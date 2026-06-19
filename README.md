# README for Mindstone Rebel

Welcome to the Rebel system — the skills, help docs, templates, and guidance that make [Rebel](https://mindstone.com) useful. The Rebel app installs and maintains this folder on your machine; it is the system your AI works from.

> **Note**: This README is for human readers. AIs should read [AGENTS.md](AGENTS.md).

- [README for Mindstone Rebel](#readme-for-mindstone-rebel)
  - [Quick Start](#quick-start)
  - [Background \& Versions](#background--versions)
  - [What's Inside](#whats-inside)
    - [Skills](#skills)
    - [Documentation](#documentation)
  - [Infrastructure](#infrastructure)
  - [Getting Help](#getting-help)


---

## Quick Start

**New to Mindstone Rebel?** See [getting-started.md](help-for-humans/getting-started.md) for step-by-step setup instructions, or [251023b_rebel_getting_started.html](help-for-humans/tutorials/251023b_rebel_getting_started.html) for a friendly tutorial that explains everything in plain English.

**Already set up?** Jump to:
- **[Coding Setup with Python](help-for-humans/coding-setup-with-Python.md)** - Set up Python and virtual environments
- **[Skills Directory](skills/)** - Browse available AI skills


## Background & Versions

This folder contains **v3** of Rebel system instructions. Earlier versions lived in shared folders and external IDE workspaces; this version is delivered by Rebel and keeps the same skills/memory/scripts ideas with a simpler layout.

- **v1 – shared-folder pilot**: Combined personal and team context in one writable shared workspace. Useful for early iteration, but too broad for multi-company or public distribution.
- **v2 – read-only core with zones**: Introduced a managed core and separate zones for different contexts, plus multi-root IDE workspaces. It improved separation but made hierarchy hard to reason about.
- **v3 – Rebel system (this repo)**: Uses a single Rebel workspace with:
  - a `rebel-system/` core folder containing platform instructions and skills (read-only for most users), and
  - one or more **spaces** that represent sharing boundaries such as personal, company-wide, project, or family contexts.

The current model keeps `skills/`, `memory/`, and `scripts/` familiar while using shallow links only to connect external folders as spaces.

Older personal/team context can map to separate spaces or subfolders within a larger space (for example `work/company1/memory/[TEAMNAME]/`). Older `ABOUTME.md` and `AUTOLOAD.md` roles are now usually captured by one `README.md` per space.

Terminology has also evolved:
- We've moved from separate `scratchpad` and `background` areas into a unified `memory/` folder that can hold a mix of user-provided files/background, AI output, summaries, and insights.
- We now call all instruction `.md` files **skills** (formerly **playbooks**) – they describe how to perform actions or workflows.


## What's Inside

### Skills
- **`skills/`** - technical skills organized by category: documentation, system, research, thinking, meetings, memory, utilities, communication

### Documentation
- **[getting-started.md](help-for-humans/getting-started.md)** - first-time setup guide
- **[251023b_rebel_getting_started.html](help-for-humans/tutorials/251023b_rebel_getting_started.html)** - friendly getting started tutorial
- **[Rebel-interface.md](help-for-humans/Rebel-interface.md)** - Rebel as the primary interface and setup links
- **[where-rebel-stores-things.md](help-for-humans/where-rebel-stores-things.md)** - where the core lives and where the app stores per-user data
- **[External IDE](help-for-humans/external-IDE-OBSOLETE/)** - Cursor and Claude Code setup (for developers)
- **[space-shared-folders.md](help-for-humans/space-shared-folders.md)** - connect shared folders as Spaces (Google Drive, OneDrive, Dropbox, Box)
- **[google-drive-desktop-local-sync.md](help-for-humans/google-drive-desktop-local-sync.md)** - Google Drive-specific setup (linked from the page above)
- **[mcp-connectors-tools-and-integrations.md](help-for-humans/mcp-connectors-tools-and-integrations.md)** - Notion, Gmail, Linear integrations

---

## Infrastructure

> See [getting-started.md](help-for-humans/getting-started.md) for step-by-step setup instructions.

**Core system delivery**: The Rebel desktop app installs and keeps this system up to date on your machine. You’ll see a `rebel-system/` folder in your workspace that points to a local, read‑only copy managed by the app.

**Interface**: The Rebel desktop app is the primary UI. Cursor or Claude Code are supported alternatives (the experience may be degraded vs Rebel due to missing app-level capabilities). See [Rebel-interface.md](help-for-humans/Rebel-interface.md). For external IDE setup, see [external-IDE-OBSOLETE/](help-for-humans/external-IDE-OBSOLETE/).

**MCPs**: Connect to external tools (Notion, Gmail, Linear, etc.). See [mcp-connectors-tools-and-integrations.md](help-for-humans/mcp-connectors-tools-and-integrations.md).

**Company documents (optional)**: Your own company files may live in Google Drive or other storage providers. Start with [space-shared-folders.md](help-for-humans/space-shared-folders.md) for how to connect shared folders as Spaces; that page links to provider-specific docs like [google-drive-desktop-local-sync.md](help-for-humans/google-drive-desktop-local-sync.md).

---

## AGENTS.md Template Variables

The `AGENTS.md` file is a Nunjucks template. These variables are available for dynamic content:

### User Content
| Variable | Description |
|----------|-------------|
| `{{ chiefOfStaffMd }}` | Content of Chief-of-Staff/README.md |

### Environment Context
| Variable | Example |
|----------|---------|
| `{{ env.date }}` | "2025-12-09 (Monday)" |
| `{{ env.timeOfDayBucket }}` | late_night / morning / afternoon / evening / night |
| `{{ env.timezone }}` | "Europe/London (+00:00)" |
| `{{ env.locale }}` | "en-GB" |
| `{{ env.platform }}` | "darwin 23.6.0 (arm64)" |
| `{{ env.appVersion }}` | "0.2.25" |
| `{{ env.buildChannel }}` | dev / beta / stable |
| `{{ env.workspacePath }}` | Full path to workspace |
| `{{ env.mcpConfigPath }}` | Path to MCP config |
| `{{ env.model }}` | "claude-sonnet-4-20250514" |
| `{{ env.permissionMode }}` | "default" |
| `{{ env.voiceProvider }}` | "openai-whisper" |
| `{{ env.isOnboarding }}` | true / false |
| `{{ env.spaces }}` | Array of {name, path, description, type, sharing} |

### Conditionals
```
{% if env.isOnboarding %}...{% endif %}
{% for space in env.spaces %}{{ space.name }}{% endfor %}
```

---

## Getting Help

Questions or issues? Open a GitHub issue or use your normal Rebel support route.

We're doing something ambitious and experimental - it's totally normal to need help getting started!
