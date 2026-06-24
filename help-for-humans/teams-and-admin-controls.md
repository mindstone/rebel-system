---
description: "Using Rebel across a team: what an organisation can manage centrally (disabled tools, recommended connectors, company model profiles, pre-set keys), how shared skills and spaces keep people aligned, and what stays personal to each person (like Safety Rules)."
---

# Teams and Admin Controls

Rebel is built for an individual first — it runs on your machine, with your accounts and your judgement. But plenty of teams want several people working the same way without everyone reinventing it. This page explains, honestly, what's shared, what's central, and what stays personal when more than one of you uses Rebel.

The short version: a few things can be managed centrally for the whole organisation; team *knowledge and workflows* are shared through ordinary shared folders; and your personal guardrails (your Safety Rules) stay yours. There's no single "admin dashboard" inside the app — central controls are set up with Mindstone and applied automatically when each person signs in.

## The honest summary

| Thing | Who controls it | How it's shared |
|---|---|---|
| **Disabled tools** (block a tool for everyone) | Your organisation (via Mindstone) | Applied to every person automatically at sign-in — can't be overridden |
| **Recommended connectors** | Your organisation (via Mindstone) | Shown as "recommended for your company" — a suggestion, not forced |
| **Company model profiles** | Your organisation (via Mindstone) | Pushed to everyone, optionally as the default model for certain work |
| **Pre-set keys** (e.g. AI or voice) | Your organisation (via Mindstone) | Filled in for everyone, so there's nothing to wire up |
| **Skills and knowledge** (how Rebel does recurring tasks) | Your team | Through a shared folder everyone connects (see below) |
| **Safety Rules** (when Rebel pauses to ask *you*) | Each person | Not shared — personal to each individual |

## What an organisation can manage centrally

If your organisation has a team arrangement with Mindstone, it can set a handful of things centrally. (This is an organisation-level arrangement, separate from the individual [Dash and Rogue AI plans](rebel://library/rebel-system%2Fhelp-for-humans%2Fmindstone-plans-and-billing.md) that power one person's models — a personal Dash plan doesn't by itself unlock these controls.) These aren't configured inside the Rebel app — they're arranged with Mindstone (talk to us at **hello@mindstone.com**), and they apply to each person automatically the next time they sign in. No one has to do anything on their own machine.

- **Switch specific tools off for everyone.** An administrator can hard-disable particular connector tools across the whole organisation — say, "no one's Rebel may delete files in Google Drive," or "turn off outbound posting in Slack." These are a genuine block: the tool simply isn't available, there's no approval prompt to click through, and an individual can't switch it back on. People see a shield icon and a "Disabled" badge against those tools in **[Settings → Connectors](rebel://settings/tools)**. This is the one safety control that applies to the whole team at once.
- **Recommend the right connectors.** Your organisation can surface a curated "recommended for your company" list at the top of the connectors screen, so everyone connects the same tools. It's a nudge, not a mandate — people can still ignore it or connect others.
- **Standardise which AI models people use.** Your organisation can push named **company model profiles** — and optionally set one as the default for everyday work. People can see these profiles but can't delete them; they can still choose a different model for themselves unless your organisation has set a default they haven't overridden.
- **Pre-fill access keys.** Things like the AI provider key or the voice key can be set centrally, so people aren't pasting credentials around — Rebel just works when they sign in.

What an organisation **cannot** currently do: push a shared set of Safety Rules, enforce an approval workflow across people, or force a connector to install. The shared-Safety-Rules limit is a deliberate security choice (explained under "What stays personal" below); the others simply aren't part of the current admin controls.

## How a team actually stays consistent

Most day-to-day consistency doesn't come from admin switches — it comes from **shared skills and shared spaces**, which work through ordinary cloud folders.

A **skill** is a short set of instructions Rebel follows for a recurring task ("how we write a weekly update," "how we qualify a lead"). A **space** is a folder with its own memory, skills, and context. When a space lives in a shared cloud folder (a Google Shared Drive, a shared Dropbox or OneDrive folder, and so on), everyone who connects that same folder sees the same skills, the same memory, and the same way of doing things. Update the shared skill once, and everyone who has that folder picks up the change.

So the answer to "won't everyone drift into slightly different habits?" is: the shared parts — the skills and knowledge that define *how your team works* — live in one shared place, so they stay in step. Personalisation happens around the edges:

- **Use a shared skill as-is**, and you get your team's version.
- **Make it your own** with **Save as Copy** — that gives you a personal copy to tweak without changing everyone else's.
- **Edit the shared one** and Rebel warns you first (especially if a colleague created it), and asks you to confirm before the change lands for the whole team — so nobody silently rewrites the team playbook.

Because sharing runs on your cloud storage, who can see or edit a shared space is governed by that folder's permissions — the same access control you already use for files. (For the mechanics, see [Space shared folders](rebel://library/rebel-system%2Fhelp-for-humans%2Fspace-shared-folders.md).)

## What stays personal

Some things are deliberately *not* shared, because they're about your individual judgement or safety:

- **Your Safety Rules.** The rules that decide when Rebel pauses to ask *you* are personal and live on your device. They aren't inherited from your team or synced between people. Two colleagues can have very different rules. This is deliberate: safety rules are never read from shared files, because a shared rulebook could be quietly edited by anyone with access to the folder — exactly the kind of tampering a safety system shouldn't trust. (If your organisation needs a guardrail for everyone, that's the "disabled tools" control above — a hard, central block enforced by the app rather than a shared file anyone could change.)
- **Your personal skills and workspace.** Anything you keep in your own (non-shared) space is yours alone.
- **Your connector sign-ins.** Each person signs in to their own accounts; Rebel doesn't share your Gmail or Slack session with teammates.

### So how are "conflicting rules across people" handled?

They don't conflict — because there's no shared rulebook to conflict *with*. Each person's Safety Rules apply only to their own Rebel, including when their own automations run. There's one common starting point — every new user begins from the same sensible default Safety Rules — and a couple of baseline protections that apply to everyone automatically:

- Saving to a **shared** space always gets an extra sensitivity check before anything is written, so private details don't leak into a team folder by accident. (You can't turn a shared space down to "save anything without checking.")
- Any tools your organisation has **disabled** are off for everyone, full stop.

Above that shared floor, each person tunes their own rules to their own comfort. There's no silent override of one person's choices by another's.

## Getting team and admin features

The central controls above come with a Mindstone team plan, and they're arranged directly with us rather than self-served in the app — partly because they're worth a short conversation about how your organisation wants to work. If you're rolling Rebel out to a group, or you want tools centrally locked down, recommended connectors, or standardised models, email **hello@mindstone.com** and we'll set it up.

For how team size relates to licensing (Rebel is free for internal use up to 100 people), see [Licensing, explained](rebel://library/rebel-system%2Fhelp-for-humans%2Flicensing-and-fair-source.md).

## See also

- [Security and tool safety](rebel://library/rebel-system%2Fhelp-for-humans%2Fsecurity-and-tool-safety.md) — how approvals and Safety Rules work for each person
- [Using skills](rebel://library/rebel-system%2Fhelp-for-humans%2Fusing-skills.md) — built-in, shared, and personal skills, and how to customise them
- [Spaces](rebel://library/rebel-system%2Fhelp-for-humans%2Fspaces.md) — what a space is and how sharing levels work
- [Space shared folders](rebel://library/rebel-system%2Fhelp-for-humans%2Fspace-shared-folders.md) — connecting a team's shared cloud folder
- [Connectors, tools and integrations](rebel://library/rebel-system%2Fhelp-for-humans%2Fmcp-connectors-tools-and-integrations.md) — including admin-disabled tools
- [Licensing, explained](rebel://library/rebel-system%2Fhelp-for-humans%2Flicensing-and-fair-source.md) — the 100-person internal-use limit
