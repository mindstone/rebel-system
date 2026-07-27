---
description: "Plain-English guide to Spaces — separate areas in your Rebel workspace with their own memory, skills, and sharing rules"
last_updated: "2026-07-26"
---

# Spaces (for sharing with different groups)

A **Space** is a folder inside your Rebel workspace with its own memory, skills, and sharing rules.

Use spaces when you want Rebel to keep things separate — for example:
- private personal thinking
- company-wide knowledge
- one team or leadership group
- a client, project, family, or volunteer context

## See also

- [Memory folders and approvals](rebel://library/rebel-system%2Fhelp-for-humans%2Fmemory-folders-and-approvals.md)
- [Spaces: shared folders](rebel://library/rebel-system%2Fhelp-for-humans%2Fspace-shared-folders.md)
- [Where Rebel stores things](rebel://library/rebel-system%2Fhelp-for-humans%2Fwhere-rebel-stores-things.md)
- [Cloud Continuity and Mobile](rebel://library/rebel-system%2Fhelp-for-humans%2Fcloud-continuity-and-mobile.md)

## What a Space does

Each space gives Rebel a clear boundary:
- **Its own context** — a `README.md`, memory, and any space-specific guides
- **Its own sharing level** — private, team, company-wide, or another shared group
- **Its own approval settings** — shared spaces are naturally more cautious than private ones

You still open **one workspace folder** overall. Spaces are just the separate areas inside it.

**A note on what the sharing level does.** The sharing level is a *label* that tells Rebel how to treat a space — how to describe it, and how careful to be with it (anything marked as shared automatically gets a stricter check before sensitive things are saved there). It does **not** itself control who can open the folder. Actual access comes from the underlying shared drive or folder's own permissions — see [Shared space access](#shared-space-access-vs-public-file-sharing) below.

## Common spaces

### Chief-of-Staff
Your private command centre.

Use it for:
- your preferences and working style
- cross-space context
- personal goals
- anything you do not want mixed into a shared work space

### Work spaces
These are usually shared company, team, or project areas.

Examples:
- company-wide knowledge
- leadership team context
- department-specific memory
- project collaboration

### Personal spaces
Personal spaces are real now — not deferred, not mythical.

Use them when you want an extra **private** area beyond Chief-of-Staff, such as:
- life admin
- side projects
- family organisation
- volunteering
- a personal knowledge area you want kept separate

Create them from [Settings → Workspace → Spaces](rebel://settings/spaces).

## Shared space access vs public file sharing

These are different things:

| If you want... | Use this | What it means |
|---|---|---|
| Ongoing access to a whole team area | **A shared space** | People see the folder because they already have access to that shared drive or shared folder |
| A link to one specific file | **Public file sharing** | Rebel creates a web link to just that file |

### Shared space access
- Follows the permissions on the underlying folder (Google Drive, OneDrive, Dropbox, Box, local shared folder, and so on)
- Gives access to the **space itself**, not just one document
- Best for regular collaboration inside Rebel

### Public file sharing
- Shares **one file only**
- Requires [Cloud Continuity](cloud-continuity-and-mobile.md)
- Can include an optional **password** and **expiry**
- Does **not** give access to the rest of the space

So yes: a file can live inside a shared team space *and* also be sent out as a separate public link. Different jobs, different tools.

## What is usually inside a Space

Most spaces contain:
- `README.md` — the short, high-value context Rebel should know about that space
- `memory/` — notes, topics, sources, and in-progress knowledge
- `skills/` — reusable instructions and workflows
- optional `help-for-humans/` — guides for people
- optional `scripts/` — automation or helper files

You do not need to build this by hand unless you enjoy that sort of thing. Rebel can create the basics for you.

## Managing Spaces

Open [Settings → Workspace → Spaces](rebel://settings/spaces) to add, review, rename, or remove spaces.

### Add a new space
You can:
1. **Create new space** — Rebel makes a fresh folder with the usual structure
2. **Add existing folder** — Rebel connects a folder you already use

If the folder lives outside your workspace, Rebel creates a link inside the workspace rather than moving the original.

### Remove a space
You can either:
- **Remove** — disconnect it from Rebel
- **Move out** — physically move it out of the workspace

If the space points to an external shared folder, removing it does **not** delete the original folder.

## Memory safety per space

Each space has its own memory setting:

| Setting | What it means |
|---|---|
| **Save without asking** | Rebel saves memory automatically. This option is for your own private spaces. |
| **Ask only when Rebel spots something specific** | Rebel saves routine updates and asks only when it spots something specific, such as a password or personal details. |
| **Ask whenever Rebel is unsure** | Rebel asks whenever it is not fully confident, even without anything specific to flag. This is the default for shared spaces. |
| **Always ask before saving** | Every memory write needs your OK. |

Shared spaces can use any of the three asking options, including **Ask only when Rebel spots something specific** when routine cards become noise. You cannot dial a shared space all the way down to **Save without asking**, and Rebel's built-in checks for passwords and keys keep running whatever shared-space option you choose.

### Privacy Mode overrides space settings

If [Privacy Mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fprivacy-mode.md) is on, Rebel asks before memory saves **even if that space would normally save automatically**.

Think of Privacy Mode as the master switch: per-space settings are your defaults, Privacy Mode is the temporary override. You can turn it on from [Settings → Privacy & Safety](rebel://settings/safety).

## Grouping spaces by organisation

You can tag work spaces with an **organisation** — for example, the company or client they belong to. Rebel uses this to group your spaces in Settings → Spaces, and to show the agent which spaces are related.

### What it looks like

In Settings → Spaces, spaces with the same organisation tag are grouped under a heading like **Mindstone** or **Acme Corp**. If a space has no organisation set, it appears under **No organisation set** — you can add one using the "Set organisation" option on each card.

### How to set one

When adding or editing a space, the About step has an optional **Organisation** field. Rebel will suggest an organisation based on any sibling spaces you already have — so if you're adding `work/Acme/ProjectX` and already have `work/Acme/General`, it will suggest `Acme` as the default.

Onboarding also sets the organisation on your first work space automatically, based on the company name you entered during setup.

### What the agent sees

The agent groups spaces by organisation in its system prompt (`<spaces_available>`). If you have three Mindstone spaces, the agent sees them grouped together. This helps it keep your work contexts separate — writing to `Mindstone/General` does not leak into `Mindstone/Exec`.

The agent cannot change a space's organisation — only you can, via Settings or the Add/Edit Space wizard.

## If a space looks broken

If a space is missing its key setup file or something has gone sideways, Rebel will usually flag it and offer to help repair it. If needed, go to [Settings → Workspace → Spaces](rebel://settings/spaces) or ask Rebel to help fix the space.

### Can't find this folder

If the folder behind a Space has been **permanently deleted** (or the Google Drive / Dropbox / iCloud shortcut is gone for good), Rebel shows the Space as a removable card with a plain **"can't find this folder"** note — distinct from the temporary **Reconnecting** state you see when a cloud mount is briefly offline.

**Remove** unlinks the Rebel shortcut only; your cloud files are untouched. Use Remove to tidy up, or reconnect if you simply moved the folder elsewhere.
