---
description: "How to find, use, and manage skills in Rebel, including built-in skills, Library browsing, and asking Rebel to add new ones"
last_updated: "2026-04-16"
---

# Using Skills

Skills are reusable instructions Rebel can follow for recurring jobs — meeting prep, research, drafting, reviews, follow-ups, and a lot besides.

Think of them as reliable workflows you can reuse instead of re-explaining yourself every time.

## Where skills live now

Skills are managed through the **Library**.

In the Skills view, you'll usually see source labels such as:

- **Built-in** — skills that ship with Rebel
- **Your Skills** — skills you've created or saved yourself
- **A Space name** — skills coming from a shared team or project space

There isn't a separate **Marketplace** tab in the current app. If you're looking for skills, start in **Library**.

## Three common ways to get a skill

### 1. Use a built-in skill

Rebel already includes plenty of skills out of the box.

Open **Library**, browse **Skills**, and look for items labeled **Built-in**.

### 2. Open a skill from your Library

If you or your team already have skills, they'll appear in Library too — usually under **Your Skills** or the name of the relevant space.

### 3. Ask Rebel to add one

If you need a skill and don't already have it, just ask.

For example:

- “Find me a good meeting-prep skill”
- “Add a skill for weekly customer updates”
- “Turn this workflow into a reusable skill”

Rebel can help add a suitable skill to your Library or create one for you if needed.

## Running a skill

### From a conversation

The simplest method is just to ask for it.

For example:

```text
Run the meeting prep skill for my call with Sarah at TechCorp
```

If Rebel recognises the skill, it will use it. If not, it will usually still understand what you're trying to do and work from there.

### From Library

1. Open **Library**
2. Open **Skills**
3. Browse or search for the skill you want
4. Open it to read what it does
5. Ask Rebel to use that skill for your task

Library is best when you want to inspect the skill before using it, compare options, or edit one later.

## Skill version history

Skills keep version history, which is exactly what it sounds like: a safety net for edits.

### What you can do

- See **when** a skill changed
- See **who** changed it
- Compare old and new versions
- **Restore** an older version
- **Save as Copy** if you want to branch off without touching the original

### Shared skill checkpoints

If a shared skill changes, Rebel can ask you to review it before the update takes effect. That helps teams avoid mysterious workflow changes showing up unannounced.

## Running skills in Cursor or Claude Code

Skills still work there — they're just markdown files.

Typical flow:

1. Open your AI pane
2. Reference the skill file with `@`
3. Ask the tool to use it

Example:

```text
Run @`skills/meetings/meeting-prep/SKILL.md` for my call with Sarah at TechCorp
```

## Tips

- Start with **Built-in** skills if you're not sure where to begin
- Use **Library** when you want to browse, compare, or inspect skills
- Ask Rebel to **create a skill** when you find yourself repeating the same workflow
- Ask Rebel to **add/install a skill** when you know what you want but don't want to manage the files yourself

## See also

- [AI Models](library://rebel-system/help-for-humans/AI-models.md) — choosing the right model for the job
- [Connectors & Integrations](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — connecting Rebel to external tools

