---
description: "How to find, use, and manage skills in Rebel, including built-in skills, Library browsing, and asking Rebel to add new ones"
last_updated: "2026-11-03"
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

- **Built-in skills** are the common foundation Rebel ships with. You can't edit them in place, but you can ask Rebel for a personal version to customise.
- **Space skills** are how a *team* shares its own playbook. When a space lives in a shared cloud folder (a Google Shared Drive, shared Dropbox, etc.), everyone who connects that folder sees the same skills — so "how we write a weekly update" stays the same for the whole team. Once the shared skill is updated, everyone picks up the change.
- **Your Skills** are yours alone.

**Customising a shared skill without disrupting others:** ask Rebel for a personal version (a personal extension) that changes how the skill works just for you.

When you edit someone else's shared skill with a recorded owner, Rebel sends your changes as a suggestion for them to review. Until it's accepted, everyone keeps using the original. Reopening the skill carries on from your sent suggestion. Your own skills, and older skills with no recorded owner, still save directly. In Spaces shared through Rebel, Space managers can also edit directly. See [Reviewing suggestions](#reviewing-suggestions) below for who can decide and where. More on sharing: [Teams and admin controls](rebel://library/rebel-system%2Fhelp-for-humans%2Fteams-and-admin-controls.md).

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
- **Restore** an older version — for someone else's shared skill, this sends a suggestion under the same ownership rule as editing
- Ask Rebel for a **personal version** if you want changes just for you

### Reviewing suggestions

Rebel automatically records who added a skill. That person is its owner and can review suggestions in the desktop app: click the notification bell (**Show notifications**), then look under **Skill updates** in **Notifications**. Choose **Review** to compare the current skill with the proposed changes, then **Accept** to update it for everyone, or **Decline** to leave it as it is. In Spaces shared through Rebel, which have manager roles, Space managers can accept or decline too. Accepting and declining aren't available on the phone or web yet.

In other Spaces, only the skill's owner can decide. If they've left the Space, the original can't be updated through Rebel's skill editor until they return. You can still use the skill or ask Rebel for a personal version — changes just for you, while everyone else keeps the shared version.

This covers edits to the skill's own file (`SKILL.md` for a folder skill, or a single-file skill), including most edits Rebel makes for you. Other files in a skill's folder save directly. Deleting, renaming or moving a skill, terminal commands, connectors that change files directly, and edits outside Rebel can also change the original without a suggestion.

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

