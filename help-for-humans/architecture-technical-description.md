---
description: "How Rebel is built under the hood: Electron architecture, privacy-first design, agent execution, voice pipeline, connectors, and security model — written for curious technical users"
---

# Technical Architecture

A look under the hood for the technically curious. Rebel is a desktop application built on Electron with a React frontend, designed around a privacy-first architecture where your workspace files stay on your device and — when you bring your own AI account — your conversations go directly to the AI model you choose, with Mindstone's servers out of the path. (On the flat-fee Mindstone plan, prompts route through Mindstone's managed AI pool to reach the model; your files and memory still stay local either way.)

---

## The Big Picture

Rebel runs as a native desktop application on macOS, Windows, and Linux. Under the hood, it's three cooperating processes:

| Process | Role | What it owns |
|---------|------|-------------|
| **Main process** | The engine room | Agent orchestration, tool execution, file operations, voice API calls, MCP server management, settings persistence |
| **Renderer** | The interface | React UI, conversation state, message queue, voice recording, keyboard shortcuts |
| **Preload bridge** | The translator | A typed API surface that connects the renderer to the main process securely |

This separation is by design. The renderer never touches the filesystem or network directly — everything goes through the preload bridge, which enforces a strict contract between what you see and what happens behind the scenes.

---

## Privacy-First Architecture

This is the most important architectural decision in Rebel: **your conversations, files, and sensitive data stay on your device — and when you use your own AI account, nothing about them flows through Mindstone.**

Here's how it works:

- **Direct model connection.** When you bring your own AI account or key, your messages go straight from your machine to the AI provider (Anthropic, OpenAI, OpenRouter, or a local model) — Mindstone's servers are not in that path. The one exception is the flat-fee Mindstone plan: there, your messages route through Mindstone's managed AI pool to reach the model. (See the [privacy policy](rebel://library/rebel-system%2Fhelp-for-humans%2FRebel-privacy-policy.md) for how that's handled; either way, your files and memory stay local.)
- **Local storage.** Conversations, memory, files, and settings are stored on your device. Rebel uses a local database (SQLite) for search indexes and `electron-store` for settings and session history.
- **Local embeddings.** When Rebel indexes your files for semantic search, it uses a local embedding model (BGE) running on your machine — no cloud calls needed. GPU acceleration is used when available.
- **Connector tokens stay local.** When you connect services like Gmail or Slack, the OAuth tokens live on your device. Rebel connects directly to those services from your machine.
- **Optional backend.** A lightweight backend (Rebel Platform) handles authentication, licence management, and optional admin configuration for teams. It does not process or store your conversations.

The only data that leaves your machine during a conversation is what gets sent to the AI model you've chosen — and you pick the model.

---

## How Conversations Work

When you send a message, here's the sequence:

1. **You type or speak.** The renderer captures your input (text or transcribed audio) and sends it through the preload bridge.
2. **The main process takes over.** It assembles a system prompt (combining platform context, your profile, space-specific instructions, and dynamic metadata like the current date), attaches your message, and sends everything to the AI model you've chosen.
3. **The model responds.** As tokens stream back, the main process dispatches events to the renderer: status updates, assistant text chunks, tool usage hints, and final results with token counts.
4. **Tools execute.** If the model wants to use a tool (read a file, search your email, check your calendar), the request goes through Rebel's safety layer before execution. More on that below.
5. **The renderer updates.** Your conversation view updates in real time as events arrive.

### Message Queue

You don't have to wait for Rebel to finish before sending another message. The renderer maintains a message queue:

- **Queue mode** (default while Rebel is working): your message waits in line and gets processed when the current turn finishes.
- **Interrupt mode**: stops the current turn and processes your message immediately.

This is purely a frontend concern — the main process sees each queued message as a normal turn, and the AI model maintains context continuity.

### Session Continuity

Conversations persist across app restarts. When you reopen a conversation, Rebel restores the full message history and reconnects to the upstream model session (when supported by the provider) so context isn't lost. Safety rails prevent restoring very old sessions or overwriting conflicting state — if resume fails, it falls back gracefully to a fresh session.

---

## The Agent Model

Rebel uses one built-in engine for every conversation. It handles planning, tool use, context management, and streaming in a single system — so behaviour is consistent and improvements reach everyone at once.

Each conversation turn is an "agent turn" — the model can think, respond, call tools, and loop as many times as needed to complete a task.

### Model Flexibility

Rebel defaults to Claude (latest Sonnet) but isn't tied to one model or provider. It supports:

- **Anthropic models** via your Anthropic API key
- **OpenAI models** via ChatGPT Pro (your OpenAI sign-in) or an API key
- **OpenRouter** — one account reaching Claude, GPT, Gemini, DeepSeek, Grok, and more
- **Local models** via Ollama, LM Studio, llama.cpp, or any OpenAI-compatible endpoint (including company gateways)

You can bring your own accounts and keys — Rebel doesn't charge per token; you pay the provider directly — or choose a flat-fee Mindstone plan where Mindstone covers the AI bill. See [AI models](rebel://library/rebel-system%2Fhelp-for-humans%2FAI-models.md).

### Context Engineering

Rebel assembles a composite system prompt for every turn, combining:

- **Platform instructions** — Rebel's core behaviour guidelines
- **Your profile** — From your Chief-of-Staff README (name, role, preferences, priorities)
- **Space context** — Skills, memory, and instructions relevant to the active space
- **Dynamic metadata** — Current date/time, active connectors, platform info
- **Conversation history** — Previous messages and tool results

Semantic search (`@files` in the composer) uses hybrid vector + keyword matching to pull relevant files into context on demand.

---

## Voice Pipeline

Rebel is designed voice-first. The voice system has two independent modes:

### Listen (Speech-to-Text)
- **Providers:** OpenAI Whisper (default), ElevenLabs Scribe, or local Parakeet
- **Flow:** Renderer records audio → sends via IPC → main process calls STT provider → transcribed text returned to renderer
- **Custom vocabulary:** You can teach Rebel domain-specific terms (product names, people, acronyms) for better accuracy
- **Global hotkey:** Activate voice from anywhere on your system (default: Ctrl+Alt+Space), with automatic screenshot capture for context-aware questions

### Speak (Text-to-Speech)
- **Providers:** OpenAI TTS (default), ElevenLabs
- **Flow:** Main process sends text to TTS provider → audio chunks stream back to renderer → played in real time
- **Streaming:** Responses start playing before generation finishes, so there's no awkward silence

Voice is entirely optional. Text input and output are fully supported as first-class alternatives.

---

## Connectors (MCP)

Rebel connects to external services through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io) — an open standard for AI-to-tool communication.

### How It Works

When you enable a connector (Settings → Connectors), Rebel registers it as an MCP server. During a conversation, if the AI model decides it needs information from that service, it calls the appropriate MCP tool — and Rebel executes it.

### SuperMCP Router

By default, all MCP servers are accessed through a single HTTP router called SuperMCP. This provides:

- **Concurrency safety** — Multiple tools can execute simultaneously without conflicts
- **Centralised configuration** — One endpoint manages all connected services
- **Health monitoring** — SuperMCP runs health checks and recovers from failures

The router starts automatically when Rebel launches and handles all tool traffic. Direct MCP mode (bypassing the router) exists as a diagnostic escape hatch.

### Connector Catalog

Rebel ships with 75+ connectors across categories:

| Category | Examples |
|----------|----------|
| **Communication** | Slack, Outlook Mail, Teams, Intercom |
| **Productivity** | Google Workspace, Notion, Asana, Jira, monday.com, Todoist |
| **Analytics** | BigQuery, Looker, Metabase, PostHog |
| **Storage** | OneDrive, SharePoint, Box, Dropbox |
| **Sales** | HubSpot, Salesforce, Affinity CRM |
| **Development** | GitHub, Sentry, Linear, PostgreSQL |
| **Design** | Canva, Miro, Figma, Framer |
| **Payments** | Stripe, PayPal, Xero |

Authentication uses industry-standard OAuth — you sign in through your browser, and Rebel stores the token locally.

---

## Workspace and File Operations

Rebel works against a folder on your local filesystem called your **workspace**. Inside, you organise content into Spaces — each with its own skills, memory, and sharing settings.

### What Rebel Can Do

- **Read and write files** — Markdown, text, and other common formats
- **Build file trees** — Navigable workspace browser with depth limits and symlink-cycle protection
- **Semantic search** — Find files by meaning using local embeddings (hybrid vector + BM25 keyword matching)
- **Create, rename, delete** — Full file management within your workspace boundary

### What Rebel Can't Do

- Access files outside your configured workspace
- Execute arbitrary code on your machine (tool calls go through the safety layer)
- Modify system files or settings

All file operations enforce that targets live within the workspace root — path traversal attempts are blocked.

---

## Safety Model

Rebel has layered safety mechanisms:

### Tool Safety
Before executing any tool call, Rebel evaluates it against your Safety Rules (natural language rules you write in Settings → Account & Preferences → Privacy & Safety). Read-only actions auto-allow. Side-effect actions are evaluated by a fast AI model against your rules. If the rules allow it, Rebel proceeds. If not, you get an approval prompt. You can also mark specific tools as 'trusted' to bypass safety checks entirely.

### Memory Safety
When Rebel wants to save something to your memory spaces, it goes through an approval flow with per-space save permissions (configured under Settings → Account & Preferences → Privacy & Safety). Shared spaces have a floor — Rebel still checks sensitivity before writing to company-wide memory, regardless of your personal setting. See [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md) for the user-facing explanation of the approval flow.

### Privacy Mode
A per-conversation toggle that tightens all safety checks. In Privacy Mode, Rebel requires your approval for all writes and tool calls — the most cautious setting.

---

## Persistence and Data Storage

| What | Where | Format |
|------|-------|--------|
| **Settings** | `electron-store` (app data directory) | JSON |
| **Conversations** | `electron-store` (separate store, versioned) | JSON |
| **Workspace files** | Your chosen workspace folder | Markdown, text, etc. |
| **Search index** | Local database | SQLite with vector embeddings |
| **Connector tokens** | Local keychain / credential store | Encrypted |
| **Action items** | `electron-store` (separate store) | JSON |

The app data directory location varies by platform — see [Where Rebel Stores Things](library://rebel-system/help-for-humans/where-rebel-stores-things.md) for specifics.

---

## Bundled Runtime

Rebel ships with a full Node.js runtime so connectors work without requiring you to install anything extra. MCP servers that need Node.js or npm packages run against this bundled runtime, not your system installation.

---

## Learn More

- [How Rebel Is Built](library://rebel-system/help-for-humans/how-rebel-is-built.md) — Simpler overview of workspaces, memory, and connectors
- [How Rebel Works](library://rebel-system/help-for-humans/how-it-works.md) — Mental model: conversations + spaces + skills + connectors + memory + safety
- [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md) — Detailed safety model
- [Connectors and Tools](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — Full connector guide
- [AI Models](library://rebel-system/help-for-humans/AI-models.md) — Supported models and configuration
- [Where Rebel Stores Things](library://rebel-system/help-for-humans/where-rebel-stores-things.md) — Data locations by platform
- [Voice and Audio](library://rebel-system/help-for-humans/voice-and-audio.md) — Voice pipeline details
