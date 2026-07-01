---
description: "Specialist advisors you activate in a Space — Rebel consults them automatically or on demand for focused expert perspective"
last_updated: "2026-07-01"
---

# Operators

Operators are specialist advisors that live in your Space. Rebel consults them mid-task when the question calls for it — a sceptical engineer, a brand critic, an investor's eye — and folds their perspective into its answer. They are viewpoints, not separate chatbots.


## See also

- [Meetings and notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md) — Live meeting coaches use the same advisors
- [Council Mode](library://rebel-system/help-for-humans/multi-model-council-mode.md) — A different feature: parallel AI models, not expert personas
- [Terminology](library://rebel-system/help-for-humans/terminology.md) — Rebel terms and definitions
- [Product overview](library://rebel-system/help-for-humans/product-overview-and-features.md) — Where Operators fit in the feature set


## How Operators work

Rebel consults an Operator **automatically** when your task matches what that Operator is for — judgment calls, drafting and review, trade-offs, "should we ship / price / launch this", "is this on-brand". It does **not** consult them for simple factual, date, or calculation questions.

You can also summon one yourself:

- **@-mention**: Type `@` in the composer and pick one from the **Operators** tab in the mention picker
- **Natural language**: "What would Investor View say about this?" or "@Brand Critic — is this headline on-brand?"

If you want Rebel's own take only, say "skip the advisors" or "just your view".


## The Operators panel

Open the [Operators](rebel://team) panel from the sidebar — the Users icon, tooltip "Perspectives Rebel can ask during your work".

Two tabs:

- **Operators** — Advisors Rebel consults during work
- **Live coaches** — Advisors configured to surface proactive tips during meetings; some are also Operators, some are meeting-only (see [Meetings and notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md))

A **search box** filters the current tab by name or what an Operator is for. The search sticks when you switch tabs; press Escape to clear it.

Each Operator card has a menu with **Copy file path** — handy if you want to find or edit the underlying file. For Operators you've activated in a Space, the card shows a quiet "Edited <when>" line — and, when Rebel knows who made the change, "by <who>" (hover for the full date).


## Activating and managing Operators

Rebel ships a set of ready-made Operators you can **activate** into a Space. Bundled examples include **Brand Critic**, **Customer Voice**, **Head of Marketing**, **Investor View**, **Risk & Compliance**, and **Skeptical Engineer**. There are also bundled **Live coaches** (see below) such as **Exec Strategy Coach**, **Pitch Coach**, and **Sales Coach**.

| Operator | What it brings |
|----------|----------------|
| **Brand Critic** | Whether copy, visuals, and tone match your brand |
| **Investor View** | How a sceptical investor might read your pitch or deck |
| **Skeptical Engineer** | Technical holes, feasibility, and "will this actually work" |

From the Operators panel you can **rename** an Operator (display name), **duplicate** one to tweak your own version, and **remove** ones you don't want. Activated Operators live in the relevant Space, so different Spaces can have different advisors.

You can also teach an Operator about your context so its advice is more tailored.


## Live meeting coaches

Some advisors double as **live meeting coaches**, and a few are meeting-only. When enabled, a coach surfaces proactive tips during a meeting instead of waiting to be asked. See [Meetings and notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md) for setup and behaviour.


## Example

You're drafting a product launch email and want a sanity check before sending:

1. Type your draft in the composer: "Review this launch email — is the tone right and are we over-promising?"
2. Rebel consults **Brand Critic** and **Customer Voice** automatically, then gives you a single answer that weaves in both perspectives.
3. Or @-mention **Skeptical Engineer** if you specifically want a technical-reality check on the claims.

You get one coherent reply — not three separate chat threads.


## Good to know

**Desktop only today.** Operators are read from your local Space files, so they work in the desktop app — not on phone or cloud yet.

**Operators vs Council Mode.** [Council Mode](library://rebel-system/help-for-humans/multi-model-council-mode.md) consults multiple AI *models* in parallel and synthesises their answers. Operators are expert *personas* — a brand lens, a sales lens, an investor lens — not different models. Complementary, not the same thing.


## When to use them

**Good for:**
- Drafting and reviewing copy, decks, and proposals
- Judgment calls — pricing, positioning, launch timing
- Trade-offs where a specialist lens sharpens the answer
- Sanity-checking before you send or present

**Skip them when:**
- You need a quick factual answer
- You explicitly want Rebel's unfiltered view ("just your view")
- The task is straightforward and doesn't benefit from a second opinion
