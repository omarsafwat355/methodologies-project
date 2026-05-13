import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * This script demonstrates the flow where an LLM sends a request 
 * to an MCP (Model Context Protocol) server to execute a function.
 */
async function runMcpFlow() {
  console.log("1. Starting MCP Client...");
  
  // We use npx to dynamically run the official SQLite MCP server locally
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-sqlite", "--db-path", "test.db"]
  });

  // Initialize the MCP Client
  const client = new Client({
    name: "mcp-llm-client",
    version: "1.0.0",
  }, {
    capabilities: { tools: {} }
  });

  // Connect the client to the server
  await client.connect(transport);
  console.log("2. Connected to MCP Server successfully!");

  // The LLM first needs to know what tools are available
  const toolsResponse = await client.listTools();
  console.log("3. Tools retrieved from MCP Server:", toolsResponse.tools.map(t => t.name));

  console.log("\n--- SIMULATING LLM INTERACTION ---");
  console.log("User: 'Can you check what tables exist in the database?'");
  console.log("LLM: *Thinks* I need to use the 'read_query' tool provided by the MCP server to answer this.");
  
  // The LLM formulates a structured execution request (Tool Call)
  const simulatedLlmToolCall = {
    method: "tools/call",
    params: {
      name: "read_query",
      arguments: {
        query: "SELECT name FROM sqlite_master WHERE type='table';"
      }
    }
  };

  console.log(`\n4. LLM formulated the request to execute function: '${simulatedLlmToolCall.params.name}'`);
  console.log("5. Sending function execution request to MCP Server...");

  // The Client sends the execution request to the MCP Server
  const result = await client.callTool({
    name: simulatedLlmToolCall.params.name,
    arguments: simulatedLlmToolCall.params.arguments
  });

  console.log("\n6. Received execution result from MCP Server:");
  console.log(JSON.stringify(result, null, 2));
  console.log("\nLLM: 'I successfully executed the query. Here are the tables...'");

  // Clean up
  await transport.close();
  console.log("\n7. Flow completed. Connection closed.");
}

runMcpFlow().catch(console.error);
