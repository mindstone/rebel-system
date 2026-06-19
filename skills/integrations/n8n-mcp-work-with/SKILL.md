---
name: n8n-mcp-work-with
description: "Run, edit, and create n8n workflows from natural language via MCP. Covers both the Official n8n MCP (built into the instance) and the Community n8n-mcp (czlonkowski). Use when the user mentions n8n, workflow automation, automating a process, or wants to read/edit/run existing n8n workflows."
last_updated: 2026-05-13
agent_type: main_agent
---

# Work With n8n MCP

Use this when the user wants to: (1) browse, run, or inspect existing n8n workflows, (2) build a new workflow from a natural-language description, (3) edit/validate/debug an existing workflow, (4) manage n8n data tables, projects, or executions.


## Two MCPs, one product

Rebel's connector catalog has **two distinct n8n MCP servers** (see `resources/connector-catalog.json`). They are NOT interchangeable — they have different endpoints, different credentials, different tool surfaces, and different ideal use cases.

| | **Official** (`n8n`) | **Community** (`n8n-community`) |
|---|---|---|
| What it is | n8n's own MCP server, baked into the instance | czlonkowski/n8n-mcp, runs as a separate Node/Docker process |
| Endpoint | `https://<instance>/mcp-server/http` (HTTP transport, in-cloud) | Local stdio (or self-hosted HTTP) talking to n8n's REST API |
| Credential | **MCP Access Token** (JWT, `aud=mcp-server-api`) | **n8n REST API key** (different thing — paid Cloud plans only) |
| Works on n8n Cloud free trial? | Yes | **No** — public REST API is disabled on free trial |
| Authoring style | SDK code → `create_workflow_from_code` | Raw JSON nodes/connections + diff updates |
| Strengths | Lower friction, no extra process, full execute including non-triggerable workflows | Deepest node-schema knowledge, 2,300+ templates, token-efficient diff updates, autofix |
| Tools when fully working | ~26 (read + write + create + execute + data tables) | ~24 (7 docs/validation + 17 management when API configured) |

**See:**
- [references/official-mcp.md](references/official-mcp.md) — Official MCP setup, gotchas, tool surface
- [references/community-mcp.md](references/community-mcp.md) — Community MCP setup, gotchas, tool surface


## Quick decision

Pick the MCP first, then drive it.

1. **User is on n8n Cloud free trial, or no n8n REST API key available** → **Official MCP only.** Community MCP's management tools will all fail (404 on `/api/v1`). The 7 docs/validation tools still work standalone but rarely worth the setup on their own.

2. **User is on paid n8n Cloud / self-hosted n8n, just wants it to work** → **Official MCP.** OAuth-style auth, no local process, full create/update/execute. Default recommendation.

3. **User is doing heavy authoring of complex novel workflows** → **Community MCP** (or both). Better node depth, template library, diff-based partial updates, autofix. Requires a REST API key from a paid plan.

4. **User wants the best of both** → enable both connectors. Drives up tool-list context cost, but gives you Official for run/manage + Community for design/validate/template-deploy. Mention to the user that they'll have ~50 n8n tools visible — fine for power users, noisy for casual ones.


## Critical gotchas (we have hit all of these)

### 1. Two separate "Enable MCP" toggles — you need BOTH

For the **Official MCP** on n8n Cloud:

- **Instance-level toggle:** Settings → Instance-level MCP → "Enable MCP access". **Requires instance owner/admin.** Without this, every Bearer token gets HTTP 401 — token validity is irrelevant.
- **Per-workflow toggle:** Workflow card menu → "Enable MCP access". Without this, the workflow won't appear in `search_workflows` and can't be executed via MCP — but auth still works fine, you just see an empty list.

A 401 on `/mcp-server/http` almost always means #1 is off (or the token is stale / from before the toggle was flipped). An empty `search_workflows` with a working `initialize` means #2 hasn't been done on any workflow.

### 2. "MCP Access Token" ≠ "n8n API key"

These are completely different credentials with different audiences and different auth realms:

- **MCP Access Token** (for Official MCP): JWT with `aud=mcp-server-api`, sent as `Authorization: Bearer <token>`, generated in Settings → Instance-level MCP → **Access Token** tab.
- **n8n API key** (for Community MCP and any direct REST API use): opaque string, sent as `X-N8N-API-KEY: <key>`, generated in Settings → **n8n API**.

If a token starts `eyJ...` and decoding the JWT payload shows `"aud":"mcp-server-api"`, it's the MCP one — it will NOT authenticate against `/api/v1/...`.

### 3. n8n Cloud free trial blocks the public REST API

`GET /api/v1/workflows` returns HTTP 404 (not 401) on free-trial Cloud instances. This kills the Community MCP's management tools entirely. Upgrade to Starter or above (~€24/mo) before recommending Community MCP. The Official MCP is unaffected — it runs on its own endpoint with its own auth.

### 4. No generic "run workflow by ID" in the public REST API

The public REST API has no `POST /workflows/{id}/execute` endpoint. Community MCP's `n8n_test_workflow` only triggers workflows that have externally triggerable entrypoints (Webhook/Form/Chat triggers). The Official MCP's `execute_workflow` uses internal APIs and can run any MCP-enabled workflow in manual or production mode — this is a meaningful capability gap.

### 5. Workflow must have at least one trigger or you can only run it manually

`get_workflow_details` returns a `triggerInfo` field. If it says "no production triggers", `execute_workflow` will only work with `executionMode: "manual"`. Don't try to publish a workflow without a trigger and then run it in production mode.


## Quick workflow recipes

### "Show me my n8n workflows"
1. Confirm Official MCP is available (`n8n__search_workflows` tool listed).
2. Call `search_workflows` (no args) — returns workflows the user has enabled for MCP. Surface name, id, `active`, `availableInMCP`, `canExecute`.
3. If list is empty, explain: per-workflow MCP toggle hasn't been enabled on anything yet. Point user to workflow card menu → "Enable MCP access".

### "Run workflow X"
1. `search_workflows` with `query: "X"` (or `get_workflow_details` if you have the id) to resolve the workflow id.
2. Check `triggerInfo`. If no production triggers, force `executionMode: "manual"`.
3. `execute_workflow` returns immediately with an `executionId`. Poll `get_execution` with `includeData: false` to get status; switch to `includeData: true` once it's `success` or `error`.

### "Build a workflow that does X"
Two paths — pick by which MCP is configured:

**Official MCP path (preferred when available):**
1. `get_sdk_reference` (sections `"guidelines"`, `"design"`) — load SDK patterns first.
2. `search_nodes` for the services involved (e.g. `["gmail", "slack", "schedule trigger"]`). Each result lists its discriminators — note them.
3. `get_node_types` with ALL node IDs you plan to use — **do not guess parameter names**, the SDK is strict. **Discriminator argument shape:** `nodeIds: [{ nodeId: "n8n-nodes-base.set", mode: "manual" }]` (objects, not flat strings — see [references/official-mcp.md](references/official-mcp.md#tool-surface-26-tools-verified-live)).
4. Write the SDK code; `validate_workflow` until clean.
5. `create_workflow_from_code` (new workflow) or `update_workflow` (existing). Always include a 1-2 sentence `description`.
6. Optionally `publish_workflow` to activate it.
7. **Where to find the output:** Run results are attached per-node on the canvas, not returned as a single value. See [references/official-mcp.md § Where does workflow output show up?](references/official-mcp.md#where-does-workflow-output-show-up).

**Community MCP path (when authoring depth matters):**
1. `search_nodes` + `get_node` to read full node schemas + examples.
2. `search_templates` for relevant prebuilt workflows; `get_template` to inspect one.
3. Build the JSON. `validate_workflow` → fix errors with `n8n_autofix_workflow` if available.
4. `n8n_create_workflow` to save.
5. `n8n_test_workflow` (only if externally triggerable) or `n8n_executions` to monitor.

### "Edit this workflow"
- Official: `get_workflow_details` → adjust SDK code → `validate_workflow` → `update_workflow`.
- Community: `n8n_update_partial_workflow` is cheaper than `n8n_update_full_workflow` for small diffs.

### "Why did my workflow fail?"
1. `search_executions` with `workflowId` and `status: ["error", "crashed"]`.
2. `get_execution` on the latest with `includeData: true` (optionally `nodeNames` filter to keep output manageable).
3. Inspect the failing node's input/output. If the workflow needs editing, use the edit recipe above.


## Verifying connectivity (you can do this without any tools)

A bare curl against the Official MCP endpoint is the fastest sanity check when something seems off:

```bash
curl -sS -i -X POST "https://<instance>.app.n8n.cloud/mcp-server/http" \
  -H "Authorization: Bearer $N8N_MCP_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"r","version":"0"}}}'
```

- **HTTP 200 + `event: message` body** → working. Move on.
- **HTTP 401 + `WWW-Authenticate: Bearer realm="n8n MCP Server"`** → Instance-level MCP toggle is off, or the token was issued before it was enabled. Regenerate the token after enabling.
- **HTTP 406** → missing the `Accept: application/json, text/event-stream` header. Add it.
- **HTTP 404** → wrong path. Correct path is `/mcp-server/http`, not `/mcp` or `/mcp-server`.


## Sanity-check fact sheet (verified live, May 2026)

- Endpoint: `POST https://<instance>.app.n8n.cloud/mcp-server/http`
- Transport: MCP Streamable HTTP, response `content-type: text/event-stream`
- Auth header: `Authorization: Bearer <MCP Access Token>` (case-insensitive)
- Server identifies as `n8n MCP Server` (currently v1.1.0)
- The Official MCP exposes 26 tools; Community MCP exposes 7 standalone + 17 management when configured
- "Official is read-only" is **stale** — as of n8n 2.14 (March 2026) it can create, update, and execute. The user's pre-research priors on this may be wrong; verify before agreeing.


## [PERSONA]

You are a careful n8n operator. Workflows are user-owned automations — never modify or run one without being sure of intent. Always prefer reading + describing before editing, and always validate before creating/updating.


## [SUCCESS]

- The right MCP is identified for the user's plan and intent
- Auth/toggle gotchas are caught before guessing at tool calls
- Workflows are created with `validate_workflow` passing first
- Execution results are surfaced with execution IDs + URLs for traceability
