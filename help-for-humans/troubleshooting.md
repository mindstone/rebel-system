---
description: "Common problems and solutions for Rebel: startup issues, connector sign-in expiry, voice and transcription, conversation errors, and getting help"
last_updated: "2026-07-02"
---

# Troubleshooting

When something goes wrong, this guide will help you figure out what's happening and how to fix it.


## See also

- [diagnostics-logging.md](diagnostics-logging.md) — What's in the diagnostic bundle and how to review it before sharing
- [mcp-connectors-tools-and-integrations.md](mcp-connectors-tools-and-integrations.md) — Connector setup and troubleshooting
- [settings-and-configuration.md](settings-and-configuration.md) — App settings reference
- [where-rebel-stores-things.md](where-rebel-stores-things.md) — Where app data and logs are stored
- [cleaning-up-duplicate-files-from-cloud-sync.md](cleaning-up-duplicate-files-from-cloud-sync.md) — Duplicate `name (1).md` files piling up from a shared cloud drive, and how to tidy them safely


---

## Quick Fixes

Before diving into specific issues, try these common solutions:

**Restart Rebel**
Quit and relaunch the app. Many transient issues resolve themselves on restart. When you quit, Rebel waits for any in-flight conversation saves to finish — you won't lose a reply that's still being written.

**Run System Check**
Open **Settings → Advanced** and click **Run System Check**. This tests your configuration and shows exactly what's working and what isn't. Failed checks include specific recommendations.

**Export diagnostics**
If you need to share details with support, use **Settings → Advanced → Download Enhanced (.zip)** to create a diagnostic bundle. Review [diagnostics-logging.md](diagnostics-logging.md) for what's included and how to check for sensitive data before sharing.

**Disk full**
If your computer runs out of disk space, Rebel now shows a calm warning saying so plainly, rather than failing in confusing ways. Free up some space (empty the trash, clear large downloads) and the warning clears on its own.


---

## Startup Issues

### Safe Mode

If Rebel encounters a problem during startup, it enters **Safe Mode**. This disables tools and connectors so you can still talk to Rebel and troubleshoot the issue. Safe Mode automatically opens a troubleshooting conversation to help you understand what went wrong.

**What triggers Safe Mode:**
- Startup took too long (usually a tool connection issue)
- A connector or tool crashed during startup
- Startup hung completely (emergency recovery kicks in)
- You explicitly requested Safe Mode

**What's disabled in Safe Mode:**
- All connectors and tools (Gmail, Slack, file tools, etc.)
- Background operations like tool discovery

**What still works:**
- Conversations with Rebel (without tools)
- Settings, including the Advanced and Diagnostics sections
- Downloading diagnostic bundles

**To exit Safe Mode:** Click "Exit & Restart" in the banner at the top of the window. If the underlying issue isn't fixed, you may end up back in Safe Mode.

See [safe-mode.md](safe-mode.md) for detailed troubleshooting steps.


### Startup Recovery Dialog

If startup fails repeatedly, you'll see a recovery dialog with options:

- **Try Again** — Attempt normal startup
- **Enter Safe Mode** — Start with tools disabled
- **Open Settings Folder** — Access configuration files directly

The dialog shows the likely cause (e.g., "Port conflict" or "Configuration error") based on what went wrong.


### App Won't Launch

If Rebel won't start at all:

1. **Check for existing processes** — Restart your computer to clear any orphaned Rebel processes from a previous crash.

2. **Reset configuration** — If startup fails due to corrupted settings:
   - Navigate to your app data folder (see [where-rebel-stores-things.md](where-rebel-stores-things.md))
   - Rename or delete `app-settings.json` and restart Rebel
   - You'll need to reconfigure your settings, but your conversations are preserved

3. **Windows: Check firewall** — Windows Firewall may prompt you to allow Rebel network access. If you dismissed this prompt, go to Windows Security → Firewall → Allow an app through firewall.

4. **Reinstall** — If nothing else works, reinstall Rebel. Your conversations and settings are stored separately from the app, so they should be preserved. For a full clean start, see [Clean Reinstall and Factory Reset](clean-reinstall-and-factory-reset.md).


### Problems updating

If you'd moved Rebel after installing it, an update could previously leave it half-installed and in a broken state. Updates are more robust now — they handle a relocated app gracefully, and if something does go wrong, Rebel reports the problem clearly instead of failing quietly. If an update ever seems stuck, quit and relaunch Rebel, then try updating again.


---

## Tools & Connectors

### Tools Not Showing Up

If expected tools aren't appearing:

1. **Check the Connectors tab** — Open **Settings → Connectors** and verify the service shows "Connected". If it shows an error or is disconnected, click to reconnect.

2. **Run System Check** — Go to **Settings → Advanced → Run System Check**. The health report shows which connectors loaded successfully and which were skipped.

3. **Re-authenticate** — OAuth tokens can expire. Remove the connection and add it again to get fresh credentials.

4. **Restart Rebel** — If the health report still looks wrong after reconnecting, quit and reopen Rebel.
   If you use **Developer Mode**, there is also a Super-MCP restart control in developer settings — but that is now a developer-only escape hatch, not a normal troubleshooting step for most people.


### Connector Authentication Issues

**"Authentication required" or "Token expired"**

Open **Settings → Connectors**, find the affected service, and click to reconnect. You'll be guided through the authentication flow again.

**OAuth popup doesn't appear**

- Check if your browser is blocking popups from Rebel
- Try a different browser as your system default
- Some corporate security software blocks OAuth flows—check with your IT team

**"Access denied" after authenticating**

You may not have the required permissions in the service you're connecting to. For workspace tools like Slack or Notion, you may need admin approval.


### Sign-in expired / needs reconnecting

When a connector's sign-in genuinely expires, Rebel tells you instead of going quiet:

- **In Settings → Connectors** — the affected account shows **Sign-in expired** with a **Reconnect** button. Click it and sign in again.
- **In the app** — you may see a gentle **needs reconnecting** toast or notice pointing you to the right connector.

This is available for supported sign-in connectors including Notion, Linear, Google Workspace, and Microsoft 365; some may still need disconnecting and reconnecting by hand.

**Microsoft one-reconnect-heals-all:** All Microsoft services (Mail, Calendar, Files, Teams, SharePoint) share one sign-in. Use the reconnect prompt once — currently surfaced through Calendar — and it restores them all together. See [Microsoft 365 — If your sign-in expires](library://rebel-system/help-for-humans/connectors/microsoft-365.md#if-your-sign-in-expires).

For the full connector troubleshooting workflow, see [MCP, Tools & Integrations — Troubleshooting Tools](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md#troubleshooting-tools).


### Super-MCP Not Running

Super-MCP is the tool router that manages all your connectors. If it's not running:

1. **Check the System Check** — It will show "Super-MCP: Not running" or a specific error.

2. **Look for port conflicts** — Another application may be using the port Rebel needs. Quit other apps that run local servers (IDE extensions, other dev tools) and restart Rebel.

3. **Restart Rebel** — For most users, quitting and reopening Rebel is the right next step.
   If you use **Developer Mode**, you can also restart Super-MCP from developer settings.

4. **Check your MCP configuration** — If you've manually edited MCP configuration files, a syntax error could prevent startup. The System Check will show "Configuration parse error" if this is the case.


### One Connector Broken, Others Work

Rebel handles connector failures gracefully. If one service is down or misconfigured, other connectors continue working. You'll see a notification about which tools couldn't load.


---

## Voice & Transcription

**OpenRouter or Mindstone transcription:** If you power Rebel through OpenRouter or a Mindstone plan, you can transcribe voice using that same connection — no separate voice API key. See [Voice and Audio](library://rebel-system/help-for-humans/voice-and-audio.md) for setup and provider options.

### Microphone Not Working

**Check permissions:**
- **Mac:** System Settings → Privacy & Security → Microphone → ensure Rebel is enabled
- **Windows:** Settings → Privacy → Microphone → ensure Rebel has access

**Test your microphone:** Make sure it works in other apps first.

**Grant permission when prompted:** If Rebel asks for microphone access, click Allow. If you denied it previously, you'll need to grant access in system settings.


### "Pending Audio" Indicator

If you see a pending audio indicator, Rebel saved a voice recording that couldn't be transcribed (usually due to a network issue). 

To retry:
1. Click the pending audio indicator in the header
2. Select "Retry" to attempt transcription again
3. If it keeps failing, check your internet connection and API key settings

Pending audio files are stored locally and can be retried later when connectivity is restored.


### Transcription Quality Issues

**Transcriptions are inaccurate:**
- Speak clearly and at a moderate pace
- Reduce background noise
- Try adjusting your microphone position
- Set your voice input language in **Settings → Agent & Voice → Voice** (auto-detection can sometimes misidentify languages)

**Custom vocabulary:** If Rebel consistently misrecognizes specific terms (company names, technical jargon), add them to the custom vocabulary in **Settings → Agent & Voice → Voice → Custom vocabulary**. This only works with the OpenAI Whisper provider.

**Transcription is empty:** The recording was too short or the audio was too quiet. Speak for at least a second or two.


### Voice Output Not Working

If Rebel's voice responses aren't playing:

1. **Check your volume** — Make sure system audio isn't muted
2. **Check voice settings** — Go to **Settings → Agent & Voice → Voice** and ensure a voice provider is selected
3. **Verify API key** — If using OpenAI or ElevenLabs for voice, ensure your API key is valid and has credits


---

## Conversations

### "Conversation Got Too Long"

When a conversation exceeds Claude's context limit, Rebel shows this message and attempts to summarize and continue automatically.

**If it keeps happening:**
- Start a new conversation for each distinct task
- Avoid pasting very large documents into the chat—attach files instead
- Break complex tasks into multiple conversations

**To manually reset:** Start a new conversation (⌘/Ctrl+N) when one gets unwieldy.


### Window went blank or stopped responding

In rare cases, a conversation could get stuck quietly re-syncing in the background until the window went blank and stopped responding — and could stay that way even after a restart. This is fixed. If a window ever does go down, Rebel now quietly reloads it on its own.

### Conversation Got Stuck

Occasionally, a conversation may become unresponsive — Rebel seems unable to continue and the conversation appears permanently stuck. This can happen if something went wrong internally during a previous message.

Rebel automatically detects and recovers from these situations. When recovery kicks in, you'll see a brief message explaining what happened, and the conversation resumes normally. No action needed on your part.

**Silent turn diagnostics:** If a response goes quiet for a few minutes, Rebel doesn't just sit there. After roughly five minutes of silence, it runs a quick diagnostic and updates the status text with what it found — for example, "the AI provider looks degraded right now," "no internet connection," or "the response is genuinely just slow." This lets you see what's going on well before any deeper recovery or timeout kicks in.

**After sleep or restart:** If your computer sleeps or restarts while a conversation is active, Rebel detects that context may have been lost and automatically reconstructs it from your conversation history. You can continue where you left off without starting over.

**Model unavailable:** If the AI model you're using becomes temporarily unavailable — or can't be found at all — Rebel automatically falls back to a working model and carries on rather than stopping with an error. Brief streaming hiccups partway through a reply are retried on their own too. No action needed.

**Long, tool-heavy tasks:** Tasks that run for a while with lots of tool use now run to completion instead of stopping early with a false "lost connection" message.

If a conversation stays stuck despite recovery attempts, start a new conversation and reference the previous one if needed.

**When Rebel stops a task on its own:** If a task is looping or running away, Rebel may stop it automatically. The message is now plain about what happened. In a normal conversation, you'll see what stopped and can send a new message or use **Continue** if that's offered. For a **scheduled automation**, the message says Rebel will try again on its next scheduled run — not that you should resend a message that was never there. See [Automations — Rebel stopped a run on its own](library://rebel-system/help-for-humans/automations.md#rebel-stopped-a-run-on-its-own).


### Understanding Conversation Status Messages

When a conversation turn ends, you may see a brief status message at the bottom of the conversation. Here's what each one means:

- **"Stopped by you"** — You clicked the Stop button to halt Rebel mid-turn. This is normal and expected.
- **"Waiting for you"** — Rebel finished and is waiting for your next message or approval. No action needed unless you want to continue.
- **"Continue" button** — If Rebel stopped before finishing (for example, it ran out of steps), you'll see a **Continue** button. Click it to let Rebel pick up where it left off.
- **Error messages** — If something actually went wrong (a network issue, a tool failure), you'll see a specific error message with guidance on what to do. These are different from the status messages above.

**When to use Continue:** If Rebel stopped mid-task and you want it to keep going, click Continue. If the task was already complete, just start a new message instead.


### Conversations Not Loading

**Specific conversation won't open:**
- The conversation file may be corrupted. Try opening a different conversation.
- Run System Check to see if there are app-data or file-access issues.

### Workspace or library problems

If your **files, spaces, or workspace folders** look wrong:

- Check that your workspace is correctly configured in **Settings → Workspace**
- Verify the workspace folder still exists and Rebel can access it
- If you moved the workspace folder outside Rebel, point Rebel to the new location
- **Library stuck on "Scanning your files and folders…"** — On Google Drive, iCloud, or OneDrive workspaces, Rebel used to hang there indefinitely while trying to follow shortcuts that led deep into cloud storage. It now skips those problematic links while still indexing your actual files. See [Google Drive Desktop](google-drive-desktop-local-sync.md#rebel-and-your-drive-folder) and [File Search](file-search.md#library-stuck-on-scanning-your-files-and-folders)
- **"Workspace health critical" on a healthy folder** — Rebel's workspace check could cry wolf when a cloud folder was slow to respond at startup. A folder that's actually there and accessible should no longer be flagged as critical just because Drive or iCloud was busy. If the folder genuinely moved or is offline, the warning is real — point Rebel to the right location in **Settings → Workspace**

Workspace issues affect your files and spaces. They do **not** normally erase your conversation history.

### Conversation history problems

If your **conversation history** is missing or empty:

- Remember that conversation history is stored in Rebel's **app data**, not in your workspace
- Changing your workspace path will not move old conversations with it
- If you've switched computers, app channels, or user profiles, you may be looking at a different app-data folder
- **Sidebar looks nearly empty** — One damaged saved conversation used to make the whole sidebar look nearly empty. Rebel now skips the damaged item and shows the rest. Your conversations were always there; restart Rebel if the sidebar still looks wrong after an update
- See [where-rebel-stores-things.md](where-rebel-stores-things.md) for the location of the `sessions/` folder and `app-settings.json`


### File or conversation search problems

If **search** isn't working as expected:

- **"Search is temporarily unavailable"** — The search index can't run right now. That doesn't mean your files or conversations are gone. Wait a moment and try again, or restart Rebel. See [Searching conversations](searching-conversations.md#when-search-cant-run) and [File Search](file-search.md#search-not-finding-expected-files)
- **Empty results with no error** — Rebel searched and genuinely found nothing. Try different keywords, a wider time range, or **Find Similar** from a conversation you do remember
- **Library still indexing** — Wait for scanning to finish before expecting file search to cover new files


### Draft Not Saving

Conversation drafts should persist automatically. If they're disappearing:

1. **Check disk space** — Very low disk space can prevent saves
2. **Check workspace access** — Run System Check to verify Rebel can write to your workspace
3. **Wait before switching** — Drafts save when you blur the input field; wait a moment before switching conversations


---

## Corporate or Managed Networks

If you're on a work network that uses extra security (common in larger organisations), Rebel may occasionally have trouble reaching its services.

**Symptoms:**
- Connection errors or timeouts when starting Rebel
- Tools failing to connect intermittently
- Things working fine at home but not at the office

**What to try:**

1. **Run System Check** — Go to **Settings → Advanced → Run System Check**. This will flag any connectivity issues and suggest next steps.
2. **Retry** — Some managed networks add extra steps that slow things down the first time. Simply retrying often works.
3. **Export diagnostics** — If the problem persists, use **Settings → Advanced → Download Enhanced (.zip)** to create a diagnostic bundle. This includes network connectivity details that can help your IT team or Rebel support pinpoint the issue.
4. **Talk to IT** — If your organisation uses a proxy, VPN, or custom security certificates, your IT team may need to allow Rebel's network access. Share the diagnostic bundle with them.


---

## Common Error Messages

| What you see | What it means | What to do |
|--------------|---------------|------------|
| "Having trouble connecting" | Network issue between Rebel and Claude | Check your internet connection; Rebel will retry automatically when you reconnect |
| "Claude is momentarily busy" | The Claude API is overloaded | Wait a moment; Rebel retries automatically |
| "API key issue" | Your Anthropic API key is missing or invalid. (If you connect Claude directly with your own key, this message now appears only when your key actually needs attention — it no longer shows up by mistake when your key is fine.) | Go to Settings and enter a valid API key |
| "Taking a quick breather" | You've hit rate limits | Wait a minute; this resolves itself |
| "Request was too large" | The message or attached file is too big | Break your request into smaller parts |
| "Your Library isn't set up yet" | No workspace folder configured | Go to Settings → Workspace and select a folder |
| "Tool conflict detected" | Multiple tool operations collided | Rebel retries automatically |
| "Connection interrupted" | Network dropped during a request | Rebel retries automatically; if the turn was in progress, it resumes when connectivity returns |


---

## Getting Help

### Before Contacting Support

1. **Run System Check** — Note any failed or warning checks
2. **Export diagnostics** — Download the diagnostic bundle
3. **Review the bundle** — Check for any accidentally included sensitive data (see [diagnostics-logging.md](diagnostics-logging.md))
4. **Note what you were doing** — Describe the steps that led to the issue

### What to Include

When reporting an issue, include:
- What you expected to happen
- What actually happened
- The diagnostic bundle (or relevant parts)
- Any error messages you saw

### Report a Bug

If you encounter a bug during a conversation, use the **Feedback & bugs** option in the Help menu. The bug report dialog automatically pre-fills reproduction steps and expected behavior from your current conversation, so you don't have to describe everything from scratch.

### Ask Rebel

For many issues, you can simply tell Rebel what's happening:

> "I'm having trouble connecting to Slack"

> "My voice input isn't working"

> "The app is running slowly"

Rebel can guide you through common solutions and help you understand diagnostic results—though it can't directly inspect your system logs or configuration files.

### Diagnose Conversation

If a specific conversation went wrong, use the built-in diagnose feature:

1. Right-click the conversation in the sidebar (or use the conversation menu)
2. Select **Diagnose Conversation**
3. Rebel will generate a diagnostic prompt with session details

This helps you (or support) understand exactly what happened during that conversation, including any errors or unexpected tool behavior.
