---
name: skill-repair
description: "Diagnoses and repairs skill issues: orphaned extensions, duplicate skills, missing frontmatter, naming inconsistencies, and implicit overrides."
last_updated: 2025-12-26
agent_type: main_agent
use_cases:
  - "Fix skill health check warnings"
  - "Clean up duplicate skills across spaces"
  - "Add missing extends declarations to personal overrides"
  - "Resolve naming inconsistencies between folder and frontmatter"
---

[WHEN QUALITY SCORE CONTEXT IS PRESENT]
If the user's message includes quality context (e.g., "It's currently just started (12/100). Add a description and use cases"):
- If the suggestion mentions **structure/description/use cases** → focus on adding missing frontmatter fields first
- If the suggestion mentions **broken chain** or **extends** → prioritise fixing or removing orphaned `extends` declarations
- If there are **duplicate skills** across spaces → help the user consolidate into proper extension chains

[GOAL]
Diagnose skill issues across the workspace and guide the user through fixing them, one at a time.

[CONTEXT]
Skills can get out of sync over time:
- Personal overrides may reference deleted base skills (orphaned)
- Same skill name may exist in multiple spaces without explicit extends
- Frontmatter may be missing required fields (name, description)
- Folder names may not match the name field in frontmatter

This skill helps identify and fix these issues interactively.

[PROCESS]
1. Scan all skill locations:
   - `rebel-system/skills/` (platform skills)
   - `Chief-of-Staff/skills/` (personal skills)
   - `work/*/skills/` (company/team skills)

2. Build skill inventory:
   - List all skills by name and location
   - Note frontmatter fields (name, description, extends, extension_type)
   - Identify examples folders

3. Detect issues:
   - **Orphaned extends**: `extends` field points to non-existent skill
   - **Implicit override**: Same name as platform skill without `extends` declaration
   - **Duplicate names**: Same skill name in multiple spaces without relationship declared
   - **Missing frontmatter**: Required fields (name, description) not present
   - **Name mismatch**: Folder name doesn't match `name` field
   - **Unused extension_type**: `extension_type` set without `extends`

4. Present issues one at a time:
   - Explain the issue clearly
   - Show the affected file(s)
   - Propose a fix
   - Ask for confirmation before making changes

5. Apply fixes:
   - Always create backup in an `archive/` folder before modifying
   - Make the change
   - Verify the fix worked

6. Summary:
   - Report what was fixed
   - Note any remaining issues that need manual attention

[FIXES]

**Orphaned extends:**
- Option A: Remove the `extends` field (skill becomes standalone)
- Option B: Update path to correct location (if skill moved)
- Option C: Delete the extension (if base was intentionally removed)

**Implicit override:**
- Add `extends` field pointing to platform skill
- Set `extension_type: overlay` (default) or `extension_type: replace`

**Duplicate names:**
- Rename one of the skills
- OR add `extends` declaration to make relationship explicit

**Missing frontmatter:**
- Add `name` (derive from folder name)
- Add `description` (ask user or leave placeholder)

**Name mismatch:**
- Update `name` field to match folder
- OR rename folder to match `name` field

[IMPORTANT]
- Always ask before making changes
- Always create backup before modifying files
- One issue at a time - don't overwhelm the user
- If unsure about the right fix, explain options and let user decide
- Some issues may require manual judgment - flag these clearly
