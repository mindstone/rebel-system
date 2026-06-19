# Internal API Flow

Detailed workflow for creating MCPs that connect to internal/private APIs.

**Key difference from external APIs**: Documentation is not publicly available, so the user must provide it.


## Phase 2: Research (Internal APIs)

### 2.1 Gather Documentation from User

Since researcher subagent cannot access internal docs, ask user to provide:

**Option A: System documentation**
- Ask: "Do you have a document that explains how this internal system works?"
- If yes, have user share the file or paste relevant sections
- Parse to extract endpoints, parameters, response schemas

**Option B: Working examples**
- Ask: "Do you have an example request that already works?"
- If yes, have user export and share it
- Extract endpoints and example requests/responses

**Option C: Example Requests**
- Ask: "Do you have an example request or response you can share?"
- For each use case, get:
  - HTTP method and URL
  - Required headers
  - Request body (if any)
  - Example response

**Option D: Manual Description**
- If no docs exist, ask user to describe each endpoint:
  - What address should I use?
  - What details does it need?
  - What does it return?
  - How does it know you're allowed to use it?

### 2.2 Validate Understanding

After gathering docs, summarize back to user:
```
Based on what you've shared, here's my understanding:

System address: https://internal-api.company.com/v1
Access: API key in X-API-Key header

Things Rebel should be able to do:
- Search customers
- Get order details
- Create support tickets

Is this correct?
```

Get explicit confirmation before proceeding.

### 2.3 Network Considerations

Ask user:
- "Will this tool run on the same network as the internal system?"
- "Do you need to be on your company network for it to respond?"
- "Does your company limit which machines can use it?"

Document any network requirements for testing phase.


## Authentication Patterns for Internal APIs

Internal APIs often use simpler auth than public APIs:

### Pattern 1: Static API Key
Most common for internal services.
```typescript
const API_KEY = process.env.INTERNAL_API_KEY;
const headers = {
  'X-API-Key': API_KEY,
  'Content-Type': 'application/json',
};
```

### Pattern 2: Service Account Token
For APIs that use service-to-service auth.
```typescript
const SERVICE_TOKEN = process.env.SERVICE_ACCOUNT_TOKEN;
const headers = {
  'Authorization': `Bearer ${SERVICE_TOKEN}`,
};
```

### Pattern 3: Multiple Headers
Some internal APIs require org/tenant identifiers.
```typescript
const headers = {
  'X-API-Key': process.env.API_KEY,
  'X-Tenant-Id': process.env.TENANT_ID,
  'X-Environment': process.env.ENVIRONMENT || 'production',
};
```

### Pattern 4: Basic Auth
Legacy internal systems sometimes use Basic auth.
```typescript
const credentials = Buffer.from(
  `${process.env.API_USER}:${process.env.API_PASSWORD}`
).toString('base64');
const headers = {
  'Authorization': `Basic ${credentials}`,
};
```

### Pattern 5: Custom Auth (Ask for Curl)
If auth is unclear, ask user for a working example:
```
Can you share a working example request?
I'll extract the auth pattern from that.
```


## Common Internal API Scenarios

### Scenario: Database Gateway API
User wants Rebel to query internal database via API layer.
- Tools: `search_records`, `get_record_by_id`, `list_tables`
- Auth: Usually API key
- Caution: Limit query scope, add pagination

### Scenario: Internal Ticketing System
User wants Rebel to create/search support tickets.
- Tools: `search_tickets`, `get_ticket`, `create_ticket`, `add_comment`
- Auth: API key or service account
- Caution: Be careful with create/update permissions

### Scenario: Internal CRM/ERP
User wants Rebel to look up customers, orders, inventory.
- Tools: `search_customers`, `get_customer`, `check_inventory`, `get_order`
- Auth: Often multiple headers (API key + tenant)
- Caution: Start read-only, add writes only if needed

### Scenario: Internal Analytics/BI
User wants Rebel to run reports or fetch metrics.
- Tools: `run_report`, `get_dashboard_data`, `fetch_metrics`
- Auth: Usually service account
- Caution: Long-running queries need timeout handling


## Security Considerations for Internal APIs

### 1. Principle of Least Privilege
- Only implement tools for the specific use cases discussed
- Don't create generic "call any endpoint" tools
- If user asks for write operations, confirm they really need them

### 2. Data Sensitivity
Ask user: "Does this include sensitive personal, financial, or health information?"
If yes:
- Consider what data Rebel should see
- May need to filter/redact responses
- Document data handling in tool descriptions

### 3. Audit Trail
Internal APIs may log all requests. Inform user:
- "Requests from this tool will appear in your system logs"
- "Use a dedicated API key so requests are identifiable"

### 4. Network Isolation
- MCP server runs locally on user's machine
- API calls go directly from their machine to internal network
- No data passes through Rebel's servers (besides LLM processing)


## Troubleshooting Internal APIs

### "Connection refused"
- Check VPN is connected
- Verify API is accessible from user's machine: `curl <api-url>`
- Check firewall rules

### "401 Unauthorized"
- Verify API key/token is correct in `.env`
- Check if credentials have expired
- Confirm header name matches what API expects

### "403 Forbidden"
- User's credentials may lack permission for that endpoint
- Contact API owner to verify access rights

### "SSL Certificate Error"
- Internal APIs may use self-signed certs
- May need to add `NODE_TLS_REJECT_UNAUTHORIZED=0` (not recommended for production)
- Better: Add internal CA cert to Node's trust store
