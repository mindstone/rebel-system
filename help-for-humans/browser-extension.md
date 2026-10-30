---
description: "What Your Browser is, how to install it, what it can see, and what to try when the pairing flow gets temperamental."
last_updated: "2026-10-29"
---

# Your Browser

Your Browser uses the Rebel extension that lets Rebel see the page you're looking at, so you can ask it to summarise, save, or act on that page without playing courier between tabs.

## What it can do

Rebel works in its own tabs in your browser, grouped under **Rebel** at the top, in the background. It doesn't switch you to them or bring your browser forward, and it leaves your own tabs alone. You can watch at any time by clicking one of its tabs.

- Open pages, and list, use and close its own tabs.
- Read the page you're looking at, or one of its own, and quote what you've selected.
- Type, pick from drop-downs, press keys, hover, click and fill in forms.
- Wait for a page or a part of it to load.
- Take a screenshot of one of its tabs. If you're using that browser window at the time, Rebel reads the page's text instead, so it never switches tabs under you. It can take the picture once you've moved to another window.

When it needs you, for example to sign in, it asks in the conversation and waits until you choose **Done** there. If you click or type in one of its tabs while it works, it waits until you stop and reads the page again before carrying on.

The first time it needs a website, it asks once for access to all websites. Your [Safety Rules](rebel://settings/safety#safetyRules) still decide what it may do on each one. If you say no, it keeps working, asking you site by site instead.

### What it can't do

- A few sites only respond to typing and clicks made by a person. On those, Rebel tells you which step to do yourself, or you can use **Rebel's Browser**.
- It can't read records of the page's behind-the-scenes activity or errors, save pages as PDFs, or upload files from your computer. **Rebel's Browser** can save PDFs and upload files.

Rebel only acts in your browser when a task needs it.

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
