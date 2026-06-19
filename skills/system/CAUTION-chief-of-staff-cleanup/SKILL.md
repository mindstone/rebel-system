---
name: caution-chief-of-staff-cleanup
description: Clean up a bloated Chief-of-Staff README by removing duplicates and extracting reference content to memory/topics
---

# CAUTION: Chief of Staff Cleanup

**IMPORTANT:** This is the manual, high-caution cleanup path for large or ambiguous Chief-of-Staff README rewrites. Routine automatic-safe hygiene is governed by [memory-cleanup](../memory/beta/memory-cleanup/SKILL.md), which only allows reversible, private, meaning-preserving actions without review.

Only run this manual skill with explicit user approval. A backup will be created at `Chief-of-Staff/backups/YYMMDD_HHMM_pre-cleanup.md` before any changes. Automatic runs must not use this visible backup location; use the non-indexed backup/manifest contract in `memory-cleanup` instead.

**SCOPE:** This skill ONLY optimizes your `Chief-of-Staff/README.md` file. It cannot modify the platform-managed system prompt (`rebel-system/AGENTS.md`), which is maintained by the Rebel team.

**What this does:**
- Removes duplicate content (sections that exactly match `rebel-system/AGENTS.md`)
- Moves reference information (company details, team lists, etc.) to `memory/topics/`
- Keeps your README lean with only identity and preferences

**Why run this:**
- **Primary benefit:** Fixes erratic AI behavior caused by duplicate instructions
- **Secondary benefit:** Reduces token costs by 20-40% if your file is bloated

**How this works:** Your Chief-of-Staff file is loaded into EVERY system prompt. **Duplication causes models to behave erratically** — for some reason, when the same text appears multiple times (within your file or between your file and the system prompt), it leads to very verbose, inconsistent behavior and mistakes.

A 50KB Chief-of-Staff file means ~12,500 extra tokens per turn. Content in `memory/topics/` is FREE until actually read. See [memory-update](../../memory/memory-update/SKILL.md) for how the memory system works.

**Realistic expectations:** This optimization primarily improves **model reliability and consistency**. As a side effect, it can reduce costs by 20-40% if your Chief-of-Staff file is bloated. The main system prompt remains unchanged, so total system prompt size will still be substantial.

---

## Step 1: Read and measure

Read these files and report their sizes (lines/KB):
- `rebel-system/AGENTS.md` (platform instructions - DO NOT modify)
- `Chief-of-Staff/README.md` OR `Chief-of-Staff/AGENTS.md` (whichever exists)

## Step 2: Back up

Before ANY changes, copy the Chief-of-Staff file to:
`Chief-of-Staff/backups/YYMMDD_HHMM_pre-cleanup.md`

## Step 3: Categorize each section (with safety checks)

Go through the file and mark each section as one of:

| Category | Action |
|----------|--------|
| **DUPLICATE** | Delete (only if EXACT duplicate with no customizations) |
| **IDENTITY** | Keep in README |
| **REFERENCE** | Move to memory/topics/ |

### What counts as DUPLICATE (delete these):

**CRITICAL:** Before deleting anything, verify it's an EXACT duplicate. Users may have customized standard sections with:
- Personal preferences or overrides
- Space-specific examples or workflows
- Additional context relevant to their work

**Safe to delete if EXACT duplicates:**
- [PROCESS], [IMPORTANT], [SECURITY], [TOOL_USE], [AGENT_USE], [TASK_MANAGEMENT] sections (verify no custom additions)
- TodoWrite instructions
- Memory model explanations
- Terminology definitions
- File conventions
- Skills index
- Tool/MCP guidance
- Rules about fabricating data, minimal changes, etc.
- Anything that restates rebel-system/AGENTS.md

**DO NOT delete if:**
- Section has user-added content beyond the platform default
- Instructions include specific examples from the user's work
- User has added personal preferences to a standard section
- There's ANY doubt about whether it's customized

**When in doubt:** Show the user what would be deleted and ask for confirmation before proceeding.

### What counts as IDENTITY (keep in README):
- Name, email, role, teams, timezone
- Company variables (COMPANY_NAME, etc.)
- Personal preferences and working style
- Current focus/priorities (brief)

### What counts as REFERENCE (move to memory/topics/):
- Company details, history, structure
- Team member lists and bios
- Client/customer information
- Project details and specs
- Meeting notes or transcripts
- Contact lists
- Any detailed info that's useful but not needed every conversation

For detailed guidance on what belongs in topics vs README, see [memory-update](../../memory/memory-update/SKILL.md).

## Step 4: Create topic files for REFERENCE content

For each chunk of reference content, create a file in `Chief-of-Staff/memory/topics/`:
- `company-overview.md` - Company info
- `team-directory.md` - Team members
- `clients/[name].md` - Client details
- `projects/[name].md` - Project info
- Use descriptive filenames (see [memory-update](../../memory/memory-update/SKILL.md) for naming conventions)

Each file needs frontmatter:
```yaml
---
description: Brief description of what this file contains
---
```

## Step 5: Rewrite the README

Create a clean README with identity, preferences, stable high-utility working context, and short signposts. Target: under 100 lines.

Keep the frontmatter, then:
- Company variables
- Profile (name, email, role, teams)
- AI working preferences (2-5 bullets)
- Current focus (brief)
- Links to frequently-needed topic files

## Step 6: Preview deletions and get confirmation

**BEFORE making final changes:**

Show the user a detailed preview:
1. **Sections marked for deletion** - Show first 3-5 lines of each section to be deleted
2. **Verification question** - Ask: "These sections appear to be exact duplicates of platform defaults. Do any of these contain custom additions or preferences you want to keep?"
3. **Wait for confirmation** - Only proceed after user confirms it's safe to delete

## Step 7: Execute changes and report

After user confirmation, make the changes and show:
1. **Backup location:** Full path to the backup file created in Step 2
2. **Size change:** Original size → New size (lines and KB)
3. **Deleted sections:** List section names removed
4. **New topic files:** Full paths to files created in memory/topics/
5. **New README:** Show the cleaned README content in full
6. **Token savings:** Conservative estimate

## After Running This

1. Check the backup exists: `Chief-of-Staff/backups/`
2. Check the new topic files in `Chief-of-Staff/memory/topics/`
3. Test a conversation - if something's missing, it's probably in the backup or topics
4. If something's wrong, restore from the backup

## Expected Impact

**Primary benefit - Model behavior:** Removing duplicate instructions significantly improves model reliability and consistency. When instructions appear multiple times, models can get confused about which version to follow, leading to:
- Inconsistent behavior across conversations
- Ignoring important instructions
- Following outdated or conflicting guidance
- Generally erratic performance

This is the main reason to run this cleanup — **better, more predictable AI behavior**.

**Secondary benefit - Cost:** Optimizing your Chief-of-Staff file can reduce costs by 20-40% if significantly bloated. Actual savings depend on:
- How much duplicate content exists
- How much reference content gets moved to memory/topics/
- How often you need to access that reference content

**What this doesn't change:** The main system prompt (`rebel-system/AGENTS.md`) remains the same size, so your total system prompt will still be substantial. This optimization addresses one component of the total cost.
