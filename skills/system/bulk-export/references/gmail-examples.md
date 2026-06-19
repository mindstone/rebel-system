# Gmail BulkExport Examples

## Pagination config

| Field | Value |
|-------|-------|
| `package_id` | `GoogleWorkspace-user-example-com` |
| `tool_id` | `search_workspace_emails` |
| `items_path` | `emails` |
| `pagination.token_field` | `nextPageToken` |
| `pagination.input_param` | `page_token` |

Always include `return_json: true` in args.

Find the right `package_id` with `list_tool_packages()` and then `list_tools(package_id="...")`.

## Export recent emails

```javascript
bulk_export({
  "package_id": "GoogleWorkspace-user-example-com",
  "tool_id": "search_workspace_emails",
  "args": { "query": "after:2026/01/01", "max_results": 100, "return_json": true },
  "output_file": "emails-recent.ndjson",
  "pagination": { "token_field": "nextPageToken", "input_param": "page_token" },
  "items_path": "emails"
})
```

## Export emails from a sender

```javascript
bulk_export({
  "package_id": "GoogleWorkspace-user-example-com",
  "tool_id": "search_workspace_emails",
  "args": { "query": "from:alice@example.com", "max_results": 100, "return_json": true },
  "output_file": "emails-from-alice.ndjson",
  "pagination": { "token_field": "nextPageToken", "input_param": "page_token" },
  "items_path": "emails"
})
```

## Ripgrep search patterns

```bash
# Find emails mentioning a topic
rg -i "quarterly report" .rebel/exports/emails-*.ndjson

# Count emails per file
rg -c "" .rebel/exports/emails-*.ndjson

# Find emails with specific labels
rg '"IMPORTANT"' .rebel/exports/emails-*.ndjson

# Find emails in a date range (ISO dates)
rg '"date":"2026-0[1-3]' .rebel/exports/emails-*.ndjson

# Extract just subjects (one per line)
rg -o '"subject":"[^"]*"' .rebel/exports/emails-*.ndjson

# Find emails with attachments
rg '"hasAttachment":true' .rebel/exports/emails-*.ndjson
```

## Gmail query syntax (for the `query` arg)

- `after:2026/01/01` — emails after a date
- `before:2026/04/01` — emails before a date
- `from:alice@example.com` — from a sender
- `to:bob@example.com` — to a recipient
- `subject:report` — subject contains word
- `has:attachment` — has attachments
- `label:IMPORTANT` — has label
- `is:unread` — unread emails
- Combine with spaces: `from:alice after:2026/01/01 has:attachment`
