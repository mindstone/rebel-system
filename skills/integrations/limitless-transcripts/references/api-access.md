# Limitless API Access (US Only)

Download transcripts from the Limitless API. **Only available for US users** - UK/EU access was terminated Dec 5, 2025.

## Status Warning

Limitless was acquired by Meta in December 2025:
- **UK/EU**: Service terminated, API inaccessible
- **US**: API access continues for existing users (at least through Dec 2026)
- **New users**: Pendant sales stopped, no new API keys

If you're in UK/EU, use [export-import.md](export-import.md) instead.


## Prerequisites

1. Active Limitless account (US region)
2. API key from [Limitless Developer Settings](https://app.limitless.ai/)


## Quick Start

```bash
# Set your API key
export LIMITLESS_API_KEY="your_api_key_here"

# Download recent lifelogs (default: last 7 days)
node scripts/download-lifelogs.cjs --days 7 --output ./lifelogs

# Convert to Rebel-compatible markdown
node scripts/convert-to-markdown.cjs --input ./lifelogs --output ~/Chief-of-Staff/memory/sources/
```


## API Reference

Base URL: `https://api.limitless.ai/v1`

### Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /lifelogs` | List/search lifelogs (max 10 per page) |
| `GET /lifelogs/{id}` | Get specific lifelog |
| `GET /download-audio` | Download audio as Ogg Opus (max 2hr) |
| `GET /chats` | List Ask AI conversations |

### Key Parameters for /lifelogs

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | string | Filter by date (YYYY-MM-DD) |
| `start`/`end` | string | Date range (YYYY-MM-DD or YYYY-MM-DD HH:mm:SS) |
| `search` | string | Hybrid semantic + keyword search |
| `limit` | int | Max results per page (max 10) |
| `cursor` | string | Pagination cursor |
| `includeContents` | bool | Include detailed segments with timestamps |
| `timezone` | string | IANA timezone (e.g., "America/New_York") |


## Response Format

```json
{
  "data": {
    "lifelogs": [{
      "id": "abc123",
      "title": "Team Meeting",
      "markdown": "# Team Meeting\n\n> Speaker 1: Hello...",
      "startTime": "2026-01-22T10:00:00Z",
      "endTime": "2026-01-22T11:00:00Z",
      "contents": [{
        "type": "blockquote",
        "content": "Hello everyone",
        "speakerName": "Alice",
        "speakerIdentifier": "user",
        "startTime": "2026-01-22T10:00:05Z",
        "startOffsetMs": 5000,
        "endOffsetMs": 8000
      }]
    }]
  },
  "meta": { 
    "lifelogs": { 
      "nextCursor": "xyz789", 
      "count": 3 
    } 
  }
}
```

Note: API response includes `speakerName` which exports do not have.


## Script Options

### download-lifelogs.js

```bash
node download-lifelogs.js [options]

Options:
  --date YYYY-MM-DD    Fetch lifelogs for a specific date
  --days N             Fetch last N days (default: 7)
  --output DIR         Output directory (default: ./lifelogs)
  --timezone TZ        IANA timezone (default: UTC)
```

### convert-to-markdown.js

```bash
node convert-to-markdown.js [options]

Options:
  --input DIR     Input directory with JSON files (default: ./lifelogs)
  --output DIR    Output directory for markdown (default: ./transcripts)
  --force         Overwrite existing files
```


## Rate Limits

- **180 requests/minute** per API key
- Error `429` with `retryAfter: 60` when exceeded


## Troubleshooting

**"API key is rate limited"**
- Wait 60 seconds, then retry
- Reduce request frequency in scripts

**Empty results**
- Check date/timezone parameters match your recording times
- Pendant recordings may take minutes to process after sync

**"API key invalid" or connection errors**
- Verify you're not in UK/EU (service terminated)
- Check API key is correct and not expired
- Limitless servers may be down (check their status page)

**Missing transcripts**
- API only returns Pendant recordings
- Desktop/web meeting transcripts were never available via API


## See Also

- [Limitless Developer Docs](https://www.limitless.ai/developers) - Official API documentation
- [limitless-api-examples](https://github.com/limitless-ai-inc/limitless-api-examples) - Official TypeScript/Python examples
- [OpenAPI spec](https://www.limitless.ai/openapi.yml) - Machine-readable API spec
