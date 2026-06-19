# Externalized LLM Prompts

This directory contains all behind-the-scenes (BTS) LLM prompts used by Rebel, extracted from TypeScript source code into editable markdown files.

## File Format

Each prompt file has YAML frontmatter followed by the prompt body:

```markdown
---
description: Brief description of what this prompt does
service: src/core/services/someService.ts
variables: []
model_hint: haiku
critical: false
---
Your prompt text goes here...
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `description` | Yes | What this prompt does |
| `service` | Yes | Source service file that consumes this prompt |
| `variables` | No | List of Nunjucks `{{ variable }}` names (empty for static prompts) |
| `model_hint` | No | Target model tier (e.g., `haiku`, `sonnet`) |
| `critical` | No | If `true`, startup fails when this prompt can't load |

## Directory Structure

```
prompts/
  agent/          — Agent behavior (forager, planning, sub-agent curation)
  conversation/   — Conversation ops (compaction, summaries, titles, auto-continue)
  intelligence/   — Intelligence features (hero choice, meeting analysis, query gen)
  safety/         — Safety evaluation, content safety, done-safety
  utility/        — Quips, merge resolvers, onboarding, transcription
```

## Variable Types

### Nunjucks variables (`getPrompt`)
For code-controlled variables, use `{{ variable_name }}` syntax:
```markdown
Generate {{ quips_per_request }} quips...
```
The service calls `getPrompt(PROMPT_IDS.QUIP_STYLE, { quips_per_request: 5 })`.

### Raw placeholders (`getRawPrompt`)
For prompts that inject **user-generated content**, use literal placeholder text and `getRawPrompt()`:
```markdown
<user_message>
{{user_message}}
</user_message>
```
The service calls `getRawPrompt(PROMPT_IDS.DONE_EVALUATION).replace('{{user_message}}', msg)`.

This avoids Nunjucks interpreting `{{ }}` syntax that may appear in user content.

## Adding a New Prompt

1. Create a `.md` file in the appropriate category directory
2. Add YAML frontmatter with all required fields
3. Add the prompt ID to `PROMPT_IDS` and `PROMPT_REGISTRY` in `src/core/services/promptFileService.ts`
4. Use `getPrompt(PROMPT_IDS.YOUR_ID)` or `getRawPrompt(PROMPT_IDS.YOUR_ID)` in the service
5. Always call `getPrompt()` inside functions (lazy), never at module scope

## Health Checks

The system validates prompt files at startup and on-demand:
- **Existence check**: All registered prompts exist and are non-empty
- **Render check**: All prompts parse and render without errors
- **Variable check**: Frontmatter-declared variables are referenced in the template

Run health checks via Settings > Diagnostics, or programmatically via the health check API.
