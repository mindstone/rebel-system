---
description: "Setup guide for Cursor IDE, the desktop app used for accessing and running Mindstone Rebel, including installation, configuration, extensions, and tips for working with AI and Markdown files"
---

# Cursor Setup Guide

**Note**: [Rebel](Rebel-interface.md) is now our primary interface for Mindstone Rebel. Cursor is a powerful but less user-friendly alternative, primarily for developers and advanced users.

Cursor is a developer IDE that can be used for accessing & running Mindstone Rebel, i.e. for browsing/editing the files and for running agentic AI.

Why Cursor? It allows you to choose different AI models, connect to any MCP, edit files on your hard disk, run custom code, and lots of other useful features and customisation. It's the same editor app that the developers use for editing code.

Cursor takes a little bit of getting used to, but you will eventually get the hang of it if you perservere, and you can _always_ ask for help.

**Privacy**: For detailed information about data collection, privacy modes, and security practices, see [`Cursor-Privacy-Policy`](Cursor-Privacy-Policy.md).


- [References](#references)
- [Quickstart](#quickstart)
- [Tips](#tips)
- [Configuration files](#configuration-files)


## References

This guide focuses on Cursor-specific setup. For general Mindstone Rebel information, see [`../README.md`](../skills/README.md).

- [`Rebel-interface.md`](Rebel-interface.md) - **Primary interface** for most users (voice-first, user-friendly)
- [`where-rebel-stores-things.md`](../where-rebel-stores-things.md) - where the core lives and where the app stores per-user data
- [`../README.md`](../skills/README.md) - main Mindstone Rebel overview
- [`space-shared-folders.md`](space-shared-folders.md) - connect shared folders as Spaces; links to provider-specific guides
- [`AI-models.md`](AI-models.md) - for picking the right model for your task
- [`mcp-connectors-tools-and-integrations.md`](mcp-connectors-tools-and-integrations.md) - connecting to external tools
- [`Cursor-Privacy-Policy`](Cursor-Privacy-Policy.md) - comprehensive privacy practices, data handling, and security measures


## Quickstart

Getting Cursor setup initially on your machine:

1. **Download & Install**: Get [Cursor](https://cursor.com/download)
2. **Open Workspace**: Open Cursor in your Google Drive Mindstone Rebel folder (containing `README.md`)
3. **Install Extensions**: Say yes when prompted for extensions (Markdown All in One, Foam, PDF reader)

Then to run a skill:

1. **Open AI Pane**: Click the Toggle AI Pane button (top-right, looks like a partly-open white box)
2. **Try a demo**:
   ```
   Run @demo-example-horoscope-skill.md with @random_md_picker.sh
   ```

## What You Lose vs Rebel

Cursor is a capable alternative, but you'll miss some Rebel features:

- **No automatic system prompt** — Rebel auto-composes context from platform, persona, spaces, and runtime metadata; in Cursor you configure manually or not at all
- **No memory persistence** — Rebel remembers you across sessions; Cursor starts fresh each time
- **No tool/memory safety** — Rebel evaluates risk and asks before risky operations
- **No automations** — No scheduled recurring agent runs
- **No voice interaction** — No Listen or Speak modes
- **No meeting transcription** — No Rebel Notetaker
- **No Actions, Scratchpad, or Spark** — Deferred tasks, quick capture, and coaching insights are Rebel-only
- **No Privacy Mode** — Per-session sensitivity toggle
- **No guided onboarding** — Interactive tutorials

For a full comparison with ChatGPT, Claude.ai, and other alternatives, see **[Why Rebel?](../why-rebel.md)**

**Note**: You can use both! Rebel and Cursor open the same workspace. Some users prefer Rebel for meetings and research, Cursor for intensive coding.


## Tips

- **@ Mentions**: Use `