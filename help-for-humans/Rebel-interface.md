---
description: "Overview of the Rebel desktop app interface: layout, unified voice mic buttons, Homepage, file attachments, and workspace integration"
last_updated: "2026-07-06"
---

# Rebel Interface (Mindstone Rebel desktop app)

Short guide for humans on how Mindstone Rebel desktop app fits into Mindstone Rebel.

Rebel is a user-friendly, voice-first desktop app. For Mindstone Rebel v3, it is the **primary UI for non-technical users**, complementing developer IDEs like Cursor and Claude Code.

**Supported platforms:** macOS, Windows, and Linux (beta).

## Current layout

Rebel's main window is now organised into four working zones:

- **Left conversation sidebar** — your conversation history, filters, and starred chats. Background automation runs live under [Automations](rebel://automations), not here.
- **Main surface area** — the part you're actively using: a conversation, Homepage, Focus, Library, Actions, or another surface
- **Right-side drawer** — extra context such as **Behind the scenes**, document preview, or approvals
- **Bottom interaction strip** — the composer, voice controls, attachments, mode toggle, and per-conversation settings

In other words: navigation on the left, work in the middle, extra context on the right, and "tell Rebel what to do next" along the bottom.


## Key Features

### Voice Interaction

Rebel supports independent **Speak** and **Listen** modes—use either separately or combine them for full voice interaction:

- **Listen mode** — Rebel transcribes your speech. Use the global voice hotkey (default: Ctrl+Alt+Space) or click any mic button.
- **Speak mode** — Rebel reads responses aloud using text-to-speech.
- **Custom vocabulary** — Teach Rebel your domain-specific terms for better transcription accuracy (Settings → Agent & Voice → Voice).

**Unified mic buttons** — Microphone buttons across Rebel (main conversation, Home page, question cards, Actions/Today) now look and behave the same. Only one records at a time; if another is already listening, the rest grey out with "Finish the other recording first." On the **Home page**, double-tap the mic while recording to stop and send immediately.

See [Voice and Audio](library://rebel-system/help-for-humans/voice-and-audio.md) for providers (including OpenRouter and Mindstone transcription), permissions, and troubleshooting. See [voice-dictation-apps](voice-dictation-apps.md) for alternative dictation options.

### File Attachments

Attach files directly to your conversations:

- **Text files** — Markdown, code files (.py, .js, .ts, etc.), plain text
- **Documents** — PDF, DOC, DOCX, XLS, XLSX
- **Images** — Screenshots, photos (paste or drag)

Drag files into the composer or paste from clipboard.

### Library & Skills

- **Skills panel** — Browse and run skills from the Library drawer; configure which system skills are available
- **Document Editor** — A unified editor for viewing and editing files inline without leaving Rebel. Files open in edit mode by default, with annotated markdown support and document actions. Seamlessly transitions between Library and conversation views.
- **Document outline** — Long documents show a navigable outline sidebar in the editor. Click any heading to jump directly to that section.
- **Memory panel** — See what Rebel knows about you: facts, preferences, and context organized by space
- **Atlas panel** — Browse your skills, memories, spaces, and files in one calm list. Pick any item to see its details and a quiet rail of what's related — "more like this", without the graphics. Start a conversation from any item, or get the gist in one click.
- **Share files** — Share any file in your library with a public link — password protection and expiry included. Text files are readable right in the browser; other files get a download link. Works just like conversation sharing.
- **Content search** — Search across your workspace to find files quickly
- **File search** — Find files by meaning, not just keywords. Use `@files` in the composer

### Conversations

- **Auto-save** — Conversations save automatically; no more lost work
- **Message navigator** — Jump between your messages in long conversations
- **Edit messages** — Click any of your previous messages to edit and branch the conversation
- **Export** — Save conversations as PDF or DOCX
- **Copy as Markdown** — Right-click any conversation in the sidebar and select "Copy as Markdown" to get a clean text version of the entire conversation
- **Reply & Comment** — Select text in Rebel's responses to copy, ask a follow-up question, or add inline comments. Collect multiple comments and send them all at once. See [Reply, Comment & Annotations](library://rebel-system/help-for-humans/reply-comment-annotations.md).
- **Sidebar tabs & folders** — Switch what the sidebar shows with the tabs at the top: **Active**, **Starred** (the star), **Done**, and **All**. Background automation runs are kept out of **Active** so they don't crowd your working list — open them from [Automations](rebel://automations) run history (they're still in **All** if you want everything). You can group related conversations into folders, and mark finished ones **done** to clear them out of Active without deleting them. See [Organising your conversations](organising-conversations.md).
- **Context menus** — Right-click in the conversation area for cut/copy/paste options. Right-click conversations in the sidebar for quick actions like mark as done, star, move to folder, or delete.
- **Privacy Mode toggle** — Flip Privacy Mode on from the conversation header to require your approval before every tool use and memory write. See [Privacy Mode](library://rebel-system/help-for-humans/privacy-mode.md) and [Session Modes](library://rebel-system/help-for-humans/session-modes.md).
- **Composer settings** — Click the settings menu in the composer to adjust model, thinking effort, and context settings per session. A file indicator button shows attached files at a glance.
- **Model switcher** — A toggle button in the top-right corner opens a popover showing all three model roles (working, thinking, and background) at a glance. Switch models or check which model is active for each role without leaving the conversation.
- **Share conversations** — Share any conversation via a secure URL. Click the share button to generate a link—optionally set a password and expiry. Recipients see a read-only web view, no app needed.
- **Notification drawer** — Approvals live in a notification drawer accessible from the badge icon in the top bar. Pending approvals are grouped by conversation, and compact receipt bubbles confirm each action after you approve. The drawer can also show **rule suggestions** — confirm-before-save cards when Rebel proposes turning something you said into a safety rule. When actions need your approval mid-conversation, a bar appears at the bottom of the conversation: "Rebel paused. X action(s) need your OK" — click **View** to open the notification drawer.
- **Structured questions** — When Rebel needs clarification, it presents multiple-choice options inline in the conversation. Pick an option or type your own answer — no more back-and-forth confusion about what's being asked.
- **Rebel's thinking card** — While Rebel works, you usually see a compact progress bar rather than a wall of logs. Expand it to see the plan, what Rebel is doing right now, and optional technical details if you want them.
- **Tool activity** — Even when Rebel hasn't answered yet, you still get visible progress instead of the app staring at you in silence.
- **Stop button** — Click the stop button once to immediately halt the agent mid-turn. It works reliably every time.
- **End-of-turn status** — After each turn, a status indicator shows what happened: "Stopped by you" (you clicked Stop), "Waiting for you" (Rebel is ready for your next message), or an error message if something went wrong. When Rebel stops before finishing a task, a **Continue** button appears so you can resume from where it left off.
- **Desktop notifications** — When a conversation finishes while you're in another app, Rebel sends a native notification linking back to the completed conversation. Opt in from Settings. A red badge also appears on the dock/taskbar icon so you never miss a completed task.
- **Full-width conversations** — Toggle from the actions menu to expand conversations edge-to-edge, giving you more room for long documents and detailed responses.
- **Auto-archive (fire & forget)** — Enable the archive toggle next to Send to automatically archive conversations when complete. Click to toggle the mode (green = enabled); long-press to archive immediately. Rebel evaluates whether a task completed successfully before archiving—unfinished work stays visible. See [Autonomous Work](library://rebel-system/help-for-humans/running-big-jobs-unleashed-auto-archive.md) for the async workflow this enables.
- **Conversation titles** — Rebel automatically gives each conversation a short, descriptive title (2–3 words) so the sidebar stays scannable. The title refreshes once around turn 5, so a quick greeting won't lock in an unhelpful label. You can rename any conversation manually at any time if you'd rather use your own title.

### Quick Capture

- **Scratchpad** — Press **⌘/Ctrl+Shift+N** to open the quick-capture modal. Notes live on the left, tasks live on the right, and **New Note** turns selected text into a proper memory file.

### Homepage

The Homepage is your landing surface — the screen you see when you open Rebel, start a new conversation, or come back after a break. It organises what matters into three sections:

- **Today** — Surfaces what needs your attention right now: calendar events, upcoming meetings, and actionable items from your connected tools. Context fields on Today and Actions cards auto-expand for longer notes, so you can add detailed context without cramping. Each card has the same mic button as everywhere else in Rebel — greyed out while another recording is in progress. Refreshes automatically while visible.
- **Chat** — Shows your recent conversations so you can pick up where you left off. The Home chat input includes a mic button; **double-tap while recording** to send your message straight away.
- **Coach** — A carousel of insights and suggestions based on your previous conversations and connected tools, including a hero card highlighting what to work on next. Insights expire after 3 days and prioritise by how often you act on them.

At the bottom, find quick links to "What's New", the community, and help. See [Homepage](library://rebel-system/help-for-humans/the-spark.md) for the full guide.

### Focus

**Focus** is Rebel's planning surface for seeing your week or month in one place.

- **Calendar overview** — upcoming meetings and time blocks
- **Briefing column** — a written prep or review for the current period
- **Goals rail** — the priorities you're meant to care about, next to the time that's competing with them

If Focus is enabled for your workspace, it appears as its own surface in the main navigation so you can switch between day-to-day conversations and a wider planning view.

### What's New Widget

A sidebar widget shows recent updates and features. The badge clears automatically once you've seen new items. Click to open the full What's New dialog with detailed release notes.


## App Navigation Links (`rebel://`)

Use `rebel://` links in conversations to direct users to specific parts of the app. Clicking these links navigates directly to the relevant screen.

| Link | Destination |
|------|-------------|
| `rebel://library` | Library tab |
| `rebel://settings` | Settings |
| `rebel://settings/system` | Settings → Workspace (compatibility route) |
| `rebel://settings/spaces` | Settings → Workspace → Spaces |
| `rebel://settings/tools` | Settings → Connectors (alias: `rebel://settings/connectors`) |
| `rebel://settings/plugins` | Settings → Advanced → Plugins |
| `rebel://settings/agents` | Settings → Agent & Voice → Intelligence |
| `rebel://settings/voice` | Settings → Agent & Voice → Voice |
| `rebel://settings/meetings` | Settings → Meetings |
| `rebel://settings/safety` | Settings → Privacy & Safety |
| `rebel://settings/diagnostics` | Settings → Advanced → Support (alias: `rebel://settings/support`) |
| `rebel://settings/usage` | Settings → Usage |
| `rebel://settings/cloud` | Settings → Workspace → Cloud Sync |
| `rebel://automations` | Automations panel |
| `rebel://usecases` | The Spark (homepage) |
| `rebel://tasks` | Actions |
| `rebel://feedback/bug` | Bug report form |
| `rebel://feedback/improvement` | Feedback/idea form |
| `rebel://feedback/bug?description=...` | Bug report with pre-filled description (URL-encode the text) |
| `rebel://feedback/bug?stepsToReproduce=...` | Bug report with pre-filled steps to reproduce |
| `rebel://feedback/bug?expectedBehavior=...` | Bug report with pre-filled expected behavior |

**Usage:** Format as standard Markdown links: `[Settings](rebel://settings)`, `[Report a Bug](rebel://feedback/bug?description=Calendar%20sync%20fails&stepsToReproduce=1.%20Open%20calendar%0A2.%20Click%20sync&expectedBehavior=Calendar%20should%20sync)`.

When users want to report a bug or share feedback, always use the `rebel://feedback` link to open the form directly — summarise the issue in the `description` query param so the form is pre-filled, and include `stepsToReproduce` and `expectedBehavior` when available. Never tell users to manually navigate to Help > Feedback.


## See also

- [reply-comment-annotations](library://rebel-system/help-for-humans/reply-comment-annotations.md) – Select text to reply, comment, and annotate conversations and documents
- [file-attachments](library://rebel-system/help-for-humans/file-attachments.md) – Supported file types, size limits, and tips for document analysis
- [keyboard-shortcuts-and-hotkeys](keyboard-shortcuts-and-hotkeys.md) – Quick reference for all shortcuts
- [actions](actions.md) – Save tasks for later and execute them on demand
- [architecture-technical-description](architecture-technical-description.md) – How Rebel, Cursor, and Claude Code sit in the Interface layer
- [secrets-and-passwords](secrets-and-passwords.md) – Where API keys and credentials should live
- [Cursor](external-IDE-OBSOLETE/Cursor.md) – IDE-based interface setup and configuration
- [where-rebel-stores-things](where-rebel-stores-things.md) – Where the core folder lives and per-user data is stored

### Additional Features

- **Actions** — Save actionable items for later and execute them when ready (see [actions](actions.md))
- **Automations** — Schedule recurring tasks like daily briefings (Settings → Automations)
- **Time Saved** — Track how much time Rebel saves you. Weekly stats show in the header; click for detailed breakdowns including all-time totals. Toggle in Settings → Display.
- **Usage & Insights** — View your API usage, costs, and session statistics in Settings → Usage


## How Rebel connects to Mindstone Rebel

- You point Rebel at a **single workspace folder**, which should be the root that contains your spaces (`Chief-of-Staff/`, `Company/`, `Exec/`, etc.).  
- Rebel reads and writes files inside that workspace only, applying the same sharing boundaries you set up via spaces.  
- Secrets (API keys, tokens) follow the general rules in `secrets-and-passwords.md`: high-risk keys live in per-user settings or environment variables; low-risk communal keys can use workspace-local `.secrets/.env` when appropriate and clearly documented.  


