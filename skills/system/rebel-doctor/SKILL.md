---
name: rebel-doctor
description: "Diagnostic skill to validate Rebel workspace configuration including spaces, symlinks, and rebel-system directory structure."
---

# Rebel Doctor - Workspace Health Check

**Purpose**: Diagnostic skill to validate that a Rebel workspace is properly configured according to Mindstone Rebel / Rebel architecture (spaces + links + `rebel-system/`).

**Usage**: Run this when setting up a new workspace or troubleshooting configuration issues.

**Action**: READ-ONLY - Reports issues with clear suggestions but does NOT make changes.

---

## What This Checks

### Core Structure Requirements

1. **Top-level `README.md`**
   - Should exist at workspace root
   - Should contain agent identity, role, and workspace configuration
   - Should reference the system configuration and other spaces

2. **`rebel-system/` Directory**
   - Should exist (symlink or directory)
   - Should point to the app‑managed `rebel-system` directory (read‑only)
   - For non-Mindstone users: typically read-only copy or fork
   - Should contain: AGENTS.md, skills/, scripts/, templates/

3. **`Chief-of-Staff/` Space** (router and cross-space resources)
   - Should exist at workspace root
   - Should contain:
     - `README.md` - identity and cross-space configuration
     - `memory/` - cross-space memory, life dashboards, weekly reviews
     - `skills/` - cross-space skills
     - `scripts/` - cross-space scripts
   - **Note:** If you have an `all/` folder from an older setup, rename it to `Chief-of-Staff/` or merge its contents into your existing Chief-of-Staff space.

4. **`work/[COMPANY-NAME]/` Space** (at least one work space)
   - Should exist for work-related content
   - Should be organized by company/organization
   - Each company space should have its own structure (solo/, company/, team/, etc.)

5. **Proper References**
   - Top-level AGENTS.md should reference `@system/AGENTS.md`
   - Spaces should have clear boundaries and purposes

---

## Diagnostic Checks

When running this skill, check for:

### ✅ Critical (Must Have)
- [ ] Top-level README.md exists
- [ ] `rebel-system/` exists and is accessible
- [ ] `Chief-of-Staff/` directory exists
- [ ] At least one work or personal space exists

### ⚠️ Recommended (Should Have)
- [ ] `Chief-of-Staff/README.md` exists
- [ ] `Chief-of-Staff/memory/` exists
- [ ] `Chief-of-Staff/skills/` exists
- [ ] `Chief-of-Staff/scripts/` exists
- [ ] `rebel-system/AGENTS.md` is accessible
- [ ] Top-level README.md references system configuration
- [ ] Work space follows naming convention `work/[COMPANY-NAME]/`

### 💡 Optional (Nice to Have)
- [ ] `personal/` space exists (for personal artifacts)
- [ ] Spaces have consistent structure (memory/, skills/, scripts/, README.md)
- [ ] `logs/` or `.logs/` directory for system logs
- [ ] `.cursorignore` or `.gitignore` configured
- [ ] README.md or documentation present

---

## Report Format

When running diagnostics, provide:

### 🩺 Workspace Health Report

**Workspace**: `[path]`

**Status**: ✅ Healthy | ⚠️ Needs Attention | ❌ Critical Issues

#### Critical Issues
- List any missing required components
- Each with clear, actionable fix suggestion

#### Warnings
- List recommended components that are missing
- Each with explanation of why it's useful and how to add it

#### Suggestions
- List optional improvements
- Each with context on benefits

#### Summary
- Overall assessment
- Priority actions (if any)
- Next steps

---

## Example Report

```
🩺 Rebel Workspace Health Report
Workspace: /Users/username/projects/my-rebel-workspace
Status: ⚠️ Needs Attention

❌ Critical Issues:
1. Missing top-level README.md
   → Create README.md at workspace root with your identity, role, and space configuration
   → See rebel-system/templates/ for examples

2. rebel-system/ not found or not accessible
   → Ensure the workspace symlink `rebel-system/` exists and points to the app‑managed location (restart the app or re-run onboarding to recreate it)

⚠️ Warnings:
1. Chief-of-Staff/README.md is missing
   → Create README.md in Chief-of-Staff/ space to define cross-space identity and configuration
   → This helps AI assistants understand cross-space context

2. No work spaces found
   → Create work/[COMPANY-NAME]/ for work-related content
   → Consider work/[COMPANY-NAME]/solo/ for individual work
   → Consider work/[COMPANY-NAME]/company/ for shared team resources

💡 Suggestions:
1. Consider adding personal/ space
   → Useful for separating personal from work content
   → Should include memory/, skills/, scripts/ subdirectories

2. No .cursorignore found
   → Consider adding to exclude logs, cache, and sensitive files from AI context
   → Example: .logs/, *.log, node_modules/, venv/

📊 Summary:
Your workspace has the basic structure but is missing some critical configuration files.
Priority actions:
1. Create top-level README.md
2. Set up or link system/ directory
3. Create Chief-of-Staff/README.md for cross-space configuration

Once these are in place, your Rebel workspace will be fully functional!
```

---

## Implementation Notes

### For AI Assistants

When a user invokes this skill:

1. **Scan workspace root** for required files/directories
2. **Check `rebel-system/` accessibility** - can you read rebel-system/AGENTS.md?
3. **Verify Chief-of-Staff/ structure** - does it have the key subdirectories?
4. **Identify spaces** - what work/personal spaces exist?
5. **Check references** - does top-level README.md reference system/?
6. **Generate report** following the format above
7. **Be concise but clear** - focus on actionable fixes
8. **Don't make changes** - only report and suggest

### Detection Heuristics

- **AGENTS.md**: Check if README.md exists, check if it contains key sections (identity, role, references)
- **rebel-system/**: Check if directory/symlink exists, try reading rebel-system/AGENTS.md
- **Chief-of-Staff/**: Check directory exists, check for subdirectories (memory, skills, scripts)
- **Work spaces**: Look for `work/*/` directories
- **References**: Grep for `@rebel-system/` or `rebel-system/AGENTS.md` in top-level README.md

---

## Related Skills

- `system/scripts/setup-rebel-workspace.md` - Script to initialize a new Rebel workspace (if/when created)
- `system/skills/refresh-update-chief-of-staff-agents.md` - Update README.md configuration
- `system/help-for-humans/Rebel-architecture.md` - Architectural overview (if exists)

---

**Version**: 1.0  
**Created**: 2025-11-20  
**Last Updated**: 2025-11-20  
**Maintained By**: Mindstone Rebel Team

