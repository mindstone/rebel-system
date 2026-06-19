---
name: memory-cleanup
description: "Semi-autonomous maintenance skill that identifies stale content, consolidates duplicated information, safely keeps Chief-of-Staff README concise, and maintains source file hygiene in any space's memory system."
last_updated: 2026-05-19
tools_required: [Read, Edit, Bash]
agent_type: main_agent
---

# Memory Cleanup

Semi-autonomous maintenance skill that tidies up a space's README and memory structure by removing stale content, consolidating duplicates, and relocating misplaced files.

**Execution mode**: Semi-autonomous by default. Executes high-confidence actions automatically, asks for approval on medium/low confidence. Use `--dry-run` to preview all proposed changes before any modifications. In automatic Chief-of-Staff hygiene mode, only the explicitly listed safe actions may run without review.

**Target**: Any space with a README.md (Chief-of-Staff, General, Exec, or custom spaces).

## See also

- [memory-update](../memory-update/SKILL.md) - Adds new facts to memory during conversations
- [source-capture](../source-capture/SKILL.md) - Captures first-party sources (meetings, Slack, etc.)
- [memory-setup](../memory-setup/SKILL.md) - Initial memory structure setup
- [file-naming-and-organisation](../../system/file-naming-and-organisation/SKILL.md) - Naming conventions

## Persona

You are a meticulous information curator and knowledge architect, expert at identifying stale content, consolidating duplicates, and maintaining clean memory systems without losing valuable information.

## Goal

Clean up a space's memory system to keep README concise, relevant, up-to-date, and high-signal while properly organizing topic files and relocating misplaced content to appropriate spaces.

## Context

Rebel's memory system accumulates content over time. READMEs can bloat with time-sensitive bullets that become stale, detailed information that belongs in topic files, and references to content that should live in other spaces (company vs personal). Sources (`memory/sources/`) capture first-party content and can also accumulate without proper citation from topics.

This skill maintains memory hygiene by:
- Removing or archiving stale time-sensitive content
- Consolidating information that's duplicated between README and topic files
- Flagging customer/company content that may belong in another space
- Keeping README focused on genuinely high-frequency (50%+ utility) context
- Identifying stale or underutilized sources that could be consolidated into topic summaries
- Detecting broken wikilinks to non-existent sources
- Flagging orphaned sources not cited by any topic (for awareness, not deletion)

### Chief-of-Staff auto-hygiene contract

When this skill is run automatically for `Chief-of-Staff/README.md`, the user should not need to understand README vs topics vs sources. The agent may only perform reversible, private, meaning-preserving maintenance.

**Automatic safe actions:**
- Create a backup and run manifest before editing.
- Remove exact duplicate platform/system instruction blocks after verifying there are no user customizations.
- Move long private reference/detail sections from `Chief-of-Staff/README.md` into `Chief-of-Staff/memory/topics/`, then replace them with a short signpost and one-sentence blurb.
- Archive stale current-priority sections inside Chief-of-Staff private memory, preserving the original wording.
- Losslessly distil long private work-context blocks into compact linked README bullets only when the full original wording is first preserved in `Chief-of-Staff/memory/topics/auto-hygiene/`, the output keeps concrete active-work facts (status, owner/collaborator, next action, key risk/blocker when present), and deterministic validation accepts the result.
- Fix duplicate signposts or broken internal links when the intended target is unambiguous.

**Must stop and ask before:**
- Deleting content permanently.
- Moving content between Chief-of-Staff/private spaces and shared spaces.
- Changing stable identity, profile, preferences, goals, or working-style facts.
- Resolving ambiguous conflicting facts.
- Publishing, distributing, or promoting source-derived facts into shared spaces.

**Backup and recovery:**
- Automatic runs must store backups/manifests somewhere excluded from ordinary memory retrieval/indexing.
- The manifest must record before hashes, files created, files rewritten, backup paths, and skipped risky items.
- Any LLM-assisted distillation must be covered by deterministic fixtures and a live-output validation gate before release enablement.
- Recovery must account for created topic/archive files and signposts, not only the README backup.
- For automatic Chief-of-Staff hygiene, ignore the generic high-confidence list below unless the action is also listed in this auto-hygiene contract.

## Process

### 1. Identify target space

Ask user which space to clean up, or accept a path to any README.md file directly.

Examples:
- "Clean up Chief-of-Staff" → uses `~/rebel/Chief-of-Staff/README.md`
- "Clean up my project space" → user provides path like `~/projects/MyProject/README.md`
- Path to README.md → uses that file directly

Read the space's README.md to understand current state.

### 2. Scan for cleanup opportunities

Analyze README.md, topic files, and source files for:

**Stale time-sensitive content:**
- Date-specific bullets that have passed (e.g., "Event TODAY Dec 17" when it's Dec 19)
- "Current priorities" with old dates
- Completed/obsolete focus areas
- Meeting notes from past dates still in "Frequently Useful References"

**README bloat (information that doesn't meet 50%+ utility threshold):**
- Detailed setup instructions that exist in topic files (e.g., MCP integration details)
- Low-frequency references in "Frequently Useful References" (or where the references haven't been modified in a while)
- Customer-specific onboarding docs with specific dates
- Full file paths instead of wikilinks

**Misplaced content (wrong space):**
- Content in Chief-of-Staff or personal that should be in another space (e.g. of relevance to other people/teams, not sensitive, etc), e.g. shared with the whole company. IMPORTANT: get express permission before changing how/where things are shared.
- Sensitive content in shared spaces → should be in Chief-of-Staff or Exec or personal, or some other more narrowly-shared space
- Temporary scratch files in memory/ → should be in temp/

**Duplicated information:**
- Details in README that already exist in referenced topic files
- Multiple bullets covering the same topic
- Really detailed information in README.md that could just be compressed to a shorter pointer to the main/canonical/more detailed memory

**Source-related cleanup opportunities:**

*Broken wikilinks to sources:*
- Topic files citing `[[sources/yyMMdd/...]]` paths that don't exist
- Sources that were moved or renamed but wikilinks weren't updated
- Typos in source paths

*Orphaned sources (not cited by any topic):*
- Sources in `memory/sources/` that no topic file references
- Note: Orphaned sources are NOT errors — they still have value for semantic search. Flag them for awareness but don't auto-delete.

*Source consolidation candidates:*
- Very old sources (e.g., `occurred_at` > 6 months ago) that haven't been cited recently and whose key facts could be summarized into topic files
- Multiple related sources from the same period that could be consolidated into a single topic summary
- Sources with minimal unique value beyond what's already in topics (consider keeping for provenance)

**IMPORTANT for sources:** Sources are provenance records — they document where facts came from. Don't delete sources just because they're old. Consolidation means ensuring key facts are captured in topics, not necessarily deleting the source files.

### 3. Categorize actions by confidence level

**If `--dry-run` was requested:** Skip to Step 4 to present all proposed changes without executing any.

**High-confidence (execute automatically in normal mode):**
- Remove bullets with past dates that are clearly stale (e.g., "TODAY Dec 17" when it's Dec 19)
- Consolidate information that duplicates topic files (replace with wikilink reference)
- Move scratch files within the same private space to temp/
- Flag obvious cross-space placement issues for approval rather than moving them automatically
- Remove full file paths, replace with wikilinks
- Fix broken wikilinks to sources when exactly one unambiguous matching source file exists (typo fix); if multiple similar files could match, treat as medium-confidence

**Medium-confidence (always ask for approval):**
- Whether to keep brief mention of high-value but stale items vs fully remove
- Which space to move content to when multiple valid destinations
- Any move between private and shared spaces, even when the destination seems obvious
- Whether specific bullets meet 50%+ utility threshold
- Restructuring README sections for better organization
- Whether to consolidate old sources into topic summaries
- What to do with broken source wikilinks when the source file doesn't exist (remove citation, find correct source, or note provenance gap)
- Whether orphaned sources should be cited in relevant topics or left for search-only access

**Low-confidence (always ask for approval):**
- Deleting topic files entirely
- Moving sensitive information between spaces
- Major restructuring of README organization
- Deleting source files (sources are provenance — deletion loses traceability)
- Removing `## Sources` sections from topics

### 4. Execute or present changes

**Normal mode (default):**
- Execute high-confidence actions automatically
- Present medium/low-confidence actions for approval before executing

**Dry-run mode (`--dry-run`):**
Present ALL proposed changes grouped by confidence level. Do not execute any changes yet.

```
Proposed cleanup for [Space Name]:

HIGH-CONFIDENCE (would auto-execute in normal mode):
1. Remove stale bullet: "Rebel Launch Event TODAY (Dec 17, 2025)" - date has passed
2. Consolidate MCP details in README → reference [[topics/Rebel-MCP-Configuration]]
3. Move scratch file within the same private space: memory/scratchpad.md → temp/scratchpad.md
4. Flag possible cross-space move for approval: Customer-Onboarding-Dec2025.md may belong in General/customers/
5. Fix wikilink typo: [[sources/251015/251015_meeting_q3-reveiw]] → [[sources/251015/251015_meeting_q3-review]]

MEDIUM-CONFIDENCE (judgment call):
6. Remove "Current priorities (Dec 15)" section? May still be relevant.
7. Move to General or Exec? File contains customer contact info.
8. Broken link: [[sources/250801/250801_meeting_kickoff]] doesn't exist. Remove citation or note provenance gap?
9. Consolidate into topic? Source 250615_meeting_budget-planning (6+ months old, not recently cited) - key facts already in Project-Budget.md

LOW-CONFIDENCE (risky):
10. Delete orphaned topic file: old-project-notes.md?
11. Delete source file: 250301_slack_old-discussion.md (not cited, very old)? Note: Deletion loses provenance.

Reply with numbers to approve (e.g., "1,2,3,5") or "all high" / "all" / "none".
```

Wait for explicit user approval before proceeding.

### 5. Execute approved actions

For each approved action:
- Read relevant files
- Make minimal, focused edits
- Move files using `mv` command
- Track what was changed

**Pattern: Remove stale time-sensitive bullets**
For example, let's say it were late Dec 2025...
```
# Remove bullets like:
# - "Rebel Launch Event TODAY (Dec 17, 2025)"
# - "Current priorities (Dec 15, 2025): ..."
```

**Pattern: Consolidate README references to topic files**
```
# Replace:
# **Fireflies MCP integration (authenticated Dec 14, 2025):**
# - Available through Klavis MCP using API key authentication
# - Successfully tested: can retrieve meeting transcripts
# [... 20+ lines of detail]
#
# With:
# **Key MCP integrations:** Fireflies, Notion, Fathom, BrowserMCP all authenticated. See [[topics/Rebel-MCP-Configuration]] for details.
```

**Pattern: Move misplaced files**
```bash
mv "Chief-of-Staff/memory/scratchpad.md" \
   "Chief-of-Staff/temp/scratchpad.md"
```

**Pattern: Move scratch files to temp/**
```bash
mv "Chief-of-Staff/memory/scratchpad.md" \
   "Chief-of-Staff/temp/"
```

**Pattern: Fix broken wikilink to source**
```
# In topic file, fix typo:
# From: [[sources/251015/251015_meeting_q3-reveiw]]
# To:   [[sources/251015/251015_meeting_q3-review]]
```

**Pattern: Consolidate old source into topic**
```
# 1. Read the old source file to extract key facts
# 2. Update the relevant topic file with those facts, citing the source:
#    - Budget confirmed at $500k (from [[sources/250615/250615_meeting_budget-planning]])
# 3. Keep the source file (for provenance) unless user explicitly approves deletion
```

**Pattern: Handle broken source wikilink (source doesn't exist)**
```
# Option A: Remove the citation if the fact can stand on its own
# Option B: Note the provenance gap: "Budget was $500k (source unavailable)"
# Option C: Search for the correct source and fix the wikilink
# Always ask user which approach to take
```

**Pattern: Flag orphaned sources**
```
# List sources not cited by any topic:
# - memory/sources/250301/250301_slack_old-discussion.md
# - memory/sources/250415/250415_email_vendor-quote.md
#
# Options:
# 1. Leave as-is (still valuable for semantic search)
# 2. Add citations from relevant topics
# 3. Delete if truly obsolete (low-confidence, requires approval)
```

### 6. Report results

Summarize what was changed, e.g.
```
Memory cleanup complete for [Space Name]:

Approved actions executed:
- Removed 3 stale time-sensitive bullets from README
- Consolidated MCP integration details (now references topic file)
- Moved 2 customer onboarding files to General/customers/
- Moved 1 scratch file to temp/
- Fixed 2 broken wikilinks to sources
- Consolidated key facts from 1 old source into Project-Budget.md

Results:
- README.md: 150 lines → 109 lines (27% reduction)
- memory/topics/: 24 files → 20 files
- memory/sources/: 12 files (unchanged - sources preserved for provenance)
- Files relocated: 4 files
- Source wikilinks fixed: 2

Source health:
- Orphaned sources (not cited by topics): 3 flagged for awareness
- Broken source citations: 0 remaining

Skipped (not approved):
- 2 medium-confidence items
- 1 low-confidence item (source deletion)
```

## Important

- **Use `--dry-run` for cautious cleanup** - preview all proposed changes before any modifications
- **Never delete topic files without approval** - archive means remove README reference but keep the topic file
- **Never delete source files without explicit approval** - sources are provenance; deletion loses traceability
- **Preserve information** - when consolidating, ensure no information is lost
- **Use minimal edits** - make focused changes, don't restructure unless asked
- **Follow space boundaries** - respect Chief-of-Staff (personal/router), General (company-shareable), Exec (sensitive); never move content between private and shared spaces without explicit approval
- **Check for related cleanup needs** - if moving customer files, check if README still references them
- **Maintain wikilink format** - use `[[topics/filename]]` and `[[sources/yyMMdd/filename]]` for references
- **Document file moves** - report which files moved where
- **Avoid relative dates** - when updating content, use absolute dates (YYYY-MM-DD or "Dec 2025")
- **Ask when uncertain** - better to ask about placement than guess wrong
- **Sources are not stale just because they're old** - a meeting from 6 months ago is still valid provenance for facts
- **Consolidation ≠ deletion** - consolidating sources means ensuring key facts are in topics, not deleting the source
- **Orphaned sources are okay** - sources not cited by topics still have value for semantic search; flag but don't auto-delete

## Success Criteria

- README.md is concise and follows the rules in `memory-update`
- No stale time-sensitive content in README
- Information properly distributed between README (high-frequency) and topics (detailed)
- Files in correct spaces (personal vs company vs exec)
- No information lost during cleanup
- User has clear understanding of what changed
- No broken wikilinks to sources (either fixed or explicitly handled)
- Orphaned sources flagged for user awareness (not auto-deleted)
- Source files preserved unless user explicitly approves deletion
- Topics cite sources properly using `[[sources/yyMMdd/filename]]` format
