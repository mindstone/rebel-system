---
description: "How Rebel handles passwords, API keys, and connector sign-ins in desktop-only and cloud continuity mode — including stored keys Rebel can use for you, shown on screen only as a key (hidden)"
last_updated: "2026-11-19"
---

# Secrets and Passwords

Your passwords, API keys, and other sensitive credentials need to stay safe. Here's the plain-English version of how Rebel handles them.

## The short version

- Your **actual passwords** stay with the service you sign in to. Rebel usually receives a token or a key, not your password.
- In **desktop-only** mode, Rebel keeps its working credentials on **this computer only**.
- If you turn on **cloud continuity**, Rebel syncs the credentials your **single-user cloud instance** needs so mobile, browser, and cloud-run work can function.

## Desktop-only mode

If Rebel is on **Only this computer**, or your account has no cloud, here's what happens:

| Credential type | What Rebel stores | Where it stays |
|---|---|---|
| Your service password | Usually nothing — you sign in on the provider's own page | Not stored by Rebel |
| Connector sign-ins (Google, Slack, Calendar, etc.) | Access tokens from the sign-in flow | On this computer only |
| AI / voice provider keys | The key or token you added in Settings | On this computer only |
| Device permissions | Microphone, file access, notifications, and other local permissions | On this computer only |

### Connector sign-ins

When you connect services through **[Settings → Connectors](rebel://settings/tools)**, Rebel normally uses a browser-based sign-in flow.

- You sign in with the provider directly
- Rebel receives a token that lets it act for you
- Your actual password is not stored by Rebel

### API keys

If a service needs an API key instead, you add it in Settings. Rebel keeps that key in its local app data, not in your workspace files.

## Keys Rebel can use for you

Sometimes you want Rebel to *use* a key on your behalf — pull data from a service that needs an API key, run a script that authenticates with a token. You can hand Rebel a **stored key** for exactly that, and here's the reassuring part: **the key never shows on your screen, in your chat history or in Rebel's logs.** (Rebel's AI itself may see the value when a task needs it; more on that below.)

Add one in **[Settings → Privacy & Safety](rebel://settings/safety)**, in the **"Keys Rebel can use"** section. In plain terms:

- **You add the key once**, in Settings, or by giving it to Rebel on your computer, which saves it here for you. It's encrypted using this computer's secure storage — the same protection your operating system uses for saved passwords.
- **Rebel lists your keys by the *name* you gave them** (e.g. "Payments API key"). When a task needs the key itself — say, to fill it into another tool — Rebel can read it back. Your safety settings ([Settings → Privacy & Safety](rebel://settings/safety)) decide that like any other action, and on screen it only ever appears as "a key (hidden)".
- **The real value is unlocked only at the moment a command runs**, and slipped into *that one command's* environment — never into your chat history, your notes, or the logs. It normally disappears from the command's environment when the command finishes; when Rebel configures a local custom tool, that command may intentionally write the key to the tool's plaintext `.env` file so the tool can read it later, but the key still never enters the conversation.

**An example.** Say a payment service needs an API key to list your transactions. You add it in Settings as "Payments API key". Then you can just ask Rebel, *"grab my last 10 charges."* Rebel runs the request with your key injected for that single call, gets the data, and shows you the result — and the key never appears in your chat, your notes or the logs.

The honest framing: **Rebel gives a tool access to the key while it runs** — not "the key can never be exposed." The key does get used, and Rebel's AI can see and use its value when a task needs it; what's guaranteed is that it's hidden everywhere it would otherwise be shown or saved, so it doesn't leak into your chat history. For the tightest safety, use a **restricted key** (read-only, minimal scope) where the service offers one — that limits what any single command could ever do.

> **Cloud tasks can use these keys.** Rebel stores each key in this computer's secure storage first. If Cloud Continuity is on, it relays the key separately to the configured cloud machine so work there has the same capability.

## With cloud continuity enabled

If you switch from **Only this computer** to **Cloud continuity**, your cloud instance needs some credentials so it can keep working when you're on mobile, in a browser, or away from your desktop.

### These stay local

- Your actual website passwords
- Operating-system permissions on this computer
- Small device-only preferences that are only about this machine

### These are copied to the configured cloud machine

- AI provider credentials Rebel needs to run cloud conversations
- Voice-provider credentials used for cloud-side voice work
- Connector access tokens for services like Google, Slack, and similar tools

Who holds that copy depends on the setup:

- **Your own provider:** the credentials go to a machine 100% under your control. Mindstone does not get them.
- **Mindstone Cloud:** Mindstone holds a copy of the credentials and never looks at them.
- **Manual connection:** Rebel cannot verify who operates the configured machine. Only connect one you trust.

In other words: **desktop-only keeps working credentials on this computer; Cloud Continuity copies the working credentials the cloud side needs to the machine you configured.**

## A quick note about “local storage”

Apps and browsers also have a lightweight **local storage** area for convenience bits like dismissed tips or simple UI preferences.

That is **not** a secure vault. Don't paste passwords, API keys, or private tokens into notes, prompts, or random text fields assuming local storage will protect them. Keep secrets in the proper Settings fields instead.

## Good habits

**Do:**
- Use OAuth connections when available (they're more secure)
- Keep API keys in Settings, not in documents or prompts
- Disconnect services you no longer use in **[Settings → Connectors](rebel://settings/tools)**
- Turn off cloud continuity if you do not want credentials available to your cloud instance

**Don't:**
- Put passwords in shared folders or memory files
- Share API keys in conversations or notes
- Store credentials in documents within your workspace

> **Keep keys in Settings:** Rebel doesn't stop a save just because it contains something that looks like a password or API key; your Space's settings and your Safety Rules decide. Settings is still the best place for credentials, rather than your workspace files.

## See Also

- [MCP connectors, tools, and integrations](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — Connecting services
- [Cloud continuity and mobile](library://rebel-system/help-for-humans/cloud-continuity-and-mobile.md) — What changes when you enable cloud continuity
- [Rebel privacy policy](library://rebel-system/help-for-humans/Rebel-privacy-policy.md) — Full privacy details
- [Where Rebel stores things](library://rebel-system/help-for-humans/where-rebel-stores-things.md) — Where app data lives
