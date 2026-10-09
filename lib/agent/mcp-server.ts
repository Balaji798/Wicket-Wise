// lib/agent/mcp-server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as myTools from "./tools"; // Our existing logic!

// 1. Initialize the MCP Server
const server = new McpServer({
  name: "Dream11-Genie-Server",
  version: "1.0.0",
});

// 2. Register tools with the server
server.tool(
  "get_match_squads",
  "Return the available squads and venue for a fixture.",
  { match: z.string().describe("The name of the match, e.g. 'CSK vs MI'") },
  async ({ match }) => {
    const result = myTools.get_match_squads(match);

    // MCP requires tools to return an array of content objects
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  },
);

server.tool(
  "get_player_stats",
  "Return recent form and fantasy stats for ONE player. Accepts a full name or a last name.",
  {
    player: z
      .string()
      .describe(
        "The name or last name of the player, e.g. 'Gaikwad' or 'MS Dhoni'",
      ),
  },
  async ({ player }) => {
    const result = myTools.get_player_stats(player);

    // MCP requires tools to return an array of content objects
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  },
);

server.tool(
  "search_form",
  "Return a short scouting note on a team's current form, injuries and in-form players.",
  {
    team: z.string().describe("Short code for the team, e.g. 'CSK' or 'MI'"),
  },
  async ({ team }) => {
    const result = myTools.search_form(team);

    // MCP requires tools to return an array of content objects
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  },
);

server.tool(
  "get_pitch_report",
  "Return the pitch and weather report for a venue.",
  {
    venue: z
      .string()
      .describe("The full venue name or a keyword like 'Chepauk'"),
  },
  async ({ venue }) => {
    const result = myTools.get_pitch_report(venue);

    // MCP requires tools to return an array of content objects
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  },
);
/*
 * TODO:
 * Register getPlayerStats, searchForm, and getPitchReport tools here
 * following the exact same pattern!
 */

// 3. Connect the server to standard input/output
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Dream11 MCP Server running on stdio"); // Use console.error for logs so stdio isn't corrupted!
}

run().catch(console.error);
