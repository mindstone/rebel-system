---
description: "Connect Figma to access your design files, components, variables, and screenshots"
---

# Figma

Access your Figma designs directly from Rebel. Get design context, extract variables, take screenshots, and read metadata from your active files.


## What You Can Do

- **Get design context** for selected frames — structured for React + Tailwind by default
- **Extract variables** and styles (colors, spacing, typography)
- **Take screenshots** of your current selection for visual reference
- **Read metadata** with layer IDs, names, types, positions, and sizes
- **Generate design system rules** to align code output with your design system
- **Read FigJam diagrams** in structured format with screenshots

> **Note**: This connector is read-only. It can inspect your designs but cannot create or modify them.


## Setup

1. Download and open the **Figma desktop app**
2. Open a Figma Design file and switch to **Dev Mode** (Shift+D)
3. In the inspect panel, click **Enable desktop MCP server**
4. In Rebel, go to **Settings → Connectors**, find **Figma**, and click **Connect**

No API key or sign-in needed — Rebel connects to Figma's local server, which uses your desktop app login.


## Tips

- **Select first**: Select the frame or component you want to work with in Figma before asking Rebel about it
- **Design-to-code**: Ask "convert this design to React" — Rebel reads the design context and generates aligned code
- **Style extraction**: Ask "what colors and spacing does this design use?" to extract design tokens
- **Layout reference**: Request a screenshot to verify your implementation matches the design


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
