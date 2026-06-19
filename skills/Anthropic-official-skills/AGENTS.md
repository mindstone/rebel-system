---
description: Official Anthropic skills - reference implementations for Claude Code that can be adapted for Cursor
---

# Anthropic Official Skills

This folder contains the official skills from Anthropic, sourced from their open-source repository.

## Key Resources

- **[README.md](README.md)** - Overview of available skills and how to use them
- **GitHub Repository**: https://github.com/anthropics/skills/tree/main
- **Blog Post**: https://claude.com/blog/skills
- **Agent Skills Spec**: [[agent_skills_spec]] - Technical specification for how skills work

## About These Skills

These are the official Anthropic-provided skills designed to work within **Claude Code**. Since we're primarily working in **Cursor**, we don't get built-in support for them. However, they're just Markdown files and scripts, so we can still make sense of them and adapt them for our use.

Each skill is self-contained in its own directory with a `SKILL.md` file containing the instructions and metadata that Claude uses.

## Skill Categories

### Document Skills (`document-skills/`)
- **docx** - Create, edit, and analyze Word documents
- **pdf** - Comprehensive PDF manipulation toolkit
- **pptx** - Create, edit, and analyze PowerPoint presentations
- **xlsx** - Create, edit, and analyze Excel spreadsheets

### Creative & Design
- **algorithmic-art** - Create generative art using p5.js
- **canvas-design** - Design beautiful visual art in .png and .pdf formats
- **slack-gif-creator** - Create animated GIFs optimized for Slack

### Development & Technical
- **artifacts-builder** - Build complex claude.ai HTML artifacts
- **webapp-testing** - Test local web applications using Playwright

> **Note**: MCP server development guidance has been consolidated into `skills/coding/build-custom-mcp-server/`

### Enterprise & Communication
- **brand-guidelines** - Apply Anthropic's official brand colors and typography
- **internal-comms** - Write internal communications
- **theme-factory** - Style artifacts with professional themes

### Meta Skills
- **skill-packager** - Package and validate skills for external distribution
- **template-skill** - Basic template for new skills

## Usage in Cursor

While these skills are designed for Claude Code's plugin system, you can:
1. Reference the skill instructions directly in your prompts
2. Use the scripts and templates they provide
3. Adapt the patterns for your own Mindstone Rebel skills
4. Learn from their structure when creating custom skills

## License

The example skills are open source (Apache 2.0). The document skills are source-available but not open source - they're provided as reference examples.

