---
description: "How to connect Anthropic in Rebel using the Anthropic provider card and an Anthropic API key"
last_updated: "2026-04-16"
---

# Set Up Anthropic for Claude in Rebel

If you came here looking for the old **Claude Max token** flow, the short version is: **Rebel now uses the Anthropic API key setup instead.**

No terminal commands. No token-copying ritual. Civilisation advances.

## Pick the right provider card

In onboarding and in **[Settings → Agent & Voice](rebel://settings/agents)**, Rebel shows three main provider cards:

| Card | Choose this if... |
|---|---|
| **ChatGPT Pro** | You want to use your OpenAI subscription |
| **OpenRouter** | You want one account that can route across multiple model providers |
| **Anthropic** | You want to connect directly to Claude with your own Anthropic API key |

This page is for the **Anthropic** card.

## How to connect Anthropic

### 1. Open the Anthropic card in Rebel

Go to either:

- the onboarding **AI setup** step, or
- **[Settings → Agent & Voice](rebel://settings/agents)**

Then choose **Anthropic**.

### 2. Click **Add API Key**

If you have not added a key yet, the Anthropic card shows an **Add API Key** button.

Click it to open the key field.

### 3. Get your key from Anthropic

Use the **Get API key** link in Rebel, or go to Anthropic's console in your browser.

Create a new API key there, then copy it.

### 4. Paste the key into Rebel

Paste the key into the Anthropic card.

Rebel checks it for you. When everything looks right, the card switches to **Key added**.

That is the whole setup.

## Do I need a Claude subscription?

No. For this setup, you need an **Anthropic account with an API key**. It is a pay-per-use connection, not a Claude subscription login.

## Can I switch later?

Yes. You can move between **ChatGPT Pro**, **OpenRouter**, and **Anthropic** later from **[Settings → Agent & Voice](rebel://settings/agents)**.

## Troubleshooting

### The key is rejected

- Make sure you copied the full key
- Try creating a fresh key in Anthropic and pasting that instead
- Check that your Anthropic account is ready for API use

### I already use ChatGPT Pro or OpenRouter

Use those cards instead. You do not need to set up Anthropic unless you specifically want direct Claude access through Anthropic.

### I removed the key by mistake

Open the Anthropic card again and add the key back. Rebel does not make this harder than necessary.

## See also

- [AI models](library://rebel-system/help-for-humans/AI-models.md) — model setup and provider options
- [Getting started](library://rebel-system/help-for-humans/getting-started.md) — onboarding overview
- [Settings and configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — full settings reference
