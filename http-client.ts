import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";

const server = new McpServer({
  name: "HttpClient",
  version: "1.0.0",
});

server.tool(
  "fetch_url",
  "指定されたURLにHTTPリクエストを送信する",
  {
    url: z.string().url(),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("GET"),
    body: z.string().optional(),
    headers: z.record(z.string()).optional()
  },
  async ({ url, method, body, headers }) => {
    try {
      const response = await fetch(url, {
        method,
        body: body,
        headers: headers
      });
      
      const responseText = await response.text();
      return {
        content: [
          { 
            type: "text", 
            text: `Status: ${response.status}\nResponse: ${responseText}` 
          }
        ],
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          content: [
            { 
              type: "text", 
              text: `エラーが発生しました: ${error.message}` 
            }
          ],
        };
      }
      return {
        content: [
          { 
            type: "text", 
            text: "予期せぬエラーが発生しました" 
          }
        ],
      };
    }
  }
);

const transport = new StdioServerTransport();

async function main() {
  await server.connect(transport);
}

main();
