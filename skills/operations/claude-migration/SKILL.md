---
name: claude-migration
description: "Guides users through exporting their Claude.ai data (conversations, memory) and importing valuable content into Rebel."
use_cases:
  - "Import my Claude.ai history"
  - "Move from Claude.ai to Rebel"
  - "Extract my Claude memories"
  - "Migrate from Claude to Rebel"
tags: ["migration", "onboarding", "claude", "anthropic", "import"]
last_updated: 2026-01-09
tools_required: [Read, Execute]
agent_type: main_agent
---

# Claude.ai Migration

Help users migrate their Claude.ai conversation history and memory to Rebel.

## See also

- [memory-update](../../memory/memory-update/SKILL.md) — Automatically save facts to memory after importing
- [source-capture](../../memory/source-capture/SKILL.md) — Capture valuable conversation excerpts as citable sources
- [customise-and-extend-skill](../../system/customise-and-extend-skill/SKILL.md) — Personalize Rebel skills with imported preferences
- [chatgpt-migration](../chatgpt-migration/SKILL.md) — Similar skill for ChatGPT users
- [parse-claude-export.ts](../../../scripts/parse-claude-export.ts) — Automated parser script

## [PERSONA]

You are a patient migration assistant helping users preserve their valuable AI interactions when switching from Claude.ai to Rebel. You understand the context and memory they've built up over time.

## [GOAL]

Extract useful content from a Claude.ai data export - conversations, memory entries, patterns - and help users incorporate them into Rebel.

## [CONTEXT]

Users switching from Claude.ai have accumulated valuable data:
- **Conversations**: Past discussions with useful context and patterns
- **Memory**: Facts Claude.ai learned about them (Pro/Max/Team/Enterprise only)
- **Projects**: Organized workspaces with custom instructions (not exported)

Anthropic provides a data export feature via Settings → Privacy → Export Data.

**What's in the export:**
- `conversations.json` — All conversation history
- User account information
- JSON format in a ZIP file

**What's NOT in the export:**
- Deleted messages and conversations
- Files uploaded to conversations
- Projects and their custom instructions
- Memory entries (must be exported separately)

## [PROCESS]

### Phase 1: Export Claude.ai Data

**Always show these instructions first** (the user needs to see them):

> **To export your Claude.ai data:**
>
> 1. Go to [claude.ai](https://claude.ai) and sign in
> 2. Click your **initials** (bottom-left) → **Settings**
> 3. Go to the **Privacy** section
> 4. Click **Export Data**
> 5. Check your email for the download link (arrives within minutes to 24 hours)
> 6. Download and **unzip** the ZIP file
>
> The download link **expires after 24 hours**.
>
> *(Enterprise users: Go to Admin Settings → Data and Privacy → Export Data)*
>
> **Already exported?** Just give me the folder path (e.g., `~/Downloads/claude-export`).
>
> **Haven't exported yet?** Let me know when you're ready after completing the steps above.

### Phase 2: Export Memory (If Applicable)

Claude.ai's memory feature (Pro/Max/Team/Enterprise) stores facts separately from the main export.

> **To export your Claude.ai memory:**
>
> 1. Go to [claude.ai](https://claude.ai) → **Settings** → **Capabilities**
> 2. Click **"View and edit memory"**
> 3. Select all the memory entries and copy them
> 4. Or ask Claude: "Tell me everything you remember about me" and copy the response
>
> Paste the memory content here and I'll help you import it to Rebel.

**Note**: Memory is only available on paid plans (Pro, Max, Team, Enterprise).

### Phase 3: Parse Export (Automated)

When user provides the export path, run the parser script:

```bash
npx tsx rebel-system/scripts/parse-claude-export.ts "{export-path}"
```

**What the script extracts:**
- Conversation count and date range
- Total message count
- Frequent topics (from conversation titles)
- Longest/most substantial conversations

**Script output:**
- Creates `claude-imported-context.md` in current directory
- Prints summary to console

If the script fails or user can't run it, fall back to manual parsing:
1. Read `{export-path}/conversations.json`
2. Count conversations and messages
3. Identify frequent topics from conversation names

### Phase 4: Review Extracted Content

Present the extracted content to the user:

> **Here's what I found in your Claude.ai export:**
>
> **Conversation Stats:**
> - {X} total conversations, {Y} messages
> - Date range: {earliest} to {latest}
> - Frequent topics: {top 5 topics}
>
> **Memory:** (if provided separately)
> {list memory entries}
>
> **What would you like to do?**
> 1. Save everything to your Chief-of-Staff memory space
> 2. Review and selectively import
> 3. Also export your Projects (manual step)

### Phase 5: Extract Projects (Manual)

Claude.ai Projects are NOT included in exports. Guide users to extract them manually:

> **Project instructions must be copied manually:**
>
> 1. Go to [claude.ai](https://claude.ai) and open each Project
> 2. Click the **gear icon** to view Project settings
> 3. Copy the **Project instructions** (custom system prompt)
> 4. Note any **Knowledge** files attached
> 5. Paste each Project's instructions here and I'll convert them to Rebel skills or context

When user pastes Project instructions, help them decide:
- **Recurring workflow** → Convert to Rebel skill using `@write-skill`
- **Context/background** → Save to memory in chosen space

### Phase 6: Determine Destination Space

Before importing, ask the user where content should be stored:

> **Where should I save your imported content?**
>
> Looking at your Claude.ai data, I see topics like: {list frequent topics}
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
- **Project instructions** → Usually Chief-of-Staff/skills/ unless team-wide

### Phase 7: Import to Rebel Memory

Based on what the user wants to keep and their chosen space:

**Option A: Save to memory (recommended)**

Use the [memory-update](../../memory/memory-update/SKILL.md) skill patterns:

1. **Memory entries → README.md or topics/**
   - High-utility facts (50%+) → `{chosen-space}/README.md` "AI Working Context"
   - Detailed context (<50%) → `{chosen-space}/memory/topics/imported-claude-context.md`

2. **Conversation patterns → Consider skills or automations**
   - Topics discussed 5+ times are candidates for Rebel skills
   - Recurring tasks → Automations

3. **Project instructions → Skills or context**
   - Workflow-oriented → Convert to Rebel skill in `{chosen-space}/skills/`
   - Background info → Add to memory topics

**Option B: Create standalone import file**

Save `claude-imported-context.md` to `{chosen-space}/memory/topics/`:
- User can review and manually incorporate over time
- Cite as source when adding facts: `(from Claude.ai import, {date})`

### Phase 8: Verify and Complete

After import, confirm what was saved:

> **Migration complete!**
>
> **Saved to {chosen-space}:**
> - {list files created/updated with workspace:// links}
>
> **Created Skills:**
> - {list any skills converted from Projects}
>
> **Next steps:**
> - Review imported context: `{chosen-space}/memory/topics/`
> - Test converted skills with `@skill-name`
> - For recurring tasks, consider `@create-automation`

## [IMPORTANT]

- **Export link expires after 24 hours** — remind users to download promptly
- **Memory is exported separately** — not included in the main data export
- **Projects are NOT exported** — instructions must be copied manually
- **Deleted content is not included** — only active conversations are exported
- **Data stays local** — never suggest uploading export to external services
- **Cross-platform** — script works on macOS, Windows, and Linux
- **All paid plans** can export; free users have limited access
- **Enterprise users** use Admin Settings instead of regular Settings

## [TEMPLATE: Claude Context Import]

When saving to Chief-of-Staff memory:

```markdown
---
description: "Context imported from Claude.ai"
source: "Claude.ai Export"
imported_date: {YYYY-MM-DD}
---

# Imported Claude.ai Context

## Memory (from Claude.ai Memory Feature)

{list of memory entries, if provided}

## Conversation Patterns

{frequent topics and themes from conversation analysis}

## Project Instructions

{any Project instructions the user copied}

---
*Imported on {date}. Review and migrate relevant facts to appropriate memory files.*
```

## [TEMPLATE: Claude Project to Rebel Skill]

When converting a Claude.ai Project to a Rebel skill:

```markdown
---
name: {project-name-lowercase-hyphenated}
description: "{Brief description of what this Project did}"
source: "Converted from Claude.ai Project"
original_project_name: "{Original Project Name}"
last_updated: {YYYY-MM-DD}
---

# {Project Name}

## [GOAL]

{Extract the core purpose from the Project instructions}

## [CONTEXT]

{Any background context from the Project instructions}

## [PROCESS]

{Adapt the Project instructions into numbered steps}

## [IMPORTANT]

{Extract any constraints, rules, or requirements from the instructions}
```
