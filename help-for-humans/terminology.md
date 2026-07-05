---
description: "Friendly glossary of key concepts and terms in Mindstone Rebel, including definitions for spaces, skills, memory, MCPs, wikilinks, and other core terminology"
last_updated: "2026-06-04"
---

# Mindstone Rebel Terminology

A friendly guide to the key concepts and terms you'll encounter.

---

## Core Concepts

### Mindstone
The company that created Mindstone Rebel. We're an Enterprise AI Academy that helps teams transform from AI-curious to AI-capable through practical, hands-on training programs. Mindstone Rebel is the AI-powered platform we built to make work with AI assistants more powerful and organized.

### Mindstone Rebel
This AI-assistant platform you're using right now! It's a structured system that helps AI agents (like me!) work with your files, knowledge, and workflows in an organized way. Think of it as a smart filing system that AI can navigate, with built-in workflows (called [skills](#skill)) for common tasks. ([Getting Started](getting-started.md) | [How It Works](how-it-works.md))

### Cursor
Supported IDE alternative to the Rebel app. Built on VS Code, Cursor lets you work with AI assistants on coding, documentation, and knowledge work. The experience may be degraded vs Rebel (less app-level prompt control, no bundled Node, no separate per‑user app data, fewer automations). In v3 we typically open a **single Rebel workspace folder** (containing `rebel-system/` and one or more spaces) rather than using multi-root workspaces; multi-root is legacy/advanced only. ([More about Cursor](external-IDE-OBSOLETE/Cursor.md))

### Space
A folder (or link to a folder) under your Rebel workspace root that contains skills, memories, and scripts, with its own `README.md` and sharing settings. Examples: your personal Chief-of-Staff space, the `rebel-system/` core (read-only shared), your company's shared space, team-specific spaces (HR, senior management), or personal spaces (family, organisations). In earlier versions these were called "zones", so you may still see that term in older docs. ([Understanding Spaces](spaces.md))

### Chief-of-Staff
That's me! Your personal AI chief-of-staff that works across all your spaces. I can help you with tasks, route between different knowledge areas, and coordinate work that spans multiple spaces. I follow instructions from your space configurations (AGENTS files) and skills.

### Conversation
A chat session with Rebel. Each conversation has its own history and context, and you can return to previous conversations from the sidebar. (Previously called "Session" in older versions of the app.)

### @-Model Dispatch
Mention any AI model by name in your message and Rebel routes it there — no settings changes needed. Type `@` in the composer to see available models, or just name-drop one naturally. ([Council Mode & model routing](library://rebel-system/help-for-humans/multi-model-council-mode.md))

### Operator
A specialist advisor you activate in a Space (a brand critic, an investor's eye, a skeptical engineer). Rebel consults an Operator's perspective mid-task and folds it into its answer — automatically when the work calls for it, or when you @-mention one. Distinct from Council Mode (which consults multiple AI *models*). ([Operators](library://rebel-system/help-for-humans/operators.md))

### Annotations (Comments)
Inline notes you add by selecting text in Rebel's responses or in documents. Select text, right-click (or use the floating toolbar in documents), and choose "Comment" to annotate. Collect multiple comments and send them as a single follow-up message. Also includes "Ask Rebel" for quick quoted replies. ([Reply, Comment & Annotations](reply-comment-annotations.md))

### Dock Notifications
A red badge on the dock icon (or taskbar) that appears when background conversations finish. Handy for knowing when an [automation](library://rebel-system/help-for-humans/automations.md) or long-running task completes while you're doing something else.

### Drafts
Unsent messages that persist when you switch conversations. If you start typing something and navigate away, your draft will be there when you return. Use **Ctrl+Tab** (or **⌘+Tab** on Mac) to cycle through conversations that have drafts waiting.

### Homepage
The landing surface you see when you open Rebel or start fresh. Organized into three sections: **Today** (actionable items like meetings and tasks), **Chat** (recent conversations), and **Coach** (contextual suggestions based on your work). ([Homepage guide](library://rebel-system/help-for-humans/the-spark.md))

### Starred
Conversations you've starred, which appear at the top of your history sidebar. Click the star icon on any conversation to star it for quick access later.

### Trash
Soft-deleted conversations you can restore or permanently remove. When you delete a conversation, it goes to Trash first, giving you a chance to recover it if needed.

### Actions
Your "save for later" list. When you come across something you want Rebel to help with but don't have time right now, you can add it to your Actions. Later, you can review these items and ask Rebel to execute them as tasks. (Previously called "Inbox", and before that "Task Queue" in earlier versions.) ([Using Actions](actions.md))

### Automations
Scheduled tasks that Rebel runs automatically in the background. You can set up recurring workflows (hourly, daily, weekly, or monthly) using skill files, and Rebel will execute them without you needing to be present. Great for things like daily briefings, weekly reports, or regular data syncs. ([Setting up Automations](automations.md))

### Scratchpad
A quick-capture window for jotting down thoughts. Press **⌘/Ctrl+Shift+N** to open it. Notes are timestamped automatically, and you can select text and click "New Note" to save it to your memory with AI-suggested locations.

### Quick Capture
Record a voice note without starting a conversation. Tap the Quick Capture button, speak, and the transcript is stored in your context automatically. Works on desktop and mobile — handy for capturing ideas while you're on the move.

### The Spark
Now called [Homepage](#homepage). Previously the discovery hub shown when you start a new conversation.

### Coaching Insights
Reflections generated after conversations suggesting what you might want to explore next. These appear on the [Homepage](#homepage) and help you discover follow-up opportunities you might have missed.

### Council Mode
Bring multiple AI models into one conversation for second opinions. Rebel consults several models simultaneously — Claude, GPT, Gemini, and others — then synthesizes their responses. Add model profiles and mark them as council members in **Settings → Agent & Voice → Intelligence**. ([Council Mode guide](library://rebel-system/help-for-humans/multi-model-council-mode.md))

---

## Structure & Organization

### Skill
Step-by-step instructions (in Markdown files) that tell AI agents how to perform actions or handle specific workflows — think recipes for common tasks like meeting prep, documentation writing, research, or system maintenance. Stored in `skills/` folders across spaces (and in the shared `rebel-system/skills/` core). Every edit is tracked with version history and contributor attribution, so you can review changes, compare versions, and revert if needed. (Also called "playbooks" in v1)

### Plugin
A custom tab that extends Rebel's sidebar. Ask Rebel to build one — describe what you want and it writes the code, compiles it, and adds the tab automatically. Plugins can search your files, embed AI helpers, display calendar events, and more. Share plugins with your team through shared Spaces. ([Plugins and Custom Tabs](library://rebel-system/help-for-humans/plugins-and-custom-tabs.md))

### Memory
Your working area for personal or team-specific context and files inside a given space (for example a `memory/` folder under that space) - like your desk workspace for things you're actively working on. The auto-loaded memory now lives in the `README.md` file for that space (often the top-level `Chief-of-Staff/README.md` for personal context), and detailed context lives in `memory/topics/` files that are loaded on-demand.

### ABOUTME.md (legacy)
In earlier v1/v2 layouts, this was your profile file (`memory/ABOUTME.md` in your personal scratchpad) with your name, email, teams, and role. In v3, the **README.md** in each space (e.g., `Chief-of-Staff/README.md`) is the source of truth for profile + auto-loaded context; treat any existing `ABOUTME.md` files as legacy input only and migrate missing profile facts into README.md over time.

---

## Technical Concepts (Made Simple)

### Mindstone Cloud
Optional managed cloud infrastructure that keeps your desktop, mobile, and browser in sync. One-click provisioning — you can use your own API keys or the managed service. Cloud Continuity is opt-in; Rebel works fully offline in desktop-only mode. ([Cloud Continuity and Mobile](library://rebel-system/help-for-humans/cloud-continuity-and-mobile.md))

### MCP (Model Context Protocol)
A connector that gives AI agents access to external tools and services. Rebel supports many connectors—some connect directly via OAuth, others are bundled, and some are community-provided. You manage all your connectors in **Settings → Connectors**. ([Understanding MCPs](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md))

### Context Window
The amount of text an AI model can hold in mind at once. Measured in tokens (roughly 3/4 of a word). Larger context windows let AI work with more files, longer conversations, and bigger projects without forgetting earlier context. Different models offer different sizes: some handle 200K tokens, others 1M+ tokens. (see [AI Model Selection](AI-models.md))

### Context Compaction
What happens when a conversation gets too long for the context window. Instead of failing, Rebel automatically:
1. Generates a summary of everything discussed so far
2. Preserves your original goal, what's been accomplished, and what remains
3. Continues the conversation with this compressed context

This runs automatically — there's nothing to configure. You'll see a brief "Compacting context..." message when it happens. If it still can't fit after two attempts, Rebel will suggest breaking the task into smaller steps. For sensitive work, consider starting a fresh conversation before hitting this limit.

### Wikilink
A way to reference files using double brackets: `[[path/to/file]]` corresponds to `path/to/file.md`. Example: `[[help/terminology]]` → `help/terminology.md`.

### Klavis (Deprecated)
A third-party MCP gateway service that was previously used to connect to external services. **Rebel now uses built-in connectors** for Gmail, Slack, Calendar, HubSpot, and 70+ other services. Built-in connectors keep your data local and don't require a third-party gateway. See [klavis-migration.md](klavis-migration.md) if you're still using Klavis and want to migrate.

### Super-MCP
A router that aggregates multiple MCP servers into one. This lets Rebel access many different tools and services efficiently without overloading the AI's context. You generally don't need to interact with Super-MCP directly—it works behind the scenes to make tool access faster and more reliable.

### Safety Rules
Natural language rules you write to tell Rebel what actions are OK and what needs your approval. Found in [Settings → Privacy & Safety](rebel://settings/safety). Think of them as a personalised safety policy — 'always ask before emailing external contacts' or 'never modify files in the Finance folder without asking.' See [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md#your-own-rules-custom-safety-instructions) for examples and tips.

### Tool Safety
A protection system that evaluates every tool action against your Safety Rules — natural language rules you write in [Settings → Privacy & Safety](rebel://settings/safety). Actions that pass your rules run automatically. Actions that don't trigger an approval prompt. You can also mark specific tools as trusted to bypass checks entirely.

### Session Modes
Rebel's labels for how a chat is running. The four you'll actually see:
- **Conversations** — your normal chats with Rebel
- **Automations** — scheduled or event-triggered runs Rebel handles in the background
- **Privacy Mode** — a toggle for extra approval and caution on sensitive work
- **Voice Mode** — a toggle for shorter, spoken-style replies while you're talking

See [Session Modes](library://rebel-system/help-for-humans/session-modes.md) for the full breakdown.

### File Search
A way to find files by meaning rather than exact keywords. Rebel indexes your workspace and enriches each chunk with document metadata (title, path) to understand what files are about. Trigger with `@files` in the composer. Indexing runs automatically in the background when you open a workspace.

### Library
The sidebar panel in Rebel where you browse files, skills, and memory. Click the folder icon to open it. (Previously called "Workspace panel" — note that your workspace folder on disk is still called a "workspace", but the UI panel is now "Library".)

### Privacy Mode
A per-session toggle for extra-sensitive work. When enabled, Rebel will ask for your approval before every tool use and memory write—nothing happens without your explicit permission. Enable it from the conversation header when you need extra control. ([Privacy Mode guide](privacy-mode.md))

### Quality Filtering
Action items are scored for relevance at write time — low-signal items are filtered before they reach you. This keeps your [Actions](library://rebel-system/help-for-humans/actions.md) focused on what actually matters.

### Connectors
Tool integrations that let Rebel access external services like Slack, Gmail, Calendar, and more. Manage your connected tools in **Settings → Connectors**. ([Understanding Connectors](mcp-connectors-tools-and-integrations.md))

### Time Saved
A feature that estimates how much time Rebel saves you. Shows weekly totals in the header with trend indicators. Click to see detailed breakdowns including all-time statistics. Toggle visibility in **Settings → Account & Preferences → Appearance**.

---

## Deprecated Terms

Some terms have changed over time. If you see these in older documentation or conversations:

| Old Term | Current Term | Notes |
|----------|--------------|-------|
| Zone | Space | Renamed in v3 |
| Playbook | Skill | Renamed in v2 |
| Task Queue | Actions | Renamed Dec 2025 (to Inbox), Apr 2026 (to Actions) |
| Inbox | Actions | Renamed Apr 2026 |
| Session | Conversation | UI terminology change Dec 2025 |
| Workspace panel | Library | UI panel renamed in v0.3.4; workspace folder unchanged |
| ABOUTME.md | README.md | Profile info now lives in space README.md files |
| Platform (skill source) | Built-in | Skill source label renamed Jan 2026 |
| Rebel skill | Built-in | Skill source label renamed Jan 2026 |
| Browse (Library tab) | Files | Library tab renamed Jan 2026 |
| What Rebel Knows | Your Context | Memory section renamed Jan 2026 |
| Forget (memory action) | Remove | Memory action renamed Jan 2026 |
| The Spark | Homepage | Landing surface renamed Feb 2026 |

---

## Getting Help

### Rebels Community Forum
The Mindstone user community at https://rebels.mindstone.com — a Discourse forum for discussion, support, and sharing. Key categories: General Chat (`/c/general-chat/9`), Technical Support (`/c/bug-reports/5`), Feature Requests (`/c/feature-requests/7`), Show & Tell (`/c/show-tell/6`), and Guides & Best Practices (`/c/guides-best-practices/8`). Rebel can search the forum and create posts on your behalf using its built-in community tools.

[Getting Started](getting-started.md) | [Troubleshooting](troubleshooting.md) | [When AI Goes Wrong](undoing-AI-changes.md)