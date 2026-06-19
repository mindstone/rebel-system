---
name: outlook-email-export-parser
description: "Parse Outlook PST/OLM email exports into searchable JSON files. Use when a user has an Outlook export (.pst or .olm) and wants to search, analyse, or work with their email data. Also handles OLM (Mac Outlook) exports. Cross-platform (Node.js). Fallback PowerShell script for Windows-only scenarios."
last_updated: 2026-04-17
tools_required: ["Node.js (bundled with Rebel)"]
agent_type: main_agent
---

# Outlook Email Export Parser

Parse Outlook PST or OLM exports into individual JSON files for searching and analysis.

## When to use

- User has a `.pst` or `.olm` file exported from Outlook and wants to search/analyse their email
- Outlook MCP connector is unavailable (auth issues, 403s, no Graph API access)
- One-off email analysis or migration from Outlook

## Quick Reference

**PST workflow (Windows Outlook export):**
1. User exports PST from Outlook (see [How to Export](#how-to-export-a-pst-file-from-outlook) below)
2. Set up and run the parser (see [Running the Scripts](#running-the-scripts))
3. Search: `rg "search term" <output-dir>/`

**OLM workflow (Mac Outlook export):**
1. User exports OLM from Mac Outlook (see [How to Export](#mac-outlook-desktop-app))
2. Set up and run the OLM parser (see [parse_olm.js](#parse_olmjs))
3. Search the same way as PST output

**Fallback (Windows-only):** If Node.js parsing fails, use the PowerShell script `export_outlook_emails.ps1` which talks directly to Outlook via COM automation. See [PowerShell Fallback](#powershell-fallback-windows-only).

**Output:** One `.json` file per email + `_manifest.json` index. Output defaults to `outlook-export/` next to the source file.

## Running the Scripts

The scripts require npm dependencies (`pst-extractor`, `olm-reader`). Since `rebel-system/` may be read-only in production builds, **always copy the scripts to a temp directory before running:**

```bash
# 1. Copy scripts to a writable location
cp -r rebel-system/skills/data-analysis/outlook-email-export-parser/scripts /tmp/outlook-parser
cd /tmp/outlook-parser

# 2. Install dependencies
npm install

# 3. Run the parser
node parse_pst.js ~/Desktop/export.pst ~/Desktop/outlook-export
# or for OLM:
node parse_olm.js ~/Desktop/export.olm ~/Desktop/outlook-export
```

On Windows, use a temp path like `%TEMP%\outlook-parser` instead of `/tmp/`.


## How to Export a PST File from Outlook

Give these instructions to the user:

### Windows (Outlook desktop app)
1. Open Outlook
2. **File > Open & Export > Import/Export**
3. Select "Export to a file" > Next
4. Select "Outlook Data File (.pst)" > Next
5. Select the mailbox or folder to export (e.g. their email account root, or just "Inbox") — check "Include subfolders" if needed
6. Choose a save location (Desktop is easiest) and filename, e.g. `export.pst`
7. Click Finish. If prompted for a password, leave it blank and click OK

### Mac (Outlook desktop app)
1. Open Outlook
2. **Tools > Export** (or in newer versions: **File > Export**)
3. Select "Outlook for Mac Data File (.olm)" — note: Mac Outlook exports `.olm`, not `.pst`
4. Choose which items to export > click Continue
5. Save to Desktop

**Important:** Mac Outlook exports `.olm` format, not `.pst`. The parser script handles `.pst` files only. If the user is on Mac, they'll need to either:
- Export from Outlook on the Web (see below)
- Use a Windows machine to export as PST
- Ask IT to provide a PST export from Exchange

### Outlook on the Web (Microsoft 365)
Regular users cannot export PST from Outlook on the Web — this requires an admin using the Microsoft 365 compliance centre (Content Search > Export). If the user only has web access, the admin path or a desktop Outlook install is needed.


## Available Scripts

| Script | Purpose | Input | Output |
|--------|---------|-------|--------|
| `parse_pst.js` | Parse PST to JSON files | `.pst` file | `*.json` + `_manifest.json` |
| `parse_olm.js` | Parse OLM to JSON files | `.olm` file | `*.json` + `_manifest.json` |
| `export_outlook_emails.ps1` | PowerShell fallback (Windows) | Running Outlook | `*.json` + `_manifest.json` |

## Script Reference

### parse_pst.js

```bash
node parse_pst.js ~/Desktop/export.pst
node parse_pst.js ~/Desktop/export.pst ~/Desktop/outlook-export
```

**Output per email:**
```json
{
  "subject": "Re: Contract review",
  "from": "sarah.jones@example.com",
  "fromName": "Sarah Jones",
  "to": "John Smith; Alice Brown",
  "cc": "Bob Wilson",
  "date": "2026-04-15T14:30:22.000Z",
  "body": "Plain text body...",
  "bodyHtml": "<html>...",
  "folder": "Top of Personal Folders/Inbox",
  "hasAttachments": true,
  "numberOfAttachments": 1,
  "importance": 1,
  "isRead": true,
  "conversationTopic": "Contract review"
}
```

**`_manifest.json`** contains an index of every exported email with file, date, from, subject, and folder — useful for quick lookups without opening individual files.

### parse_olm.js

For `.olm` files exported from Mac Outlook. Uses [`olm-reader`](https://www.npmjs.com/package/olm-reader) (pure JS, handles multi-disk archives).

```bash
node parse_olm.js ~/Desktop/export.olm
node parse_olm.js ~/Desktop/export.olm ~/Desktop/outlook-export
```

Outputs the same JSON format as `parse_pst.js`. Note: OLM stores email fields differently — field mapping is best-effort. Some metadata (like `conversationTopic`) may not be available in OLM exports.


## Searching Exported Emails

```bash
# Full-text search across all emails
rg "quarterly report" ~/Desktop/outlook-export/

# Find emails from a specific sender
rg '"from":"sarah' ~/Desktop/outlook-export/

# Find emails with attachments
rg '"hasAttachments":true' ~/Desktop/outlook-export/

# Search subjects only
rg '"subject":".*contract' ~/Desktop/outlook-export/

# Count emails per sender (from manifest)
node -e "
  const m = require('./outlook-export/_manifest.json');
  const counts = {};
  m.emails.forEach(e => { counts[e.from] = (counts[e.from]||0)+1; });
  Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,20)
    .forEach(([k,v]) => console.log(v, k));
"
```


## Troubleshooting

**"Cannot find module 'pst-extractor'"**
Run `npm install` in the `scripts/` directory first.

**Large PST files (>1GB)**
The parser processes emails sequentially and writes one file at a time. It handles large files, but expect several minutes for very large archives. Progress is printed every 200 emails.

**Corrupt PST files**
`pst-extractor` does not handle corrupt PST files. If Outlook reports errors with the PST, run Outlook's built-in repair tool (`scanpst.exe` on Windows: typically at `C:\Program Files\Microsoft Office\root\Office16\SCANPST.EXE`) before parsing.

**X500 addresses instead of email addresses**
Some Exchange-hosted emails store internal X500 addresses (like `/O=EXCHANGELABS/OU=...`) instead of SMTP addresses. The `from` field will contain whatever the PST stores. The `fromName` field usually has the readable display name regardless.

**`.olm` files (Mac Outlook)**
Use `parse_olm.js` for OLM files. See [parse_olm.js](#parse_olmjs) above.


## PowerShell Fallback (Windows only)

If the Node.js PST parser fails (corrupt file, permission issues, missing Node), and the user has Outlook open on Windows, use the PowerShell script as a backup. It talks directly to Outlook via COM automation — no file parsing needed.

```powershell
# From PowerShell on the Windows machine:
powershell -ExecutionPolicy Bypass -File export_outlook_emails.ps1
```

Defaults: exports last 90 days from Inbox + Sent Items to `Desktop\outlook-export\`. Edit the three settings at the top of the script to change folders, date range, or output location.

**Gotchas:**
- Outlook must be running
- May trigger a security dialog ("A program is trying to access email addresses") — click Allow
- Exchange accounts may return X500 addresses instead of SMTP for `from` field
- Gets slow with very large mailboxes (10k+ items)


## Privacy Notes

- All processing happens locally — no data leaves the machine
- The original PST file is not modified
- Exported JSON files contain full email content including body text
- Delete the output directory when analysis is complete


## Related

- [bulk-export](../../system/bulk-export/SKILL.md) — for exporting via MCP connectors (Gmail, etc.) when API access works
- [linkedin-export-parser](../linkedin-export-parser/SKILL.md) — similar pattern for LinkedIn data exports
