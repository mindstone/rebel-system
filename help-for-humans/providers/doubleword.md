---
description: "Doubleword — a bring-your-own-key provider for cheap, open-source models (GLM, DeepSeek) built for background and automation work"
last_updated: "2026-07-05"
---

# Doubleword

**What it is:** A bring-your-own-key provider offering cheap, open-source models — GLM 5.2, DeepSeek V4 Flash, and DeepSeek V4 Pro. Best for background and automation work: each step takes about a minute, so it's not the one to reach for in a live back-and-forth. You can include it in Council and Smart model picking too — being slow, it makes those wait, so expect a pause when it's picked.

**About reasoning:** These are reasoning models — they think before they answer. Rebel can't dial that thinking up or down on Doubleword (unlike, say, Claude or GPT), so you won't see a thinking-effort control for them. Worth knowing for the bill: the thinking can count as output, so a "cheap" model can quietly cost a bit more than the sticker price suggests. Still cheap — just not free of its own thoughts.

**How to connect:** In [Settings → Agent & Voice → Intelligence](rebel://settings/agents), add a model, choose **Doubleword**, and paste your API key.

**Useful links:**
- [Create a Doubleword API key](https://docs.doubleword.ai/inference-api/creating-an-api-key)
- [Doubleword](https://www.doubleword.ai/)

## See also

- [AI models](rebel://library/rebel-system%2Fhelp-for-humans%2FAI-models.md) — how to power Rebel's AI and pick models for each role
- [Custom models and gateways](rebel://library/rebel-system%2Fhelp-for-humans%2Fcustom-models-and-gateways.md) — running your own or a company-hosted model
- [Council Mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fmulti-model-council-mode.md) — second opinions from several models at once
- [Troubleshooting](rebel://library/rebel-system%2Fhelp-for-humans%2Ftroubleshooting.md) — if model setup goes sideways
