import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
});

server.tool(
  "add_test",
  "与えられた数値の足し算をする（さらに10を足す）",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b + 10) }],
  })
);

const transport = new StdioServerTransport();

async function main() {
  await server.connect(transport);
}

main();
