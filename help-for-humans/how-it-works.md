---
description: "A friendly overview of how Rebel works: conversations, spaces, skills, connectors, memory, and safety features"
last_updated: "2026-05-11"
---

# How Rebel Works

Rebel is your AI assistant for getting work done. Think of it as a capable colleague who can access your files, tools, and knowledge—while always asking before doing anything risky.

Under the hood, Rebel runs on **Rebel Core** — the app's built-in, in-process runtime. It talks directly to your chosen AI provider and your connectors, rather than handing the job off to a separate subprocess SDK in the background.

Here's the mental model: **Conversations + Spaces + Skills + Connectors + Memory + Safety**

In daily use, you'll mostly move between the [Homepage](rebel://usecases), [Actions](rebel://tasks), and [Automations](rebel://automations): the Homepage shows what needs attention, Actions holds saved work, and Automations handles recurring jobs in the background.

---

## Conversations

Where you interact with Rebel. Each conversation has its own history, so you can pick up where you left off. Start fresh or continue an old thread—your choice. When Rebel needs clarification — whether before starting a complex task or partway through — it asks structured questions right in the conversation. Pick an option or type your own answer.

For straightforward questions where Rebel already has enough context, it answers directly without going through its full planning phase — faster responses for simple asks.

When Rebel needs to handle multiple independent tasks at once — say, researching three different topics in parallel — it spins up sub-agents simultaneously. You'll see a **"Running N parallel tasks"** banner at the top of the conversation while the burst is in flight. There's a cap on how many run at once so your computer stays responsive.

---

## Spaces

Organized areas for different parts of your work. Think of them as folders with superpowers: each space can have its own skills, memory, and sharing settings. Your Chief-of-Staff space is personal; you might have shared team spaces too.

**See also:** [Understanding Spaces](library://rebel-system/help-for-humans/spaces.md)

---

## Skills

Reusable instructions that tell Rebel how to handle specific tasks—like meeting prep, writing documentation, or research workflows. Skills save you from explaining the same process repeatedly.

**See also:** [Using Skills](library://rebel-system/help-for-humans/using-skills.md)

---

## Connectors

Tools that let Rebel access external services: Slack messages, Gmail inbox, calendar events, Notion pages, and more. Connect what you need in Settings → Connectors.

**See also:** [Connectors and Tools](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md)

---

## Memory

What Rebel learns about you over time—your preferences, ongoing projects, key context. Memory lives in your spaces, organized into topics that Rebel can reference when relevant.

**See also:** [Understanding Memory](library://rebel-system/help-for-humans/memory-folders-and-approvals.md)

---

## Safety

Rebel asks permission before doing anything potentially risky. You write Safety Rules — natural language rules that tell Rebel what needs your approval. Rebel checks every tool action and memory write against your rules. Privacy Mode gives you even more control when needed.

**See also:** [Permissions](library://rebel-system/help-for-humans/permissions.md) | [Privacy Mode](library://rebel-system/help-for-humans/privacy-mode.md)

---

## AI Models

Rebel works with multiple AI providers — not just one. During setup, most people start by choosing a provider card for **ChatGPT Pro**, **OpenRouter**, or **Anthropic**. You can switch later, add more models if you want, and mention a model by name mid-conversation when you want Rebel to route part of the job there.

The **Usage** dashboard in Settings shows exactly where your spend goes — broken down by conversation, model, and category. If you're on a subscription, it separates what's covered by your plan from any per-token costs, so there are no surprises.

**See also:** [AI Models](library://rebel-system/help-for-humans/AI-models.md)

---

## Going Deeper

- [Product Overview and Features](library://rebel-system/help-for-humans/product-overview-and-features.md) — Complete feature reference and comparisons
- [How Rebel Is Built](library://rebel-system/help-for-humans/how-rebel-is-built.md) — Workspace, memory, and privacy overview
- [Technical Architecture](library://rebel-system/help-for-humans/architecture-technical-description.md) — Under-the-hood details for the technically curious

