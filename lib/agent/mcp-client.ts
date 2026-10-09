/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/agent/mcp-client.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function runClient() {
  // 1. Configure the transport to launch our server as a background child process!
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "lib/agent/mcp-server.ts"], // Spawns the server you just tested
  });

  // 2. Initialize our Client
  const client = new Client(
    { name: "Dream11-Test-Client", version: "1.0.0" },
    { capabilities: {} },
  );

  // 3. Establish the connection
  console.log("🔄 Connecting to child MCP Server...");
  await client.connect(transport);

  // 4. Dynamic Discovery: Ask the server for its tools!
  console.log("\n🔍 Requesting tools list from server...");
  const availableTools = await client.listTools();

  availableTools.tools.forEach((tool) => {
    console.log(` - ${tool.name}: ${tool.description}`);
  });

  // 5. Dynamic Execution: Tell the server to run a tool!
  console.log("\n⚡ Executing 'get_match_squads' tool remotely...");
  const result = await client.callTool({
    name: "get_match_squads",
    arguments: { match: "CSK vs MI" },
  });

  // 6. Print the result!
  console.log("\n✅ Result from server:\n", (result.content as any[])[0].text);

  // Clean up
  await transport.close();
}

runClient().catch(console.error);
