---
description: "User-facing guide to where memory belongs, how sensitivity markers work, and what approval buttons mean when Rebel wants to save something"
last_updated: "2026-07-26"
---

# Memory Folders and Approvals

Rebel remembers useful things by saving them into the right place inside each space.

The short version:
- **`README.md`** = the most important context Rebel should keep top-of-mind
- **`memory/topics/`** = reusable notes and background knowledge
- **`memory/sources/`** = original material like transcripts, captured docs, and raw source files

## See also

- [Spaces](rebel://library/rebel-system%2Fhelp-for-humans%2Fspaces.md)
- [Privacy Mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fprivacy-mode.md)
- [Where Rebel stores things](rebel://library/rebel-system%2Fhelp-for-humans%2Fwhere-rebel-stores-things.md)
- [Memory System Tutorial](rebel://library/rebel-system%2Fhelp-for-humans%2Ftutorials%2F251216a_rebel-memory-system-tutorial.html)

## First-time setup: what goes where?

If you are new to Rebel, this is the easiest way to think about it:

| Put it here | Use it for | Good examples |
|---|---|---|
| **Space `README.md`** | Short, high-value context Rebel should remember often | who you are, how you like to work, team norms, current priorities |
| **`memory/topics/`** | Reusable knowledge that matters, but does not need to load every single time | project notes, people profiles, recurring decisions, research summaries |
| **`memory/sources/`** | Original material Rebel may want to cite or revisit later | meeting transcripts, imported docs, captured web pages, raw notes |

### A simple rule of thumb
- Put the **headline version** in `README.md`
- Put the **fuller reusable version** in `memory/topics/`
- Put the **original source material** in `memory/sources/`

If you only remember one thing: keep `README.md` short and useful. It is the front door, not the garage.

## Memory sensitivity markers

Inside a memory topic file, you can use headings to make sharing boundaries obvious.

### `## PERSONAL`
Use this for information that should stay private to you.

Examples:
- salary, equity, or finances
- health or family matters
- private reflections
- sensitive personal preferences

### `## SPACE-SHAREABLE`
Use this for information that is safe to share with the people who already have access to that space.

Examples:
- project status
- meeting takeaways for that team
- client facts that are appropriate for that shared space
- working decisions the space should remember

### When to use these markers
Use them when one file contains a mix of private and shareable material.

If everything in the file has the same sensitivity, keep it simple — you do not need headings just for the theatre of it.

If you are unsure, treat it as private first and share later on purpose.

## How automatic memory updates work

Rebel can update memory after a conversation when it spots something genuinely worth keeping. You do not have to save every note by hand.

Your saving preferences are lines in your [Safety Rules](rebel://settings/safety#safetyRules); read and edit them there. Your previous Space choices have moved into that document. Spaces with the same name are identified by their folder.

Rebel normally saves routine notes to private Spaces without asking. A rule that names a Space or destination adds a check, even when the rule permits saving there. Team and shared Spaces are checked against your rules and the Space's description. If the check can't give an answer, a routine save to a team Space still goes ahead while you're chatting. An automation's save also goes ahead and is noted under **Recent activity** in Privacy & Safety. A memory update Rebel makes in the background waits for you. If your rules name that Space, or it's shared outside the company, Rebel asks you first whenever the check can't answer.

If you had set a Space to always ask before saving, that choice is now a line in your Safety Rules, and the safety check follows it. [Privacy Mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fprivacy-mode.md) keeps saves waiting for your approval.

### What something specific looks like

When Rebel spots something specific, the approval card says **what** it is worried about — for example, something that looks like a password or key, personal details, or account and security information. You get a reason to review, not a vague raised eyebrow.

Built-in checks for passwords and keys run alongside your Safety Rules, in private Spaces as well as shared ones. That means a document containing an obviously fake example key can still trigger a review card. The check is being cautious about the shape of the text; approve that save and move on. Meeting transcripts saved to your own private Space skip this check.

If a destination already has a save waiting for review, later saves to the same place keep asking until you clear the pending card. This prevents a newer save from quietly stepping around an earlier decision.

## Where approvals appear now

When Rebel needs your OK, you will usually see a bar at the bottom of the conversation saying:

**"Rebel paused. X actions need your OK"**

Click **View** to open the notification drawer and review the pending items.

## The button labels you will see

There are two common memory approval flows.

### 1) Staged memory files
This is the most common cautious path. Rebel saves the draft safely first, then asks you what to do with it.

Buttons you may see:
- **Allow** — publish the memory to its intended space
- **Deny** — keep it out of that target space and save it privately instead
- **Preview** — open the full diff before deciding
- **Allow All / Deny All** — batch actions when several staged files are waiting

If your safety rules were the reason Rebel stopped, you may also see:
- **Allow & choose rule update…**
- **Deny & choose rule update…**

### 2) Direct memory approvals
Sometimes Rebel needs an immediate yes/no decision instead of the staged-file route.

Buttons you may see:
- **Save** — save it to the target memory location
- **Keep private** — save it privately instead
- **Discard** — do not save it anywhere
- **Preview** — inspect the content first

## Getting too many approval cards?

- **Edit your saving preferences.** Open [Safety Rules](rebel://settings/safety#safetyRules) and change the line for the Space. Settings → Spaces also links there.
- **Review each waiting save.** The “Ask less” shortcut has gone. For now, in-Library save cards let you allow the save once or decline it; saved Space permissions arrive in a later update.
- **Check what happened without a card.** **Recent activity** under **[What Rebel can do](rebel://settings/safety#approvalAuthorityLedger)** shows what Rebel saved without asking and why.

## Where staged files live before you decide

When Rebel stages a memory write for review, it puts the draft in:

`Chief-of-Staff/memory/pending/`

That means:
- nothing is silently lost
- pending memory stays in your private area until you decide
- you can review it before it moves into a shared space

If a save would overwrite something that changed in the meantime, Rebel shows you the conflict instead of quietly bulldozing it.

## Privacy Mode changes the rules

When [Privacy Mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fprivacy-mode.md) is on, Rebel asks before **every** memory save — even in spaces that would normally save automatically.

Use it when you want maximum control for sensitive work. You can toggle it from [Settings → Privacy & Safety](rebel://settings/safety).

## Best practice for sources

Use `memory/sources/` for original material, then let `memory/topics/` point back to it rather than copying everything across.

That gives you:
- cleaner topic files
- easier tracing back to the original
- less duplicated clutter

A transcript is a source. A distilled summary of what matters from that transcript is a topic.

When you ask Rebel to share part of a source with another space, it prefers the least-rewritten version that is safe to share. When the private and shareable parts are cleanly separate, Rebel can prepare a **partial copy** of the original for you to review — the real words, with the removals shown — because the original can't misremember. When they're woven together, a summary is safer. Either way, Rebel shows you the result in the conversation and waits for your approval before saving anything.
