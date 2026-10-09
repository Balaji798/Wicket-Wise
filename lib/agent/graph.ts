// lib/agent/graph.ts
import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";
import { search, SafeSearchType } from "duck-duck-scrape";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import * as myTools from "./tools";

// 1. Wrap our original functions in LangChain tool() wrappers
const getMatchSquadsTool = tool(
  async ({ match }) => {
    const result = myTools.get_match_squads(match);
    return JSON.stringify(result); // Tools must always output strings for the LLM!
  },
  {
    name: "get_match_squads",
    description:
      "Return the available squads and venue for a fixture. Call this FIRST.",
    // Zod perfectly replaces our old raw JSON schema!
    schema: z.object({
      match: z.string().describe("The name of the match, e.g. 'CSK vs MI'"),
    }),
  },
);

// TODO: Create getPlayerStatsTool here using the same pattern!
const getPlayerStatsTool = tool(
  async ({ player }) => {
    const result = myTools.get_player_stats(player);
    return JSON.stringify(result); // Tools must always output strings for the LLM!
  },
  {
    name: "get_player_stats",
    description:
      "Return recent form and fantasy stats for ONE player. Accepts a full name or a last name.",
    // Zod perfectly replaces our old raw JSON schema!
    schema: z.object({
      player: z
        .string()
        .describe(
          "The name or last name of the player, e.g. 'Gaikwad' or 'MS Dhoni'",
        ),
    }),
  },
);
const searchFormTool = tool(
  async ({ team }) => {
    const result = myTools.search_form(team);
    return JSON.stringify(result);
  },
  {
    name: "search_form",
    description:
      "Return a short scouting note on a team's current form, injuries and in-form players.",
    schema: z.object({
      team: z.string().describe("Short code for the team, e.g. 'CSK' or 'MI'"),
    }),
  },
);
const getPitchReportTool = tool(
  async ({ venue }) => {
    const result = myTools.get_pitch_report(venue);
    return JSON.stringify(result);
  },
  {
    name: "get_pitch_report",
    description: "Return the pitch and weather report for a venue.",
    schema: z.object({
      venue: z
        .string()
        .describe("The full venue name or a keyword like 'Chepauk'"),
    }),
  },
);

const webSearchTool = tool(
  async ({ query }) => {
    try {
      console.log("🕵️‍♂️ Searching the live web for:", query);
      const results = await search(query, {
        safeSearch: SafeSearchType.MODERATE,
      });

      // Grab the summaries of the top 5 search hits
      const topResults = results.results
        .slice(0, 5)
        .map((r) => `Title: ${r.title}\nInfo: ${r.description}`)
        .join("\n\n---\n\n");

      return topResults || "No reliable information found on the web.";
    } catch (err) {
      return "Sorry, I couldn't reach the search engine.";
    }
  },
  {
    name: "live_web_search",
    description:
      "Use this to search the live web for recent news, match outcomes, live player stats, or real-world events.",
    schema: z.object({
      query: z.string().describe("A keyword-focused search query"),
    }),
  },
);
// 2. Put all wrapped tools into an array for the Graph to use later
export const graphTools = [
  getMatchSquadsTool,
  getPlayerStatsTool,
  searchFormTool,
  getPitchReportTool,
  webSearchTool,
];

// 2. LLM & NODE CONFIGURATION
const llm = new ChatGroq({
  model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
});
const llmWithTools = llm.bindTools(graphTools);
const toolNode = new ToolNode(graphTools);
// The Agent Node checks the messages array and calls the LLM
async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await llmWithTools.invoke(state.messages);
  return { messages: [response] };
}
// 3. BUILDING THE STATE GRAPH
// This is exactly like drawing a flowchart!
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel) // Add our AI brain node
  .addNode("tools", toolNode) // Add our tool executor node
  .addEdge("__start__", "agent"); // 1. Start execution directly at the agent
// 2. After the agent thinks, we evaluate conditionally:
workflow.addConditionalEdges("agent", (state) => {
  // We add 'as AIMessage' so TypeScript knows tool_calls is a valid property!
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;

  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }

  return "__end__";
});
// 3. Once the tools finish running, ALWAYS go back to the agent to let it read the results!
workflow.addEdge("tools", "agent");
// Compile everything into a ready-to-run agent!
export const agentGraph = workflow.compile();
