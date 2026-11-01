---
description: "How to connect Anthropic in Rebel using an Anthropic API key"
last_updated: "2026-11-01"
---

# Set Up Anthropic for Claude in Rebel

If you came here looking for the old **Claude Max token** flow, the short version is: **Rebel now uses the Anthropic API key setup instead.**

No terminal commands. No token-copying ritual. Civilisation advances.

## How to connect Anthropic

### 1. Open the key field in Rebel

In **[Settings → Agent & Voice](rebel://settings/agents)**, choose **Add an account or key** → **Paste an API key**. Leave **API key for** set to **Anthropic**. The key field is already open.

During onboarding, choose the **Anthropic** card in the AI setup step, then **Add API Key** if the field is closed. The three main cards are for ChatGPT Pro, OpenRouter and Anthropic; that layout is only in onboarding.

### 2. Get your key from Anthropic

Use the **Get API key** link below the field to open Anthropic's console in your browser. Create a new API key there, then copy it.

### 3. Paste the key into Rebel

Paste the key into the field. Click outside it so Rebel can check it. The line below the field tells you whether the check worked.

You can then find Anthropic under **Your AI accounts**. Choose **Use for everyday work** on its row to use it as your main connection.

## Do I need a Claude subscription?

No. For this setup, you need an **Anthropic account with an API key**. It is a pay-per-use connection, not a Claude subscription login.

## Can I switch later?

Yes. In **[Settings → Agent & Voice](rebel://settings/agents)** → **Your AI accounts**, choose **Use for everyday work** on the account you want to use.

## Troubleshooting

### The key is rejected

- Make sure you copied the full key
- Try creating a fresh key in Anthropic and pasting that instead
- Check that your Anthropic account is ready for API use

### I already use ChatGPT Pro or OpenRouter

In Settings, choose **Add an account or key** → **Sign in with ChatGPT** or **Sign in with OpenRouter** instead. You do not need to set up Anthropic unless you specifically want direct Claude access through Anthropic.

### I removed the key by mistake

Choose **Add an account or key** → **Paste an API key** → **Anthropic** again and paste the key. Rebel does not make this harder than necessary.

## See also

- [AI models](rebel://library/rebel-system%2Fhelp-for-humans%2FAI-models.md) — model setup and provider options
- [Getting started](rebel://library/rebel-system%2Fhelp-for-humans%2Fgetting-started.md) — onboarding overview
- [Settings and configuration](rebel://library/rebel-system%2Fhelp-for-humans%2Fsettings-and-configuration.md) — full settings reference
