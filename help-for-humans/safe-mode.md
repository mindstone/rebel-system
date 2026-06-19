---
description: "Understanding Safe Mode: what it is, why it activates, and how to get back to normal"
last_updated: "2026-04-16"
---

# Safe Mode

Safe Mode is Rebel's recovery state. When something goes wrong during startup, Rebel enters Safe Mode so you can still have a conversation and troubleshoot the problem—without the tools that might be causing the issue.

Think of it as the "let's talk this through" mode.

When Safe Mode activates, Rebel automatically opens a troubleshooting conversation to help you figure out what went wrong. No need to hunt for the right button—help starts immediately.


## See also

- [Troubleshooting](library://rebel-system/help-for-humans/troubleshooting.md) — Common problems and solutions
- [Diagnostics and Logging](library://rebel-system/help-for-humans/diagnostics-logging.md) — Generating diagnostic bundles for support


## When Safe Mode Activates

Safe Mode activates when Rebel can't start normally. Common triggers:

| Trigger | What happened |
|---------|---------------|
| **Startup timeout** | Rebel's tools didn't become ready within 30 seconds |
| **Startup failure** | Something crashed during initialization |
| **Startup hang** | Rebel detected it was stuck and recovered automatically (see Emergency Recovery below) |
| **Your choice** | You clicked "Enter Safe Mode" in the recovery dialog |
| **Command line** | The app was launched with `--safe-mode` flag |

When Safe Mode activates, Rebel remembers why. This helps with troubleshooting—you'll see the reason in the Safe Mode banner at the top of the window.


## Emergency Recovery

If Rebel detects that startup is completely stuck—not just slow, but frozen—it triggers emergency recovery. This is the "nothing's happening at all" scenario.

Emergency recovery:
1. Detects that critical startup steps aren't progressing
2. Safely interrupts the stuck process
3. Enters Safe Mode automatically
4. Opens a troubleshooting conversation to help you fix the underlying issue

You don't need to do anything. If Rebel hangs on startup, it recovers itself. The troubleshooting conversation will explain what happened and suggest next steps.


## What's Different in Safe Mode

**Available:**
- Conversations with Rebel (just like normal)
- All settings and preferences
- Diagnostics in **Settings → Advanced**
- **Support & Diagnostics → System Health** checks
- The **Safe Mode** controls on the same page
- Exporting logs for support

**Temporarily disabled:**
- All MCP tools (file access, web search, integrations)
- Background MCP operations and health checks

Rebel can still help you think through problems, draft text, and discuss what might be wrong—it just can't take actions that require tools until you exit Safe Mode.


## The Safe Mode Banner

When you're in Safe Mode, a banner appears at the top of the window showing:

- Why Safe Mode activated
- When it happened
- An error category (if applicable)
- A reference ID for support (if you need to share with someone helping you)

The banner includes an **Exit & Restart** button to restart Rebel normally once you've addressed the issue (see "Exiting Safe Mode" below). The same controls also appear in the **Safe Mode** section of **Settings → Advanced**.

Since Safe Mode now opens a troubleshooting conversation automatically, you'll already be in a helpful dialogue about what went wrong. If you need to restart troubleshooting later, click the banner to begin a new diagnostic conversation.


## Common Causes and Fixes

### Port conflict

**What it means:** Another application is using the port Rebel needs.

**How to fix:**
1. Quit other apps that run local servers (VS Code extensions, dev tools, other AI assistants)
2. Restart your computer to clear any orphaned processes
3. Try again

### Configuration problem

**What it means:** Rebel's configuration file has an error—often invalid JSON from a manual edit.

**How to fix:**
1. Open **Settings → Connectors**
2. Reconnect or remove the connector that was recently changed
3. If you use a manual JSON setup, open **Advanced** at the bottom of the Connectors page and fix the config or choose the correct config file again
4. Restart Rebel

### Network or firewall issue

**What it means:** Something is blocking Rebel from connecting to its own local services.

**How to fix:**
1. Check your firewall settings—Rebel needs to connect to localhost
2. If you're using a VPN, try disconnecting temporarily
3. Check if antivirus software is blocking local network access

### Permission problem

**What it means:** Rebel doesn't have access to a folder or resource it needs.

**How to fix:**
1. Open **Settings → Advanced**
2. In **Support & Diagnostics**, use **System Health → Run System Check** to look for permission warnings
3. Grant Rebel access to required directories in your system settings
4. Restart Rebel


## Exiting Safe Mode

Ready to try again?

1. Click **Exit & Restart** in the Safe Mode banner
2. Rebel restarts and attempts normal startup

If the underlying issue wasn't fixed, Rebel may enter Safe Mode again. That's okay—it means there's still something to troubleshoot. Try the suggestions above, or generate a diagnostic bundle to share with support.


## When to Run Diagnostics

If you're stuck in a loop of entering Safe Mode, or the cause isn't clear:

1. Open **Settings → Advanced**
2. In **Support & Diagnostics**, use **System Health → Run System Check** to see what Rebel can detect
3. Under **Download Diagnostic Logs**, choose **Standard (.md)** or **Detailed (.zip)** to create a report or bundle
4. Share this with support or someone helping you troubleshoot

The diagnostic bundle includes redacted logs and system state that help identify what went wrong. See [Diagnostics and Logging](library://rebel-system/help-for-humans/diagnostics-logging.md) for what's included and privacy protections.


## Rebel Knows It's in Safe Mode

When Safe Mode activates, Rebel immediately starts a troubleshooting conversation. It already knows:

- That tools are unavailable
- Why Safe Mode was triggered
- What you might try to fix the problem

This conversation starts automatically—no need to ask "Why am I in Safe Mode?" Rebel will walk you through likely causes and suggest fixes based on what went wrong. If you need more help, just continue the conversation.
