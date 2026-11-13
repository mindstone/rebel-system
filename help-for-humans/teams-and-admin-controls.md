---
description: "Using Rebel across a team: what an organisation can manage centrally from the Transformation Engine admin site (company-wide Dash/Rogue AI plans, per-person AI and voice keys, models and allowed models, disabled tools, recommended connectors, spaces, desktop update track), how shared skills and spaces keep people aligned, and what stays personal to each person (like Safety Rules)."
---

# Teams and Admin Controls

Rebel is built for an individual first — it runs on your machine, with your accounts and your judgement. But plenty of teams want several people working the same way without everyone reinventing it. This page explains, honestly, what's shared, what's central, and what stays personal when more than one of you uses Rebel.

The short version: a few things can be managed centrally for the whole organisation; team *knowledge and workflows* are shared through ordinary shared folders; and your personal guardrails (your Safety Rules) stay yours. Central controls aren't set inside the Rebel app: Mindstone switches them on for your company, your admins then manage them on the **Transformation Engine** (Mindstone's company admin site, open to the people your company makes admins; if you're not sure whether that's you, ask whoever set up Rebel at your company), and they reach each person's Rebel automatically.

## The honest summary

| Thing | Who controls it | How it's shared |
|---|---|---|
| **AI plans for everyone** (Mindstone's Dash or Rogue AI plans, billed to the company) | Your organisation's admins (Transformation Engine) | Assigned per person by your company's admins — nothing for employees to buy or set up |
| **Disabled tools** (block a tool for everyone) | Your organisation's admins (Transformation Engine) | Applied to every person automatically at sign-in — can't be overridden |
| **Recommended connectors** | Your organisation's admins (Transformation Engine) | Shown as "recommended for your company" — a suggestion, not forced |
| **Company model profiles** | Your organisation's admins (Transformation Engine) | Pushed to everyone, optionally as the default model for certain work |
| **Per-person keys** (AI or voice) | Your organisation's admins (Transformation Engine) | Each person gets their own key, collected by their Rebel automatically ([Company-provided keys](rebel://library/rebel-system%2Fhelp-for-humans%2Fcompany-provided-keys.md)) |
| **Skills and knowledge** (how Rebel does recurring tasks) | Your team | Through a shared folder everyone connects (see below) |
| **Safety Rules** (when Rebel pauses to ask *you*) | Each person | Not shared — personal to each individual |

## What an organisation can manage centrally

If your organisation has a team arrangement with Mindstone, it can set a handful of things centrally. (This is an organisation-level arrangement, separate from the individual [Dash and Rogue AI plans](rebel://library/rebel-system%2Fhelp-for-humans%2Fmindstone-plans-and-billing.md) that power one person's models — a personal Dash plan doesn't by itself unlock these controls. The arrangement *can* include centrally-provided plans for everyone — the first item below.) Mindstone sets this up with you (talk to us at **hello@mindstone.com**). After that, your company's admins manage it themselves on the Transformation Engine: in your company's **Settings**, the **Rebel** tab holds settings for everyone (Models, Connectors, Spaces, General, Plans), and **Members** holds each person's plan, keys and models. Changes reach each person's Rebel on its own within a few minutes while it's open. No one has to do anything on their own machine. (If the Rebel tab says "To change these settings, use Rebel for now", your company hasn't moved its Rebel admin to the Transformation Engine yet; Mindstone will tell you when it has.)

- **Provide the AI plans themselves, company-wide.** Instead of each employee subscribing individually, the company can cover everyone's **Dash** or **Rogue** plan: Mindstone sets the company up once, the company's admins then assign (or change, or remove) a plan per person from the company's page on Mindstone's web platform, and Mindstone invoices the company — not each employee. Someone who's already paying personally can't be assigned a company plan until their personal one is sorted out — deliberately, person by person — so nobody ends up double-billed by accident, and leavers' plans end with their membership. Details: [Mindstone plans → Plans for a whole company](rebel://library/rebel-system%2Fhelp-for-humans%2Fmindstone-plans-and-billing.md#plans-for-a-whole-company).
- **Switch specific tools off for everyone.** An administrator can hard-disable particular connector tools across the whole organisation — say, "no one's Rebel may delete files in Google Drive," or "turn off outbound posting in Slack." These are a genuine block: the tool simply isn't available, there's no approval prompt to click through, and an individual can't switch it back on. People see a shield icon and a "Disabled" badge against those tools in **[Settings → Connectors](rebel://settings/tools)**. This is the one safety control that applies to the whole team at once.
- **Recommend the right connectors.** Your organisation can surface a curated "recommended for your company" list at the top of the connectors screen, so everyone connects the same tools. It's a nudge, not a mandate — people can still ignore it or connect others.
- **Standardise which AI models people use.** For each kind of work (what the Transformation Engine calls Thinking, Rebel calls Planning; Working is Everyday work; Background is Behind the scenes), an admin can leave the choice to Rebel, **suggest** a model people can switch away from, or **lock** a model so everyone uses it. An admin can also limit which models people may pick (**Allowed models**), add **custom endpoints**, and give an individual their own models. People on a Mindstone plan use their plan's models. In Rebel, company choices show as "Set by {your company}", and company models carry a **Managed** badge. See [AI Models](rebel://library/rebel-system%2Fhelp-for-humans%2FAI-models.md#if-your-company-manages-your-models).
- **Give each person their own AI and voice keys.** An admin sets a key per person (Anthropic, OpenAI, OpenRouter, Fireworks AI, voice, or a custom endpoint), or makes OpenRouter and Fireworks keys for many people at once. Each person's Rebel collects their key on its own, and the admin page shows whether it has. How it works, what each status means, and what to do when a key looks stuck: [Company-provided keys](rebel://library/rebel-system%2Fhelp-for-humans%2Fcompany-provided-keys.md).
- **Set company-wide options.** The voice provider (and so which voice key people need), a shared drive for spaces, shared spaces themselves, whether people can share logs with Mindstone, and how fast the desktop app updates: **Current** (each new version as it's released) or **Steady** (a version only after it has run well for at least a week; security and serious bug fixes still arrive straight away). Individuals can be put on **Beta** or Current.

What an organisation **cannot** currently do: push a shared set of Safety Rules, enforce an approval workflow across people, or force a connector to install. The shared-Safety-Rules limit is a deliberate security choice (explained under "What stays personal" below); the others simply aren't part of the current admin controls.

## How a team actually stays consistent

Most day-to-day consistency doesn't come from admin switches — it comes from **shared skills and shared spaces**, which work through ordinary cloud folders.

A **skill** is a short set of instructions Rebel follows for a recurring task ("how we write a weekly update," "how we qualify a lead"). A **space** is a folder with its own memory, skills, and context. When a space lives in a shared cloud folder (a Google Shared Drive, a shared Dropbox or OneDrive folder, and so on), everyone who connects that same folder sees the same skills, the same memory, and the same way of doing things. Once the shared skill is updated, everyone who has that folder picks up the change.

So the answer to "won't everyone drift into slightly different habits?" is: the shared parts — the skills and knowledge that define *how your team works* — live in one shared place, so they stay in step. Personalisation happens around the edges:

- **Use a shared skill as-is**, and you get your team's version.
- **Make it your own** by asking Rebel for a personal version (a personal extension) — changes just for you, while everyone else keeps the shared version.
- **Suggest changes to someone else's shared skill** by editing it in Rebel. Rebel automatically records who added a skill; that person is its owner and reviews suggestions in the desktop app: click the notification bell (**Show notifications**), then look under **Skill updates** in **Notifications**. In Spaces shared through Rebel, which have manager roles, Space managers can decide too; elsewhere only the owner can decide. Until accepted, the original stays as it is. Managers' own edits and edits to older skills with no recorded owner save directly. See [Using skills → Reviewing suggestions](rebel://library/rebel-system%2Fhelp-for-humans%2Fusing-skills.md#reviewing-suggestions) for the current limits.

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

The central controls above come with a Mindstone team plan. Mindstone sets your company up first, partly because it's worth a short conversation about how your organisation wants to work; after that your admins run them day to day on the Transformation Engine. If you're rolling Rebel out to a group, or you want company-wide AI plans, per-person keys, tools centrally locked down, recommended connectors, or standardised models, email **hello@mindstone.com** and we'll set it up.

For how team size relates to licensing (Rebel is free for internal use up to 100 people), see [Licensing, explained](rebel://library/rebel-system%2Fhelp-for-humans%2Flicensing-and-fair-source.md).

## See also

- [Company-provided keys](rebel://library/rebel-system%2Fhelp-for-humans%2Fcompany-provided-keys.md) — how per-person keys reach Rebel, key statuses, and stuck keys
- [Security and tool safety](rebel://library/rebel-system%2Fhelp-for-humans%2Fsecurity-and-tool-safety.md) — how approvals and Safety Rules work for each person
- [Using skills](rebel://library/rebel-system%2Fhelp-for-humans%2Fusing-skills.md) — built-in, shared, and personal skills, and how to customise them
- [Spaces](rebel://library/rebel-system%2Fhelp-for-humans%2Fspaces.md) — what a space is and how sharing levels work
- [Space shared folders](rebel://library/rebel-system%2Fhelp-for-humans%2Fspace-shared-folders.md) — connecting a team's shared cloud folder
- [Connectors, tools and integrations](rebel://library/rebel-system%2Fhelp-for-humans%2Fmcp-connectors-tools-and-integrations.md) — including admin-disabled tools
- [Licensing, explained](rebel://library/rebel-system%2Fhelp-for-humans%2Flicensing-and-fair-source.md) — the 100-person internal-use limit
