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

Rebel's per-space memory safety ladder has four settings. Shared spaces use one of the three asking options; **Save without asking** is for your own private spaces.

| Setting | What it means |
|---|---|
| **Save without asking** | Rebel saves to this space automatically. |
| **Ask only when Rebel spots something specific** | Rebel saves routine updates on its own and asks only when it spots something specific, such as a password or personal details. |
| **Ask whenever Rebel is unsure** | Rebel checks with you whenever it is not fully confident, even when it cannot point to anything specific. This is the default for shared spaces. |
| **Always ask before saving** | Every save to this space needs your OK. |

A safety check that cannot complete can still ask rather than guess. [Privacy Mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fprivacy-mode.md) also overrides these settings and asks before every memory save.

### What a specific concern looks like

When Rebel spots a specific concern, the approval card says **what** it is worried about — for example, something that looks like a password or key, personal details, or account and security information. You get a reason to review, not a vague raised eyebrow.

In shared spaces, built-in checks for passwords and keys run whatever setting you choose. That means a document containing an obviously fake example key can still trigger a review card. The check is being cautious about the shape of the text; approve that save and move on. Your own private space is exempt from this built-in credential check, though its chosen setting or Privacy Mode may still ask.

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

- **Choose fewer routine check-ins for a busy shared space.** Open [Settings → Safety](rebel://settings/safety), find the space under **Memory Spaces**, and choose **Ask only when Rebel spots something specific**. Rebel will still ask when it spots something specific. You can also open **Settings → Spaces** and use **Open Privacy & Safety → Memory Spaces** at the bottom of the Spaces section.
- **Ask less about a space from the card.** A card for a space set to **Ask whenever Rebel is unsure** can offer **Only ask when Rebel spots something specific?** Choose it to update that space without leaving the card. The save in front of you still needs its own decision.
- **Remember recurring saves.** When a card offers **Allow and remember…**, use it to teach Rebel the rule instead of approving the same kind of save repeatedly.
- **Check what happened without a card.** The Activity log in [Settings → Safety](rebel://settings/safety) shows what Rebel saved without asking and why. You can switch any space back to more check-ins at any time.

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
