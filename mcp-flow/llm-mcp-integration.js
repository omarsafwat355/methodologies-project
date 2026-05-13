import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

/**
 * This script demonstrates the exact flow of an LLM sending a request
 * to an MCP (Model Context Protocol) server to execute a function.
 */
async function runMcpFlow() {
  console.log("1. Starting MCP Client and Mock Server...");
  
  // We use InMemoryTransport to simulate the connection locally without needing external databases or npx!
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  // --- 1. SETUP MOCK MCP SERVER ---
  const server = new Server({ name: "mock-database-mcp-server", version: "1.0.0" }, { capabilities: { tools: {} } });
  
  // Define what tools the server has
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { 
      tools: [{ 
        name: "read_query", 
        description: "Run a database query", 
        inputSchema: { type: "object", properties: { query: { type: "string"} } } 
      }] 
    };
  });
  
  // Define how the server executes the tool when requested
  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    return { content: [{ type: "text", text: "Successfully executed query! Found tables: [users, posts, comments]" }] };
  });
  
  await server.connect(serverTransport);
  console.log("2. MCP Server is online and listening.");

  // --- 2. SETUP MCP CLIENT ---
  const client = new Client({ name: "mcp-llm-client", version: "1.0.0" }, { capabilities: { tools: {} } });
  await client.connect(clientTransport);
  console.log("3. Client connected to MCP Server successfully!\n");

  // --- 3. THE LLM TO MCP FLOW ---
  // The LLM first asks the MCP Server what tools are available
  const toolsResponse = await client.listTools();
  console.log("4. Tools retrieved by LLM from MCP Server:", toolsResponse.tools.map(t => t.name));

  console.log("\n--- SIMULATING LLM INTERACTION ---");
  console.log("User: 'Can you check what tables exist in the database?'");
  console.log("LLM: *Thinks* I need to use the 'read_query' tool provided by the MCP server to answer this.");
  
  // The LLM formulates a structured execution request (Tool Call)
  const simulatedLlmToolCall = {
    name: "read_query",
    arguments: {
      query: "SELECT name FROM sqlite_master WHERE type='table';"
    }
  };

  console.log(`\n5. LLM formulated the request to execute function: '${simulatedLlmToolCall.name}'`);
  console.log("6. Client sending function execution request to MCP Server...");

  // The Client sends the execution request to the MCP Server
  const result = await client.callTool(simulatedLlmToolCall);

  console.log("\n7. Received execution result from MCP Server:");
  console.log(JSON.stringify(result, null, 2));
  console.log("\nLLM: 'I successfully executed the query. Here are the tables: users, posts, and comments!'");

  // Clean up
  console.log("\n8. Flow completed. Connections closed.");
}

runMcpFlow().catch(console.error);
