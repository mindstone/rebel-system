---
description: "Demo Mode lets you run Rebel as a completely fresh user — ideal for presentations, training, or testing the onboarding experience."
last_updated: "2026-04-16"
---

# Demo Mode

Demo Mode starts Rebel in a completely isolated sandbox — fresh settings, no conversations, no connected tools, no memory. It's as if someone just installed the app for the first time.

Your real data is completely untouched. When you exit Demo Mode, everything goes back to exactly how it was.


## Who this is for

Demo Mode is primarily for **advanced use cases**:

- **Mindstone employees** demoing Rebel to prospects, investors, or at events
- **Team leads** walking new colleagues through the onboarding experience
- **Testing** what the app looks like from a first-time user's perspective

Most users will never need this. If you're just using Rebel day-to-day, you can safely ignore it.


## How to start Demo Mode

There are two ways:

### From the app menu

1. Open the **Rebel** menu (top-left of your screen)
2. Click **"Start Demo Mode..."**
3. A dialog appears with two options (see below)
4. Click **Start Demo**
5. Rebel will restart automatically in Demo Mode

### From Settings

1. Open **Settings** (gear icon, or press the keyboard shortcut)
2. Go to **Advanced → Developer**
3. Find the **Demo Mode** section
4. Click **"Enter Demo Mode"**

> **Don't see Developer?** Turn on **Developer mode** first in Settings → Advanced. Then the Demo Mode controls appear.

### Choosing your options

When the dialog appears, you'll see two choices:

| Option | What it does |
|--------|-------------|
| **Keep my API keys** | Starts fresh, but keeps your compatible AI provider setup so you can actually use the demo straight away. That includes saved API keys plus provider settings Rebel can reuse — for example OpenRouter, custom model profiles, and related voice/provider configuration. |
| **Completely fresh start** | Truly blank slate — no provider setup, no API keys, no carry-over configuration. Your provider cards start disconnected, so you'll need to connect one before Rebel can do live AI work. |

There's also an **"Include sample content"** checkbox that adds fictional skills and memories for a made-up company called ACME Corp. Useful if you want the demo to feel populated without doing real setup.

### Provider setup in Demo Mode

Demo Mode does **not** fake an AI provider for you.

- If you choose **Keep my API keys**, the provider cards in **Settings → Agent & Voice** should already be ready enough for a live demo.
- If you choose **Completely fresh start**, expect the provider cards to look like a brand-new install until you connect one.


## What happens when Demo Mode is active

Once Rebel restarts in Demo Mode, you'll notice:

- A **"Demo Mode" indicator** appears in the header bar (with a mask icon)
- The **onboarding wizard** starts, just like a new user would see
- All your conversations, settings, connections, and memory are gone (temporarily)
- The header shows **"Exit Demo"** and **"Restart Demo"** buttons

Everything you do in Demo Mode — conversations, settings changes, file uploads — happens in a temporary sandbox. None of it touches your real data.


### What's isolated

| Your stuff | In Demo Mode |
|------------|-------------|
| Conversations | Hidden (safe in your real profile) |
| Settings | Fresh defaults |
| Connected tools | None configured |
| Memory & folders | Empty |
| Workspace | A demo "Rebel" folder in a temporary location |
| API keys | Only if you chose "Keep my API keys" |

### Important: API costs still apply

If you chose "Keep my API keys," conversations in Demo Mode still use your real API credits. The isolation is about data, not billing. Keep this in mind if you're doing extended demos.


## How to exit Demo Mode

Click **"Exit Demo"** in the header bar. Rebel restarts and returns to your normal environment with all your real data intact.

That's it. The temporary demo data is automatically cleaned up.


## How to restart Demo Mode

If you want a fresh demo (say, between presentations), click **"Restart Demo"** in the header bar instead of exiting first. This creates a brand-new sandbox without going back to your real environment in between.


## How it works (briefly)

Demo Mode creates a temporary folder on your computer and tells Rebel to use it for all storage instead of your normal data folder. Since everything — conversations, settings, memory — is stored in this temporary location, your real data is never read or modified.

When you exit, the temporary folder is deleted and Rebel switches back to your real data folder.


## What if something goes wrong

### Rebel didn't restart properly

Quit Rebel completely and reopen it. If Demo Mode was active, it should resume in Demo Mode. If it doesn't, you're back in your normal environment — no harm done.

### I closed the app during Demo Mode and now I'm stuck

Just reopen Rebel. If the demo flag is still set, you'll be in Demo Mode — use "Exit Demo" to return to normal. If the temporary folder was cleaned up (e.g., your computer restarted), Rebel detects this automatically and starts normally.

### Orphaned demo data

Temporary demo folders are automatically cleaned up when you exit Demo Mode. Any orphaned folders (from crashes or unexpected shutdowns) are cleaned up automatically after 7 days. You don't need to do anything.


## See also

- [Settings and configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — where to find Developer mode and other advanced options
- [Re-running onboarding](library://rebel-system/help-for-humans/re-running-onboarding.md) — if you just want to redo onboarding without a full demo sandbox
- [Where Rebel stores things](library://rebel-system/help-for-humans/where-rebel-stores-things.md) — details on Rebel's data storage
