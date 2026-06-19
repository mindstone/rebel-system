---
description: "How to route messages to specific AI models with @-mentions, and use Council Mode to consult multiple models in parallel"
last_updated: "2026-05-11"
---

# Council Mode

Council Mode lets Rebel consult multiple AI models simultaneously — Claude, GPT, Gemini, and others — then synthesize their responses into a single answer. Useful for cross-checking research, getting diverse perspectives, or validating important decisions.


## See also

- [AI models](library://rebel-system/help-for-humans/AI-models.md) — Model configuration basics, including Smart model picking (Rebel's automatic per-step model selection within your Quality Tier — different from Council, but complementary)
- [Settings and configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — Where to find Council Mode settings


## Quick model routing with @-mentions

You don't need to enable Council Mode to use other models. Just mention a model by name in your message:

- **@-mention**: Type `@` in the composer and select a model from the **Models** tab in the mention picker
- **Natural language**: Just describe what you want — "use GPT for this" or "ask Gemini about this"

Rebel routes that single message to the mentioned model and returns its response. This is useful for one-off comparisons or when a specific model is better suited for a task, without changing your default settings or running a full council.

The @-mention approach and Council Mode complement each other:
- **@-mention** — Route one message to one model
- **Council Mode** — Consult multiple models in parallel and synthesize their answers


## How Council Mode works

When you send a message with Council Mode enabled:

1. Rebel dispatches your request to multiple AI models in parallel (each runs as a subagent)
2. Each model investigates independently with access to the same tools and context
3. Rebel synthesizes all responses into a single, cross-checked answer
4. You can expand each sub-agent's result to see individual model responses

This costs roughly 4x the tokens of a single-model response (depending on how many models you include).


## Setup

### 1. Add model profiles

In the same settings tab under **Model Profiles**, you have two ways to add council members:

#### Quick Add (recommended)

Pre-configured profiles appear as cards below the model list — for example, "GPT-5.2 High Thinking" or "GPT-5.2 Pro Max Thinking." Click one, enter your API key (or reuse the one from your voice settings if it's the same provider), and you're done. The model, thinking level, and council membership are all pre-set.

#### Manual setup

For full control or custom endpoints:

- Click **Add Profile**
- Choose a provider (OpenAI, Google Gemini, Together AI, Cerebras) or configure a custom endpoint
- Enter your API key for that provider
- Optionally set a **thinking level** (Low, Medium, High, or Extra High) to control how deeply the model reasons — higher levels produce more thorough answers but use more tokens
- Look for the **Council** chip on the model row — that's your toggle. Click it to add or remove this profile from council deliberations. (If the chip isn't visible, open the Model team section in Settings → Agent & Voice → Intelligence to access it.)

You can add as many council members as you like — there is no cap on the number of models.

### 2. Toggle per message

Once set up, a council icon (group icon) appears in the composer. Click it to toggle Council Mode on or off for individual messages — you don't have to use it every time.

- **ON** — The next message consults all council members
- **OFF** — Normal single-model response


## When to use it

**Good for:**
- Important research where accuracy matters
- Decisions that benefit from multiple perspectives
- Fact-checking or validating claims
- Complex analysis where different models may catch different things

**Skip it when:**
- Speed matters more than thoroughness
- The task is straightforward
- You want to minimize token usage


## Thinking levels

Each council member can be assigned a thinking level that controls how deeply it reasons through problems:

| Level | Best for |
|-------|----------|
| **Low** | Quick factual lookups, simple questions |
| **Medium** | Balanced speed and depth (default for most models) |
| **High** | Complex analysis, important decisions |
| **Extra High** | Maximum reasoning depth (available on select models like GPT-5.2 Pro) |

Higher thinking levels produce more thorough answers but use more tokens. Quick Add presets come with a sensible default already set.


## Error handling

If a council member hits a problem — an invalid API key, a rate limit, or a provider outage — Rebel surfaces the error in real time within the conversation. You'll see which model failed and why, so you can fix it (update the key, wait, or remove the profile) without guessing.


## Supported providers

Council Mode works with any OpenAI-compatible API endpoint. Built-in presets and Quick Add profiles are available for:

- **OpenAI** — GPT-5.2, GPT-5.2 Pro, and more. Includes ready-made profiles like "GPT-5.2 High Thinking" and "GPT-5.2 Pro Max Thinking."
- **Google Gemini** — Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini 3 Flash, Gemini 3.1 Pro.
- **Together AI** — Open-source models hosted on Together's infrastructure.
- **Cerebras** — Ultra-fast inference (Llama, Qwen, GPT OSS models).

You can also configure custom endpoints for other providers like Ollama, LM Studio, or any OpenAI-compatible service.


## Tips

- Mark only the profiles you want as council members — other profiles can be used as Planner, Main work, or Behind the Scenes instead
- Each council member runs independently, so a slow provider won't block faster ones
- If you already have an API key set up for voice (e.g., OpenAI), Quick Add can reuse it — no need to paste it again
- Expand sub-agent results to see how each model approached the problem differently
- Council responses appear in the conversation like normal messages, with expandable detail for each model's contribution
