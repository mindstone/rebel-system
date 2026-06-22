---
description: "Guide to Rebel's Settings destinations: Agent & Voice, Connectors, Meetings, Workspace, Privacy & Safety (Safety Rules and Privacy Mode), Account & Preferences, Usage, and Advanced"
last_updated: "2026-06-14"
---

# Settings and Configuration

How to configure Rebel to work the way you want.

Access Settings via the gear icon in the top-right corner, or use the keyboard shortcut `Cmd+,` / `Ctrl+,`.

Settings is organised into eight destinations:

- **Agent & Voice** — AI models, provider keys, and voice behaviour
- **Connectors** — external tools and MCP integrations
- **Meetings** — notetaker, join behaviour, transcript routing, and meeting imports
- **Workspace** — library folder, scratchpad, spaces, and cloud sync
- **Privacy & Safety** — Safety Rules, trusted tools, Privacy Mode, and activity log
- **Account & Preferences** — profile, appearance, and notifications
- **Usage** — API usage and estimated costs
- **Advanced** — diagnostics, updates, plugins, developer tools, and advanced operations

If your window is narrow, the Settings sidebar may collapse. Expand it to see the full destination list.

## See also

- [Where Rebel stores things](library://rebel-system/help-for-humans/where-rebel-stores-things.md) — Where your data lives on disk
- [AI models](library://rebel-system/help-for-humans/AI-models.md) — Choosing the right model for your task
- [MCP tools and other knowledge sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — Connecting external tools
- [Keyboard shortcuts and hotkeys](library://rebel-system/help-for-humans/keyboard-shortcuts-and-hotkeys.md) — Quick reference for shortcuts
- [Meetings and notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md) — Configure meeting capture
- [Spaces](library://rebel-system/help-for-humans/spaces.md) — Understanding workspace spaces
- [Privacy mode](library://rebel-system/help-for-humans/privacy-mode.md) — Extra caution for sensitive work

---

## Agent & Voice

The place for how Rebel thinks, speaks, and listens.

Inside **Agent & Voice** you'll see two sections:

- **Intelligence** — authentication, model selection, fallbacks, permission mode, memory behaviour, file indexing, and related AI settings
- **Voice** — transcription provider, text-to-speech voice, custom vocabulary, and voice hotkeys

### Intelligence

Use **Settings → Agent & Voice → Intelligence** for:

- **Authentication** — Anthropic, OpenAI, Gemini, and other provider keys are managed through a card-based grid. Each provider shows its connection status at a glance — connected providers stay connected between sessions, so you only need to set up your keys once. Connecting a provider automatically selects it as your active provider; disconnecting your active provider falls back to another connected one. Cards also include shortcuts to the provider's billing page so you can check your usage or upgrade your plan without hunting for the link. You can also connect a ChatGPT Pro or Claude Max subscription instead of using an API key. OpenRouter users can enter any model ID directly — not just those in Rebel's curated list. If you'd rather not manage any of this, the **"Let Mindstone handle it"** option here puts you on a flat-fee [Mindstone plan](rebel://library/rebel-system%2Fhelp-for-humans%2Fmindstone-plans-and-billing.md) where Mindstone covers the AI bill and shows your monthly allowance
- **Thinking / Working / Background models** — which model plans, works, and handles behind-the-scenes tasks
- **Fallbacks** — backup models if your primary choice is unavailable
- **Permission mode** — whether Rebel runs actions freely or stays in plan-only mode
- **Auto memory updates** — whether Rebel should save useful facts automatically
- **Expose provider keys in agent shell** — make provider keys available to Rebel-run shell sessions if you need that
- **File indexing** — GPU acceleration and the quick link to Library indexing controls
- **Learned model limits** — Rebel remembers what it learns about each model's effective context-window limit on your specific setup, so you don't have to re-establish the boundary after restarts or app updates
- **Daily recommendations** — controls when Rebel generates daily recommendations for you. Three modes: **Ask** (shows a prompt card on your Homepage so you can trigger recommendations on demand), **Automatic** (Rebel generates recommendations daily on its own), or **Off** (disabled entirely)

See [AI models](library://rebel-system/help-for-humans/AI-models.md) for the full model guide.

### Voice

Use **Settings → Agent & Voice → Voice** for:

- **Voice provider** — Local (Moonshine), OpenAI Whisper, ElevenLabs Scribe, or a custom OpenAI-compatible provider
- **Text-to-speech voice** — choose the voice Rebel uses for spoken replies
- **Voice input language** — Auto or a specific spoken language
- **Custom vocabulary** — names, acronyms, and domain terms that speech recognition often gets wrong
- **Global voice activation hotkey** — launch voice input from anywhere
- **After the hotkey sends** — decide whether Rebel stays in voice mode or switches back to text

See [voice-and-audio](library://rebel-system/help-for-humans/voice-and-audio.md) for the full voice guide.

---

## Connectors

Connect Rebel to external services like Slack, Gmail, Calendar, Notion, Linear, email, and more.

At the top you will see **Connectors** with a short description and an **Add a tool** button. From there you can add a custom MCP tool or request a new connector. You can also use the text links for **Connect a custom tool**, **Request a connector**, and **Connection issues? Diagnostics** when you need troubleshooting help.

Below that, use the search field (**Search connectors...**), optional category filter, and sort (**A-Z** or **Recent**) to browse the catalogue.

The page is organised into two main areas:

- **Connected** — tools you have already set up. Use the tabs **All**, **Needs attention**, and **Not connected** to focus on healthy connections, ones that need a fix, or ones you have turned off. Inactive connectors stay here so you can turn them back on.
- **Available** — tools you have not connected yet, including a short **Recommended** list when your organisation suggests picks. Categories group similar tools; **Developer tools** is optional and aimed at technical work.

**To connect a service:** click the connector and follow the authentication or setup steps.

At the bottom of the Connectors page, open **Advanced** if you need connector *platform* settings (for example letting other desktop apps use Rebel as an MCP server, interactive views, or file paths for configuration). This is different from **Settings → Advanced**, which covers app-wide diagnostics, updates, and plugins.

See [MCP tools and other knowledge sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) for the full guide.

---

## Meetings

Configure the Rebel Notetaker for automatic meeting transcription.

Use **Settings → Meetings** for:

- **Choosing a notetaker avatar**
- **Join behaviour** — ask first or auto-join
- **Transcript storage** — where 1:1 and group meeting notes are saved
- **Trigger phrase and spoken replies**
- **Paste a meeting link** workflows
- **External meeting providers** like Fireflies and Fathom
- **Meeting unlock / experimental notetaker controls** when available

See [meetings-and-notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md) for the full guide.

---

## Workspace

Everything about where Rebel stores and organises your work.

Use **Settings → Workspace** for:

- **Core Directory** — your library root, where your files, spaces, and the `rebel-system/` folder live
- **Scratchpad** — choose folders to hide from recent scratchpad suggestions
- **Spaces** — view, add, and organise your current spaces
- **Cloud Sync** — desktop/cloud continuity and cross-device access settings

See [spaces](library://rebel-system/help-for-humans/spaces.md), [scratchpad](library://rebel-system/help-for-humans/scratchpad.md), and [cloud-continuity-and-mobile](library://rebel-system/help-for-humans/cloud-continuity-and-mobile.md) for deeper guides.

---

## Privacy & Safety

Everything about what Rebel is allowed to do and how it handles your data.

Use **Settings → Privacy & Safety** for:

- **Safety Rules** — natural-language rules that tell Rebel what's OK and what needs your approval
- **Trusted tools** — tools you've allowed to run without asking
- **File approvals and memory-space save permissions** — control over changes to your files and memory
- **Privacy Mode** — a temporary master switch for extra caution on sensitive work
- **Activity log** — a record of what Rebel has done
- **Privacy and data cards** — how your data is stored and used

If you want the full safety breakdown, see [security-and-tool-safety](library://rebel-system/help-for-humans/security-and-tool-safety.md).

---

## Account & Preferences

Your personal setup: who you are, and how the app looks and notifies you.

Use **Settings → Account & Preferences** for:

- **Profile** — avatar, name, account details, and sign out / guest-mode exit
- **Appearance** — theme, UI personalisation, time saved visibility, and streaming preference
- **Notifications** — desktop notifications and dock/taskbar badge behaviour

---

## Usage

Track your API usage and estimated costs.

Use **Settings → Usage** for:

- **Period selector** — **Last 24h** (rolling window), **Last 7 days**, **Last 30 days**, or **All time**. On the 24h view, peak-day and per-active-day cards are hidden since they don't add signal at that resolution; projection and prior-24h comparison remain
- **You paid** — an honest headline showing only what actually left your wallet (out-of-pocket). If you have a subscription, the coverage it absorbed is shown as context, not as money you owe
- **The Records** — your most expensive conversation and costliest single turn, each a click away to open
- **Cost breakdown** — conversations, automations, file intelligence, safety checks, memory & notes, and more
- **Per-model costs** — when Rebel uses multiple AI models during a task (e.g., one for planning, another for execution), each model's cost is tracked separately so you can see exactly where your spend goes
- **Insights** — top conversation, average cost per turn, trend comparison, projected monthly cost
- **Coverage ratio** — if you have a subscription, a coverage bar shows how much of your usage is covered by your plan versus paid per-token
- **Export** — download usage data as CSV

---

## Advanced

Troubleshooting, updates, plugins, and power-user controls.

Use **Settings → Advanced** for:

- **Support & Diagnostics** — system health checks, diagnostics exports, safe mode, onboarding actions
- **App updates** — current version, changelog, and update checks
- **Plugins** — plugin catalog, shared plugins, and management tools
- **Prevent sleep** — keeps your computer awake while Rebel is working on a task, so long-running jobs aren't interrupted by your machine going to sleep (off by default)
- **Context management** — toggle automatic context management on or off. When enabled, Rebel automatically keeps long conversations within the AI model's limits by summarising earlier context. Disable it if you prefer to manage conversation length manually
- **Developer Tools** — available when Developer Mode is enabled
- **Advanced operations** — workspace rename and similar maintenance tasks


If you're troubleshooting, start with [troubleshooting](library://rebel-system/help-for-humans/troubleshooting.md) and [diagnostics-logging](library://rebel-system/help-for-humans/diagnostics-logging.md).

---

## Where is everything stored?

Rebel keeps your data in two places:

**Inside your workspace:**
- Your files and folders
- The `rebel-system/` folder (read-only, contains skills and help docs)
- Spaces you've created

**On your computer (outside the workspace):**
- App settings
- Conversation history
- Logs

**Platform locations for app data:**
- **Mac:** `~/Library/Application Support/mindstone-rebel/`
- **Windows:** `%APPDATA%\mindstone-rebel\`
- **Linux:** `~/.config/mindstone-rebel/`

See [where-rebel-stores-things](library://rebel-system/help-for-humans/where-rebel-stores-things.md) for the full breakdown.

---

## Troubleshooting

**Settings not saving?**
- Make sure Rebel has write access to its data folder
- Try closing and reopening the app

**Voice not working?**
- Check microphone permissions in your system settings
- **For Local (Moonshine):** make sure the model is downloaded in **Settings → Agent & Voice → Voice**
- **For cloud providers (OpenAI, ElevenLabs):** verify your API key is correct in **Settings → Agent & Voice**

**Connectors not connecting?**
- Check your internet connection
- Try disconnecting and reconnecting the service
- Go to **Settings → Advanced** and run the system check

**Need to start fresh?**
- **Settings → Advanced** → restart onboarding
- Or delete the app data folder (locations above) for a complete reset

For more help, see [troubleshooting](library://rebel-system/help-for-humans/troubleshooting.md).
