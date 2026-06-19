# Community n8n MCP (czlonkowski/n8n-mcp)

Catalog id: `n8n-community`. See [SKILL.md](../SKILL.md) for when to pick this vs the official MCP.

## What it is

`czlonkowski/n8n-mcp` (<https://github.com/czlonkowski/n8n-mcp>), a community MCP server that bundles deep n8n node knowledge (1,650+ node schemas, 2,300+ templates, validation, autofix) and acts as a proxy to the n8n public REST API for workflow management.

- Runs as a separate process — local stdio (`npx -y n8n-mcp`), local HTTP, Docker, or the maintainer's hosted SaaS at `dashboard.n8n-mcp.com`.
- Talks to your n8n instance via the public REST API (`/api/v1/...`) — **not** the same endpoint as the Official MCP.
- Independent of the Official MCP — you can run both side-by-side.

## Setup checklist

1. **Confirm n8n REST API is available on the target instance**:
   - Cloud free trial: **NOT available**. `GET /api/v1/workflows` returns HTTP 404. Stop here — recommend upgrading or switching to Official MCP.
   - Cloud Starter+ (~€24/mo): available.
   - Self-hosted: always available, no plan gating.

2. **Generate an n8n REST API key**:
   - n8n UI → Settings → **n8n API** → "Create an API key".
   - **This is NOT the same as the MCP Access Token used by the Official MCP** — see [SKILL.md § Critical gotchas](../SKILL.md#critical-gotchas-we-have-hit-all-of-these). Wrong credential = silent 401s on every management call.
   - Non-enterprise API keys have full account access. Treat like a powerful secret.

3. **Configure the connector**:
   - Catalog id `n8n-community` runs via `npx -y n8n-mcp` in stdio mode.
   - Required env vars:
     ```
     MCP_MODE=stdio
     LOG_LEVEL=error
     DISABLE_CONSOLE_OUTPUT=true
     N8N_API_URL=https://<instance>.app.n8n.cloud
     N8N_API_KEY=<the n8n REST API key from step 2>
     ```
   - Without `N8N_API_URL` + `N8N_API_KEY`, only the 7 standalone tools are exposed (no management).

4. **Optional — HTTP deployment**:
   - For multi-device / shared use, run as HTTP server with `MCP_MODE=http`, `AUTH_TOKEN=<strong>` (and `MCP_AUTH_TOKEN=<same>` for some deployment modes per the maintainer's docs). Use a tiny VPS / Fly / Railway and point Rebel at the URL.

## Endpoint contract

When configured stdio (the default for Rebel's catalog), the MCP server runs as a local subprocess. Internally, it calls the n8n REST API:

```
GET/POST/PUT/DELETE https://<instance>/api/v1/...
X-N8N-API-KEY: <n8n API key>
```

The MCP server's local SQLite of node documentation/templates is prebuilt into the npm package — node docs work offline.

## Tool surface

The number of tools depends on whether you've configured n8n API access.

### Always present (7 standalone tools)

These work without any n8n instance or API key. They use only the local SQLite of node knowledge.

- `tools_documentation` — Self-documentation of the tool surface (useful first call).
- `search_nodes` — Search across 1,650+ n8n node schemas.
- `get_node` — Full schema, parameters, examples for a specific node.
- `validate_node` — Validate a single node configuration.
- `get_template` — Fetch a prebuilt workflow template by id.
- `search_templates` — Search across 2,300+ templates.
- `validate_workflow` — Validate a full workflow JSON (nodes + connections).

### Added when `N8N_API_URL` + `N8N_API_KEY` are set (17 management tools)

- `n8n_create_workflow` — Create from JSON.
- `n8n_get_workflow` — Fetch one workflow.
- `n8n_list_workflows` — List workflows.
- `n8n_update_full_workflow` — Replace entire workflow definition.
- `n8n_update_partial_workflow` — **Token-efficient diff update.** Prefer over full update for small changes.
- `n8n_delete_workflow` — Delete (irreversible).
- `n8n_validate_workflow` — Server-side validation.
- `n8n_autofix_workflow` — Heuristic fixes for common workflow issues. No equivalent in Official MCP.
- `n8n_test_workflow` — Trigger a workflow. **Only works for workflows with externally triggerable entrypoints (Webhook/Form/Chat).** This is a public-API limitation, not an MCP limitation.
- `n8n_executions` — List/get executions.
- `n8n_health_check` — Ping the n8n instance.
- `n8n_workflow_versions` — Version history (if instance supports it).
- `n8n_deploy_template` — Deploy a prebuilt template to the instance.
- `n8n_manage_datatable` — Datatable CRUD.
- `n8n_manage_credentials` — Manage n8n credentials (create/list/delete only — n8n API doesn't expose credential reads).
- `n8n_generate_workflow` — Generate a workflow from a natural-language prompt.
- `n8n_audit_instance` — Run n8n's instance audit endpoint.

## Key behaviors and quirks

- **Authoring is raw JSON, not SDK code.** Unlike the Official MCP, you build `nodes` and `connections` arrays directly. This is more verbose for the model but gives finer control and is closer to how exported workflows look.
- **`n8n_update_partial_workflow` is a real win.** When iterating on a 50+ node workflow, sending a JSON-Patch-style diff is dramatically cheaper than re-sending the whole workflow. Use this by default for updates after the initial create.
- **`n8n_autofix_workflow` is unique.** It heuristically fixes common issues (missing connections, deprecated parameter names, invalid expressions) before you re-validate. Worth running before any update attempt.
- **`n8n_test_workflow` ≠ Official `execute_workflow`.** Community MCP can only trigger workflows with external entrypoints. Manual-only workflows (no webhook/form/chat trigger) are NOT runnable via Community MCP — that's a hard limit of the n8n public REST API, not a bug in the MCP. If the user needs to run manual-only workflows from natural language, they need the Official MCP.
- **`n8n_manage_credentials` is write-only for secrets.** n8n's REST API exposes only `POST /credentials` (create), `GET /credentials/schema/{type}`, and `DELETE /credentials/{id}`. You cannot fetch existing credential values via API — that's a deliberate n8n security design.
- **Free-trial Cloud breaks management tools entirely.** All 17 management tools will fail with 404. The 7 standalone tools still work — useful as a "node knowledge oracle" complement to the Official MCP.
- **It's a proxy, not a separate trust boundary.** The Community MCP grants no capability beyond the n8n API key you give it. If the key is full-access, the MCP is full-access. Treat the key accordingly.

## Authoring recipe (raw JSON)

1. `search_nodes` for the services involved (e.g. `["gmail", "slack", "schedule trigger"]`).
2. `get_node` for each — read parameters, examples.
3. `search_templates` for an example doing something similar; `get_template` to inspect.
4. Write the workflow JSON (nodes array + connections object).
5. `validate_workflow` — fix errors. `n8n_autofix_workflow` (if API configured) for heuristic fixes.
6. `n8n_create_workflow` to save. Returns the created workflow including id.
7. For updates, prefer `n8n_update_partial_workflow` with a diff over `n8n_update_full_workflow`.

## Debugging failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Only 7 tools visible | `N8N_API_URL` / `N8N_API_KEY` env vars not set or empty | Add both to the connector env config and reconnect |
| All `n8n_*` tools fail with 404 | Free-trial Cloud, or self-hosted instance with public API disabled | Upgrade to paid Cloud plan, or enable public API in self-hosted config |
| All `n8n_*` tools fail with 401 | Wrong credential — using MCP Access Token (`aud=mcp-server-api`) instead of REST API key | Generate a real REST API key in Settings → n8n API |
| `n8n_test_workflow` errors with "no externally triggerable entrypoint" | Workflow has no Webhook/Form/Chat trigger | Add one, or use the Official MCP's `execute_workflow` instead |
| `npx -y n8n-mcp` is slow on first boot | First fetch downloads the package + prebuilt SQLite (~50MB) | Pre-warm by running it once during connector setup |
| Stdio MCP crashes / disconnects | Renderer's MCP supervisor restarts it on crash; check logs for the npm subprocess | Check Rebel's MCP logs in `~/Library/Application\ Support/mindstone-rebel/logs/` |

## When NOT to use the Community MCP

- User is on n8n Cloud free trial — management tools will all fail.
- User needs to run workflows that have no external trigger (e.g. only manual / "Execute Workflow" trigger) — the Community MCP physically can't trigger these.
- User doesn't want to install Node.js / have a local subprocess — Official MCP runs in-cloud with no client-side process.
- User only needs read/list/run, never authoring — Official MCP is fewer tools, less context cost.

## When the Community MCP shines

- Authoring novel/complex workflows from scratch — node depth + templates beat SDK-code authoring.
- Iterating on a large workflow with many small changes — `n8n_update_partial_workflow` is far cheaper than full re-sends.
- Deploying templates programmatically — `n8n_deploy_template` is a true convenience.
- Auditing / instance-level admin — `n8n_audit_instance` has no Official MCP equivalent.
- Using validation/templates without any n8n instance — the 7 standalone tools work fully offline-ish.
