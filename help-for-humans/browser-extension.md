---
description: "What Rebel Browser is, how to install it, what it can see, and what to try when the pairing flow gets temperamental."
last_updated: "2026-05-11"
---

# Rebel Browser

Rebel Browser is the browser extension that lets Rebel see the page you're looking at, so you can ask it to summarise, save, or act on that page without playing courier between tabs.

It runs locally. Rebel does not get a permanent live feed of your browser. It only sees what you point it at.

## How to install it

Open **Settings → Connections → Rebel Browser → Install**.

Rebel will walk you through the rest in chat. You pick the browser, it prepares the files, and opens the right windows. Follow its instructions.

In practice, that usually means:

1. Pick your browser in the chat.
2. Rebel opens the extension folder and your browser's extensions page.
3. Turn on **Developer Mode**.
4. Drag the **Rebel Browser** folder into that page.
5. Either type the 6-digit code Rebel shows you, or approve the connection when Rebel asks.

Should take about a minute. Even software occasionally behaves.

## Supported browsers

- Chrome
- Edge
- Brave
- Arc
- Vivaldi
- Opera

Any Chromium-based browser, basically.

## Troubleshooting

### Rebel says it can't find your browser

Close the browser, relaunch Rebel, and try again.

If that still fails, install Chrome first. It is the least surprising option.

### The extensions page won't open

Open `chrome://extensions` manually in your browser and drag the **Rebel Browser** folder in.

### The 6-digit code expired

Ask Rebel to try again. It mints a fresh one.

### It says Developer Mode is required

Correct. Flip the **Developer Mode** toggle at the top-right of the extensions page.

It's reversible. The extension is local and does nothing in the background unless you ask Rebel to use it.

### It's still not working

Quit and reopen Rebel, then try again. The bridge sometimes benefits from a fresh start. Dramatic, but effective.

## What to expect once it's installed

Rebel can use the extension to:

- read page context
- take screenshots on demand
- help you summarise, save, or act on the current page

Nothing is sent anywhere just because the extension exists. Rebel only uses it when you ask.

## Conversation scoping per tab

Each browser tab that has Rebel running has its own independent conversation context. Switching tabs does not carry the conversation over — what you were working on in one tab stays in that tab, and starting a new conversation in a different tab begins fresh.

This means you can have Rebel open in multiple tabs at once — different tasks, different conversations — without them interfering with each other. Your context in one tab is never visible to another.

The extension runs locally.

Rebel only sees what you point it at, and nothing leaves your machine unless you ask Rebel to do something with it.
