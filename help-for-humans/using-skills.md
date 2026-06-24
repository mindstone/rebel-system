---
description: "How to find, use, and manage skills in Rebel, including built-in skills, Library browsing, and asking Rebel to add new ones"
last_updated: "2026-04-16"
---

# Using Skills

Skills are reusable instructions Rebel can follow for recurring jobs — meeting prep, research, drafting, reviews, follow-ups, and a lot besides.

Think of them as reliable workflows you can reuse instead of re-explaining yourself every time.

## Where skills live now

Skills are managed through the **Library**. Every skill comes from one of three places, and the source label tells you which:

| Source label | Where it comes from | Who it's for |
|---|---|---|
| **Built-in** | Ships with Rebel itself | Everyone gets the same set; read-only (you can't edit these, but you can copy one to customise it) |
| **A Space name** | A space's own skills — e.g. a shared team or project space | Shared with everyone who has that space |
| **Your Skills** | Skills you created or saved yourself | Personal to you |

There isn't a separate **Marketplace** tab in the current app. If you're looking for skills, start in **Library**.

### Shared "base skills" vs your own

This three-way split is what lets a team share a common way of working while still leaving room to personalise — the "base skills everyone shares, tweaked individually" idea.

- **Built-in skills** are the common foundation Rebel ships with. You can't edit them in place, but you can **Save as Copy** and adjust the copy.
- **Space skills** are how a *team* shares its own playbook. When a space lives in a shared cloud folder (a Google Shared Drive, shared Dropbox, etc.), everyone who connects that folder sees the same skills — so "how we write a weekly update" stays the same for the whole team. Update the shared skill once and everyone picks up the change.
- **Your Skills** are yours alone.

**Customising a shared skill without disrupting others:** use **Save as Copy** to make a personal version you can change freely — the shared original is untouched. If you *do* edit the shared one directly, Rebel warns you first (especially if a teammate created it) and, for team skills, asks you to confirm before the change lands for everyone — so nobody silently rewrites the team's playbook. (More on team sharing in [Teams and admin controls](library://rebel-system/help-for-humans/teams-and-admin-controls.md).)

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
- [Teams and admin controls](library://rebel-system/help-for-humans/teams-and-admin-controls.md) — sharing skills across a team and what stays personal

