# Common BulkExport + Ripgrep Patterns

## NDJSON search basics

Each line in an NDJSON file is a self-contained JSON object. Ripgrep treats each line independently.

```bash
# Count total records
rg -c "" .rebel/exports/data.ndjson

# Search case-insensitive
rg -i "quarterly report" .rebel/exports/data.ndjson

# Show only matching filenames (when searching multiple files)
rg -l "pattern" .rebel/exports/*.ndjson

# Count matches per file
rg -c "pattern" .rebel/exports/*.ndjson

# Show context (lines before/after)
rg -B1 -A1 "pattern" .rebel/exports/data.ndjson
```

## Field-level searches

```bash
# Match a specific field value
rg '"fieldName":"exactValue"' .rebel/exports/data.ndjson

# Match field containing a substring
rg '"fieldName":"[^"]*substring[^"]*"' .rebel/exports/data.ndjson

# Match boolean field
rg '"isActive":true' .rebel/exports/data.ndjson

# Match numeric field (exact)
rg '"count":42[,}]' .rebel/exports/data.ndjson

# Extract specific field values
rg -o '"email":"[^"]*"' .rebel/exports/data.ndjson
```

## Combining with standard tools

```bash
# Sort unique field values
rg -o '"category":"[^"]*"' .rebel/exports/data.ndjson | sort -u

# Count by field value
rg -o '"status":"[^"]*"' .rebel/exports/data.ndjson | sort | uniq -c | sort -rn

# Head/tail of export
head -5 .rebel/exports/data.ndjson
tail -5 .rebel/exports/data.ndjson

# Pipe to Read for pretty-printing a specific line
sed -n '42p' .rebel/exports/data.ndjson
```

## Slack channel history

```javascript
bulk_export({
  "package_id": "Slack",
  "tool_id": "get_slack_channel_history",
  "args": { "channel": "C123ABC", "limit": 100 },
  "output_file": "slack-general.ndjson",
  "pagination": { "token_field": "nextCursor", "input_param": "cursor" },
  "items_path": "messages"
})
```

Note: Slack uses `channel` (not `channel_id`) and the pagination token is at `nextCursor` (top-level, not nested under `response_metadata`).

## Tools that don't need BulkExport

Some MCP tools already return large datasets in a single call and handle pagination internally:

- **Calendar events** — `list_workspace_calendar_events` returns up to 500 events in one call. Just call it directly.
- **Small Slack channels** — If a channel has fewer than ~200 messages, a single `get_slack_channel_history` call is sufficient.

## Third-party MCP tools

For MCP tools not bundled with Rebel (e.g., HubSpot, Salesforce, custom MCPs), you'll need to check the tool's response format to determine the correct `items_path`, `pagination.token_field`, and `pagination.input_param` values. Try calling the tool once with a small `limit` to inspect the response shape before configuring BulkExport.
