---
name: linkedin-export-parser
description: "Parse LinkedIn data exports into queryable JSON. Modular scripts for connections, messages, and network analysis."
version: "2.0.0"
last_updated: 2026-01-26
tools_required: ["Node.js (v18+)", "npm"]
agent_type: main_agent
---

# LinkedIn Export Parser

A collection of modular Node.js scripts for parsing and analyzing LinkedIn data exports.

## Quick Reference for Agents

**When to use this skill:** User has a LinkedIn export ZIP and wants to:
- Search/analyze their connections
- Find message history
- Generate network reports
- Convert LinkedIn data to other formats

**Basic workflow:**
1. List contents: `node list_export_contents.js <export.zip>`
2. Parse all data: `node parse_linkedin_export.js <export.zip>`
3. Query: `node query_linkedin_data.js <command> [options]`

**Output location:** Parsed data is written to system temp folder by default (`$TMPDIR/linkedin-parser/parsed_data`). Use `--output <dir>` to specify a custom location.

## Available Scripts

| Script | Purpose | Input | Output |
|--------|---------|-------|--------|
| `list_export_contents.js` | Preview what's in the export | ZIP | Console summary |
| `parse_linkedin_export.js` | Parse all CSVs to JSON | ZIP | `parsed_data/*.json` |
| `query_linkedin_data.js` | Query parsed data | `parsed_data/` | JSON results |
| `extract_connections_csv.js` | Extract connections only | ZIP | JSON or CSV |
| `extract_messages.js` | Extract messages only | ZIP | JSON |
| `network_stats.js` | Generate network statistics | ZIP | JSON or console |

## Setup

Since `rebel-system/` may be read-only in production builds, copy the scripts to a writable location first:

```bash
cp -r rebel-system/skills/data-analysis/linkedin-export-parser/scripts /tmp/linkedin-parser
cd /tmp/linkedin-parser
npm install
```

On Windows, use `%TEMP%\linkedin-parser` instead of `/tmp/`.

## Script Reference

### 1. list_export_contents.js

Preview what's in a LinkedIn export without fully parsing it.

```bash
node list_export_contents.js ~/Downloads/linkedin-export.zip
```

Output shows:
- All CSV files with sizes
- Media files and folders
- Export type (Basic vs Complete)

### 2. parse_linkedin_export.js

Parse entire export to JSON files for comprehensive querying.

```bash
node parse_linkedin_export.js ~/Downloads/linkedin-export.zip
node parse_linkedin_export.js ~/Downloads/linkedin-export.zip --output /custom/path
```

Creates JSON files in temp folder (or specified `--output` dir):
- `connections.json` - All connections
- `messages.json` - All messages (if present)
- `profile.json` - Profile data
- `*.json` - Other data files
- `index.json` - Metadata
- `parsing_errors.json` - Any errors

### 3. query_linkedin_data.js

Query parsed data. Requires running parser first.

**Commands:**

```bash
# Network stats
node query_linkedin_data.js stats

# Find person by name
node query_linkedin_data.js find-person --name "Adrian"

# Find connections at company
node query_linkedin_data.js connections-by-company --company "Google"

# Connections from specific time
node query_linkedin_data.js connections-by-date --year 2020 --month 6

# Search messages
node query_linkedin_data.js messages-search --query "fundraising"

# Messages with person
node query_linkedin_data.js messages-with --person "Jane Smith"

# View profile
node query_linkedin_data.js profile-summary
```

### 4. extract_connections_csv.js

Extract connections directly from ZIP without full parsing. Useful for quick CSV export.

```bash
# JSON to stdout
node extract_connections_csv.js export.zip

# CSV to file
node extract_connections_csv.js export.zip --format csv --output connections.csv

# Without URLs/emails
node extract_connections_csv.js export.zip --no-url --no-email
```

### 5. extract_messages.js

Extract and filter messages directly from ZIP.

```bash
# All conversations (grouped)
node extract_messages.js export.zip

# Messages with specific person
node extract_messages.js export.zip --person "John Smith"

# Search message content
node extract_messages.js export.zip --search "meeting"

# Flat list (no grouping)
node extract_messages.js export.zip --flat --limit 50
```

### 6. network_stats.js

Generate comprehensive network statistics.

```bash
# Pretty console output
node network_stats.js export.zip

# JSON to file
node network_stats.js export.zip --output stats.json

# Top 50 companies/positions
node network_stats.js export.zip --top 50
```

## LinkedIn Export Types

LinkedIn offers two export types:

**Basic Export** (arrives in minutes):
- Connections.csv
- Profile.csv
- Basic account data

**Complete/Full Archive** (arrives within 24 hours):
- Everything in Basic, plus:
- messages.csv
- Endorsements, recommendations
- Article drafts, shares
- Media files

Use `list_export_contents.js` to identify which type you have.

## Data Format Reference

### Connections.csv Fields

| Field | Description |
|-------|-------------|
| First Name | Contact's first name |
| Last Name | Contact's last name |
| URL | LinkedIn profile URL |
| Email Address | Email (if shared) |
| Company | Current company |
| Position | Current job title |
| Connected On | Date connected (e.g., "17 Jan 2026") |

### Messages.csv Fields

| Field | Description |
|-------|-------------|
| CONVERSATION ID | Thread identifier |
| CONVERSATION TITLE | Thread title/name |
| FROM | Sender name |
| TO | Recipient name |
| DATE | Timestamp |
| SUBJECT | Message subject |
| CONTENT | Message body |
| FOLDER | Inbox/Sent/etc |

## Common Workflows

### Investor Discovery
```bash
node query_linkedin_data.js connections-by-company --company "Ventures"
node query_linkedin_data.js connections-by-company --company "Capital"
node query_linkedin_data.js connections-by-company --company "Partners"
```

### Meeting Prep
```bash
# Find the person
node query_linkedin_data.js find-person --name "Jane Smith"

# Check message history
node query_linkedin_data.js messages-with --person "Jane Smith"
```

### CRM Export
```bash
node extract_connections_csv.js export.zip --format csv --output crm_import.csv
```

### Network Analysis
```bash
node network_stats.js export.zip --output network_analysis.json
```

## Troubleshooting

**"Module not found"**
```bash
cd scripts && npm install
```

**"No parsed data found"**
Run parser first: `node parse_linkedin_export.js <export.zip>`

**Messages not found**
You may have a Basic export. Request a Full Archive from LinkedIn.

**CSV parsing errors**
Check `parsed_data/parsing_errors.json` for details. The parser uses `relax_quotes: true` to handle most malformed CSVs.

## Privacy Notes

- All processing happens locally
- No data sent to external services
- Original ZIP unchanged
- Consider encrypting/deleting JSON output when done

## For Agents: Temporary Scripts

**Do not add temporary/debugging scripts to this folder.** Place one-off scripts in the user's Chief of Staff temp folder (or equivalent workspace temp location) unless explicitly instructed otherwise. Only add scripts here if they are reusable, general-purpose utilities.

## Related Docs

- `QUICKSTART.md` - Quick examples
- `EXAMPLES.md` - Detailed workflows
- `FILE_FORMAT.md` - LinkedIn export format details
