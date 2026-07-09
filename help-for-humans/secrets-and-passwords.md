---
description: "How Rebel handles passwords, API keys, and connector sign-ins in desktop-only and cloud continuity mode — including stored keys Rebel can use without seeing them"
last_updated: "2026-07-09"
---

# Secrets and Passwords

Your passwords, API keys, and other sensitive credentials need to stay safe. Here's the plain-English version of how Rebel handles them.

## The short version

- Your **actual passwords** stay with the service you sign in to. Rebel usually receives a token or a key, not your password.
- In **desktop-only** mode, Rebel keeps its working credentials on **this computer only**.
- If you turn on **cloud continuity**, Rebel syncs the credentials your **single-user cloud instance** needs so mobile, browser, and cloud-run work can function.

## Desktop-only mode

If you leave Rebel on **Desktop only**, here's what happens:

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

## Keys Rebel can use for you — without ever seeing them

Sometimes you want Rebel to *use* a key on your behalf — pull data from a service that needs an API key, run a script that authenticates with a token. You can hand Rebel a **stored key** for exactly that, and here's the reassuring part: **Rebel uses it without the AI ever seeing the value.**

Add one in **[Settings → Privacy & Safety](rebel://settings/safety)**, in the **"Keys Rebel can use"** section. In plain terms:

- **You paste the key in once, into Settings.** It's encrypted using this computer's secure storage — the same protection your operating system uses for saved passwords.
- **The AI only sees the *name* you gave it** (e.g. "Payments API key"), never the value. There's deliberately **no** "show me the key" command it can run — so a sneaky instruction hidden in an email or web page has nothing to read.
- **The real value is unlocked only at the moment a command runs**, and slipped into *that one command's* environment — never into the conversation, your notes, or the logs. When the command finishes, it's gone again.

**An example.** Say a payment service needs an API key to list your transactions. You add it in Settings as "Payments API key". Then you can just ask Rebel, *"grab my last 10 charges."* Rebel runs the request with your key injected for that single call, gets the data, and shows you the result — and the key never appears anywhere you (or the AI) could read it back.

The honest framing: **Rebel gives a tool access to the key while it runs** — not "the key can never be exposed." The key does get used; what's guaranteed is that the AI reading your conversation never gets to look at it, and it doesn't leak into your chat history. For the tightest safety, use a **restricted key** (read-only, minimal scope) where the service offers one — that limits what any single command could ever do.

> **This works on this computer only.** Because it relies on your computer's secure storage, stored keys aren't available when Rebel is running in the cloud or on mobile yet. If you ask for something there that needs one, Rebel will tell you it's desktop-only rather than half-doing it.

## With cloud continuity enabled

If you switch from **Desktop only** to **Add cloud continuity**, your cloud instance needs some credentials so it can keep working when you're on mobile, in a browser, or away from your desktop.

### These stay local

- Your actual website passwords
- Operating-system permissions on this computer
- Small device-only preferences that are only about this machine

### These can sync to your cloud instance

- AI provider credentials Rebel needs to run cloud conversations
- Voice-provider credentials used for cloud-side voice work
- Connector access tokens for services like Google, Slack, and similar tools

In other words: **desktop-only keeps working credentials on this computer; cloud continuity copies the working credentials the cloud side needs to your own cloud instance.**

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

> **Built-in protection:** If Rebel is about to save something to memory and spots what looks like a password or API key, it'll pause and ask you first — even in spaces set to save automatically. This is a safety net, not a guarantee, so it's still best to keep credentials in Settings rather than in your workspace files.

## See Also

- [MCP connectors, tools, and integrations](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — Connecting services
- [Cloud continuity and mobile](library://rebel-system/help-for-humans/cloud-continuity-and-mobile.md) — What changes when you enable cloud continuity
- [Rebel privacy policy](library://rebel-system/help-for-humans/Rebel-privacy-policy.md) — Full privacy details
- [Where Rebel stores things](library://rebel-system/help-for-humans/where-rebel-stores-things.md) — Where app data lives
