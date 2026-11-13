---
description: "Fireworks AI — bring your own API key for Qwen and DeepSeek models hosted by Fireworks"
last_updated: "2026-11-12"
---

# Fireworks AI

**What it is:** Bring your own Fireworks AI API key to use hosted Qwen and DeepSeek models in Rebel. When your own Fireworks key pays, Fireworks bills you directly for what you use. Company-managed Fireworks models are paid by your organisation.

**Models that work well:** Qwen 3.7 Plus, the balanced default, and DeepSeek V4 Pro for harder reasoning-heavy work.

**While a Mindstone plan is in use:** models from this connection use your plan's allowance first. Here, **in use** means the plan's row in **Settings → Agent & Voice** says **In use**. Local services stay on your computer, and company-managed models stay company-paid. Pay-per-use prices apply when this connection pays.

**If your company provides Fireworks:** there's nothing to connect. Your admin gives you your own Fireworks key from the Transformation Engine, and Rebel collects it on its own; the models show as "{model} (set by {your company})". This needs version 0.4.63 of Rebel or later. If they show "Checking organisation connection..." for more than a few minutes, update Rebel and open Settings. Details, including how admins make and rotate Fireworks keys: [Company-provided keys](rebel://library/rebel-system%2Fhelp-for-humans%2Fcompany-provided-keys.md).

**How to connect your own key:** In [Settings → Agent & Voice](rebel://settings/agents), choose **Add an account or key** → **Connect your own AI service**. Enter a name, set **Base URL** to `https://api.fireworks.ai/inference/v1`, paste your Fireworks AI key, and choose **Save**. In **Settings → Agent & Voice**, choose **Add model** on that service's row and enter the model's Fireworks model ID.

**Useful links:**

- [Create a Fireworks API key](https://app.fireworks.ai/settings/users/api-keys)
- [Fireworks AI](https://fireworks.ai/)

## See also

- [Company-provided keys](rebel://library/rebel-system%2Fhelp-for-humans%2Fcompany-provided-keys.md) — how company keys reach Rebel, and what to do when one looks stuck
- [AI models](rebel://library/rebel-system%2Fhelp-for-humans%2FAI-models.md) — how to power Rebel's AI and pick models for each role
- [Custom models and gateways](rebel://library/rebel-system%2Fhelp-for-humans%2Fcustom-models-and-gateways.md) — running your own or a company-hosted model
- [Council Mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fmulti-model-council-mode.md) — second opinions from several models at once
- [Troubleshooting](rebel://library/rebel-system%2Fhelp-for-humans%2Ftroubleshooting.md) — if model setup goes sideways
