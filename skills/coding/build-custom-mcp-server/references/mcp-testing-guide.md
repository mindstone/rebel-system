# MCP Testing Guide

> **Sync Notice** — Derived from Rebel's MCP testing and improvement standards (2026-04-09). When the upstream standards change, this bundled copy should be re-synced to reflect updated patterns.

This document defines the testing standards for MCP servers. It covers the test strategy decision order, mock patterns, integration fallbacks, debugging, and how to keep tests current.

For **development standards** (SDK patterns, naming, error handling, security, packaging), see [mcp-development-standard.md](mcp-development-standard.md).
For **tool design** principles (naming, descriptions, pagination, response formats), see [mcp_best_practices.md](mcp_best_practices.md).

---

## 1. Every MCP Needs Tests

Testing is **mandatory**, not optional. Every new or improved MCP server must have tests before the work is considered complete.

Tests are the only reliable way to catch:
- Tool registration failures and malformed schemas
- Response shaping bugs (wrong fields, missing data, broken formatting)
- Error handling regressions (crashes instead of structured errors)
- Breaking changes when the upstream API evolves
- Packaging issues (missing build artifacts, broken imports)

An MCP without tests is an MCP that will break silently. Choose the best approach for your server from the strategies below, then add tests before shipping.

---

## 2. Test Strategy Decision Order

Not all MCPs are equal — choose the test approach that gives the best coverage for the least effort. Follow this decision order:

| Priority | Strategy | When to use | Key advantage |
|----------|----------|-------------|---------------|
| **1st choice** | Mock API tests | MCP makes REST/HTTP calls | Deterministic, no API keys needed, tests full pipeline |
| **2nd choice** | Mock client unit tests | MCP uses a vendor SDK | Fast, tests tool logic directly, mocks the SDK client |
| **Fallback** | Declarative integration tests | Mocking is impractical | Skips cleanly without credentials, tests real behavior when keys are available |

**Decision flow:**
1. Can you intercept the MCP's outbound HTTP calls? → **Use mock API tests** (preferred)
2. Does the MCP use a vendor SDK you can mock? → **Use mock client unit tests**
3. Neither is practical? → **Use declarative integration tests** as a fallback

Always prefer mock tests — they are deterministic, run without API keys, and can run in any CI environment.

---

## 3. Mock API Test Pattern

Mock API tests spawn the **real MCP server process** and intercept its outbound HTTP traffic, replacing real API responses with controlled mock data. This tests the full pipeline: tool invocation → handler logic → HTTP request construction → response shaping.

### How it works

1. A local mock HTTP server starts with predefined routes and responses
2. The MCP server process is spawned with environment variables pointing to the mock server
3. Tests call tools via the MCP protocol and verify the shaped responses
4. The mock server logs all requests, so you can verify request construction (headers, query params, body)

### Example structure

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Mock data
const mockItems = [
  { id: '1', name: 'Item One' },
  { id: '2', name: 'Item Two' },
];

describe('my-mcp - mock API tests', () => {
  let client; // MCP test client
  let mockApi; // Mock HTTP server

  beforeAll(async () => {
    // Start mock API server with predefined routes
    // Start MCP server process pointing to mock API
    // Connect MCP test client
  }, 30_000);

  afterAll(async () => {
    if (client) await client.close();
    if (mockApi) await mockApi.close();
  });

  it('list_items returns shaped data', async () => {
    const result = await client.callTool('list_items', {});
    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toHaveProperty('id');
  });

  it('get_item with invalid ID returns structured error', async () => {
    const result = await client.callTool('get_item', { item_id: 'nonexistent' });
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('sends correct authorization header', () => {
    const requests = mockApi.getRequestLog();
    const listRequest = requests.find(r => r.path === '/api/items');
    expect(listRequest.headers.authorization).toBe('Bearer mock-test-key');
  });
});
```

### Key setup details

- **Intercepted domains:** Configure which API domains the mock server handles (e.g., `api.example.com`)
- **Environment variables:** Pass mock API keys and base URL overrides to the MCP process
- **Connection timeout:** Allow 15–30 seconds for server startup in `beforeAll`
- **Routes:** Define mock routes with method, path, and response (status code + JSON body)

---

## 4. What Mock Tests Should Cover

Mock tests should cover these categories at minimum:

### Happy path
- Each tool returns correctly shaped data for valid inputs
- Default parameters produce reasonable results
- Response fields match the tool's documented output

### Pagination
- `limit` parameter restricts result count
- Pagination tokens/cursors are passed correctly to the upstream API
- Empty pages return clean empty arrays, not errors

### Malformed input
- Missing required parameters return structured errors (not crashes)
- Invalid parameter types are rejected with helpful messages
- Out-of-range values (negative limits, empty strings) are handled gracefully

### Auth and error cases
- Expired or invalid credentials return actionable error messages
- API rate limit responses (HTTP 429) are handled, not swallowed
- Server errors (HTTP 500) produce structured error responses
- Missing configuration returns a clear "not configured" message (not a crash)

### Empty states
- Tools return clean results when the upstream API returns no data
- Empty search results return `{ ok: true, data: [] }`, not an error
- Null or missing optional fields in API responses don't cause exceptions

### Request construction
- Correct HTTP method (GET, POST, PUT, DELETE) for each tool
- Required headers are present (Authorization, Content-Type)
- Query parameters and request body are correctly formatted
- Pagination parameters are passed through to the upstream API

Use the mock server's request log to verify request construction without needing a real API.

---

## 5. Mock Client Unit Tests

When the MCP uses a vendor SDK (e.g., Microsoft Graph Client, AWS SDK), mock the SDK client and test tool functions directly. This is faster than full-server mock tests and catches logic bugs in tool handlers.

### When to use

- The MCP calls a vendor SDK rather than making raw HTTP requests
- The SDK client is complex to intercept at the HTTP level
- You want fast, focused tests of tool handler logic

### Example structure

```typescript
import { vi, describe, it, expect } from 'vitest';

// Mock the vendor SDK
vi.mock('vendor-sdk', () => ({
  Client: vi.fn().mockImplementation(() => ({
    items: {
      list: vi.fn().mockResolvedValue({ value: [{ id: '1', name: 'Test' }] }),
      get: vi.fn().mockResolvedValue({ id: '1', name: 'Test', details: '...' }),
    },
  })),
}));

// Import tool functions after mocking
const { listItems, getItem } = await import('./src/tools/items.js');

describe('my-mcp tools (mock client)', () => {
  it('listItems returns formatted results', async () => {
    const mockClient = new (await import('vendor-sdk')).Client();
    const result = await listItems(mockClient, { limit: 10 });
    expect(result.ok).toBe(true);
    expect(result.data).toHaveLength(1);
  });

  it('getItem handles missing item', async () => {
    const mockClient = new (await import('vendor-sdk')).Client();
    mockClient.items.get.mockRejectedValueOnce(new Error('Not found'));
    const result = await getItem(mockClient, { item_id: 'missing' });
    expect(result.ok).toBe(false);
  });
});
```

### Key principles

- Mock at the SDK boundary, not at HTTP level
- Test each tool function independently
- Verify error handling for SDK exceptions
- Check that tool functions correctly shape SDK responses into MCP output format

---

## 6. Declarative Integration Tests (Fallback)

When mocking is impractical, use declarative integration tests as a fallback. These tests call real APIs with real credentials — but **skip automatically** when the required API key is not set, so they never fail in environments without credentials.

### When to use

- The API surface is too complex to mock effectively
- You need to verify real API behavior (pagination, rate limits, error formats)
- As a supplement to mock tests for end-to-end confidence

### Example structure

```typescript
import { describe, it, expect, beforeAll } from 'vitest';

const API_KEY = process.env.MY_SERVICE_API_KEY;

describe('my-mcp - integration tests', () => {
  beforeAll(() => {
    if (!API_KEY) {
      console.log('Skipping integration tests: MY_SERVICE_API_KEY not set');
      return;
    }
    // Start real MCP server with real credentials
  });

  it('list_items returns real data', async () => {
    if (!API_KEY) return; // Skip without credentials
    const result = await client.callTool('list_items', { limit: 2 });
    expect(result.ok).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('get_item with invalid ID returns error', async () => {
    if (!API_KEY) return;
    const result = await client.callTool('get_item', { item_id: 'invalid-id-12345' });
    expect(result.ok).toBe(false);
  });
});
```

### Declarative configuration approach

For simpler test files, use a configuration object that declares expected tools and test cases:

```typescript
const integrationConfig = {
  name: 'my-mcp',
  envKey: 'MY_SERVICE_API_KEY',
  expectedTools: ['list_items', 'get_item', 'create_item'],
  toolTests: [
    { tool: 'list_items', args: { limit: 2 }, expectOk: true, expectFields: ['ok', 'data'] },
    { tool: 'get_item', args: { item_id: 'invalid' }, expectOk: false },
    { tool: 'create_item', skip: true }, // Skip write tools in automated tests
  ],
};
```

This keeps per-MCP test files minimal (10–15 lines) and makes adding tests for new MCPs straightforward.

### Key principles

- **Always skip cleanly without credentials** — never fail, never error
- **Mark write/destructive tools as `skip: true`** — don't create, modify, or delete real data in automated tests
- **Use small result sets** (`limit: 2`) to avoid slow tests and rate limits
- **Expect specific response fields** — validate the response shape, not just `ok: true`

---

## 7. Smoke and Integration Test Purposes

Beyond tool-level tests, MCP servers benefit from two additional test levels:

### Startup smoke tests

Verify that the MCP server process starts successfully without crashing. This catches:
- Import errors and missing dependencies
- Syntax errors in compiled output
- Missing environment variables that cause immediate crashes
- Broken package structure (missing entrypoint, bad shebang)

A smoke test simply spawns the server process and verifies it doesn't exit with a non-zero code within a few seconds.

```bash
# Basic smoke test: start the server, check it doesn't crash
node dist/index.js &
SERVER_PID=$!
sleep 3
kill -0 $SERVER_PID 2>/dev/null && echo "PASS: Server started" || echo "FAIL: Server crashed"
kill $SERVER_PID 2>/dev/null
```

### Schema and tool registration tests

Connect to the running server via the MCP protocol and verify:
- All expected tools are registered (tool names match the expected list)
- Every tool has a `name`, `description`, and valid `inputSchema`
- `inputSchema.type` is `"object"` for every tool (MCP protocol requirement)
- Tool count matches expectations (catches accidental tool removals)

```typescript
const { tools } = await client.listTools();
expect(tools.length).toBe(expectedToolCount);
for (const tool of tools) {
  expect(tool.name).toBeTruthy();
  expect(tool.description).toBeTruthy();
  expect(tool.inputSchema.type).toBe('object');
}
```

### Unconfigured error handling

Verify that calling a tool without proper configuration returns a structured error response — not a crash or unhandled exception:

```typescript
// Call without API key configured — should return structured error, not crash
const result = await client.callTool('list_items', {});
expect(result.ok).toBe(false);
// Server should still be alive after the error
const { tools } = await client.listTools();
expect(tools.length).toBeGreaterThan(0);
```

---

## 8. Build Prerequisites

MCP test artifacts must exist before tests can run. If your MCP compiles TypeScript to JavaScript (or bundles source into a single file), the build step must complete before any test that spawns the server process.

### Build before test

```bash
# Build the MCP server
npm run build

# Then run tests
npm test
```

In your `package.json`, ensure the test script doesn't depend on a pre-existing build:

```json
{
  "scripts": {
    "build": "tsc",
    "pretest": "npm run build",
    "test": "vitest run"
  }
}
```

Using `pretest` ensures the build runs automatically before every test invocation.

### Common build issues

- **Missing `dist/` directory:** Tests that spawn `node dist/index.js` will fail if the TypeScript hasn't been compiled
- **Stale build artifacts:** After changing source code, always rebuild before running tests — stale `.js` files will produce confusing failures
- **Build script not in package.json:** Ensure `npm run build` works from a clean state

### CI considerations

In CI pipelines, always run `npm run build` as a separate step before `npm test`. Don't rely on cached build artifacts from previous runs — a clean build-then-test sequence catches more issues.

---

## 9. Keeping Tests in Sync with Tool Changes

Tests drift when tools change. Follow these practices to keep them aligned:

### When you add a new tool

- Add the tool name to the `expectedTools` array in integration/smoke tests
- Write mock API test cases covering happy path and error cases
- Verify the new tool appears in `client.listTools()` output

### When you rename a tool

- Update all test references to use the new tool name
- If backwards-compatible aliases exist, add a test that verifies the old name still works
- Update `expectedTools` arrays

### When you change a tool's input schema

- Update test `args` to match the new schema
- If parameters were renamed, test both old and new names (if aliases are supported)
- Add a test for any new required parameters

### When you change a tool's response shape

- Update `expectFields` or response assertions to match the new shape
- If a field was removed intentionally, remove it from tests
- If a field was added, add assertions for it

### When you change error handling

- Update error assertions to match the new error format
- If the error response structure changed (e.g., from `{ ok: false }` to `{ error: true }`), update all error test assertions
- Verify the server remains stable after errors (doesn't crash)

### Automation tip

If your test framework supports snapshot testing, consider snapshotting tool schemas from `client.listTools()`. Schema changes will then be surfaced as snapshot diffs during code review.

---

## 10. Common Failures and Debugging Patterns

### Missing build artifact

**Symptom:** Test fails with "server script not found" or "Cannot find module dist/index.js"

**Fix:** Run `npm run build` before running tests. If using CI, ensure the build step precedes the test step.

### Startup hang

**Symptom:** Test times out during server startup (connection timeout in `beforeAll`)

**Debug:**
```bash
# Run the server directly and check stderr
NODE_ENV=test node dist/index.js 2>&1
```

**Common causes:**
- Missing required environment variables — the server blocks waiting for configuration
- Network calls on startup (e.g., fetching site metadata) — these hang without network access
- Infinite loop in initialization code

**Fix:** Ensure all required env vars are set in the test environment. If the server makes network calls on startup, consider making them lazy (on first tool call) or mockable.

### Malformed tool schema

**Symptom:** Schema validation test fails with "inputSchema.type should be object" or "Tool missing description"

**Fix:** Check the tool's registration. Every tool needs:
- A `name` (non-empty string)
- A `description` (non-empty string)
- An `inputSchema` with `type: "object"` at the top level

```typescript
server.registerTool(
  'my_tool',
  {
    description: 'Does something useful', // Required
    inputSchema: {
      // Zod schema here — SDK converts to JSON Schema with type: "object"
      query: z.string().describe('Search query'),
    },
    annotations: { readOnlyHint: true },
  },
  handler,
);
```

### Unconfigured error mismatch

**Symptom:** Test expects a structured error from an unconfigured tool, but gets a crash or unhandled exception instead.

**Fix:** Wrap all tool handlers with a shared error handler (see [mcp-development-standard.md](mcp-development-standard.md) § Error Handling). The error handler should catch missing-credential errors and return a structured response:

```typescript
// In your error handler, check for configuration issues
if (!apiKey) {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        ok: false,
        error: 'Not configured',
        resolution: 'Set the API key in your MCP configuration',
      }),
    }],
  };
}
```

### Variable extraction ordering

**Symptom:** Integration test fails with "Variable not yet extracted" when using extracted values from previous test cases.

**Fix:** Ensure test cases run in order and that the extracting test (e.g., one that saves an `itemId` from a list response) comes before the consuming test (e.g., one that uses `$itemId` to fetch a single item).

### API response shape changed

**Symptom:** Integration test fails because expected fields are missing from the response.

**Fix:** The upstream API likely changed its response format. Update `expectFields` to match the new shape. If the change is unintentional, you may have found a regression in your response shaping code.

---

## 11. MCP Inspector for Interactive Debugging

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is an interactive debugging tool for MCP servers. Use it during development to:

- **Verify tool registration** — see all tools, their schemas, and descriptions
- **Test tools interactively** — call tools with custom arguments and inspect responses
- **Debug response formatting** — see exactly what the MCP returns (JSON structure, content blocks)
- **Identify schema issues** — malformed schemas are highlighted immediately

### Usage

```bash
# Install and run the inspector against your MCP server
npx @modelcontextprotocol/inspector node dist/index.js
```

This opens a web UI where you can:
1. Browse all registered tools and their schemas
2. Call any tool with custom arguments
3. Inspect the raw MCP protocol messages
4. Verify error responses match expected format

### When to use the Inspector

- **During development** — verify tools work before writing automated tests
- **When debugging test failures** — compare Inspector output with test expectations
- **When testing with real API keys** — interactive exploration of real API responses
- **For schema validation** — the Inspector highlights schema issues the MCP protocol layer would reject

### Programmatic alternative

For scripted debugging (or when you don't need the web UI), use the MCP SDK client directly:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'node',
  args: ['dist/index.js'],
  env: { MY_API_KEY: 'test-key', ...process.env },
});

const client = new Client({ name: 'debug-client', version: '1.0' });
await client.connect(transport);

// List all tools
const { tools } = await client.listTools();
console.log('Registered tools:', tools.map(t => t.name));

// Call a tool
const result = await client.callTool({
  name: 'list_items',
  arguments: { limit: 5 },
});
console.log('Result:', JSON.stringify(result, null, 2));

await client.close();
```

---

## 12. Declarative-First Test Architecture

When designing your test suite, prefer a **declarative-first** approach. This means structuring tests as configuration objects that describe *what* to test, not *how* to test it.

### Why declarative-first

- **Low per-MCP effort:** Adding tests for a new MCP is 10–15 lines of configuration, not hundreds of lines of custom test code
- **Consistency:** All MCPs are tested with the same patterns and assertions
- **Maintainability:** When the test framework improves, all MCP tests benefit automatically
- **Readability:** Test intent is clear from the configuration — no need to trace through test helper functions

### Recommended test file structure

```
my-mcp/
├── src/
│   ├── index.ts
│   ├── server.ts
│   └── tools/
├── test/
│   ├── mock-api.test.ts      # Mock API tests (primary)
│   └── integration.test.ts   # Declarative integration tests (fallback)
├── package.json
└── tsconfig.json
```

### Declarative mock test pattern

```typescript
// test/mock-api.test.ts
const mockRoutes = [
  { method: 'GET', path: '/api/items', handler: { body: { data: mockItems } } },
  { method: 'GET', path: '/api/items/1', handler: { body: mockItems[0] } },
  { method: 'GET', path: '/api/items/invalid', handler: { status: 404, body: { error: 'Not found' } } },
  { method: 'POST', path: '/api/items', handler: { status: 201, body: { id: '3', name: 'New Item' } } },
];

const toolTests = [
  { tool: 'list_items', args: {}, expectOk: true, expectFields: ['data'] },
  { tool: 'get_item', args: { item_id: '1' }, expectOk: true, expectFields: ['id', 'name'] },
  { tool: 'get_item', args: { item_id: 'invalid' }, expectOk: false },
  { tool: 'create_item', args: { name: 'New Item' }, expectOk: true, expectFields: ['id'] },
];
```

### When to use custom test code

Declarative tests cover the majority of cases. Drop to custom test code only when:
- The tool has an async polling workflow (e.g., start job → poll status → return result)
- The tool involves multi-step OAuth or authentication flows
- The tool reads/writes files with complex I/O patterns
- The response validation requires deep structural assertions beyond field presence

Even in these cases, keep the custom code minimal and consider whether a helper function could make it declarative in the future.

### Test coverage summary

A complete MCP test suite should include:

| Test type | Coverage | Runs without API keys? |
|-----------|----------|----------------------|
| Startup smoke | Server starts, doesn't crash | Yes |
| Schema validation | All tools registered with valid schemas | Yes |
| Mock API tests | Happy path, errors, pagination, edge cases | Yes |
| Unconfigured handling | Structured error when not configured | Yes |
| Integration tests (fallback) | Real API behavior when keys available | No (skips cleanly) |
