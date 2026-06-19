# MCP Development Standard

> **Sync Notice** — Derived from Rebel's MCP development standard (2026-04-09). When the upstream standard changes, this bundled copy should be re-synced to reflect updated patterns.

This document defines the engineering standards for building MCP servers. It covers SDK patterns, naming conventions, module architecture, error handling, security, and packaging.

For **tool design** principles (naming, descriptions, pagination, response formats), see [mcp_best_practices.md](mcp_best_practices.md).
For **Node/TypeScript implementation** details (project setup, Zod examples, complete code templates), see [node_mcp_server.md](node_mcp_server.md).

---

## 1. SDK Construction Standard

### Use McpServer + registerTool + Zod

All MCP servers **must** use the high-level `McpServer` class with `registerTool()` and Zod schemas. The low-level `Server` + `setRequestHandler()` pattern is legacy — do not use it for new servers.

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const server = new McpServer({ name: 'my-mcp-server', version: '0.1.0' });

server.registerTool(
  'service_search_items',
  {
    description: 'Search items by query...',
    inputSchema: {
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Max results (default: 20)'),
    },
    annotations: { readOnlyHint: true },
  },
  async (args) => {
    const result = await doSearch(args.query, args.limit);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  },
);
```

**Why Zod over raw JSON Schema:**
- Type-safe argument destructuring in callbacks (no `args as Record<string, unknown>`)
- `.describe()` on each field replaces separate `description` in JSON Schema
- SDK handles Zod-to-JSON-Schema conversion for the wire protocol
- Consistent with official MCP reference servers

> For comprehensive setup instructions, starter templates, and full working examples, see [node_mcp_server.md](node_mcp_server.md).

---

## 2. Tool Annotations

Every tool **must** declare annotations. Annotations tell host applications how to present tools to users and what safety prompts to show.

Use this mapping:

| Tool behaviour | readOnlyHint | destructiveHint |
|---|---|---|
| Read-only (GET, search, list, export) | `true` | omit |
| Creates new resources (POST) | `false` | `false` |
| Mutates or deletes existing resources (PUT, DELETE) | `false` | `true` |

Optional but recommended:
- `idempotentHint: true` for PUT operations that are truly idempotent
- `openWorldHint: true` for tools that interact with external APIs

> For full annotation reference and examples, see [mcp_best_practices.md](mcp_best_practices.md).

---

## 3. Tool and Parameter Naming

### Tool names

- **snake_case** with service prefix: `{service}_{action}_{resource}`
- Names must be specific enough to stand alone in a multi-MCP tool list
- Examples: `zendesk_search_tickets`, `slack_post_message`, `github_create_issue`

### Parameter names

- All top-level input parameters must be **snake_case**
- Use one canonical name per concept across tools within the same MCP
- Descriptions and error text must use the canonical snake_case names

### Canonical concept names

| Concept | Canonical name | Notes |
|---|---|---|
| Max results | `limit` | Do not alternate between `count`, `maxResults`, `max_results` |
| Pagination token | `page_token` / `cursor` | Use whichever the upstream API uses, then keep consistent |
| JSON toggle | `return_json` | Boolean switching between JSON and markdown output |
| Resource identifiers | `{thing}_id` | Always snake_case: `message_id`, `thread_id`, `file_id`, etc. |

### Exceptions

- Nested objects mirroring an upstream API structure may keep upstream casing inside the nested object (e.g., `start.dateTime`)
- Response field names are not covered by this standard — it applies to tool **input parameters** only

> For detailed naming guidance, cross-tool parameter consistency, and additional examples, see [mcp_best_practices.md](mcp_best_practices.md).

---

## 4. Rename Compatibility

When renaming a parameter to follow the naming standard, the MCP handler **must** accept both the legacy name and the new canonical snake_case name:

- If the MCP performs validation before the handler runs, add a boundary normaliser that rewrites legacy names before validation
- If both old and new names are supplied, the **snake_case name wins**

This ensures existing consumers continue working while the ecosystem migrates to consistent naming.

**New tool naming review — verify before shipping:**

- [ ] All top-level parameters are snake_case
- [ ] Repeated concepts use the canonical names from the table above
- [ ] Descriptions and examples use snake_case parameter names

---

## 5. Module Layout

### When to split

Split any MCP server exceeding **~500 lines** of source. Below that, a single file is fine.

### Standard file layout

```
src/
├── types.ts          # Interfaces, constants, domain error classes
├── auth.ts           # Mutable state (accounts), token refresh, credential loading
├── client.ts         # API fetch wrapper, retry logic, pagination helpers
├── formatters.ts     # Response formatting functions
├── utils.ts          # withErrorHandling(), path utilities, shared helpers
├── tools/
│   ├── index.ts      # Re-exports all registration functions
│   ├── tickets.ts    # registerTicketTools(server)
│   ├── users.ts      # registerUserTools(server)
│   └── search.ts     # registerSearchTools(server)
├── server.ts         # createServer(): creates McpServer, registers all tools
└── index.ts          # Entrypoint: shebang, import server, connect transport
```

### Dependency layering (acyclic)

```
types.ts  ←  no imports
   ↑
auth.ts   ←  imports types
   ↑
client.ts ←  imports types, auth
   ↑
formatters.ts ← imports types
   ↑
utils.ts  ←  imports types
   ↑
tools/*   ←  imports from all the above (leaf nodes)
   ↑
server.ts ←  imports tools/*
   ↑
index.ts  ←  imports server
```

**Rules:**
- Tool modules are **leaf nodes** — they import from shared modules but never from each other
- Never import from `tools/*` into `auth.ts`, `client.ts`, or other shared modules
- Use direct imports, not dependency injection — simpler and matches reference server patterns

---

## 6. State Ownership

State that changes at runtime (e.g., authenticated accounts, cached tokens) must be **owned by a single module** and exposed through accessor/mutator functions:

```typescript
// auth.ts — OWNS the mutable state
let accounts: Map<string, Account> = new Map();

export function getAccount(id?: string): Account | undefined { ... }
export function removeAccount(id: string): void { ... }
export function loadAccounts(): void { ... }
```

Tool modules call `getAccount()` — they **never** touch the Map directly. This prevents scattered mutations and makes the state easy to reason about.

---

## 7. Error Handling

### Shared error wrapper

Every `registerTool` callback should be wrapped with a shared error handler that:
1. Catches exceptions and converts them to MCP-compatible responses
2. Preserves a structured error format: `{ ok: false, error, code, resolution }`
3. Prevents unhandled exceptions from crashing the server process

```typescript
// utils.ts
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export function withErrorHandling<T>(
  fn: (args: T, extra: unknown) => Promise<string>
): (args: T, extra: unknown) => Promise<CallToolResult> {
  return async (args, extra) => {
    try {
      const result = await fn(args, extra);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      if (error instanceof ServiceError) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              ok: false,
              error: error.message,
              code: error.code,
              resolution: error.resolution,
            }),
          }],
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify({ ok: false, error: String(error) }) }],
      };
    }
  };
}
```

### Error sanitisation

- **Log full errors** (stack traces, response bodies) to `stderr` for debugging
- **Return sanitised messages** to the caller — never leak API keys, internal URLs, or raw upstream error bodies
- Use domain-specific error classes (e.g., `ServiceError`) with `code` + `resolution` fields for actionable guidance

---

## 8. Security Baseline

### File permissions

| What | Permission | Why |
|---|---|---|
| Credential files (tokens, accounts.json) | `0o600` | Owner read/write only |
| Credential directories | `0o700` | Owner access only |
| Temp export files | `0o600` | Prevent other users reading exported data |

Without explicit `mode`, Node.js `fs.writeFile` inherits the process umask (typically `0o644` = world-readable). On shared workstations, any local process can read OAuth refresh tokens and gain persistent access to user accounts.

**Important:** The `mode` parameter only applies when creating a new file. If the file already exists, old permissions are preserved. Always call `fs.chmod` after every credential write:

```typescript
// CORRECT — restrictive permissions + chmod for existing files
await fs.writeFile(tokenPath, JSON.stringify(tokenData, null, 2), { mode: 0o600 });
await fs.chmod(tokenPath, 0o600);
await fs.mkdir(credentialsDir, { recursive: true, mode: 0o700 });
```

The `mode` parameter is silently ignored on Windows (which uses ACLs). Always include it — it is safe on all platforms.

### Atomic writes for crash safety

Token files should use write-to-temp + rename to prevent corruption if the process crashes mid-write:

```typescript
async function writeCredentialFile(filePath: string, data: string): Promise<void> {
  const tmpPath = `${filePath}.tmp.${process.pid}`;
  await fs.writeFile(tmpPath, data, { mode: 0o600 });
  await fs.rename(tmpPath, filePath); // atomic on same volume
}
```

### Input validation

- **Identifier validation:** Regex-check user-supplied identifiers (subdomains, tenant IDs) before using them in URLs. Example: `/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i`
- **Path traversal prevention:** Confine file writes to a safe directory:
  ```typescript
  function resolveSafeOutputPath(outputPath: string): string {
    const resolved = path.resolve(outputPath);
    if (!resolved.startsWith(path.resolve(os.tmpdir()))) {
      throw new Error('output_path must be within the temp directory');
    }
    return resolved;
  }
  ```
- **Request timeouts:** Always set `AbortSignal.timeout()` on outbound requests. Default: 30 seconds.
- **Zod for all inputs:** Use Zod schemas on every tool — they provide both type safety and runtime validation at the boundary.

### No token exposure

Never expose tokens or API keys in tool responses or log output. See the next section for the recommended abstraction.

---

## 9. Credential Abstraction

Tool modules should **never** handle raw secrets directly. Wrap credentials in a `getAuthHeader(account)` function so tool code never sees tokens:

```typescript
// auth.ts
export function getAuthHeader(account: Account): Record<string, string> {
  return { Authorization: `Bearer ${account.accessToken}` };
}

// tools/tickets.ts — uses the abstraction
const headers = getAuthHeader(account);
const response = await fetch(url, { headers });
```

This centralises credential handling and makes it easier to audit, rotate, and protect secrets.

---

## 10. Packaging and Distribution

### ESM-only + npx

All MCP servers should use ESM output with `tsc`, targeting `npx` as the primary distribution method:

```json
{
  "name": "@scope/mcp-server-service",
  "version": "0.1.0",
  "type": "module",
  "bin": { "mcp-server-service": "dist/index.js" },
  "files": ["dist"],
  "scripts": {
    "build": "tsc && shx chmod +x dist/index.js",
    "prepare": "npm run build",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.26.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^22",
    "shx": "^0.3.4",
    "typescript": "^5.8.2"
  },
  "engines": { "node": ">=18" }
}
```

**Key fields:**
- `bin` — enables `npx` execution
- `files: ["dist"]` — limits the npm package to compiled output only (no source, tests, or config)
- `prepare` — ensures a clean build before `npm publish`

### Shebang preservation

The entrypoint (`src/index.ts`) must start with `#!/usr/bin/env node`. TypeScript 5.5+ preserves shebangs in compiled output. Verify after build:

```bash
head -1 dist/index.js  # Should show: #!/usr/bin/env node
```

### Host configuration examples

```json
// npx (once published)
{ "command": "npx", "args": ["-y", "@scope/mcp-server-service@0.1.0"] }

// Local development
{ "command": "node", "args": ["/path/to/dist/index.js"] }
```

> For complete `tsconfig.json` configuration and project scaffolding, see [node_mcp_server.md](node_mcp_server.md).

---

## 11. Pre-Ship Checklist

Before considering an MCP server ready to ship:

### SDK and tools
- [ ] Uses `McpServer` + `registerTool()` + Zod (not legacy `Server`)
- [ ] All tools have `annotations` (readOnlyHint and destructiveHint at minimum)
- [ ] All tool names use snake_case with service prefix
- [ ] All top-level parameters use snake_case
- [ ] Repeated concepts use canonical names (`limit`, `page_token`/`cursor`, `return_json`, `{thing}_id`)

### Error handling
- [ ] Error responses follow `{ ok: false, error, code, resolution }` via `withErrorHandling()`
- [ ] No secrets, tokens, or internal URLs in tool responses
- [ ] No token values or refresh tokens in log output (stderr)

### Security
- [ ] Credential files written with explicit `{ mode: 0o600 }` + `fs.chmod`
- [ ] Credential directories created with explicit `{ mode: 0o700 }`
- [ ] Token writes use atomic pattern (write-to-temp + rename)
- [ ] Input validation on user-supplied identifiers (subdomains, paths, IDs)
- [ ] Request timeouts set on all outbound HTTP calls
- [ ] No hardcoded secrets in source code

### Packaging
- [ ] ESM-only output with `bin` field and shebang preserved
- [ ] `files: ["dist"]` in package.json
- [ ] `npm run build` succeeds from clean state
- [ ] Smoke test: `node dist/index.js` starts without errors

### OSS readiness (for connectors published to npm)
- [ ] No internal references in source/test code (run the grep check below)
- [ ] No bridge pattern code (`bridge.ts`, `MINDSTONE_REBEL_BRIDGE_STATE`, localhost bridge calls)
- [ ] Error messages and resolution hints are host-neutral
- [ ] User-Agent strings use connector name, not host app branding
- [ ] Host/domain inputs validated before credential transmission (see Host/Domain Validation above)
- [ ] LICENSE file present with full license text
- [ ] README.md present with setup, tool reference, and security disclosures
- [ ] Mock credentials in tests do not resemble real key patterns (avoid `sk_`, `key_real_`, etc.)
- [ ] No internal environment variables (e.g., REBEL_WORKSPACE_PATH, MINDSTONE_REBEL_BRIDGE_STATE)
- [ ] `npm audit` clean — no Critical or High vulnerabilities
- [ ] No hardcoded secrets anywhere in source or test fixtures

## OSS Readiness

### Host/Domain Validation Patterns

When a connector accepts user-supplied hostnames or subdomains that will be used in URL construction:

- MUST validate against a strict pattern before interpolating into URLs
- MUST validate before sending any credentials to the constructed URL
- Subdomain pattern example: `^[a-z0-9]([a-z0-9-]*[a-z0-9])?$` (rejects slashes, `@`, `?`, etc.)
- Full hostname pattern: allowlist of known vendor domains (e.g. `*.workday.com`, `*.freshdesk.com`)

```typescript
// utils.ts — shared hostname validation
const SUBDOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;

export function validateSubdomain(input: string, serviceName: string): string {
  const trimmed = input.trim().toLowerCase();
  if (!SUBDOMAIN_PATTERN.test(trimmed)) {
    throw new ServiceError(
      'INVALID_SUBDOMAIN',
      `Invalid ${serviceName} subdomain: must contain only letters, numbers, and hyphens`,
      `Check your ${serviceName} subdomain and try again`
    );
  }
  return trimmed;
}

export function validateServiceHost(host: string, allowedPattern: RegExp, serviceName: string): string {
  const trimmed = host.trim().toLowerCase();
  if (!allowedPattern.test(trimmed)) {
    throw new ServiceError(
      'INVALID_HOST',
      `Invalid ${serviceName} host: must match ${allowedPattern}`,
      `Verify the ${serviceName} hostname and try again`
    );
  }
  return trimmed;
}
```

**Why this matters:** Without validation, attackers can craft hostnames that redirect API requests (with credentials in `Authorization` headers) to attacker-controlled servers.

### Internal Reference Stripping (OSS connectors)

Connectors published as open-source packages must not contain internal references:

| What to check | Allowed | Not allowed |
|---|---|---|
| Error messages | "Reconnect in your MCP host's settings" | "Reconnect in Mindstone Settings > Integrations" |
| User-Agent | "mcp-server-zendesk/0.2.0" | Product-host-specific User-Agent strings |
| Environment variables | Service-specific (`ZENDESK_API_TOKEN`) | `REBEL_WORKSPACE_PATH`, `MINDSTONE_REBEL_BRIDGE_STATE` |
| Bridge code | Not present | `src/bridge.ts`, localhost bridge calls |
| Package metadata | `@mindstone-engineering` scope (intentional) | Internal repo URLs if not public |

Pre-publish grep check:

```bash
# Run from connector root — should return zero matches (excluding LICENSE, package.json author/scope)
rg -i 'mindstone|rebel|nspr' --glob '!LICENSE' --glob '!package.json' --glob '!node_modules' src/ test/
```

### Error Message Neutrality

All user-facing error messages and resolution hints must be host-neutral:

- Do NOT reference specific app names ("Mindstone", "Rebel", "Claude Desktop")
- Use generic MCP host language: "your MCP host", "the host application", "your connector settings"
- Example: `resolution: "Reconnect this connector in your MCP host's settings"`
