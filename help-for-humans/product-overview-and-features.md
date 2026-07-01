---
description: "Complete overview of what Rebel does: product vision, all features, and how Rebel compares to ChatGPT, Claude Cowork, and OpenClaw"
last_updated: "2026-04-16"
---

# Product Overview and Features

Rebel is a voice-first AI assistant for knowledge workers — executives, product managers, researchers, sales and marketing professionals, customer success teams, and anyone whose work involves thinking, communicating, and coordinating across tools and people.

Think of Rebel as a capable Chief of Staff who remembers your context, connects to your tools, and actually does the work — not just advises on it.

---

## What Makes Rebel Different

### It Remembers You

Most AI tools start from scratch every conversation. Rebel maintains persistent memory across sessions — your preferences, ongoing projects, key contacts, and working style compound over time. A conversation in month three is fundamentally more useful than one in month one.

### It Connects to Your Work

120+ connectors let Rebel access your actual tools: Gmail, Slack, Calendar, Notion, HubSpot, Salesforce, Jira, and dozens more. When you say "check my calendar for conflicts" or "find that Slack thread about the Q2 launch," Rebel actually does it.

### Privacy First

Rebel connects directly to the AI setup you choose — whether that's Anthropic, ChatGPT Pro, OpenRouter, or another provider — so your conversations go straight there, never through Mindstone's servers. Your workspace files stay on your machine. Mindstone never sees your conversations, files, or sensitive data. Connector tokens are stored locally. Search indexes run on local embeddings.

### Voice First

Speak to Rebel like you'd speak to a colleague. Global hotkey activation, real-time transcription, and spoken responses make hands-free interaction natural — while walking, commuting, or thinking out loud.

---

## Core Features

### Conversations

The primary way you interact with Rebel. Each conversation maintains its own history, and you can pick up where you left off days or weeks later.

- **Auto-save** — Never lose work. Conversations persist automatically
- **Drafts** — Start a message, switch conversations, come back — your draft is waiting
- **Edit and branch** — Click any previous message to edit it and explore a different direction
- **Inline questions** — When Rebel needs clarification, it presents structured multiple-choice questions right in the conversation. Pick an option or type your own answer
- **Export** — Save conversations as Markdown
- **Reply and comment** — Select text in Rebel's responses to ask follow-up questions or add inline annotations
- **Multiple simultaneous conversations** — Run several conversations at once
- **Sidebar filters** — Filter your conversation list with chips for All, Unread, Automations, and Starred
- **Dock notifications** — A red badge appears on the dock icon when background conversations finish, so you never miss a result
- **Status banners** — See at a glance whether a conversation was stopped by you, is waiting for you, or finished in the background

**See also:** [Getting Started](library://rebel-system/help-for-humans/getting-started.md)

### Spaces

Organised areas for different parts of your work. Each space has its own skills, memory, and sharing settings.

- **Personal spaces** — Private to you (Chief-of-Staff, personal projects)
- **Team spaces** — Shared with your team (company context, shared skills)
- **Sharing boundaries** — Control what's visible where. Personal notes stay personal; company context is shared
- **Shared folder backing** — Connect spaces to Google Drive, OneDrive, Dropbox, or Box for team sync

**See also:** [Understanding Spaces](library://rebel-system/help-for-humans/spaces.md) | [Shared Folders](library://rebel-system/help-for-humans/space-shared-folders.md)

### Memory

What Rebel learns about you over time, organised into three tiers:

- **Always loaded** — Your name, role, current priorities, key contacts. Available in every conversation
- **On-demand** — Detailed notes about specific topics, loaded when relevant
- **Shared knowledge** — Company or team context accessible to everyone in a shared space

Memory writes go through an approval flow. Rebel won't quietly overwrite important context, and shared spaces have extra safety checks.

**See also:** [Memory and Approvals](library://rebel-system/help-for-humans/memory-folders-and-approvals.md)

### Skills

Reusable instructions that tell Rebel how to handle specific tasks. Skills are just Markdown files with clear steps — nothing proprietary.

- **Built-in skills** — Meeting prep, research, document drafting, and more
- **Custom skills** — Create your own for recurring workflows
- **Composable** — Skills can call other skills (a meeting prep skill might use a web researcher + CRM lookup + document drafter)
- **Shareable** — Skills in team spaces are available to everyone on the team
- **Version history** — Every edit is tracked, so you can review changes and revert if needed
- **Contributor attribution** — See who created or updated a skill
- **Safety checkpoints** — Skills go through safety review before they can take actions on your behalf

**See also:** [Using Skills](library://rebel-system/help-for-humans/using-skills.md)

### Operators

Specialist advisors Rebel consults when their expertise would sharpen your answer — judgment calls, drafting, review, and more. See [Operators](library://rebel-system/help-for-humans/operators.md).

### Connectors

Integrations with external services, available in Settings → Connectors:

| Category | Examples |
|----------|----------|
| **Communication** | Slack, Outlook Mail, Teams, Intercom, Email |
| **Productivity** | Google Workspace (Gmail, Calendar, Drive, Docs), Notion, Asana, Jira, monday.com, Todoist, ClickUp |
| **Analytics** | BigQuery, Looker, Metabase, PostHog, ChartMogul |
| **Storage** | OneDrive, SharePoint, Box, Dropbox, Egnyte |
| **Sales** | HubSpot, Salesforce, Affinity CRM |
| **Development** | GitHub, Sentry, Linear, PostgreSQL |
| **Design** | Canva, Miro, Figma, Framer, Webflow |
| **Payments** | Stripe, PayPal, Xero, Ramp |
| **Media** | ElevenLabs, Kling AI, OpenAI Image Generation |

Authentication uses standard OAuth — sign in through your browser, and tokens stay on your device.

**See also:** [Connectors and Tools](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md)

### Voice

Independent Listen and Speak modes — use either separately or together:

- **Listen** — Real-time speech transcription with custom vocabulary for your domain terms
- **Speak** — Rebel reads responses aloud with streaming playback (no waiting for the full response)
- **Global hotkey** — Activate voice from any app (default: Ctrl+Alt+Space), with automatic screenshot capture for context
- **Multiple providers** — OpenAI Whisper, ElevenLabs Scribe, or local transcription

**See also:** [Voice and Audio](library://rebel-system/help-for-humans/voice-and-audio.md)

### Safety

Layered protection that stays out of your way:

- **Tool safety** — Every tool action is evaluated against your Safety Rules before execution. Safe actions run automatically; flagged actions ask for approval
- **Memory safety** — Approval flow for memory writes, with extra checks for shared spaces
- **Privacy Mode** — Per-conversation toggle for sensitive work
- **Safety Rules** — Write natural language rules that tell Rebel what needs your approval. Plus trusted tools, per-space memory settings, and Privacy Mode for sensitive work.

**See also:** [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md) | [Privacy Mode](library://rebel-system/help-for-humans/privacy-mode.md)

---

## Productivity Features

### Homepage

Your landing surface when you open Rebel, with three sections:

- **Today** — Your daily briefing: upcoming meetings, pending action items, and suggested follow-ups
- **Chat** — Jump straight into a new conversation or pick up a recent one
- **Coach** — Reflections and coaching insights from previous conversations suggesting what to explore next
- **Quick suggestions** — Fresh prompts, help links, community links, and what's new when you're starting from zero

**See also:** [Homepage](library://rebel-system/help-for-humans/the-spark.md)

### Focus

A planning surface for your week, meetings, and priorities:

- **Goal-aligned calendar** — See how meetings support your priorities, including productive, blocker, noise, or travel signals
- **Meeting prep** — Generate prep docs for important meetings before they start
- **Briefings** — Get concise daily and weekly briefings instead of a wall of calendar chaos
- **Recommendation control** — Choose whether recommendations are automatic, on-demand, or off

### Document Editor

A built-in editor for long-form work, rebuilt from scratch:

- **Annotated Markdown** — Rich editing with inline annotations, so Rebel can comment on specific sections
- **Live collaboration** — Rebel writes alongside you, making edits you can accept, reject, or refine
- **Export** — Save as Markdown, PDF, or DOCX when you're done

### Actions and Scratchpad

Capture and defer work without losing track:

- **Actions** — Save actionable items from connected tools for later review and execution
- **Scratchpad** — Quick capture with ⌘/Ctrl+Shift+N. Jot down thoughts, then use "New Note" to save with AI-suggested file names
- **Quick Capture** — Record a voice note without starting a conversation. The transcript feeds into your context automatically — handy for capturing ideas on the go

**See also:** [Actions](library://rebel-system/help-for-humans/actions.md) | [Scratchpad](library://rebel-system/help-for-humans/scratchpad.md)

### Sharing

Share work without sending people on a scavenger hunt:

- **Library file sharing** — Share files from your Library with a link
- **Password and expiry controls** — Add a password and choose when the link expires
- **Browser-friendly delivery** — Text files can open in the browser; everything else gets a clean download page

### Automations

Schedule recurring or one-off agent tasks:

- **Scheduled runs** — Daily briefings, weekly summaries, regular check-ins
- **One-off tasks** — Schedule a single run for a specific time without setting up a recurring schedule
- **Headless execution** — Runs in the background without interaction
- **Run history** — Track what happened and when
- **Catch-up** — Missed runs execute when Rebel next launches

**See also:** [Automations](library://rebel-system/help-for-humans/automations.md)

### Rebel Notetaker

AI-powered meeting intelligence:

- **Joins your meetings** — Zoom, Google Meet, Microsoft Teams
- **Captures transcripts** — Searchable, AI-summarised
- **Interactive Q&A** — Ask questions during meetings with optional knowledge search
- **Real-time coaching** — Contextual suggestions during meetings, triggered at conversationally relevant moments. Saved transcripts include extracted decisions and open questions
- **Meeting prep** — Full workflow for researching attendees and preparing briefings
- **Device support** — Works with recording devices like Plaud and Limitless Pendant
- **Import** — Bring transcripts from Fireflies, Fathom, or Granola

**See also:** [Meetings and Notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md)

### Session Modes

The four labels you'll see around the app:

- **Conversations** — your normal chats with Rebel
- **Automations** — scheduled or event-triggered runs Rebel handles in the background
- **Privacy Mode** — a toggle for extra approval and caution on sensitive work
- **Voice Mode** — a toggle for shorter, spoken-style replies while you're talking

**See also:** [Session Modes](library://rebel-system/help-for-humans/session-modes.md)

### Big Jobs

For extended autonomous work:

- **Unleashed mode** — Up to 10 auto-continues for complex tasks
- **Auto-archive** — Fire-and-forget delegation. Rebel evaluates whether work completed before archiving
- **Multiple simultaneous conversations** — Run several tasks in parallel

**See also:** [Autonomous Work](library://rebel-system/help-for-humans/running-big-jobs-unleashed-auto-archive.md)

### Semantic File Search

Find files by meaning, not just keywords:

- **Hybrid search** — Combines vector embeddings with keyword matching
- **Local processing** — Embeddings run on your machine (GPU-accelerated when available)
- **In-composer** — Type `@files` to search and attach relevant files to your message

**See also:** [File Search](library://rebel-system/help-for-humans/file-search.md)

### Plugins (Labs)

Custom tabs that extend Rebel's sidebar. Ask Rebel to build one — describe what you want, and it writes the code, compiles it, and adds the tab automatically.

- **AI-generated** — Describe a dashboard, list, or view and Rebel creates it
- **Source search** — Plugins can search your files and connected sources
- **AI helpers** — Embed AI-powered summaries, suggestions, or analysis right in the tab
- **Calendar hooks** — Display and interact with your calendar events
- **Clipboard integration** — Read from and write to your clipboard for quick data transfer
- **Sharing via Spaces** — Share plugins with your team through shared Spaces
- **Themed** — Plugin components match Rebel's look and feel in both light and dark mode
- **Persistent** — Plugins survive app restarts
- **Self-correcting** — If compilation fails, Rebel reviews errors and fixes the code automatically

**See also:** [Plugins and Custom Tabs](library://rebel-system/help-for-humans/plugins-and-custom-tabs.md)

### Keyboard Shortcuts

Full shortcut set for power users:

- **⌘/Ctrl+N** — New conversation
- **⌘/Ctrl+O** — Quick Open (fast file access)
- **Ctrl+Tab** — Cycle through conversations with drafts
- **⌘/Ctrl+Shift+N** — Scratchpad
- **Global hotkey** — Configurable voice activation

**See also:** [Keyboard Shortcuts](library://rebel-system/help-for-humans/keyboard-shortcuts-and-hotkeys.md)

---

## AI Models

Rebel is model-agnostic. Most people start with one of three first-class options — ChatGPT Pro, OpenRouter, or Anthropic — then add other model profiles if needed.

| Provider option | Access method |
|----------------|--------------|
| **ChatGPT Pro** | Connect your OpenAI subscription |
| **OpenRouter** | Connect OpenRouter for access to a broad model catalog |
| **Anthropic** | API key or Claude Max subscription |
| **Other models** | Add OpenAI, Google, local, or custom-compatible models as profiles |

Rebel can split work between a **Working** model for execution and a **Thinking** model for planning, or route to a model by name mid-conversation.

### @-Model Dispatch

Mention any model by name in your message — like "ask GPT-4o what it thinks" or "@Claude, summarise this" — and Rebel routes that part of the conversation to that model automatically. No need to switch settings or open a different app.

### Council Mode

Bring multiple AI models into one conversation for second opinions, diverse perspectives, or cross-checking. Start a council and each model contributes its response — useful when the stakes are high or you want to compare reasoning styles.

**See also:** [AI Models](library://rebel-system/help-for-humans/AI-models.md)

---

## Platforms

| Platform | Status |
|----------|--------|
| macOS | Supported |
| Windows | Supported |
| Linux | Beta |
| Mobile (iOS & Android) | Beta |

### Mindstone Cloud

Optional managed cloud infrastructure that keeps your desktop, mobile, and browser in sync. One-click provisioning with seamless switching between your own API keys and managed service. Cloud Continuity is opt-in — Rebel works fully offline in desktop-only mode.

**See also:** [Cloud Continuity and Mobile](library://rebel-system/help-for-humans/cloud-continuity-and-mobile.md)

---

## How Rebel Compares

### vs ChatGPT / Claude.ai

ChatGPT and Claude.ai are great for quick questions. Rebel is for ongoing work:

- **Memory**: They forget between sessions. Rebel remembers and compounds
- **Files**: They can't access your local files. Rebel works against your workspace
- **Tools**: Limited plugins. Rebel has 120+ connectors to your actual work tools
- **Models**: Locked to one provider. Rebel lets you use any model, route to models by name mid-conversation, or bring multiple models together in Council Mode
- **Voice**: Basic or none. Rebel is voice-first with custom vocabulary and global hotkey
- **Automation**: None. Rebel has scheduled tasks, Actions, and headless execution

### vs Claude Cowork

Claude Cowork (Anthropic's autonomous AI agent) validates the category. Key differences:

- **Memory**: Cowork starts fresh each session. Rebel maintains persistent, structured memory across conversations that compounds over time
- **Privacy**: Both send LLM calls to Anthropic when using Claude. Rebel's advantage is local memory, local search embeddings, and the option to use local models for fully offline operation. Workspace data is indexed locally on your device — no cloud calls for search
- **Voice**: Cowork has basic dictation (Caps Lock to transcribe). Rebel is voice-first with spoken responses, custom vocabulary for your domain terms, global hotkey activation, and optional local transcription
- **Safety**: Cowork inherits Anthropic's model-level safety. Rebel adds application-layer safety on top — customisable approval levels, memory write approvals, and sensitivity-aware routing between spaces
- **Integrations**: Cowork supports custom MCPs but setup is manual (remote URL + OAuth configuration). Rebel ships 120+ plug-and-play connectors with one-click setup
- **Automations**: Cowork has basic scheduling but requires the app to be open. Rebel runs automations headlessly with persistent execution, run history, and catch-up for missed runs
- **Model choice**: Cowork is Anthropic-only. Rebel supports multiple providers including local models
- **Data portability**: Cowork offers JSON export (all-or-nothing, 24-hour expiry). Rebel stores everything as Markdown files on disk — inherently portable, inspectable, and yours
- **Meeting intelligence**: Cowork has none. Rebel includes full meeting prep, transcription, and follow-up

### vs OpenClaw

OpenClaw (open-source AI assistant, 180K+ GitHub stars) proves massive demand for AI that actually does things. Key differences:

- **Security**: 135K+ OpenClaw instances exposed to the internet with known critical vulnerabilities. Rebel has zero exposed deployments — it runs locally by design
- **Setup**: OpenClaw requires terminal comfort, Node.js, API key management, and manual security hardening. Rebel has guided graphical onboarding
- **Safety**: OpenClaw has minimal safety by default. Rebel has built-in tool safety, memory approval flows, and privacy mode
- **Enterprise**: OpenClaw has no authentication, access controls, or team features. Rebel has shared spaces, team memory, and role-based sharing
- **Cost predictability**: OpenClaw API costs range from $10 to $700+/month unpredictably. Rebel offers subscription pricing

### Using Rebel Alongside Other Tools

Rebel works well alongside other tools. Some users combine:

- **Rebel** for meetings, research, planning, voice workflows, and cross-tool orchestration
- **Cursor or Claude Code** for intensive coding sessions
- **ChatGPT or Claude.ai** for quick one-off questions on mobile

The same workspace, files, and skills are accessible from Rebel and compatible IDE tools.

---

## Core Principles

- **Privacy first** — Mindstone never sees your data. Your workspace files stay local; conversations go directly to your chosen AI provider
- **Respect your attention** — Minimise friction. Focus on what you're trying to achieve
- **Do no harm** — No destructive operations without explicit approval
- **Ask, don't guess** — When intent or risk is unclear, Rebel asks rather than assuming
- **Open formats** — Markdown files, SQLite databases, standard protocols. Your data is portable
- **Model agnostic** — Choose your AI provider. No lock-in

---

## Learn More

- [Getting Started](library://rebel-system/help-for-humans/getting-started.md) — First-time setup
- [How Rebel Works](library://rebel-system/help-for-humans/how-it-works.md) — Mental model of the system
- [How Rebel Is Built](library://rebel-system/help-for-humans/how-rebel-is-built.md) — Workspace and memory overview
- [Technical Architecture](library://rebel-system/help-for-humans/architecture-technical-description.md) — Under-the-hood details
- [Why Rebel?](library://rebel-system/help-for-humans/why-rebel.md) — Detailed comparison with alternatives
- [Rebel Interface](library://rebel-system/help-for-humans/Rebel-interface.md) — Full interface reference
