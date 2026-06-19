---
description: "Using Rebel's command-line interface — when to use it, what's available, and how to get started"
last_updated: "2026-05-15"
---

# Command-Line Interface (CLI)

Rebel has a command-line interface you can use alongside the app. It's handy for scripted workflows, running repeated tasks, or if you prefer your terminal to a window.

---

## When to Use the CLI

Most people use Rebel through the app. The CLI is useful when you want to:

- **Automate repetitive tasks** — run a prompt on a schedule or from another script
- **Run AI-powered scripts in CI** — for example, a script that checks open pull requests every morning
- **Get quick answers without opening the app** — a one-off query from your terminal
- **Feed files directly from disk** — attach documents, PDFs, or images to a prompt from the command line

---

## Two Ways to Run the CLI

| Path | How | Auth | Speed |
|------|-----|------|-------|
| **From the app** | `rebel run …` from inside the installed app | Uses your app's login — no extra setup | 1–3 seconds |
| **Standalone** | `npm i -g @mindstone/rebel-cli` then `rebel …` | Requires API key env-vars | ~0.4 seconds |

The **app-backed CLI** (inside Mindstone Rebel) is the easy option — it reuses your existing login. Use it for day-to-day terminal work while the app is running.

The **standalone binary** (`@mindstone/rebel-cli`) is the fast option for scripts and automation. It doesn't need the app open, but it needs an API key set in your environment (see [AI Models](library://rebel-system/help-for-humans/AI-models.md)).

---

## Basic Examples

### Run a single prompt
```bash
rebel run -p "summarise the key decisions from my last meeting"
```

### Chat interactively
```bash
rebel chat
```
Type your messages and press Enter. Type `exit` to quit.

### Attach a file
```bash
rebel run -p "extract action items from this PDF" --attach ./meeting-notes.pdf
```

### Resume a conversation
```bash
rebel sessions list   # shows your recent sessions
rebel run -p "continue from where we left off" --session abc123
```

### Skip MCP tools for a faster start
```bash
rebel run --no-mcp -p "quick question"
```

### Get structured JSON output (for scripts)
```bash
rebel run --json -p "list my open pull requests" 2>/dev/null | jq '.event.summary'
```

---

## Getting Help

```bash
rebel --help           # list all commands
rebel run --help       # options for the run command
rebel chat --help      # options for the chat command
rebel sessions --help  # session management commands
```

---

## API Key Setup (Standalone Binary)

If you installed `@mindstone/rebel-cli` separately, set your API key before first use:

```bash
export REBEL_ANTHROPIC_API_KEY=sk-ant-...   # for Anthropic models
export REBEL_OPENROUTER_API_KEY=<key>        # for OpenRouter models
```

Add these to your shell profile (`~/.zshrc`, `~/.bashrc`) so they're always available. See [AI Models](library://rebel-system/help-for-humans/AI-models.md) for more on setting up API access.

---

## Exit Codes

The CLI returns exit codes you can check in scripts:

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Something went wrong — check the error message |
| `2` | A policy check failed (e.g., approval denied, session conflict) |
| `3` | Session is busy — another process is writing it, retry shortly |

---

## Sessions and Sharing with the App

Sessions you create from the CLI appear in the app's sidebar (on next app reload). Both the app and the CLI read and write the same session store, so you can start something in the CLI and continue it in the app, or vice versa.

---

## A Note on Codex / ChatGPT Pro

If you use ChatGPT Pro, the app-backed CLI supports full long conversations. The standalone binary works with ChatGPT Pro too, but only for single-shot queries — long interactive sessions need the app's OAuth flow. For those, open the app and run `rebel chat` from there.
