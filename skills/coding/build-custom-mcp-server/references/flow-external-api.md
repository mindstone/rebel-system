# External API Flow

Detailed workflow for creating MCPs that connect to external/public APIs.

**Key difference from internal APIs**: Documentation is publicly available, so researcher subagent can help discover it.


## Phase 2: Research (External APIs)

### 2.1 Use Researcher Subagent

Launch a researcher to find API documentation:

```
Research the [API NAME] API documentation. Find:
1. Official API documentation URL
2. Authentication method (API key, OAuth, etc.)
3. Base URL for API requests
4. Rate limits and quotas
5. Available endpoints relevant to: [USER'S USE CASES]
6. Request/response formats

Return a structured summary with links to authoritative sources.
```

### 2.2 Verify Findings

After researcher returns:
1. Review the documentation links
2. Confirm auth method matches what user described
3. Identify the specific endpoints needed for user's use cases
4. Note any rate limits or usage restrictions

### 2.3 Check for Existing MCP

Before building, search for existing implementations:
- Official vendor MCP (some providers like Notion, Linear have official MCPs)
- Community MCPs on GitHub: `site:github.com [API NAME] mcp`
- Smithery registry: https://smithery.ai

If a quality existing MCP exists, consider using it instead of building new.


### 2.4 Probe the live API (MANDATORY before implementation)

> **Why this step exists:** Contributed connectors have shipped with
> hallucinated endpoints (that return 404 against the real API) and wrong
> auth headers (that return 401 against the real API) because the research
> phase trusted model memory of the API instead of verifying each call. A
> 30-second curl probe of each endpoint prevents an entire class of broken
> PRs. **Do not skip this step, even if the API seems well-known.**

Before proposing the tool list in Phase 3, verify each planned endpoint
and the auth header against the **real live API**. Skipping this step
is the single most common cause of broken contributed connectors.

**Required steps:**

1. **Ask the user for a test API key** (sandbox/free tier preferred).
   Use the **same `AskUserQuestion` card pattern documented in
   [SKILL.md § 6.2 "Set Up Credentials"](../SKILL.md#62-set-up-credentials)**
   — one card with a "Have it" option that takes the key as input and a
   "Need to get it" option that pairs `url` (the provider's API-keys
   page) with `requiresInput: true` and a clear `inputPlaceholder`. Just
   earlier in the flow. Don't ask in free-text chat; the card-based flow
   is what the in-app UX expects.
   If the user has not yet obtained one, pause research and help them
   through the auth section below. Do not proceed with "I'll implement
   it and they can test later" — that's the pattern that produces
   broken PRs.
2. **Probe each planned endpoint with `curl`** using the auth header
   documented in the API docs. For each endpoint, record:
   - HTTP method + full URL
   - Auth header name and value format (redacted)
   - Observed HTTP status code
   - First ~200 chars of the response body
3. **If you cannot obtain a key**, do not silently stop. Report
   `testing` status via `rebel_mcp_report_contribution_state` (the
   valid transitions are `draft` / `testing` / `ready_to_submit` —
   there is no `blocked` status, and the tool does not accept an
   arbitrary `notes` field), then send a visible chat message to the
   user that names the blocker — e.g. *"I need a test access key before
   I can safely try this with [provider]. Could you create one here and
   paste it back?"*. Stay in
   `testing` until the probe can run; do not skip implementation on
   unverified endpoints and do not invent a new status. The user's
   MCPBuildCard will show the `testing` state, and the chat message
   carries the explanation.
4. **Paste the probe results into `docs/build-plan.md`** under a
   dedicated `## Live API Probes` section. Reviewers and the implementer
   MUST be able to see this evidence.

**Minimum probe set** (per endpoint the tool list will expose):

```bash
# Example — verify auth header works
curl -s -o /dev/null -w "HTTP %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  https://api.example.com/v1/items

# Example — verify a specific resource endpoint exists
curl -s -w "\nHTTP %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  https://api.example.com/v1/items/123 | head -20

# Example — verify a mutation endpoint exists (use a harmless test body)
curl -s -w "\nHTTP %{http_code}\n" -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}' \
  https://api.example.com/v1/items/123/runs | head -20
```

**Interpret the results:**

- `HTTP 200/201/204` → endpoint exists and auth works ✅
- `HTTP 400` → endpoint exists, body was wrong — this is fine for the
  probe; note the expected schema from the error response
- `HTTP 401/403` → auth header is wrong. **Stop.** Read the docs again,
  try alternative header names (`X-Api-Key`, `X-API-Key`, `Bearer`,
  service-specific formats), and re-probe until you get 2xx or a
  request-level error like 400.
- `HTTP 404` → endpoint does not exist. **Stop.** The endpoint you
  planned is either wrong, renamed, or on a different base URL. Read
  the docs again or drop the tool from the plan. Do not implement
  against a 404 endpoint and assume it will work later.

**Record the probes verbatim in the build-plan** so the reviewer can
confirm the endpoints and auth header used by the implementer match
the probes that returned 2xx. Each entry MUST include the full URL,
the HTTP status, and the first ~200 chars of the response body — a
status code on its own is not evidence. Example format:

````markdown
## Live API Probes (Phase 2.4)

Probed on 2026-04-21 using a free-tier API key.

### GET https://api.example.com/v1/items
- Auth header: `Authorization: Bearer <redacted>`
- HTTP: **200**
- Response preview:
  ```
  {"items":[{"id":"abc","name":"Example one"},{"id":"def","name":"Example two"}],"next_cursor":null}
  ```

### GET https://api.example.com/v1/items/abc
- Auth header: `Authorization: Bearer <redacted>`
- HTTP: **200**
- Response preview:
  ```
  {"id":"abc","name":"Example one","created_at":"2026-04-20T10:11:12Z","owner":"user-42"}
  ```

### POST https://api.example.com/v1/items/abc/runs
- Auth header: `Authorization: Bearer <redacted>`
- HTTP: **404**
- Response preview:
  ```
  {"status":404,"title":"Not Found","detail":"The requested resource could not be found."}
  ```
- Action: ❌ Endpoint does not exist — dropping `run_item` tool from Phase 3 tool list.
````

If a probe returns 404 or 401, the tool list from Phase 3 must be
revised to remove or replace that tool — not implemented and hoped for.
A nested code fence showing the actual response body is mandatory; a
one-line "returns list" summary is not sufficient evidence.

---


## Common External API Patterns

### Pattern: REST API with API Key
Most common pattern (Stripe, SendGrid, etc.)

```typescript
const API_KEY = process.env.STRIPE_API_KEY;
const BASE_URL = 'https://api.stripe.com/v1';

async function apiRequest(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}
```

### Pattern: REST API with OAuth
For APIs requiring user authorization (Google, Microsoft, etc.)

**Note**: OAuth is complex for non-technical users. If the API requires OAuth:
1. Check if Rebel already has a built-in connector
2. If not, recommend user involve a developer or IT team
3. Point to [mcp_best_practices.md](mcp_best_practices.md) OAuth patterns as reference

### Pattern: GraphQL API
Some modern APIs use GraphQL (GitHub, Shopify, etc.)

```typescript
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function graphqlRequest(query: string, variables?: object) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}
```


## Authentication for External APIs

### Getting API Credentials

Guide user to obtain credentials:

1. **Identify the developer portal**
   - Usually: `developer.[service].com` or `[service].com/developers`
   - Researcher can find this

2. **Create developer account**
   - User may need to sign up
   - Some APIs require approval

3. **Generate API key/token**
   - Usually in Settings/API Keys section
   - Note any scopes or permissions needed

4. **Store securely**
   - Add to `.env` file
   - Never commit to git
   - Never share in chat


## Rate Limiting

External APIs almost always have rate limits. Handle gracefully:

### Detection
```typescript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  return {
    isError: true,
    content: [{
      type: 'text',
      text: `Rate limit exceeded. Try again in ${retryAfter} seconds.`
    }]
  };
}
```

### Prevention
- Add delays between requests if doing bulk operations
- Cache responses where appropriate
- Document rate limits in tool descriptions


## Example: Building a GitHub MCP

### Use Cases (from user)
- "Search repositories"
- "Get issue details"
- "List my pull requests"

### Research Findings
- Base URL: `https://api.github.com`
- Auth: Personal Access Token in `Authorization: Bearer` header
- Rate limit: 5000 requests/hour (authenticated)
- Docs: https://docs.github.com/en/rest

### Proposed Tools
| Tool | Endpoint | Description |
|------|----------|-------------|
| `search_repos` | GET /search/repositories | Search public repositories |
| `get_issue` | GET /repos/{owner}/{repo}/issues/{number} | Get issue details |
| `list_my_prs` | GET /search/issues | Find PRs authored by user |

### Implementation Notes
- Use `q` parameter for search queries
- Include pagination support
- Return markdown-formatted summaries for readability


## Troubleshooting External APIs

### "401 Unauthorized"
- API key may be invalid or expired
- Check if key has required scopes/permissions
- Verify header format (Bearer vs Basic vs custom)

### "403 Forbidden"
- API key lacks permission for this endpoint
- May need upgraded plan (paid APIs)
- Check if endpoint requires specific scopes

### "429 Too Many Requests"
- Rate limit exceeded
- Wait for retry period
- Consider caching or reducing request frequency

### "CORS errors" (in browser context)
- Not applicable for Node.js MCP servers
- MCP servers run server-side, no CORS restrictions
