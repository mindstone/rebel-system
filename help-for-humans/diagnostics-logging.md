---
description: "How Rebel's diagnostic logs work, what they capture, privacy protections, and what to review before sharing with support"
last_updated: "2026-05-11"
---

# Diagnostics and Logging

When something goes wrong, Rebel can generate a diagnostic bundle to help troubleshoot the issue. This page explains what's captured, how your privacy is protected, and what to review before sharing.


## See also

- [troubleshooting.md](library://rebel-system/help-for-humans/troubleshooting.md) — Common problems and solutions
- [settings-and-configuration.md](library://rebel-system/help-for-humans/settings-and-configuration.md) — App settings overview
- [where-rebel-stores-things.md](library://rebel-system/help-for-humans/where-rebel-stores-things.md) — Where logs and app data are stored


## Accessing Diagnostics

1. Open **Settings** (gear icon in the top right, or Cmd+, / Ctrl+,)
2. Go to **Advanced**
3. Open **Support** and look for the **System Health** section

You can also access diagnostics directly from the Help menu: **Help → Download Diagnostics...** for a quick export without navigating to Settings.


## System Health Check

The health check runs a comprehensive diagnostic of your system configuration. Click **Run System Check** to start.

### What it checks

| Category | What's Verified |
|----------|-----------------|
| **Workspace** | Library directory accessible, disk space available, write permissions |
| **API Keys** | Claude API key valid, voice provider keys configured |
| **MCP Tools** | Configuration valid, Super-MCP server running, tool connections healthy |
| **Permissions** | Microphone access, workspace path accessible |
| **System** | Node runtime present, required ports available |
| **Sync** | rebel-system present and current |

### Understanding results

Each check shows one of four status indicators:

| Status | Meaning | Action |
|--------|---------|--------|
| ✓ Pass | Working correctly | None needed |
| ⚠ Warn | Working but not optimal | Review the recommendation |
| ✗ Fail | Not working | Follow the remediation steps shown |
| — Skip | Not applicable to your setup | None needed |

Failed and warning checks show a brief message explaining the issue and what you can do about it. Passed checks are collapsed by default to keep the view tidy.

### When to run it

Run a health check when:
- Rebel isn't responding to commands as expected
- Tools or MCP integrations stop working
- You're setting up a new workspace
- Before contacting support (they'll appreciate it)


## Export Options

After running a health check, you can export diagnostic data. Choose the format that matches your needs:

| Format | Contents | Best For |
|--------|----------|----------|
| **Standard (.md)** | Health checks, settings (redacted), session IDs, application logs | Sharing with support — safe for external sharing |
| **Detailed (.zip)** | Everything in Standard, plus: automation history, session excerpts, tool usage stats, API cost data, Chief of Staff config | Complex debugging — review before sharing externally |

### Standard format

A single Markdown file you can open in any text editor. Contains:
- System health report with all check results
- App settings with API keys and secrets redacted
- MCP configuration (environment variable values redacted)
- Recent session IDs for correlation
- Application logs from the last 15 minutes

This format is designed to be safe for external sharing while providing enough context for support to understand what's happening.

### Detailed format

A ZIP archive with structured files for deeper investigation. Includes everything in Standard format, plus:
- Recent session summaries (last 5 conversations, content excerpts included)
- Automation run history
- Pending tool approval queue
- Tool usage statistics
- API cost ledger (last 500 entries)
- Chief of Staff system prompt
- Error pattern analysis

The Detailed format may contain business context from your conversations. Review the contents before sharing externally.

Post-incident bundles also include a **structured events ledger** — a chronological timeline of everything that happened during the session. This makes it much easier for support to pinpoint exactly where things went sideways rather than piecing together what happened from raw logs.


## Privacy Considerations

Rebel automatically redacts sensitive information before including it in either bundle format.

### Always redacted

- API keys (Anthropic, OpenAI, ElevenLabs, etc.)
- OAuth and authentication tokens
- Passwords and client secrets
- MCP environment variables containing keys, tokens, or credentials
- Sensitive URL parameters (tokens, bearer auth, session IDs)

### Anonymised

- Your username in file paths (replaced with `~`)
- Basic auth credentials in URLs

### Before sharing externally

The automatic redaction handles most sensitive data, but you should still review exports before sending them outside your organisation:

**Standard format**: Open the `.md` file and search for any credentials or project names you want to keep private.

**Detailed format**: Open the ZIP and review `README.md` for a summary. Spot-check `recent-sessions/` files if your conversations contained sensitive business context.

**Things to watch for:**
- File paths may reveal project or client names
- MCP server URLs and internal hostnames are visible
- Tool call logs show which files Rebel accessed (but not file contents)
- Session excerpts in Detailed format include conversation fragments


## Log Files

Application logs are stored locally on your machine, separate from your workspace:

| Platform | Location |
|----------|----------|
| macOS | `~/Library/Application Support/mindstone-rebel/logs/` |
| Windows | `%APPDATA%\mindstone-rebel\logs\` |
| Linux | `~/.config/mindstone-rebel/logs/` |

Logs rotate daily. Older files are compressed and eventually removed automatically. They're never uploaded without your explicit action.


## When to Use Diagnostics

**Troubleshooting flow:**

1. **Something isn't working** — Run a System Health Check first
2. **Check shows failures** — Follow the remediation steps shown
3. **Still not working** — Export a Standard diagnostic and review it
4. **Need support help** — Share the Standard export with support
5. **Complex issue** — Export Detailed format and share after reviewing

For most support requests, the Standard format provides everything needed to understand what went wrong without extensive back-and-forth.
