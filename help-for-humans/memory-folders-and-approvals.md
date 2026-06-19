---
description: "User-facing guide to where memory belongs, how sensitivity markers work, and what approval buttons mean when Rebel wants to save something"
last_updated: "2026-06-04"
---

# Memory Folders and Approvals

Rebel remembers useful things by saving them into the right place inside each space.

The short version:
- **`README.md`** = the most important context Rebel should keep top-of-mind
- **`memory/topics/`** = reusable notes and background knowledge
- **`memory/sources/`** = original material like transcripts, captured docs, and raw source files

## See also

- [Spaces](spaces.md)
- [Privacy Mode](privacy-mode.md)
- [Where Rebel stores things](where-rebel-stores-things.md)
- [Memory System Tutorial](tutorials/251216a_rebel-memory-system-tutorial.html)

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

Depending on the space and your safety settings, Rebel may:
- save it automatically
- ask only when it looks sensitive
- ask every time

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

## Where staged files live before you decide

When Rebel stages a memory write for review, it puts the draft in:

`Chief-of-Staff/memory/pending/`

That means:
- nothing is silently lost
- pending memory stays in your private area until you decide
- you can review it before it moves into a shared space

If a save would overwrite something that changed in the meantime, Rebel shows you the conflict instead of quietly bulldozing it.

## Privacy Mode changes the rules

When [Privacy Mode](privacy-mode.md) is on, Rebel asks before **every** memory save — even in spaces that would normally save automatically.

Use it when you want maximum control for sensitive work. You can toggle it from [Settings → Privacy & Safety](rebel://settings/safety).

## Best practice for sources

Use `memory/sources/` for original material, then let `memory/topics/` point back to it rather than copying everything across.

That gives you:
- cleaner topic files
- easier tracing back to the original
- less duplicated clutter

A transcript is a source. A distilled summary of what matters from that transcript is a topic.
