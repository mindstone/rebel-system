---
description: "A friendly overview of how Rebel is built and organized for curious users"
last_updated: "2026-04-16"
---

# How Rebel Is Built

Curious about what's going on under the hood? Here's the short version.

At the centre is **Rebel Core** — Rebel's built-in, in-process runtime. It talks directly to your chosen AI provider and your connectors, and doesn't rely on a separate subprocess SDK running out of process.

## Your Workspace

When you use Rebel, everything lives in a single folder on your computer called your **workspace**. Think of it as your personal AI headquarters. Inside, you'll find:

- **Spaces** — Different areas for different parts of your life (work, personal projects, family). Each space has its own memories, skills, and settings.
- **Chief-of-Staff** — A special space that works across all your other spaces. It's where Rebel keeps track of your preferences and high-level context.
- **rebel-system** — Rebel's built-in library of skills, help docs, and instructions. This updates automatically when you update the app.

## How Rebel Remembers Things

Rebel uses a three-tier memory system:

1. **Always loaded** — The essentials: your name, current priorities, key contacts. This context is available in every conversation.
2. **On-demand** — Detailed notes about specific topics, loaded only when relevant. This keeps conversations focused without overwhelming Rebel with information.
3. **Shared knowledge** — Company or team context that everyone on your team can access.

## How Rebel Connects to Your Tools

Rebel can connect to services like Gmail, Slack, your calendar, and dozens more. These connections work through something called **connectors** (you'll see them in Settings → Connectors).

When you connect a service:
- You sign in through your browser (Rebel never sees your password)
- Rebel stores the connection locally on your device
- Your workspace files stay on your machine. When you have a conversation, your prompts go directly to your chosen AI provider (not through Mindstone)

## Skills and Workflows

Rebel comes with built-in **skills** — step-by-step instructions for common tasks like meeting prep, research, or document drafting. You can also create your own skills or customize existing ones.

Skills are just text files with clear instructions. When you ask Rebel to do something complex, it might use several skills together to get the job done.

## AI Models

Rebel is model-agnostic — it works with multiple AI providers, not just one. Most people start with one of three first-class options: **ChatGPT Pro**, **OpenRouter**, or **Anthropic**. You can also add other providers or local models later. Different models can serve different roles — one for planning, another for execution — and you can mention any model by name mid-conversation to route to it.

**See also:** [AI Models](library://rebel-system/help-for-humans/AI-models.md)

## Privacy by Design

- Your workspace files (memory, skills, documents) stay on your device
- Rebel only sends data to your chosen AI providers when you're having a conversation
- Connections to external services use industry-standard OAuth — Rebel doesn't store your passwords
- You control what's shared and what stays private through your space settings

## Learn More

- [Getting Started](library://rebel-system/help-for-humans/getting-started.md) — First-time setup
- [Product Overview and Features](library://rebel-system/help-for-humans/product-overview-and-features.md) — Complete feature reference
- [Understanding Spaces](library://rebel-system/help-for-humans/spaces.md) — How spaces work
- [Connecting Your Tools](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — Adding integrations
- [Technical Architecture](library://rebel-system/help-for-humans/architecture-technical-description.md) — Under-the-hood details for the technically curious
- [Privacy Policy](library://rebel-system/help-for-humans/Rebel-privacy-policy.md) — Full privacy details
