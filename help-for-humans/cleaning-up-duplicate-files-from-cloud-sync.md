---
description: "Why duplicate files and folders like 'note (1).md' or 'Project (1)/' pile up when you run Rebel on two computers via a shared cloud drive, what Rebel now does about it (including whole-folder conflict copies), and how to tidy an existing mess safely."
last_updated: "2026-06-07"
---

# Cleaning up duplicate files from cloud sync

If you've opened a folder and found a small army of near-identical files —
`roadmap.md`, `roadmap (1).md`, `roadmap (1) (1).md`, and so on — this guide explains
what happened, what Rebel now does about it, and how to tidy up safely.

## What you're seeing

Lots of copies of the same file, usually with ` (1)`, ` (2)`, or `(conflicted copy …)`
in the name. In bad cases a single folder can fill with hundreds or thousands of them.
Your real files are still there — they're just buried in duplicates, which clutters your
folders, makes Rebel slower to find the right thing, and quietly runs up cost.

## Why it happens (it's your cloud drive, amplified)

When the **same file** is edited on **two computers** that share **one cloud drive**
(Google Drive, Dropbox, OneDrive), the drive can't always tell which version wins — so it
keeps both by making a copy: `roadmap (1).md` next to `roadmap.md`. That's the cloud
drive's own behaviour, not Rebel's.

The trouble was that an **older version of Rebel then copied those duplicates around** as
it synced between your machines, so one stray `(1)` could multiply into a whole pile. That
amplification is what turned a handful of copies into thousands.

## What Rebel now does about it

- **It stops fighting your cloud drive.** For workspaces that live in cloud storage (Google
  Drive, Dropbox, iCloud, OneDrive, Box), Rebel now lets your cloud app handle delivering file
  changes between your computers, instead of writing the same files itself. Two programs writing
  the same file at once is what made the duplicates in the first place — so with only one of them
  doing the writing, the `(1)` copies stop being minted at all. This is the real cure, and it
  applies automatically once you update.
- **It no longer multiplies them.** As before, Rebel also recognises any conflict copies that do
  exist and refuses to pass them around between your machines, so an old stray copy can't breed
  more. This covers whole **folders** too (like `Project (1)/`), not just individual files.
- **It offers to tidy up.** If Rebel notices conflict copies in your folders, it shows a
  one-time note — *"Tidy up duplicate files? Rebel found N duplicate files from a cloud-sync
  issue."* — with a **Move … to cleanup folder** button. If you have none, you'll see
  nothing.

> **A side effect worth knowing about.** Because Rebel now leaves cloud-folder delivery to your
> cloud app, there's one thing your cloud app can't do: deliver an edit you made on your **phone or
> in the web app** (that change never lands in your Drive folder). When that happens, Rebel shows a
> gentle **"Newer version available — you edited this on another device"** note; click **Update to
> newest** to bring your computer current. Nothing to lose, one click. See
> [Google Drive desktop & local sync](rebel://library/rebel-system%2Fhelp-for-humans%2Fgoogle-drive-desktop-local-sync.md)
> for more.

**The tidy-up is deliberately cautious:**
- It only moves copies that are **exactly identical** to your real file.
- It **moves** them (it never deletes) into a dated folder, `.rebel/conflicts-cleanup/<date>/`,
  inside the same space — so nothing is lost and you can fish anything back out.
- If a "copy" is actually **different** from the original (you might have edited it), Rebel
  **leaves it alone** and flags it for you to look at. Your judgement, not Rebel's.

## If you already have a big pile of duplicates

### First: stop it from growing

Before you tidy up, check whether the pile is still **actively growing** — new copies
appearing, or Rebel/your cloud drive showing sync errors. Cleaning up while it's still
happening is like bailing a boat that's still taking on water, and moving files around mid-loop
can actually stir up more copies. So, in order:

1. **Update Rebel to the latest version — on _both_ computers.** This is the single most
   important step. The fixes that *stop* the duplication (and the tidy-up itself) only work once
   you're up to date; an older version on either machine can keep the pile growing.
2. **Let it settle.** Give your cloud drive (Google Drive, Dropbox, OneDrive) a few minutes to
   finish syncing on both machines. If it helps, quit Rebel on one computer while you tidy on the
   other, so only one machine is touching the shared folder.
3. **Then tidy up** — using either option below.

If new duplicates *keep* appearing even after both computers are updated and settled, don't keep
mass-moving them — see [Troubleshooting](#troubleshooting), as something may be stuck.

### Easiest: let Rebel offer it

Next time Rebel updates, it'll spot the duplicates on startup and show the **Tidy up
duplicate files?** note. Click **Move … to cleanup folder**. Done — the exact duplicates go
to the dated cleanup folder, your originals stay put, and anything that genuinely differs is
left for your review.

### Right now: ask Rebel to clean a folder

Don't want to wait? Just ask Rebel, in plain language:

> "Clean up the duplicate files in my Acme space."

Rebel will **preview first** (a dry run — it shows you exactly what it would move and moves
nothing), and only tidy up once you say go. Under the hood it runs a small, careful tool
(`cleanup-conflict-copies`) that:

- **previews by default** — nothing moves until you confirm;
- only ever **moves exact duplicates** into `.rebel/conflicts-cleanup/<date>/` (never deletes,
  never touches files that differ from the original);
- keeps a record of what it moved, so anything can be put back.

It's safe to run more than once, and on one folder at a time if you'd rather go space by space.

## What it will and won't do

| It will | It won't |
|---------|----------|
| Move *exact* duplicate conflict copies to a dated cleanup folder | Delete anything |
| Show you a preview before touching anything | Touch a copy that differs from the original (you might have edited it) |
| Leave your real files exactly where they are | Touch your normal notes or non-duplicate files |
| Let you review or restore from the cleanup folder | Reach across to your other computer or the cloud |

## Avoiding it going forward

The main fix is already built in — for cloud-storage workspaces, Rebel now leaves file delivery
to your cloud app, so the two of them no longer write over each other and the duplicates stop
being created. (Rebel also still refuses to amplify any copies that already exist.) To keep even
the occasional one from appearing, try not to have **both** computers actively editing the
**same** shared-drive file at the same moment; let one finish syncing before the other picks it
up. And keep **every** computer on the latest Rebel — the fix only holds when none of your
machines is running an old version that still writes the files itself.

## Troubleshooting

- **The cleanup note never appeared.** Then Rebel didn't find any duplicates to tidy — or
  you haven't updated to a version that includes it yet. You can always ask Rebel directly to
  check a folder.
- **Some duplicates are still there after tidying.** Those are the ones that *differ* from
  your original — Rebel leaves them for you on purpose. Open them, keep the version you want,
  and delete the rest yourself.
- **I want my moved files back.** They're in `.rebel/conflicts-cleanup/<date>/` inside the
  space — move anything you want back out.
- **Duplicates keep coming back, or I'm seeing repeated sync / "Drive" errors.** First make sure
  **both** computers are on the latest Rebel and have finished syncing — an out-of-date machine is
  the usual culprit. If it *still* keeps happening after that, something may be stuck behind the
  scenes (on the cloud side) rather than on your computer; reach out so we can take a look, instead
  of repeatedly moving the copies — that just stirs things up while the loop is still active.

## See also

- [Google Drive desktop & local sync](rebel://library/rebel-system%2Fhelp-for-humans%2Fgoogle-drive-desktop-local-sync.md)
- [Where Rebel stores things](rebel://library/rebel-system%2Fhelp-for-humans%2Fwhere-rebel-stores-things.md)
- [Memory folders and approvals](rebel://library/rebel-system%2Fhelp-for-humans%2Fmemory-folders-and-approvals.md)
- [Cloud continuity and mobile](rebel://library/rebel-system%2Fhelp-for-humans%2Fcloud-continuity-and-mobile.md)
- [Troubleshooting](rebel://library/rebel-system%2Fhelp-for-humans%2Ftroubleshooting.md)
