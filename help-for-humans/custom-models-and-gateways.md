---
description: "How to connect your own model or a company gateway (a custom OpenAI-compatible endpoint), what the Test button checks, and how to fix common gateway issues like thinking and tool use"
last_updated: "2026-06-18"
---

# Custom models and gateways

Most people only need one of Rebel's built-in providers (ChatGPT Pro, OpenRouter, or Anthropic). But Rebel can also talk to **your own model** — a model you host yourself, or one reached through a **company gateway** that sits in front of a provider. This is the "advanced" path, and it's entirely optional.

## When you'd want this

- A **company gateway** — many organisations route all AI traffic through their own endpoint (often built on something like litellm in front of Vertex, Bedrock, or Azure) for control and billing.
- A **model running on your own machine** (e.g. via Ollama or a local server).
- A **specialised or fine-tuned model** from a provider that isn't one of Rebel's built-in cards.

The common thread: the endpoint speaks the **OpenAI-compatible** API, and you point Rebel at it.

## Adding one

1. Open [Settings → Agent & Voice → Intelligence](rebel://settings/agents).
2. Under your models, choose **Add a model** → **Other (custom endpoint)**.
3. Fill in:
   - **Name** — anything memorable ("Work gateway", "Local Llama").
   - **Server URL** — the endpoint address (e.g. `https://gateway.yourcompany.com/v1`, or `http://localhost:8000/v1` for a local server).
   - **Model ID** — the exact name the endpoint expects (e.g. `claude-opus-4-8`).
   - **API key** — if the endpoint needs one (leave blank for most local servers).
4. Click **Test now**.

## What "Test now" does

Test sends a few quick requests and reports what the endpoint can actually do:

- **Works** — it answers as a chat model at all.
- **JSON** — it can return structured data (Rebel uses this behind the scenes).
- **Thinking** — it accepts Rebel's "thinking" setting (the reasoning effort).
- **Tools** — it can call functions (needed for Rebel to take actions).

If something isn't supported, Rebel marks it. For **thinking**, Rebel then **adapts automatically** — it stops sending the thinking setting for that model, so the model just works. (Tools are different: if a model can't use tools through your gateway, Rebel flags it but can't paper over it — see below.) You can re-test any time; if you've fixed things on the gateway side, the capability turns back on.

This is the important bit for thinking: **you don't flip switches to work around a gateway that can't take it — you just run Test, and Rebel stops sending it.**

## Common gateway issues (and what to do)

### "No Thinking" — the gateway can't handle Rebel's thinking setting

Some gateways don't translate Rebel's thinking setting into a shape the underlying model accepts, and reject the request. When Test detects this, Rebel marks the model **No Thinking** and simply stops sending the setting — so the model works, just without an explicit thinking level. Nothing else to do.

If you (or your IT team) later update the gateway, **re-test** to turn thinking back on. If you'd rather not wait, you can also point the profile at a model the gateway already handles well.

### Tool calls fail with a "missing signature" message

A model reached through a gateway can fail on **tool use** if the gateway doesn't carry the model's tool-call data across steps (most often seen with Gemini-family models behind a gateway). Rebel can't fix this from its side — the gateway has to preserve that data. Until it does, use that model for chat/writing rather than tool-heavy tasks, or pick a model your gateway fully supports for the work that needs tools.

### "Not compatible" on the very first test

Usually a setup detail:

- Double-check the **Server URL** and that the server is actually running.
- Make sure the **Model ID** matches exactly what the endpoint expects.
- Confirm the **API key** (if the endpoint needs one).
- Check that your network/firewall allows the connection.

Fix the detail, then **Test now** again.

## See also

- [AI models](library://rebel-system/help-for-humans/AI-models.md) — connecting the built-in providers and choosing your Planner / Main work / Behind the Scenes models.
- [Settings and configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — where these controls live.
