---
name: system-files-cleanup-to-be-company-agnostic
description: "Process for cleaning up rebel-system/ files to remove company-specific content and properly separate generic platform content from company-specific extensions"
last_updated: 2025-11-22
agent_type: main_agent
---

# System Files Cleanup - Company-Agnostic

## Purpose

Ensure `rebel-system/` files remain generic and reusable across different companies/users, while company-specific content lives in company spaces (e.g., `work/[COMPANY]/company/`).

## Principle

**Core rule**: The `rebel-system/` folder should contain ONLY generic, reusable platform content. Company-specific examples, configurations, or references belong in company spaces.

## See Also

- [signposting-to-single-source-of-truth.md](../documentation/signposting-to-single-source-of-truth/SKILL.md) - principles for avoiding duplication
- [rename-or-move.md](rename-or-move/SKILL.md) - for renaming company files to be more specific
- [file-naming-and-organisation.md](file-naming-and-organisation/SKILL.md) - naming conventions

## Process

### 1. Identify Cleanup Candidates

Look for system files that contain:
- **Company-specific examples** (e.g., "Sam's configuration", "Acme Inc platform MCP")
- **Company-specific tools/services** (e.g., internal platform integrations)
- **Company employee references** (names, roles, specific projects)
- **Company-specific workflows** (internal processes, team-specific practices)

**IMPORTANT**: If you're uncertain whether content is company-specific or generally useful, **ASK THE USER** before proceeding.

### 2. Plan the Separation

For each file needing cleanup:

**System file changes:**
- Remove company-specific sections
- Keep generic, reusable content
- Ensure examples are generic or widely applicable

**Company file changes:**
- Create/rename to indicate company specificity using lowercase-hyphen format with `-[CompanyName]-specific` suffix (e.g., `secrets-and-passwords-Acme-specific.md`, `MCP-tools-Acme-specific.md`) per [file-naming-and-organisation.md](file-naming-and-organisation/SKILL.md)
- Add prominent signposting to system file at top (blockquote with link and brief context)
- Keep ONLY company-specific content
- Remove duplicated generic content

**IMPORTANT**: If the scope is unclear or you see potential issues, **ASK THE USER** for clarification before making changes.

### 3. Validate the Split

Check that:
- ✅ System file is truly generic (no company names, employee names, company-specific tools)
- ✅ Company file has clear signposting to system file
- ✅ No important content was lost in the separation
- ✅ Both files have appropriate descriptions in frontmatter

### 4. Update References

Search for and update any references to renamed/moved files:
```bash
grep -r "old-filename" /path/to/workspace
```

Use [SD-string-displacement-find-replace.md](../utilities/SD-string-displacement-find-replace/SKILL.md) for bulk reference updates if needed.

## Examples

### Example 1: Secrets and Passwords Documentation

**Before cleanup:**
- `rebel-system/help-for-humans/secrets-and-passwords.md` - contained Acme Inc Slack links, company-specific branding, specific memory file references

**After cleanup:**
- `rebel-system/help-for-humans/secrets-and-passwords.md` - generic secrets management guidance only
- `work/CompanyName/company/memory/help/secrets-and-passwords-Acme-specific.md` - signposts to system file, contains only Acme Inc-specific content (Slack discussion, platform architecture context, team practices)

**Changes made:**
1. Removed Acme Inc Slack conversation link from system file
2. Made "Future plans" section generic (removed company-specific branding)
3. Fixed incorrect file path references in system file
4. Renamed company file to follow naming conventions (`-Acme-specific` suffix)
5. Rewrote company file with clear blockquote signposting at top

### Example 2: MCP Tools Documentation

**Before cleanup:**
- `rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md` - contained Acme Inc-specific sections

**After cleanup:**
- `rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md` - generic MCP info only
- `work/CompanyName/company/memory/help/MCP-tools-Acme-specific.md` - signposts to system file, contains only Acme Inc-specific content (internal platform MCP, Zapier configs, employee examples)

**Changes made:**
1. Removed "Acme Inc Internal Platform MCP" section from system file
2. Removed employee-specific examples (Sam's configuration) from system file
3. Renamed company file to indicate specificity with `-Acme-specific` suffix
4. Rewrote company file to signpost and contain only company-specific content

## When to Ask the User

**ALWAYS ASK** if:
- You're unsure whether content is company-specific or generally useful
- The file structure or scope is unclear
- You notice potential issues or complications
- Multiple cleanup approaches seem equally valid
- The changes might affect multiple users or teams

## Common Company-Specific Patterns to Remove

From system files, remove:
- ❌ Specific company names (unless as generic examples)
- ❌ Employee names and personal configurations
- ❌ Company-specific tools/platforms (unless widely used)
- ❌ Internal process descriptions
- ❌ Company-specific terminology (unless defining it generically)
- ❌ Links to company-specific resources
- ❌ Company-specific MCPs/integrations

## What Can Stay in System Files

Keep in system files:
- ✅ Generic instructions and processes
- ✅ Widely-used tool/service documentation
- ✅ Generic examples (e.g., "your company's internal platform")
- ✅ Architecture and design principles
- ✅ Placeholders like `{COMPANY_NAME}` (see `help-for-humans/variables-and-user-info.md`)

## Checklist

- [ ] Identified company-specific content in system file
- [ ] Confirmed scope and approach with user (if any uncertainty)
- [ ] Removed company-specific content from system file
- [ ] Created/renamed company-specific file with clear naming
- [ ] Added signposting from company file to system file
- [ ] Validated both files are complete and correct
- [ ] Updated any references to renamed files
- [ ] Verified frontmatter descriptions are accurate

## Notes

- This is an iterative process - system files may accumulate company-specific content over time
- Regular audits help maintain clean separation
- When in doubt about whether something is company-specific, **ask the user**

