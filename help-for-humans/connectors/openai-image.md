---
description: "Generate images with OpenAI's gpt-image-2 model"
---

# OpenAI Image Generation

Generate images from text. OpenAI's gpt-image-2 is particularly good at crisp text and multilingual copy. Saves to your workspace — no hunting around for the file.


## What You Can Do

- **Generate images** from text descriptions
- **Generate multiple variations in one go** — request `count: 1–8`
- **Edit an existing image** by describing the change — redraw, recolor, add/remove objects, or fix text
- **Put readable text inside the image** — gpt-image-2 handles Latin and non-Latin scripts well
- **Pick a quality level** — `low`, `medium`, `high`, or `auto` (defaults to `high`)
- **Choose a shape** — square, portrait, or landscape


## Setup

This connector uses your OpenAI API key:

1. Open **Settings → Connectors**
2. Find **OpenAI Image Generation** and enable it
3. Ensure your OpenAI API key is configured in **Settings → Voice** (shared with voice features)

> **Cost note**: Images are billed directly to your OpenAI account — not Rebel. At 1024×1024, OpenAI currently charges roughly $0.006 (low), $0.053 (medium), and $0.211 (high) per image. Batch requests multiply linearly by `count` (for example, `count: 8` at `high` is about $1.68). Edits cost more than generations because reference images are also billed — roughly $0.25-$0.40 per square edit at high quality. See [OpenAI pricing](https://openai.com/pricing) for current rates.

> **How it finds your files**: Edit requires the reference image to be in your current workspace — drag it in first if it's elsewhere.


## Alternatives

Other image generation tools with MCP support:

- [Replicate MCP](https://replicate.com/docs/reference/mcp) — Access Flux, Stable Diffusion, and many models
- [Stability AI MCP](https://github.com/tadasant/mcp-server-stability-ai) — Stable Diffusion models
- [fal.ai MCP](https://docs.fal.ai/model-apis/mcp) — Multi-model platform
- [Leonardo.ai MCP](https://docs.leonardo.ai/docs/connect-to-leonardoai-mcp) — Creative AI images
- [ComfyUI MCP](https://github.com/joenorton/comfyui-mcp-server) — Local Stable Diffusion

This integration calls the [OpenAI Images API](https://platform.openai.com/docs/api-reference/images) directly.


## See Also

- [MCP-tools-and-other-knowledge-sources](rebel://library/rebel-system%2Fhelp-for-humans%2Fmcp-connectors-tools-and-integrations.md) — overview of all connectors
