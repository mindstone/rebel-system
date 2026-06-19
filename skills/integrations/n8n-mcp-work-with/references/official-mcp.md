# Official n8n MCP (built into the instance)

Catalog id: `n8n` ("n8n (Official)"). See [SKILL.md](../SKILL.md) for when to pick this vs the community MCP.

## What it is

n8n's first-party MCP server, baked into every n8n 2.14+ instance (Cloud and self-hosted). No external process to run — Rebel talks to it over HTTPS directly. Server identifies as `n8n MCP Server` (currently v1.1.0).

Source of truth: <https://docs.n8n.io/advanced-ai/mcp/accessing-n8n-mcp-server/>.

## Setup checklist

The order matters. Skipping or reversing steps causes the symptoms documented in [SKILL.md § Critical gotchas](../SKILL.md#critical-gotchas-we-have-hit-all-of-these).

1. **Enable instance-level MCP** (admin only):
   - n8n UI → Settings → **Instance-level MCP** → toggle **Enable MCP access** on.
   - Without this, the `/mcp-server/http` endpoint returns HTTP 401 for every request.

2. **Generate / view the MCP Access Token**:
   - Same Settings page → **Connection details → Access Token** tab.
   - This token is a JWT with `aud: "mcp-server-api"`. If the user has a token decoded as anything else (e.g. `aud: "n8n-api"`), that's an n8n REST API key — wrong credential for this MCP, send them back to the right tab.
   - **Regenerate the token if it was issued before instance-level MCP was enabled.** Existing tokens may not auto-validate against newly-enabled MCP.

3. **Enable MCP per workflow**:
   - For each workflow you want visible to MCP, open its card menu and select **Enable MCP access**.
   - Without this, the workflow won't appear in `search_workflows` and can't be executed via MCP. Auth still works fine — you just see an empty list.

4. **Connect in Rebel**:
   - The `n8n` connector entry in `resources/connector-catalog.json` uses HTTP transport + OAuth-style header auth.
   - URL: `https://<instance>.app.n8n.cloud/mcp-server/http` (Cloud) or `https://<your-self-hosted-domain>/mcp-server/http`.
   - Header: `Authorization: Bearer <token>`.

## Endpoint contract

```
POST https://<instance>/mcp-server/http
Authorization: Bearer <MCP Access Token>
Content-Type: application/json
Accept: application/json, text/event-stream

{"jsonrpc": "2.0", ...}
```

- Transport: MCP Streamable HTTP. Responses come back as Server-Sent Events (`content-type: text/event-stream`, body lines start with `event: message\ndata: {...}`).
- `Accept: application/json, text/event-stream` is **required**. Without `text/event-stream` you get HTTP 406.
- Rate limit: 100 req/min per token (`X-RateLimit-Limit: 100`).
- No `Mcp-Session-Id` is returned on initialize — n8n's transport is stateless across calls; you re-auth on each request rather than holding a session.

## Tool surface (26 tools, verified live)

### Workflow read/run
- `search_workflows` — Lists workflows visible to MCP. Returns id, name, `active`, `availableInMCP`, `canExecute`, `scopes`. Filter by `query` (name/description) or `projectId`. Max 200 results.
- `get_workflow_details` — Full workflow definition including `nodes`, `connections`, `settings.availableInMCP`, and a `triggerInfo` string describing what trigger types are available. Use **before** `execute_workflow` to know the input shape.
- `execute_workflow` — Returns `executionId` immediately. Args: `workflowId`, `executionMode` (`manual` | `production`, default `production`), and `inputs` shaped as a discriminated union: `{type: "chat", chatInput}` | `{type: "form", formData}` | `{type: "webhook", webhookData: {method, query, body, headers}}`.
- `test_workflow` — Lower-friction execute for development. Pairs with `prepare_test_pin_data`.
- `prepare_test_pin_data` — Pin data for nodes so `test_workflow` can simulate upstream inputs.
- `search_executions` — Filter by `workflowId`, `status` (`canceled` | `crashed` | `error` | `new` | `running` | `success` | `unknown` | `waiting`), date range, cursor-paginated via `lastId`.
- `get_execution` — Args: `workflowId`, `executionId`, optional `includeData: true` to fetch node inputs/outputs, optional `nodeNames` filter, optional `truncateData: N` to cap items per node. Default returns metadata only — cheap status check.

### Workflow authoring (SDK-code-as-workflow)
- `get_sdk_reference` — **Always call this first when authoring.** Returns SDK patterns and syntax. Has sections: default, `"guidelines"` (coding rules), `"design"` (design guidance). The Official MCP authors workflows by writing SDK code, not raw JSON.
- `search_nodes` — Discover nodes by service name (`["gmail", "slack"]`) or utility (`["set", "if", "merge", "code"]`). Returns discriminators (resource/operation/mode) needed for `get_node_types`.
- `get_suggested_nodes` — Optional: get curated recommendations by workflow technique category.
- `get_node_types` — Get TypeScript parameter definitions for nodes. **Pass ALL node IDs you plan to use including discriminators.** The SDK validates parameter names strictly; guessing breaks `create_workflow_from_code`.
  - **Argument shape for discriminators:** `nodeIds: [{ nodeId: "n8n-nodes-base.set", mode: "manual" }]` — objects in the `nodeIds` array, NOT a separate `discriminators` map alongside a flat string array. The error `Node 'X' requires mode discriminator. Available modes: ...` means you passed the flat form; switch to the object form.
  - For nodes with `operation` discriminators, use the same shape: `nodeIds: [{ nodeId: "n8n-nodes-base.spreadsheetFile", operation: "fromFile" }]`.
  - Use `search_nodes` first to discover which discriminators a node needs (each result lists its discriminators).
- `validate_workflow` — Validate the SDK code. Fix and re-validate until clean before creating/updating.
- `create_workflow_from_code` — Parse SDK code and create the workflow. **Always include a 1-2 sentence `description`** so users can find and understand their workflows later.
- `update_workflow` — Update an existing workflow with new SDK code. Same prepare-then-validate flow.
- `archive_workflow` — Archive (not delete) a workflow.
- `publish_workflow` / `unpublish_workflow` — Publish a draft as the active production version, or revert to draft.

### Data tables
- `search_data_tables` — List n8n Data Tables.
- `create_data_table` / `rename_data_table` — Manage tables.
- `add_data_table_column` / `delete_data_table_column` / `rename_data_table_column` — Manage columns.
- `add_data_table_rows` — Bulk insert rows.

### Org/scoping
- `search_projects` — n8n projects (workspace scoping).
- `search_folders` — Folders within projects.

## Key behaviors and quirks

- **Authoring is SDK-code, not JSON.** Unlike the community MCP, you do not write raw `nodes`/`connections` arrays. Instead you write n8n SDK-flavoured TypeScript and let `create_workflow_from_code` parse it. This is why `get_sdk_reference` and `get_node_types` matter so much — the model needs them to produce valid SDK code.
- **`execute_workflow` works on any MCP-enabled workflow.** Unlike the public REST API (which has no generic "run by ID" endpoint), the Official MCP `execute_workflow` uses internal APIs and can manually trigger workflows that have no Webhook/Form/Chat trigger.
- **Default execution mode is `production`.** This runs the published (active) version. To run the current unpublished version, pass `executionMode: "manual"`.
- **`get_execution` defaults to metadata only.** Call it with `includeData: false` (or default) for cheap polling, then a final `includeData: true` once `status` is terminal.
- **Workflows without triggers can only run manually.** `get_workflow_details` returns a clear `triggerInfo` string — surface this to the user before trying production-mode runs.
- **Pre-condition: MCP must be enabled at instance AND workflow level.** Workflows whose per-workflow toggle is off appear nowhere in MCP results, even if they exist in the UI.
- **No write-access without enabling.** `search_workflows` only returns workflows the current user has access to AND that have per-workflow MCP enabled. The `scopes` field on each result tells you what operations are permitted.

## Live-verified tool list (May 2026)

```
search_workflows, execute_workflow, get_execution, search_executions,
get_workflow_details, publish_workflow, unpublish_workflow,
prepare_test_pin_data, test_workflow,
search_data_tables, create_data_table, rename_data_table,
add_data_table_column, delete_data_table_column, rename_data_table_column,
add_data_table_rows,
search_nodes, get_node_types, get_suggested_nodes,
validate_workflow, create_workflow_from_code,
search_projects, search_folders, archive_workflow, update_workflow,
get_sdk_reference
```

## Where does workflow output show up?

When the user runs a workflow (either via MCP `execute_workflow` or by clicking "Test workflow" in the n8n UI), the output is **NOT a return value of the run** — it's attached to each node on the canvas. Things to point them at:

- **Canvas nodes glow green** (success) or red (error) after a run; each node displays an item-count badge and execution time.
- **Click a node** on the canvas to open its **output panel** on the right side. The Set / final node's panel shows the JSON output (e.g. `{ "message": "Hello, World!", "greetedAt": "..." }`).
- **Top toast**: "Workflow executed successfully" briefly after a run.
- **Executions side panel** (left sidebar → Executions, or the chip at the top of the canvas): full history. Click any past run to load its outputs back into the canvas nodes.
- **Via MCP**: `get_execution` with `includeData: true` returns the same per-node `runData` map. `data.resultData.runData['<Node Name>'][0].data.main[0]` is the array of output items for that node.

There is no single "stdout"/return value — n8n's mental model is data-flowing-through-nodes, not function-call-with-result. If the user wants a literal value out, they need an HTTP Response, Webhook Response, Slack message, file write, etc. as the terminal node.

## Debugging failure modes

| Symptom | Cause | Fix |
|---|---|---|
| HTTP 401 on every request | Instance-level MCP toggle off, OR token issued before toggle was enabled | Enable toggle as instance admin, then regenerate token |
| HTTP 401 only on certain operations | Token scope or workflow scope insufficient | Check `scopes` in `search_workflows` result |
| HTTP 404 | Wrong path | Use `/mcp-server/http` (not `/mcp`, `/mcp-server`, `/api/mcp`) |
| HTTP 406 | Missing `text/event-stream` in Accept header | Add `Accept: application/json, text/event-stream` |
| `search_workflows` returns empty `data: []` despite owning workflows | Per-workflow MCP toggle not flipped on any workflow | Open each workflow card → menu → Enable MCP access |
| `create_workflow_from_code` rejects parameters | Guessed parameter names | Call `get_node_types` with full discriminators first |
| `get_node_types` returns "requires mode discriminator" error | Passed `nodeIds: ["..."]` (flat strings) for a node that needs a discriminator | Switch to `nodeIds: [{ nodeId, mode: "manual" }]` (object form) |
| `execute_workflow` errors with "no production trigger" | Workflow has no Webhook/Form/Chat/Schedule trigger, called with `executionMode: "production"` | Either add a trigger and `publish_workflow`, or call with `executionMode: "manual"` |

## When NOT to use the Official MCP

- Heavy authoring of complex workflows where you want template-based starters: prefer the [Community MCP](community-mcp.md) — its 2,300+ templates + autofix outperform SDK-code authoring for novel patterns.
- Diff-based partial updates of large workflows: Community MCP's `n8n_update_partial_workflow` is more token-efficient than re-sending the whole SDK code to `update_workflow`.
- Users who only need to read node documentation and validate node configs without actually touching an n8n instance: Community MCP's 7 standalone tools work without any n8n API connection.
