---
description: "Connect Granola to access AI meeting summaries, transcripts, and notes"
---

# Granola

Access your Granola meeting data: AI-generated summaries, raw transcripts with speaker labels, attendee info, and meeting notes. Rebel connects to Granola's official MCP server by default, with an option to use the local cache for offline access.


## What You Can Do

- **List meetings** by date range or browse all recent meetings
- **Read AI summaries** -- Granola's AI-generated structured analysis with key points, action items, and decisions
- **Get transcripts** with timestamps and speaker separation (You vs Other)
- **Search across everything** -- titles, attendee names, AI summaries, notes, and transcript content
- **Browse by participants** -- find meetings with specific people


## Setup

1. Open **Settings → Connectors** in Rebel
2. Find **Granola** and click **Connect**
3. Sign in to your Granola account in the browser when prompted

Rebel now connects to Granola's official MCP server, which syncs with Granola's cloud. This means you get the latest features and your data stays in sync across devices.

> **Offline alternative**: If you prefer local-only access, you can set up the bundled connector via Custom MCP Server. This reads from Granola's local cache file and works without an internet connection — see the "Local Cache Connector" section below.


## Troubleshooting

**Sign-in issues**: Make sure you have an active Granola account. Free accounts have access to meetings from the last 30 days; paid plans have full history.

**"Granola cache not found" (local connector)**: Granola must be installed and have recorded at least one meeting so the cache file exists. The Granola app does **not** need to be running -- Rebel reads the cache file directly from disk. Once a meeting has been recorded, the cache persists and works even when Granola is closed or offline.


## Tips

- **AI summaries vs transcripts**: Ask for the "meeting summary" to get Granola's AI analysis (structured sections, key points). Ask for the "transcript" to get the raw word-by-word record.
- **Finding meetings**: You can search by participant name, topic keyword, or browse by date. Example: "Find meetings with Alice from last month" or "What did we discuss about the product roadmap?"
- **Large transcripts**: Transcripts support pagination. For long meetings, Rebel will automatically page through the content.


## Alternatives

Other meeting transcript tools with MCP support:

- [Fathom](https://help.fathom.video/en/articles/8368641-public-api) -- Bundled in Rebel, requires API key
- [Fireflies](https://docs.fireflies.ai/getting-started/mcp-configuration) -- Official MCP server with OAuth
- [Otter](https://help.otter.ai/hc/en-us/articles/35287607569687-Otter-MCP-Server) -- Official MCP server (Enterprise only)
- [Quill](https://www.quillmeetings.com/guides/connecting-to-claude-or-other-ais) -- Local MCP server via HTTP

Rebel's Granola integration reads from the local cache file, requiring no API. Choose the tool that best fits your meeting recording workflow.


## Local Cache Connector

For offline or privacy-first use, you can set up Rebel to read directly from Granola's local cache instead of the cloud:

1. Open **Settings → Connectors** in Rebel
2. Go to the **Custom MCP Server** tab
3. Add the local Granola connector

This requires Granola to be installed locally with at least one recorded meeting.

**Comparison:**

| | Official MCP (default) | Local Cache Connector |
|---|---|---|
| **Data source** | Granola's cloud servers | Local cache on your device |
| **Internet required** | Yes | No -- works offline |
| **Authentication** | Sign in via browser | None |
| **Granola plan** | Free plan limited to last 30 days | Any (including free) |
| **Transcript access** | Paid Granola tiers only | Always available |
| **Privacy** | Data goes through Granola's servers | All data stays local |

Both approaches give you access to meeting summaries, transcripts, and search. The official MCP stays in sync with Granola's latest features; the local connector is simpler and works offline.


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) -- overview of all connectors
