---
name: bulk-export
description: "Export large datasets from MCP tools to local NDJSON files for fast ripgrep search. Use when analysing hundreds or thousands of items (emails, messages, contacts) would overwhelm conversation context."
last_updated: 2026-06-02
agent_type: main_agent
---

# Bulk Export

Export large datasets from any MCP tool to local NDJSON files, then search with ripgrep.

## When to use

- User asks to **analyse** a large volume of data: "review my last 3 months of emails", "find patterns in Slack messages", "audit all CRM contacts"
- The dataset is **too large** for sequential MCP calls through the conversation (hundreds or thousands of items)
- You need to **search or filter** the data after downloading it

## When NOT to use

- Small datasets (< 50 items) — just call the MCP tool directly
- You need real-time data — BulkExport creates a snapshot, not a live view
- You need structured queries (GROUP BY, JOIN) — use direct MCP tools or suggest a database approach

## How it works

1. **You call `bulk_export`** with the `package_id`, `tool_id`, arguments, pagination config, and output file
2. `bulk_export` is a native SuperMCP tool that calls the downstream MCP tool in a loop, writing each page to an NDJSON file
3. You get a compact summary (status, pages, lines, bytes, file path) — never the data itself
4. **You search** the file using `Bash` with `rg` (ripgrep)

BulkExport is like Unix `>` redirection for MCP tools — same tool, same args, output goes to a file instead of the conversation.

## See also

- [space-memory-populate](../space-memory-populate/SKILL.md) — Bulk-populates space memory from MCPs through the LLM. Use BulkExport instead when you need raw data for analysis rather than memory population.
- [references/gmail-examples.md](references/gmail-examples.md) — Gmail pagination config and ripgrep patterns
- [references/common-patterns.md](references/common-patterns.md) — Universal NDJSON search patterns

## bulk_export Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `package_id` | Yes | MCP package ID (e.g., `GoogleWorkspace-user-example-com`) |
| `tool_id` | Yes | MCP tool ID inside that package (e.g., `search_workspace_emails`) |
| `args` | Yes | Arguments to pass to the MCP tool (exact same schema as calling it directly) |
| `output_file` | Yes | Relative output path under `.rebel/exports/` (e.g., `gmail/emails.ndjson`) |
| `pagination` | No | Object with `token_field` (where to find the next-page token) and `input_param` (arg name to inject that token into) |
| `items_path` | No | Dot-path to the items array in the response (e.g., `emails`). If omitted, the entire response becomes one NDJSON line per page. |
| `max_pages` | No | Maximum pages (default: 100, cap: 500) |
| `if_exists` | No | `"error"` (default) refuses to overwrite an existing `output_file`; `"overwrite"` replaces it. |

Always use the full `package_id` + `tool_id` format. Find these with `list_tool_packages()` then `list_tools(package_id="...")`.

`bulk_export` only runs **read-only** tools (it refuses tools whose annotations or name suggest they modify state) — it's for extracting data, never for bulk mutations.

### Result summary

You get back a compact JSON summary — never the data itself:

| Field | Meaning |
|-------|---------|
| `status` | `"complete"` (pagination exhausted), `"partial"` (stopped early — hit `max_pages` with more pages remaining, or a mid-run error after some lines were written), or `"failed"` (nothing usable written) |
| `pages` | Pages written |
| `lines` | NDJSON lines (items) written |
| `bytes` | File size |
| `output_file` | Workspace-relative path to query |
| `errors` | Present only if something went wrong; each is capped to a short diagnostic |

If `status` is `"partial"` because you hit `max_pages`, raise `max_pages` (cap 500) or narrow the query, then re-run.

## Example workflow

### 1. Export emails

```javascript
bulk_export({
  package_id: "GoogleWorkspace-user-example-com",
  tool_id: "search_workspace_emails",
  args: { query: "after:2026/01/01 before:2026/04/01", max_results: 100, return_json: true },
  output_file: "emails-q1.ndjson",
  pagination: { token_field: "nextPageToken", input_param: "page_token" },
  items_path: "emails"
})
```

### 2. Search with ripgrep

```bash
# Find emails mentioning "quarterly report"
rg -i "quarterly report" .rebel/exports/emails-q1.ndjson

# Count emails from a sender
rg '"from":"alice@example.com"' .rebel/exports/emails-q1.ndjson -c

# Find emails with attachments
rg '"hasAttachment":true' .rebel/exports/emails-q1.ndjson
```

## Important notes

- **Always include `return_json: true`** in args for MCP tools that support it. `bulk_export` needs JSON output.
- **Know your pagination fields.** Check the MCP tool's response format to get the right `token_field` and `input_param`. See the reference docs for common tools.
- **Files persist in the workspace.** Clean up old exports when done: `Bash({ command: "rm .rebel/exports/*.ndjson" })`
- **Best on desktop; on cloud the file is a session/workspace artifact.** `bulk_export` writes to the workspace filesystem, which exists on both desktop and cloud — but on desktop it's a durable local file you can re-query anytime, whereas on a cloud deployment treat the export as a within-session artifact (query it in the same session via `Bash`/`Read`/`SearchFiles`; don't assume it persists across deployments).
- **Privacy.** Exported data is stored locally in the user's workspace. Treat it with the same care as the original data source.
