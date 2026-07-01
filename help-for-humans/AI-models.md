---
description: "How to power Rebel's AI — a flat-fee Mindstone plan or bring your own (ChatGPT Pro, OpenRouter, Anthropic) — then choose Rebel's Planner, Main work, and Behind the Scenes models, plus the per-conversation Quality Tier selector"
last_updated: "2026-06-26"
---

# AI models

Rebel gives you two ways to power its AI:

- **Let Mindstone handle it** — a flat-fee [Mindstone plan](rebel://library/rebel-system%2Fhelp-for-humans%2Fmindstone-plans-and-billing.md) where Mindstone covers the AI bill. No API keys, no separate accounts. The simplest option.
- **Bring your own** — connect an AI account or key you already have. Three first-class choices: **ChatGPT Pro**, **OpenRouter**, or **Anthropic**.

You only need **one** of these to get started.

In onboarding and in [Settings → Agent & Voice → Intelligence](rebel://settings/agents), you pick how you want to power Rebel, then choose which models Rebel should use for **Planner**, **Main work**, and **Behind the Scenes**.

**You're not locked to one model or one provider.** Connect more than one and switch whenever you like — and through OpenRouter alone you can reach Claude, GPT, Gemini, DeepSeek, Grok, and others on a single account. You can also run models on your own machine (e.g. via Ollama or LM Studio) or point Rebel at a company gateway — see [Custom models and gateways](rebel://library/rebel-system%2Fhelp-for-humans%2Fcustom-models-and-gateways.md). And with [Council Mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fmulti-model-council-mode.md) you can put a question to several models at once.

## Backup connections

In **[Settings → Agent & Voice → Backup connections](rebel://settings/agents)**, you can add a backup connection. If your main connection is busy or hitting its limit, Rebel automatically switches to the backup — no interruption, no extra setup mid-conversation.

If you add no backup, nothing changes: Rebel won't switch connections on its own, and there's no extra spend. A Mindstone plan isn't used as an automatic backup.

## See also

- [Mindstone plans](rebel://library/rebel-system%2Fhelp-for-humans%2Fmindstone-plans-and-billing.md) — the flat-fee subscription, monthly allowance, and billing
- [Settings and configuration](rebel://library/rebel-system%2Fhelp-for-humans%2Fsettings-and-configuration.md) — where these controls live
- [Council Mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fmulti-model-council-mode.md) — getting second opinions from multiple models
- [Troubleshooting](rebel://library/rebel-system%2Fhelp-for-humans%2Ftroubleshooting.md) — if model setup goes sideways
- [The Open Build](rebel://library/rebel-system%2Fhelp-for-humans%2Ffair-source-and-open-source-build.md) — in the open build you bring your own AI account or access code; there's no Mindstone plan

## Letting Mindstone handle it

The simplest path: pick a flat-fee **Mindstone plan** and Mindstone covers the AI bill — no keys, no separate accounts. Two plans (**Dash** and **Rogue**) share the same monthly usage allowance and differ in the calibre of models you get.

Subscribe from onboarding's **"Let Mindstone handle it"** option, or in [Settings → Agent & Voice → Intelligence](rebel://settings/agents). Full details — plans, allowance, billing, upgrades, and cancellation — are in [Mindstone plans](rebel://library/rebel-system%2Fhelp-for-humans%2Fmindstone-plans-and-billing.md).

The rest of this page covers the **bring-your-own** route.

## Bringing your own: ChatGPT Pro, OpenRouter, or Anthropic

If you'd rather use an account or key you already have, Rebel has three first-class choices:

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
4. If you disconnect your active provider, Rebel switches your active provider to another one you've connected, so you're not left without a model

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

If you want extra help with Anthropic-specific setup, see [Claude Max setup](rebel://library/rebel-system%2Fhelp-for-humans%2Fclaude-max-setup.md).

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
- **Council** — multiple models consulted in parallel for important decisions (see [Council Mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fmulti-model-council-mode.md))
- **Recovery** — a fallback that steps in when something hiccups, so work keeps going rather than stopping cold

If a chosen model can't be found, Rebel quietly switches to a working one and carries on instead of stopping with an error. And if a reply stutters mid-stream for a moment, Rebel retries on its own — you usually won't even notice.

When you pick which model to use for each role, you see a **unified list** — all your connected providers' models appear together, so you don't need to flip between tabs or providers to find the right fit. If you have both a subscription (e.g. ChatGPT Pro) and an API key for the same provider, they appear as **separate, distinct profiles** so the two don't get muddled.

Each role shows its **real status** at a glance. If a model is genuinely ready to use, it says so; if it would fail or still needs setup, it tells you that honestly rather than giving a false all-clear (or warning you about a model that's actually running fine). The fallback role — the model that steps in for very long conversations — gets its own **Pick fallback** nudge so it doesn't quietly go unset.

You manage all of this in **Settings → Agent & Voice → Intelligence** under the Model team section. Each model row has a chip-toggle to mark it as part of Council or not — no checkbox, no wizard.

### Smart model picking

**Smart model picking** lets Rebel choose which of your models runs each step of a job, rather than using one model for everything — a fast, cheap model for routine steps, a stronger one for the hard thinking, without you having to decide.

It's an **experimental feature and off by default.** Turn it on in **Settings → Agent & Voice → Intelligence**, under the Model team section: flip the **Smart model picking** toggle, then mark each model you want in the pool with its **Included in Smart picking** chip. You need at least two eligible models before it does anything.

A few things worth knowing:

- It only kicks in when Rebel is **planning** a job — i.e. you've set a separate Planner model so plan mode is active. For an ordinary one-shot reply, your Main work model handles it.
- If you've **explicitly picked a model** for the conversation, Rebel honours that and steps aside — Smart picking won't override your choice.
- It only ever picks from the models *you* marked eligible; it won't reach for something you haven't enabled.

If you'd rather just dial overall quality up or down without thinking about individual models, use the **Quality Tier** slider below — that's the simpler control for most people.

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
- Use the **Quality Tier** slider to set how much quality vs. speed you want per conversation — it's the simplest way to get good results without managing individual models (Smart model picking is a separate, experimental opt-in if you later want per-step routing)
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

Connecting your own model or a company gateway? See [Custom models and gateways](rebel://library/rebel-system%2Fhelp-for-humans%2Fcustom-models-and-gateways.md) — it covers setup, what the **Test** button checks, and how Rebel handles gateways that can't take certain settings.

## Cost tracking

Rebel tracks AI spend across the providers you use. Open [Settings → Usage](rebel://settings/usage) for an honest **You paid** total (what actually left your wallet, with any subscription coverage shown as context), plus expandable breakdowns by model, provider, automation, and day.

That is especially handy if you use one model for **Planner** and another for **Main work** — or if you want to know which conversation ran up the bill.

## When your key is rejected

If a provider turns down your credentials, Rebel names the **specific provider** and says the **saved** key was rejected — not that you mistyped it this turn. That matters: re-entering the same key won't help if it's been revoked or expired. The error points you to **Update key** and the right field in [Settings → Agent & Voice → Intelligence](rebel://settings/agents).

If the bad key belongs to an automation's provider, scheduled runs may pause until you fix it — see [Automations](rebel://library/rebel-system%2Fhelp-for-humans%2Fautomations.md).



