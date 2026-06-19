---
description: "How to connect ChatGPT Pro, OpenRouter, or Anthropic, then choose Rebel's Planner, Main work, and Behind the Scenes models, plus the per-conversation Quality Tier selector"
last_updated: "2026-06-18"
---

# AI models

Rebel currently has three main first-class AI provider options:

- **ChatGPT Pro**
- **OpenRouter**
- **Anthropic**

You only need **one** of them connected to get started.

In onboarding and in [Settings → Agent & Voice → Intelligence](rebel://settings/agents), you pick a provider from these **provider cards**, then choose which models Rebel should use for **Planner**, **Main work**, and **Behind the Scenes**.

## See also

- [Settings and configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — where these controls live
- [Council Mode](library://rebel-system/help-for-humans/multi-model-council-mode.md) — getting second opinions from multiple models
- [Troubleshooting](library://rebel-system/help-for-humans/troubleshooting.md) — if model setup goes sideways
- [The Open-Source Build](rebel://library/rebel-system%2Fhelp-for-humans%2Fopen-source-build.md) — in the open build you bring your own AI account or access code; there's no Mindstone-managed plan

## The three main provider choices

| Provider | Best for | What you need |
|---|---|---|
| **ChatGPT Pro** | Easiest setup if you already pay for ChatGPT Pro | Your OpenAI login |
| **OpenRouter** | One account that can access Claude, GPT, Gemini, and more | An OpenRouter account with credits |
| **Anthropic** | Direct Claude access and pay-as-you-go billing | An Anthropic API key |

## How provider cards work

The flow is the same in onboarding and in Settings:

1. **Connect** the provider you want
2. The card shows as **Connected** and is automatically selected as your active provider
3. If you have multiple providers connected, click a different card to switch
4. If you disconnect your active provider, Rebel automatically falls back to another connected provider

One connection is enough. More than one is optional.

## Setup options

### ChatGPT Pro

If you already have ChatGPT Pro, this is the quickest route.

1. Open **Settings → Agent & Voice → Intelligence**
2. On the **ChatGPT Pro** card, click **Connect**
3. Sign in with your OpenAI account
4. Once connected, click the card if you want ChatGPT Pro to be your active provider

Good fit if you want a simple setup and already live in ChatGPT anyway.

### OpenRouter

OpenRouter is a first-class option in Rebel, not a workaround.

1. Open **Settings → Agent & Voice → Intelligence**
2. On the **OpenRouter** card, click **Connect**
3. Finish the sign-in flow
4. Add credits to your OpenRouter account
5. Click the card to make it your active provider if needed

Good fit if you want one billing account for multiple model families. You can also enter any OpenRouter model ID directly — not just the defaults in Rebel's curated list. If you work with very large documents, MiniMax M3 is now available here as a long-context option.

### Anthropic

Use Anthropic if you want direct Claude access.

1. Open **Settings → Agent & Voice → Intelligence**
2. On the **Anthropic** card, click **Add API Key**
3. Paste your Anthropic key
4. Click the card to make Anthropic your active provider if needed

Good fit if you want the most direct Claude setup and pay-as-you-go pricing.

If you want extra help with Anthropic-specific setup, see [Claude Max setup](library://rebel-system/help-for-humans/claude-max-setup.md).

## Model roles: Planner, Main work, and Behind the Scenes

Rebel splits model choices into three jobs. Plan first, then do the work, then tidy up Behind the Scenes.

### Planner

This is optional.

It handles deeper planning before the Main work model gets on with it. For harder jobs, this can improve quality. For simple jobs, it can be overkill.

You can leave it as **Off (no plan mode)** for the simplest setup — Rebel will just use your Main work model end-to-end and skip the separate planning phase.

### Main work

This is the main model you notice most.

It handles the actual conversation work:

- writing
- editing
- using tools
- producing the answer you see

If you're only going to change one thing, change this.

### Behind the Scenes

This model handles quieter jobs in the background, such as:

- safety checks
- memory updates
- file indexing
- conversation titles

In the app this is labeled **Behind the Scenes**.

### Model team

A **Model team** is Rebel bringing together a set of models that each do a different job. Instead of one model doing everything, Rebel picks the right tool for each step of a task.

The roles within a team are:

- **Main work** — the model you talk to most, handling writing, editing, and tool use
- **Deep thinking** — an optional planning model that thinks harder before Main work starts (leave it Off for simple tasks)
- **Behind the Scenes** — background jobs like safety checks, memory updates, and file indexing
- **Council** — multiple models consulted in parallel for important decisions (see [Council Mode](library://rebel-system/help-for-humans/multi-model-council-mode.md))
- **Recovery** — a fallback that steps in when something hiccups, so work keeps going rather than stopping cold

If a chosen model can't be found, Rebel quietly switches to a working one and carries on instead of stopping with an error. And if a reply stutters mid-stream for a moment, Rebel retries on its own — you usually won't even notice.

When you pick which model to use for each role, you see a **unified list** — all your connected providers' models appear together, so you don't need to flip between tabs or providers to find the right fit. If you have both a subscription (e.g. ChatGPT Pro) and an API key for the same provider, they appear as **separate, distinct profiles** so the two don't get muddled.

Each role shows its **real status** at a glance. If a model is genuinely ready to use, it says so; if it would fail or still needs setup, it tells you that honestly rather than giving a false all-clear (or warning you about a model that's actually running fine). The fallback role — the model that steps in for very long conversations — gets its own **Pick fallback** nudge so it doesn't quietly go unset.

You manage all of this in **Settings → Agent & Voice → Intelligence** under the Model team section. Each model row has a chip-toggle to mark it as part of Council or not — no checkbox, no wizard.

### Smart model picking

**Smart model picking** is Rebel choosing the best model for each step within your Quality Tier. When Rebel plans a job, it works out which model is best suited to the step at hand — given your tier setting and what each model can do — and routes the job there automatically.

Smart picking kicks in every turn unless you've already picked a specific model for the conversation. If you've explicitly chosen a working model, Rebel honours that and steps aside.

The **Quality Tier** slider is your control knob. Smart picking delivers the best available result within the tier you've chosen:

| Tier | Smart picking result |
|---|---|
| **Quick** | Fastest model that does the job |
| **Balanced** | Best mix of speed and quality |
| **Thorough** | Deeper reasoning for complex steps |
| **Maximum** | The strongest model available |

You can also open the advanced panel inside a conversation's model selector and override specific fields directly — Smart picking respects that choice.

## Quality Tier selector (per-conversation)

Inside any conversation, Rebel offers a **Quality Tier** slider that lets you pick an outcome rather than juggle model names. Each tier has a cost indicator so you can see the trade-off at a glance:

| Tier | Cost | Best for |
|---|---|---|
| **Quick** | $ | Fast responses for simple tasks |
| **Balanced** | $$ | Everyday work — a good balance of speed and quality |
| **Thorough** | $$$ | Deep reasoning for complex tasks |
| **Maximum** | $$$$ | The best available quality when it matters |

The tier overrides your global **Planner** and **Main work** settings for that conversation only — your Settings defaults are untouched. Pick the tier that matches the job, not the model catalogue.

If you prefer the old way, power users can still open the advanced panel inside the conversation's model selector to override specific Planner / Main work / effort fields directly.

**Frontier (Claude Fable 5)** briefly topped the line-up for **Maximum** tier — a temporary addition while access was available. That access has been withdrawn for now, so Fable may not appear in your pickers. When it returns, Rebel will surface it again; until then, **Maximum** uses the strongest model Rebel can actually reach for you.

## A simple starting point

For most people:

- Use your preferred provider card
- Pick a strong **Main work** model
- Smart model picking is **on by default** — Rebel automatically picks the best model for each step within your Quality Tier, so you get good results without managing every detail
- Leave **Planner** on **Off (no plan mode)** unless you do lots of complex work — picking a separate model here turns on the planning phase
- Leave **Behind the Scenes** on the default unless you have a reason to change it

That keeps Rebel fast without turning settings into a hobby.

## Available models

**Available models** is your catalogue of the models Rebel is allowed to use — separate from the **Model team** above (where you assign roles like Planner and Main work). This is about which models are in the pool at all.

- **On/Off per model** — each row has a clear On/Off toggle. Switch a model off and it stops showing up as a choice without leaving your list — flip it back on whenever. No deleting and re-adding.
- **Add a model** — opens a picker with a live **search** (by name or provider), a **Recommended for most people** shortlist for when you're not sure where to start, and — if you're on a Mindstone plan — an **Included with your plan** group surfacing the models your subscription already covers, one click to add.

Rebel won't offer a model in a picker if it can't serve it. If a model you'd already chosen later becomes unavailable — withdrawn access, disconnected provider, that sort of thing — Rebel falls back to a working alternative and keeps going rather than leaving the conversation stuck.

## Other providers and model profiles

The three provider cards above are the main setup path.

If you want to go further, Rebel also lets you add:

- extra provider API keys
- custom model profiles
- local or specialised models

These appear in the more advanced parts of **Settings → Agent & Voice → Intelligence**. They're optional — useful if you like tinkering, unnecessary if you don't.

Connecting your own model or a company gateway? See [Custom models and gateways](library://rebel-system/help-for-humans/custom-models-and-gateways.md) — it covers setup, what the **Test** button checks, and how Rebel handles gateways that can't take certain settings.

## Cost tracking

Rebel tracks AI spend across the providers you use. Open [Settings → Usage](rebel://settings/usage) for an honest **You paid** total (what actually left your wallet, with any subscription coverage shown as context), plus expandable breakdowns by model, provider, automation, and day.

That is especially handy if you use one model for **Planner** and another for **Main work** — or if you want to know which conversation ran up the bill.



