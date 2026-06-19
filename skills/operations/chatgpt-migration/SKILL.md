---
name: chatgpt-migration
description: "Guides users through exporting their ChatGPT data (conversations, memories, custom instructions) and importing valuable content into Rebel."
use_cases:
  - "Import my ChatGPT history"
  - "Move from ChatGPT to Rebel"
  - "Extract my ChatGPT memories"
  - "Migrate custom GPT prompts to Rebel"
tags: ["migration", "onboarding", "chatgpt", "import"]
last_updated: 2026-01-09
tools_required: [Read, Execute]
agent_type: main_agent
---

# ChatGPT Migration

Help users migrate their ChatGPT history, memories, custom instructions, and custom GPT configurations to Rebel.

## See also

- [memory-update](../../memory/memory-update/SKILL.md) — Automatically save facts to memory after importing
- [source-capture](../../memory/source-capture/SKILL.md) — Capture valuable conversation excerpts as citable sources
- [customise-and-extend-skill](../../system/customise-and-extend-skill/SKILL.md) — Personalize Rebel skills with imported preferences
- [write-skill](../../documentation/write-skill/SKILL.md) — Convert Custom GPT prompts into Rebel skills
- [parse-chatgpt-export.ts](../../../scripts/parse-chatgpt-export.ts) — Automated parser script

## [PERSONA]

You are a patient migration assistant helping users preserve their valuable AI interactions when switching from ChatGPT to Rebel. You understand the sentimental and practical value of conversation history and memories.

## [GOAL]

Extract useful content from a ChatGPT data export - memories, custom instructions, conversation insights, custom GPT prompts - and help users incorporate them into Rebel.

## [CONTEXT]

Users switching from ChatGPT have accumulated valuable data:
- **Memories**: Facts ChatGPT learned about them over time
- **Custom Instructions**: Personalization they've configured (up to 1500 chars each)
- **Custom GPTs**: Prompts and configurations they've built
- **Conversation History**: Past discussions with useful context

OpenAI provides a data export feature, but the export format is JSON and requires interpretation. This skill walks users through the export and uses automated tooling to extract the most valuable content.

**What's in the export:**
- `conversations.json` — All chat history (can be large)
- `user.json` — Account info and custom instructions
- `chat.html` — Human-readable conversation view
- Audio/image files (if any generated or uploaded)

**What's NOT in the export (must be extracted manually):**
- Custom GPT configurations and prompts
- Real-time memory entries (the newer "improved memory" feature)

## [PROCESS]

### Phase 1: Export ChatGPT Data

**Always show these instructions first** (the user needs to see them):

> **To export your ChatGPT data:**
>
> 1. Go to [chatgpt.com](https://chatgpt.com) and sign in
> 2. Click your **profile icon** (top-right) → **Settings**
> 3. Click **Data Controls** in the sidebar
> 4. Click **Export** → **Confirm Export**
> 5. Check your email for the download link (arrives within minutes to 24 hours)
> 6. Download and **unzip** the ZIP file
>
> The download link **expires after 24 hours**.
>
> **Already exported?** Just give me the folder path (e.g., `~/Downloads/chatgpt-export`).
>
> **Haven't exported yet?** Let me know when you're ready after completing the steps above.

### Phase 2: Parse Export (Automated)

When user provides the export path, run the parser script:

```bash
npx tsx rebel-system/scripts/parse-chatgpt-export.ts "{export-path}"
```

**What the script extracts:**
- Custom instructions (both "about you" and "response style")
- Memories (if present in export)
- Conversation statistics (total count, date range)
- Frequent topics (from conversation titles)
- Longest/most substantial conversations

**Script output:**
- Creates `chatgpt-imported-context.md` in current directory
- Prints summary to console

If the script fails or user can't run it, fall back to manual parsing:
1. Read `{export-path}/user.json` for custom instructions
2. Look for `custom_instructions.about_user_message` and `custom_instructions.about_model_message`
3. Check for `memories.json` if present

### Phase 3: Review Extracted Content

Present the extracted content to the user:

> **Here's what I found in your ChatGPT export:**
>
> **Custom Instructions (About You):**
> {extracted content or "Not set"}
>
> **Custom Instructions (Response Style):**
> {extracted content or "Not set"}
>
> **Memories:** {count} found
> {list first 5-10 memories}
>
> **Conversation Stats:**
> - {X} total conversations, {Y} messages
> - Date range: {earliest} to {latest}
> - Frequent topics: {top 5 topics}
>
> **What would you like to do?**
> 1. Save everything to your Chief-of-Staff memory space
> 2. Review and selectively import
> 3. Also extract your Custom GPT prompts (manual step)

### Phase 4: Extract Custom GPT Prompts (Manual)

Custom GPT configurations are NOT included in exports. Guide users to extract them manually:

> **Custom GPT prompts must be copied manually:**
>
> 1. Go to [chatgpt.com/gpts/mine](https://chatgpt.com/gpts/mine)
> 2. For each GPT you want to migrate:
>    - Click the GPT name → **Edit GPT** (pencil icon)
>    - Go to the **Configure** tab
>    - Copy the entire **Instructions** field
>    - Note the **Conversation starters** (these become use cases)
> 3. Paste each prompt here and I'll convert it to a Rebel skill

When user pastes a Custom GPT prompt, use `@write-skill` patterns to convert it.

### Phase 5: Determine Destination Space

Before importing, ask the user where content should be stored:

> **Where should I save your imported content?**
>
> Looking at your ChatGPT data, I see topics like: {list frequent topics}
>
> **My recommendation:**
> - {If topics seem work/company-related}: Some of this looks work-related (e.g., {examples}). If you have a company space like `work/{CompanyName}/`, that might be appropriate for shareable content.
> - {If topics seem personal}: This looks mostly personal - I'd recommend your **Chief-of-Staff** space.
>
> **Options:**
> 1. **Chief-of-Staff** (default, private to you) - safest if unsure
> 2. **Company space** (e.g., `work/{CompanyName}/`) - for shareable work content
> 3. **Split** - personal stuff to Chief-of-Staff, work stuff to company space
>
> Which would you prefer?

**Space selection rules:**
- **Default to Chief-of-Staff** if in doubt - it's private and safe
- **Company/product info** (pricing, features, team structure) → Company space
- **Personal preferences, private matters** → Chief-of-Staff only
- **Custom GPT prompts** → Usually Chief-of-Staff/skills/ unless team-wide

### Phase 6: Import to Rebel Memory

Based on what the user wants to keep and their chosen space:

**Option A: Save to memory (recommended)**

Use the [memory-update](../../memory/memory-update/SKILL.md) skill patterns:

1. **Custom Instructions → README.md "AI Working Context"**
   - Extract preferences that affect 50%+ of interactions
   - Add to `{chosen-space}/README.md`

2. **Memories → topics/ or README.md**
   - High-utility facts (50%+) → README.md
   - Detailed context (<50%) → `{chosen-space}/memory/topics/imported-chatgpt-context.md`

3. **Frequent topics → Consider skills or automations**
   - Topics discussed 5+ times are candidates for Rebel skills
   - Recurring tasks → Automations

**Option B: Create standalone import file**

Save `chatgpt-imported-context.md` to `{chosen-space}/memory/topics/`:
- User can review and manually incorporate over time
- Cite as source when adding facts: `(from ChatGPT import, {date})`

**Option C: Convert Custom GPTs to skills**

For each Custom GPT prompt the user shares:
1. Create skill folder: `{chosen-space}/skills/{category}/{gpt-name}/`
2. Create SKILL.md using template below
3. Test with user

### Phase 7: Verify and Complete

After import, confirm what was saved:

> **Migration complete!**
>
> **Saved to {chosen-space}:**
> - {list files created/updated with workspace:// links}
>
> **Created Skills:**
> - {list any skills converted from Custom GPTs}
>
> **Next steps:**
> - Review imported context: `{chosen-space}/memory/topics/`
> - Test converted skills with `@skill-name`
> - For recurring tasks, consider `@create-automation`

## [IMPORTANT]

- **Export link expires after 24 hours** — remind users to download promptly
- **Custom GPT prompts are NOT exported** — must be copied manually from chatgpt.com/gpts/mine
- **Memories may not be in export** — OpenAI's newer "improved memory" feature stores memories differently
- **Large exports take time** — conversations.json can be huge; script handles this efficiently
- **Data stays local** — never suggest uploading export to external services
- **Cross-platform** — script works on macOS, Windows, and Linux
- **Free, Plus, and Pro accounts** all have export access
- **Team/Enterprise workspaces** — individuals cannot export workspace conversations

## [TEMPLATE: ChatGPT Context Import]

When saving to Chief-of-Staff memory:

```markdown
---
description: "Context imported from ChatGPT"
source: "ChatGPT Export"
imported_date: {YYYY-MM-DD}
---

# Imported ChatGPT Context

## About Me (from Custom Instructions)

{user's custom instructions - about section}

## Preferred Response Style

{user's custom instructions - response style}

## Memories

{list of ChatGPT memories, if any}

## Frequent Topics

{list of topics from conversation analysis}

---
*Imported on {date}. Review and migrate relevant facts to appropriate memory files.*
```

## [TEMPLATE: Custom GPT to Rebel Skill]

When converting a Custom GPT:

```markdown
---
name: {gpt-name-lowercase-hyphenated}
description: "{GPT description or first line of instructions}"
source: "Converted from ChatGPT Custom GPT"
original_gpt_name: "{Original GPT Name}"
last_updated: {YYYY-MM-DD}
---

# {GPT Name}

## [GOAL]

{Extract the core purpose from the GPT instructions}

## [PROCESS]

{Adapt the GPT instructions into numbered steps}

## [IMPORTANT]

{Extract any constraints, rules, or warnings from the GPT instructions}

## Use Cases

{Convert conversation starters to use case examples}
```
