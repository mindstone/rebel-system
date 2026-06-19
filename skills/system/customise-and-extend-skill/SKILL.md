---
name: customise-and-extend-skill
description: "Personalize any skill with your preferences, examples, and context. Supports layered extensions (personal, team, company) that chain together and inherit improvements from the base skill."
use_cases:
  - "Personalize a skill I use often"
  - "Add my preferences to meeting-prep"
  - "Customize a skill with my context"
  - "Make a skill my own"
  - "Create a team-wide extension with shared guidelines"
  - "Add company standards to a skill"
tags: ["skills", "personalization", "customization", "layering"]
last_updated: 2025-12-30
tools_required: [Read, Edit]
agent_type: main_agent
---

# Extend Skill

**Goal**: Help users personalize skills they use regularly by creating personal extensions that inherit improvements from the base skill.

## When to Use This Skill

Use this skill when users want to:
- Add their preferences to a skill they've used multiple times
- Customize a general-purpose skill with their specific context
- Create a personal version of a platform skill
- Add examples or format preferences to an existing skill

## Important Principles

1. **Extensions are deltas** - Only include what's new, extra, or different from the base skill. Don't restate what the base already covers.
2. **Inheritance works** - The extension automatically gets improvements to the base
3. **Ask one question at a time** - Don't overwhelm with a questionnaire
4. **Short is better** - A 20-line extension beats a 200-line duplicate
5. **Match naming exactly** - Folder name must match base skill name (lowercase-hyphen)

## Layered Extensions

Extensions can **chain**: a personal extension can extend a team extension, which extends a company extension, which extends the base skill. This enables shared customizations without duplicating content.

### Three Conceptual Layers

| Layer | Location | Purpose |
|-------|----------|---------|
| **System** | `rebel-system/skills/...` | Platform default (read-only) |
| **Shared** | `work/{Company}/skills/...` or `work/{Company}/{Team}/skills/...` | Org/team standards |
| **Personal** | `Chief-of-Staff/skills/...` | Individual preferences |

### How Chaining Works

Each extension has `extends:` pointing to its parent. When using a skill:

1. Read the extension you're invoking
2. If it has `extends:`, read that skill too
3. Continue until you reach a skill with no `extends:` (or `extension_type: replace`)
4. Apply instructions from least-specific → most-specific; most-specific wins for conflicts

**Example chain:**
```
Chief-of-Staff/skills/sales/email-to-customers/SKILL.md
  extends: work/AcmeCorp/Sales/skills/sales/email-to-customers/SKILL.md
    extends: work/AcmeCorp/skills/sales/email-to-customers/SKILL.md
      extends: rebel-system/skills/sales/email-to-customers/SKILL.md
```

### Safety Guidelines

- **Max depth**: Keep chains to 3-4 levels. Deeper chains add complexity without proportional value.
- **Avoid cycles**: Never have skill A extend B which extends A.
- **Missing layers are fine**: Personal can extend directly from system if no shared layer exists.
- **`extension_type: replace`**: Stops the chain. Use when you want to shadow the base completely rather than overlay.

### When to Use Shared vs Personal

- **Shared (team/company)**: Tone guidelines, industry context, compliance requirements, templates everyone should follow
- **Personal**: Format preferences, individual role context, communication style

## Naming Conventions

**IMPORTANT: Folder names must match the base skill exactly:**
- If extending `meeting-external-prep` → create folder `meeting-external-prep/`
- If extending `sales-proposal-drafting` → create folder `sales-proposal-drafting/`
- Do NOT change casing (use lowercase-hyphen like the base)
- Do NOT add suffixes like `-PERSONAL` or `-extended`

## Attribution Requirements

**Always include attribution fields in frontmatter:**

```yaml
author: "User Name"
contributed:
  - "User Name"
  - "Rebel"
last_modified_by: "Rebel"
last_modified_at: "2025-12-27"
```

### Getting the User's Name

**CRITICAL: Be consistent.** If creating multiple skills, use the SAME name format for all.

**To find the user's name (in priority order):**
1. **Check Chief-of-Staff README** - Look in `Chief-of-Staff/README.md` for name
2. **Check existing skills** - Look at `author:` fields in their other skills
3. **Check email signatures** - If they have email examples, look for signature
4. **Fall back to email** - If no name found, use their email address
5. **Ask the user** - If nothing found: "What name should I use for attribution?"

**Name format rules:**
- Prefer full name with proper capitalization: "Jane Smith"
- If using email, use full email: "jane@example.com"
- NO parenthetical notes - just the clean name/email
- Use "Rebel" for AI contributions (not "Rebel (Claude)")
- **BE CONSISTENT** - don't mix "Jane Smith" and "jane@example.com" in the same batch

**WRONG formats:**
```yaml
# WRONG - parenthetical notes
contributed:
  - "User Name (original author)"

# WRONG - object format
contributed:
  - role: "Original Author"
    entity: "user@email.com"

# WRONG - inconsistent naming in same session
# Skill 1: author: "Jane Smith"
# Skill 2: author: "jane@example.com"  # Should match Skill 1!
```

## When Quality Score Context is Present

If the user's message includes quality context (e.g., "It's currently taking shape (42/100). This skill could be personalised for your workflow"), adapt:

- **High usage, no personal extension**: Lead with the opportunity — "You've used this skill often. Adding your preferences will make it sharper for your specific workflow."
- **Bloated extension** (>100 lines): Offer to trim — "Your personalisation is quite detailed. Let's keep just the delta — your preferences that differ from the base skill."
- **Ideal extension**: 20-50 lines. What belongs: format preferences, recurring context (role, company, industry), example outputs you liked. What doesn't belong: anything the base skill already covers.

## Process

### Step 1: Identify the Base Skill

If the user hasn't specified which skill to personalize:

> "Which skill would you like to personalize? Some popular ones to extend:
> - `meeting-prep` - Add your meeting format preferences
> - `research` - Add your research structure
> - `document-writing` - Add your writing style"

If they have specified, confirm and read the base skill:

1. Read the skill file to understand what it does
2. Check it's a platform or space skill (not already in Chief-of-Staff)
3. Note the category from the path (e.g., `productivity`, `research`)

### Step 2: Determine Target Layer and Check Existing

First, clarify where this extension should live:

> "Should this be a **personal** extension (just for you) or a **shared** extension (for your team or company)?"

- **Personal**: Target is `Chief-of-Staff/skills/{category}/{skill-name}/`
- **Shared**: Target is `work/{Company}/skills/{category}/{skill-name}/` or `work/{Company}/{Team}/skills/{category}/{skill-name}/`

Then check if an extension already exists at the target location:

- **If exists**: "You already have an extension for this skill at {path}. Would you like to update it?"
- **If not**: Proceed to gathering preferences

Also check if a parent layer exists that this extension should extend (rather than extending the base directly).

### Step 3: Gather Personalization Context

Ask ONE question at a time, waiting for response before the next:

**Question 1 - Format Preferences**:
> "What's your preferred format or structure when using this skill? For example, do you prefer bullet points, specific sections, or a particular length?"

**Question 2 - Recurring Context** (if relevant):
> "Any context that should always be included? This might be your company, role, industry, or specific constraints."

**Question 3 - Example** (optional):
> "Do you have an example of output you liked? You can paste it or describe what made it good. (Skip if not needed)"

**Question 4 - Modifications** (if relevant):
> "Any steps you'd typically add, skip, or modify from the standard process?"

Don't ask all questions if earlier answers give enough context. Use judgment.

### Step 4: Generate the Extension

Create the extension file with:

```yaml
---
name: {skill-name}
description: "Personal extension of {base-skill-name} with {brief context}"
extends: {base-skill-relative-path}
extension_type: overlay
author: "{user's full name}"
contributed:
  - "{user's full name}"
  - "Rebel"
last_modified_by: "Rebel"
last_modified_at: "{YYYY-MM-DD}"
---

# Personal Extensions

## My Preferences

{Format preferences gathered in Step 3}

## Additional Context

{Recurring context gathered in Step 3}

## Example Output

{Optional - only if provided}
```

**Location**: `Chief-of-Staff/skills/{category}/{skill-name}/SKILL.md`

### Step 5: Explain Inheritance

After creating the extension:

> "Done! Your personalized version of {skill-name} is ready.
>
> **How it works**:
> - When you use `@{skill-name}`, your preferences will be included automatically
> - If the base skill improves, your extension inherits those improvements
> - To update your preferences, edit the file or run `@customise-and-extend-skill` again"

## Template

```markdown
---
name: {skill-name}
description: "Personal extension of {base-skill-name} with {user's context}"
extends: {base-skill-relative-path}
extension_type: overlay
---

# Personal Extensions

## My Preferences

{User's format preferences, structure requirements, etc.}

## Additional Context

{User's recurring context: company, role, industry, constraints}

## Example Output

{Optional: Example output the user liked}
```

## Important Guidelines

### Keep It Short
- The extension should be **just the delta** — what's new, extra, or different
- Don't duplicate or paraphrase content from the base skill
- Don't improvise extra content beyond what the user provided
- 20-50 lines is ideal; over 100 lines usually means there's duplication to trim

### Respect the Base
- Don't contradict the base skill's purpose
- Add to the process, don't redefine it
- If the user wants something completely different, suggest `@write-skill` instead

### Use Clear Language
- Match the user's terminology
- Be specific ("bullet points with 3-5 items" not "concise format")
- Include actual examples when the user provides them

## Example Interaction

**User**: "I want to personalize meeting-prep"

**Assistant**: *Reads `rebel-system/skills/productivity/meeting-prep/SKILL.md`*

> "I've read the meeting-prep skill. It helps prepare agendas, research attendees, and gather context.
>
> Let's customize it for you. First question:
> **What's your preferred format for meeting prep output?** For example, do you want a specific agenda structure, bullet points, or something else?"

**User**: "I like a one-page brief with attendees, key talking points, and 3 questions I should ask"

**Assistant**:
> "Great - one-page brief format with attendees, talking points, and questions. 
>
> **Any recurring context?** For example, your role, company, or meeting types you have most often?"

**User**: "I'm a PM at TechCorp, mostly internal stakeholder meetings"

**Assistant**: *Creates extension*

> "Done! I've created your personalized meeting-prep extension at `Chief-of-Staff/skills/productivity/meeting-prep/SKILL.md`.
>
> Now when you use meeting-prep, it will automatically include your one-page brief format and PM context. The base skill will handle all the research and prep work, with your preferences layered on top."

## Related Skills

- `@write-skill` - Create a completely new skill from scratch
- `@skill-repair` - Fix broken skill extensions or frontmatter
- `@chief-of-staff-review-and-refine` - Review overall configuration

## Reverse Case: Extracting a Base Skill from a Customized Version

If you have a personal skill that works well and want to share the reusable parts with your team or company:

**See [EXTRACT-BASE-SKILL.md](./EXTRACT-BASE-SKILL.md)** for the complete workflow covering:
- How to identify what's general vs. personal in your skill
- Step-by-step process for extracting a base skill
- Converting your original into a minimal extension
- Testing and verification checklist
- Common mistakes to avoid

The short version:
1. Identify which parts are general-purpose vs. personal preferences
2. Create the base skill at the appropriate layer (team/company/platform)
3. Convert your original skill to an extension that `extends:` the new base
4. Verify both work correctly
