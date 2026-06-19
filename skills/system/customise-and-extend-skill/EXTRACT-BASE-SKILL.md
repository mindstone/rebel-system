# Extract Base Skill from Customized Version

**Goal**: When you have a working customized skill and want to share the reusable parts with your team or the platform, this guide walks you through extracting a general-purpose base skill and converting your original into an extension.

> **See also**: The main [SKILL.md](./SKILL.md) covers extending an existing base skill with personal preferences.

## When to Use This

Use this workflow when:
- You've created a skill in `Chief-of-Staff/skills/` that works well and others could benefit from
- A team member's personal skill should become a team standard
- You want to contribute a skill back to the platform (rebel-system)
- You realize a "personal" skill is actually mostly general-purpose with a few personal tweaks

## Key Principles

1. **Identify the delta** - What's truly personal vs. what's generally useful?
2. **Base should stand alone** - The extracted base must work without your personal context
3. **Personal becomes minimal** - After extraction, your extension should be just preferences/context
4. **Preserve attribution** - Track who contributed what in the layering
5. **Test both directions** - Verify base works generically AND your extension still works for you

## Process

### Step 1: Analyze the Existing Skill

Read the skill you want to generalize and identify:

**General-purpose elements** (go in base):
- Process steps that work for anyone
- Common questions to consider
- Universal best practices
- Generic templates or structures

**Personal elements** (stay in extension):
- Your specific role/company context
- Format preferences unique to you
- Examples from your domain
- Modifications to steps based on your workflow

**Create a mental split:**
```
Original Skill = General Base + Personal Delta
```

### Step 2: Determine the Target Location

Where should the base skill live?

| Target | Location Pattern | When to Use |
|--------|-----------------|-------------|
| **Team** | `work/{Company}/{Team}/skills/{category}/{skill-name}/` | Team-specific workflow |
| **Company** | `work/{Company}/skills/{category}/{skill-name}/` | Company-wide standard |
| **Platform** | `rebel-system/skills/{category}/{skill-name}/` | Universal utility (requires contribution process) |

For platform contributions, coordinate with maintainers before creating.

### Step 3: Extract the Base Skill

**Important clarification**: "Base skill" here means "the new upstream layer in your chain." It may itself extend a deeper base (e.g., a company skill extending a platform skill), or it may be a standalone skill with no `extends:` field.

Create the new base skill file. Include standard frontmatter fields used in your skill format (see existing skills for reference). Key elements:

```yaml
---
name: {skill-name}
description: "{General description without personal context}"
# If this extends a deeper base (e.g., platform skill), include:
extends: {path-to-deeper-base}  # optional - omit if standalone
extension_type: overlay  # only if extends is present
# Standard fields (include as appropriate for your skill format):
use_cases:
  - "{Generic use case 1}"
  - "{Generic use case 2}"
tags: ["{relevant}", "{tags}"]
author: "{original author}"
contributed:
  - "{original author}"
  - "Rebel"
last_modified_by: "Rebel"
last_modified_at: "{YYYY-MM-DD}"
---

# {Skill Name}

{Content extracted from original, with personal references removed}

## When to Use

{Generic triggers}

## Process

{Steps that work for anyone}

## Template/Output Format

{Generic structure}
```

**Path convention**: Use workspace-root-relative paths for `extends:` (e.g., `rebel-system/skills/...` or `work/AcmeCorp/skills/...`), not filesystem-relative paths like `../`.

**Quality checks for the base:**
- [ ] No references to specific companies, roles, or contexts (unless it's a company-layer base)
- [ ] Process steps make sense without your domain knowledge
- [ ] Examples are generic or use placeholder domains
- [ ] Someone unfamiliar with your work could follow it

### Step 4: Convert Original to Extension

Now modify your original skill to become an extension:

```yaml
---
name: {skill-name}
description: "Personal extension of {base-skill-name} with {your context}"
extends: {relative-path-to-new-base}
extension_type: overlay
author: "{your name}"
contributed:
  - "{your name}"
  - "Rebel"
last_modified_by: "Rebel"
last_modified_at: "{YYYY-MM-DD}"
---

# Personal Extensions

## My Preferences

{Format preferences, length requirements, etc.}

## Additional Context

{Your role, company, domain specifics}

## Modified Steps

{Any steps you add/skip/change}

## My Examples

{Examples specific to your domain}
```

**What to remove from the original:**
- All general-purpose process steps (now in base)
- Generic use cases (now in base)
- Universal best practices (now in base)

**What to keep:**
- Your specific preferences
- Your context (role, company, domain)
- Your examples
- Your modifications to the standard process

### Step 5: Verify the Split

Test both skills:

**Test the base skill:**
1. Temporarily rename or move your personal extension to disable it
2. Invoke the base skill directly (e.g., `@client-meeting-prep` when only the company layer exists)
3. Verify it produces useful output with generic context
4. Check that it doesn't assume knowledge only you have
5. Restore your personal extension afterward

**Test your extension:**
1. Invoke your skill normally
2. Verify your preferences are applied
3. Confirm the base skill's process is inherited
4. Check that your personal context appears in output

### Step 6: Document the Relationship

Add a note to both files about their relationship:

**In the base skill** (optional, at bottom):
```markdown
## Extensions

This skill can be extended with personal or team preferences. See `@customise-and-extend-skill`.
```

**In your extension** (the `extends:` field already documents this):
```yaml
extends: work/AcmeCorp/skills/productivity/meeting-prep/SKILL.md
```

## Example: Extracting a Meeting Prep Skill

This example shows a 3-layer chain: platform base → company extension → personal extension.

### Before (Monolithic Personal Skill)

`Chief-of-Staff/skills/productivity/client-meeting-prep/SKILL.md`:
```yaml
---
name: client-meeting-prep
description: "Prepare for client meetings at TechCorp"
---

# Client Meeting Prep

## My Process
1. Research the client company in our CRM
2. Review past meeting notes in Notion
3. Check recent support tickets
4. Prepare one-page brief with:
   - Attendees and their roles
   - Account history (ARR, tenure, health score)
   - 3 talking points
   - 3 questions to ask
5. Send brief to account team 1 hour before

## My Format
Always one page. Bullet points. Include health score prominently.

## Context
I'm a CSM at TechCorp. Our clients are enterprise SaaS companies.
```

### After (Base + Extension)

**Base skill** at `work/TechCorp/skills/productivity/client-meeting-prep/SKILL.md`:
```yaml
---
name: client-meeting-prep
description: "Prepare for client meetings with research and structured brief"
extends: rebel-system/skills/productivity/meeting-prep/SKILL.md
extension_type: overlay
---

# Client Meeting Prep Extensions

## Company Context

TechCorp-specific additions to standard meeting prep.

## Additional Research Sources
- Check CRM for account details
- Review past meeting notes
- Check recent support tickets

## Brief Structure
Include in the meeting brief:
- Attendees and their roles
- Account history (ARR, tenure, health score)
- Key talking points
- Questions to explore

## Distribution
Send brief to account team before meeting.
```

**Personal extension** at `Chief-of-Staff/skills/productivity/client-meeting-prep/SKILL.md`:
```yaml
---
name: client-meeting-prep
description: "My preferences for client meeting prep"
extends: work/TechCorp/skills/productivity/client-meeting-prep/SKILL.md
extension_type: overlay
---

# Personal Extensions

## My Preferences
- Always one page maximum
- Bullet points only (no prose)
- Health score displayed prominently at top
- 3 talking points (not more)
- 3 questions (not more)

## Timing
Send brief 1 hour before meeting (not earlier).

## My Role Context
CSM focusing on enterprise SaaS clients.
```

## Common Mistakes

### Mistake 1: Base Still Contains Personal Context
**Wrong**: Base skill mentions "our CRM" or "my team"
**Right**: Base skill says "your CRM" or "the team"

### Mistake 2: Extension Duplicates Base Content
**Wrong**: Extension repeats all the process steps
**Right**: Extension only has preferences and modifications

### Mistake 3: Base Doesn't Work Standalone
**Wrong**: Base assumes context that's only in the extension
**Right**: Base produces useful output for any user

### Mistake 4: Forgetting to Update extends: Path
**Wrong**: Extension still has no `extends:` or points to wrong location
**Right**: Extension has correct relative path to new base

### Mistake 5: Breaking the Naming Convention
**Wrong**: Renaming the skill during extraction
**Right**: Keep the same `{skill-name}` folder name at all layers

## Checklist

Before considering the extraction complete:

- [ ] Base skill created at appropriate layer (team/company/platform)
- [ ] Base skill works without any extensions
- [ ] Base skill has no personal/company-specific references (unless it's a company base)
- [ ] Original skill converted to extension with `extends:` field
- [ ] Extension contains ONLY personal preferences and context
- [ ] Extension is significantly shorter than original
- [ ] Both skills have proper attribution in frontmatter
- [ ] Tested: base works generically
- [ ] Tested: extension works with your preferences applied

## Related Skills

- [SKILL.md](./SKILL.md) - Extend an existing base skill with preferences (forward direction)
- `@write-skill` - Create a completely new skill from scratch
- `@skill-repair` - Fix broken skill extensions or frontmatter
