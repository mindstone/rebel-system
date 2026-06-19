#!/usr/bin/env node
/**
 * MCP Server for My API
 *
 * This server provides tools to interact with My API.
 * Customize this template for your specific API.
 *
 * SECURITY NOTE — path-parameter encoding:
 *   ALWAYS wrap tool inputs in encodeURIComponent() when interpolating them
 *   into a URL path. Interpolating raw user input lets a model-supplied value
 *   like "../other-endpoint" escape the intended endpoint. Example:
 *     `/items/${encodeURIComponent(params.id)}`   ✅
 *     `/items/${params.id}`                       ❌
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as logger from "./logger.js";

// =============================================================================
// Configuration
// =============================================================================

// IMPORTANT: Change this to your actual API base URL
// Never accept base URL from tool input (SSRF prevention)
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;

// Maximum response size (25KB) to prevent memory issues
const MAX_RESPONSE_SIZE = 25000;

// Warn at startup if using HTTP for non-localhost URLs.
// Do NOT exit here — the MCP protocol handshake must still succeed so the
// host can list tools. Missing/invalid configuration is surfaced on first
// tool call via apiRequest() below, which returns a structured error.
if (API_BASE_URL && API_BASE_URL.startsWith("http://") && !API_BASE_URL.includes("localhost")) {
  logger.warn("Using HTTP instead of HTTPS. Consider using HTTPS for security.");
}

/**
 * Build a host-neutral "not configured" error for tool responses.
 *
 * Host-neutral: do not reference any specific MCP host by name.
 * Contributed OSS connectors run in many different hosts and should
 * use generic language like "your MCP host" in user-facing messages.
 */
function missingConfigError(varName: string): string {
  return (
    `${varName} is not configured. Set it in your .env file ` +
    `or in your MCP host's connector environment variables, then retry.`
  );
}

// =============================================================================
// API Client
// =============================================================================

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Lazy credential check — return a structured error on first tool call
  // rather than crashing the server at startup. This lets the MCP host
  // complete its handshake, list tools, and surface the missing-credential
  // message through normal tool output instead of an unhelpful process exit.
  if (!API_BASE_URL || API_BASE_URL === "https://api.example.com/v1") {
    return { error: missingConfigError("API_BASE_URL") };
  }
  if (!API_KEY) {
    return { error: missingConfigError("API_KEY") };
  }

  // Timeout after 30 seconds
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        // CHANGE THIS: Adjust auth header for your API
        // Common patterns:
        //   Bearer token: "Authorization": `Bearer ${API_KEY}`
        //   API key header: "X-API-Key": API_KEY
        //   Basic auth: "Authorization": `Basic ${Buffer.from(`user:${API_KEY}`).toString('base64')}`
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      // Truncate very long error messages
      const truncated = errorText.length > 500 ? errorText.slice(0, 500) + "..." : errorText;
      return { error: `API error ${response.status}: ${truncated}` };
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return { data: {} as T };
    }

    // Check response size
    if (text.length > MAX_RESPONSE_SIZE) {
      logger.warn(`Response truncated from ${text.length} to ${MAX_RESPONSE_SIZE} chars`);
      const truncatedText = text.slice(0, MAX_RESPONSE_SIZE);
      try {
        // Try to parse truncated JSON (may fail if cut mid-object)
        const data = JSON.parse(truncatedText) as T;
        return { data };
      } catch {
        return { 
          error: `Response too large (${text.length} chars). Consider using pagination or filters.` 
        };
      }
    }

    try {
      const data = JSON.parse(text) as T;
      return { data };
    } catch {
      return { error: `Invalid JSON response: ${text.slice(0, 200)}...` };
    }
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      return { error: "Request timed out after 30 seconds" };
    }
    return { error: `Request failed: ${error instanceof Error ? error.message : String(error)}` };
  }
}

// =============================================================================
// MCP Server Setup
// =============================================================================

// The server name is the MCP handshake identifier (what the MCP protocol
// announces to clients). Use `<api-name>-mcp` — e.g. "apple-shortcuts-mcp",
// "typeform-mcp" — so logs, protocol messages, and the connector directory
// name all agree. This is *intentionally* different from the published npm
// package name (`@mindstone-engineering/mcp-server-<api-name>`) — the scope
// only applies to the npm side, protocol handshakes stay unscoped.
const server = new McpServer({
  name: "PLACEHOLDER-mcp",
  version: "0.1.0",
});

// =============================================================================
// Tool: Example Search
// =============================================================================

const SearchInputSchema = z.object({
  query: z.string()
    .min(1, "Query is required")
    .max(200, "Query must not exceed 200 characters")
    .describe("Search query string"),
  limit: z.number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .describe("Maximum number of results to return"),
}).strict();

type SearchInput = z.infer<typeof SearchInputSchema>;

server.registerTool(
  "example_search",
  {
    title: "Example Search",
    description: `Search for items in the API.

Use this tool when the user wants to find or search for something.

Args:
  - query (string): Search query
  - limit (number): Max results (default: 10)

Returns:
  List of matching items with id, name, and description.

Example:
  - "Search for widgets" -> { query: "widgets" }
  - "Find the top 5 products" -> { query: "products", limit: 5 }`,
    inputSchema: SearchInputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (params: SearchInput) => {
    const result = await apiRequest<{ items: Array<{ id: string; name: string; description: string }> }>(
      `/search?q=${encodeURIComponent(params.query)}&limit=${params.limit}`
    );

    if (result.error) {
      return {
        isError: true,
        content: [{ type: "text", text: result.error }],
      };
    }

    const items = result.data?.items || [];
    if (items.length === 0) {
      return {
        content: [{ type: "text", text: `No results found for "${params.query}"` }],
      };
    }

    // Format results for readability
    const formatted = items
      .map((item, i) => `${i + 1}. **${item.name}** (${item.id})\n   ${item.description}`)
      .join("\n\n");

    return {
      content: [{
        type: "text",
        text: `Found ${items.length} results for "${params.query}":\n\n${formatted}`,
      }],
    };
  }
);

// =============================================================================
// Tool: Example Get by ID
// =============================================================================

const GetByIdInputSchema = z.object({
  id: z.string()
    .min(1, "ID is required")
    .describe("The unique identifier of the item to retrieve"),
}).strict();

type GetByIdInput = z.infer<typeof GetByIdInputSchema>;

server.registerTool(
  "example_get_by_id",
  {
    title: "Get Item by ID",
    description: `Retrieve a specific item by its ID.

Use this tool when the user wants details about a specific item they already know the ID for.

Args:
  - id (string): The item's unique identifier

Returns:
  Full details of the item including all available fields.

Example:
  - "Get details for item ABC123" -> { id: "ABC123" }`,
    inputSchema: GetByIdInputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (params: GetByIdInput) => {
    const result = await apiRequest<{ id: string; name: string; description: string; [key: string]: unknown }>(
      `/items/${encodeURIComponent(params.id)}`
    );

    if (result.error) {
      return {
        isError: true,
        content: [{ type: "text", text: result.error }],
      };
    }

    const item = result.data;
    if (!item) {
      return {
        isError: true,
        content: [{ type: "text", text: `Item with ID "${params.id}" not found` }],
      };
    }

    return {
      content: [{
        type: "text",
        text: `## ${item.name}\n\n**ID**: ${item.id}\n\n${item.description}\n\n` +
          `\`\`\`json\n${JSON.stringify(item, null, 2)}\n\`\`\``,
      }],
    };
  }
);

// =============================================================================
// Start Server
// =============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("MCP server running via stdio");
}

main().catch((err) => {
  logger.error("Server error", err);
  process.exit(1);
});
