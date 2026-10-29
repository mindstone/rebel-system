---
description: "What Your Browser is, how to install it, what it can see, and what to try when the pairing flow gets temperamental."
last_updated: "2026-10-29"
---

# Your Browser

Your Browser uses the Rebel extension that lets Rebel see the page you're looking at, so you can ask it to summarise, save, or act on that page without playing courier between tabs.

It runs locally. Rebel does not get a permanent live feed of your browser. It only sees what you point it at.

## How to install it

Open **Settings → Connectors**, choose **Your Browser**, then **Set up with Rebel**.

Rebel will walk you through the rest in chat. You pick the browser, it prepares the files, and opens the right windows. Follow its instructions.

In practice, that usually means:

1. Tell Rebel which browser to use, if it asks.
2. Rebel prepares the extension folder and opens your browser's extensions page when possible.
3. Follow the instructions in chat to enable **Developer Mode** and load the revealed **Rebel** extension folder.
4. Tell Rebel when the extension is loaded or the Rebel icon appears. Rebel checks that it's connected.

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

Open `chrome://extensions` manually in your browser and load the revealed **Rebel** extension folder.

### The install window closed

Set up **Your Browser** again from Settings and follow the new instructions.

### It says Developer Mode is required

Correct. Flip the **Developer Mode** toggle at the top-right of the extensions page.

It's reversible. The extension is local and does nothing in the background unless you ask Rebel to use it.

### It's still not working

Quit and reopen Rebel, then try again. The bridge sometimes benefits from a fresh start. Dramatic, but effective.

## What to expect once it's installed

Rebel can use the extension to:

- read page context
- quote selected text
- fill fields and click on the page
- help you summarise, save, or act on the current page

Nothing is sent anywhere just because the extension exists. Rebel only uses it when you ask.

## Conversation scoping per tab

Each browser tab that has Rebel running has its own independent conversation context. Switching tabs does not carry the conversation over — what you were working on in one tab stays in that tab, and starting a new conversation in a different tab begins fresh.

This means you can have Rebel open in multiple tabs at once — different tasks, different conversations — without them interfering with each other. Your context in one tab is never visible to another.

The extension runs locally.

Rebel only sees what you point it at, and nothing leaves your machine unless you ask Rebel to do something with it.
