---
name: improve-skill
description: "Improve an existing shared skill with proper changelog tracking and attribution. Ensures changes are documented and credited."
use_cases:
  - "Improve a team skill"
  - "Add features to an existing skill"
  - "Fix issues in a shared skill"
  - "Make a skill better"
tags: ["skills", "improvement", "collaboration"]
last_updated: 2025-12-27
tools_required: [Read, Edit]
agent_type: main_agent
---

# Improve Skill

**Goal**: Help users improve existing shared skills while maintaining proper changelog and attribution.

## When to Use This Skill

Use this skill when users want to:
- Add new capabilities to an existing skill
- Fix issues or edge cases in a skill
- Improve the output quality of a skill
- Update a skill for new requirements

## Why Use This Instead of Direct Editing

Direct editing of skills bypasses:
- **Changelog tracking** - No record of what changed and why
- **Attribution** - No credit for your improvement
- **Review opportunity** - No chance to validate changes

This skill ensures improvements are documented and credited.

## When Quality Score Context is Present

If the user's message includes a quality description (e.g., "It's currently just started (18/100). Add an example or two."), skip the open-ended "What would you like to improve?" and act on the suggestion immediately:

- **"Add an example"** or **"examples"** → Jump straight to example creation (see Example Best Practices below)
- **"Add some structure"** or **"headings"** → Restructure the body with headings and action steps (see Improving Clarity below)
- **"Add some context"** or **"who made this"** → Enrich frontmatter: `author`, `tools_required`, `last_modified_at`, `contributed`
- **"Try using this skill"** or **"adoption"** → Suggest the user invoke the skill in a conversation and come back after
- **"Rate this skill"** or **"feedback"** → Explain that rating after using it helps shape its future

After addressing the specific suggestion, check if there's more to improve — offer one additional quick win if obvious. Don't overwhelm with a full audit.

## Process

### Step 1: Identify the Skill to Improve

If the user hasn't specified which skill:

> "Which skill would you like to improve? You can:
> - Name it directly (e.g., 'meeting-prep')
> - Describe what it does
> - Share the path"

Once identified, read the skill file to understand its current state.

### Step 2: Understand the Improvement

Ask what they want to improve:

> "I've read the skill. What would you like to improve?
> - Add new capability
> - Fix an issue
> - Improve output quality
> - Update for new requirements
> - Something else"

Get specific details about the change.

### Step 3: Make the Improvement

Edit the skill file with the requested changes. Be surgical — only change what's needed.

**Conciseness check**: Before adding content, ask: "Does Claude really need this? Can I assume it already knows this?" Every line added competes for context window space. Prefer one clear instruction over multiple elaborate rules.

**Accretion check**: Before adding a new section (deal-type recipe, format variant, edge-case block), check if the skill has accumulated similar sections over time. If so, consider the opposite operation — distill the skill back to its essence:
- Move accumulated recipes to `examples/` files and replace with "find relevant examples"
- Collapse SUCCESS/OUTPUT into GOAL
- Replace hardcoded tool references with conditional ones
- Reduce per-step field counts (3 powerful fields beat 12 prescriptive ones)
- Ask: "Would a shorter, more focused skill actually produce better output?"

**Outcome over format**: When improving a GOAL or process step, favour outcome-oriented language ("highest chance of conversion") over format-prescriptive language ("2-page document with 3 sections").

### Step 4: Test the Improvement

Before finalizing, verify the improvement actually works:

1. **Scenario test**: Run the skill (or mentally trace it) against a representative task that exercises the changed area
2. **Regression check**: Confirm existing behavior still works — the improvement shouldn't break what was already good
3. **Observe navigation**: If testing in a fresh conversation, watch how the agent navigates the skill — does it find and use the new content as intended?

If the skill underperforms on any scenario, iterate on the changes before proceeding.

### Step 5: Update Attribution

Update the frontmatter:

```yaml
contributed:
  - "Previous Contributors"
  - "{User's Name}"      # Add the improver
  - "Rebel"
last_modified_by: "{User's Name}"
last_modified_at: "{YYYY-MM-DD}"
```

### Step 6: Create Changelog Entry

Create a changelog file at `.changelog/{YYYY-MM-DD}-{username}-{brief-description}.md`:

```markdown
# {Brief Description of Change}

**Date**: {YYYY-MM-DD}
**Author**: {User's Name}

## What Changed

{Description of the changes made}

## Why

{Reason for the improvement}

## Impact

{What users will notice differently}
```

**Location**: `{skill-folder}/.changelog/`

### Step 7: Summarize

> "Done! I've improved {skill-name}:
> 
> **Changes**: {brief summary}
> **Changelog**: Created at `.changelog/{filename}`
> **Attribution**: Added you to contributors
> 
> The improvement is now live for everyone using this skill."

## Changelog Convention

Every improvement creates a changelog entry:

```
skills/meeting-prep/
├── SKILL.md
└── .changelog/
    ├── 2025-12-20-sarah-added-slack-context.md
    ├── 2025-12-25-tom-fixed-timezone-handling.md
    └── 2025-12-27-alex-improved-format.md
```

**Filename format**: `{YYYY-MM-DD}-{username}-{brief-description}.md`
- Use lowercase
- Use hyphens for spaces
- Keep description under 5 words

## Attribution Guidelines

**Get the user's name** (in priority order):
1. Check Chief-of-Staff README for name
2. Check existing skills' `author:` fields
3. Check email signatures
4. Fall back to email address
5. Ask if nothing found

**Be consistent**: Use the same name format across all changes in a session.

## Example Interaction

**User**: "I want to improve meeting-prep to include Slack context"

**Assistant**: *Reads meeting-prep skill*

> "I see meeting-prep currently gathers calendar and attendee info. You want to add Slack context - great idea!
> 
> What Slack context should it include?
> - Recent messages with attendees
> - Relevant channel discussions
> - Both?"

**User**: "Both - recent DMs and relevant channels"

**Assistant**: *Edits SKILL.md to add Slack context gathering*
*Updates attribution with user's name*
*Creates changelog entry*

> "Done! I've improved meeting-prep:
> 
> **Changes**: Added Slack context gathering (DMs + channels)
> **Changelog**: `.changelog/2025-12-27-alex-added-slack-context.md`
> **Attribution**: Added you to contributors
> 
> Everyone using meeting-prep will now get Slack context in their prep."

## Example Best Practices

Examples are the single highest-leverage improvement. They teach Rebel what great output looks like — the difference between generic results and nailing it every time.

- **Minimum**: 1 example (dramatically better than none)
- **Sweet spot**: 3-5 examples covering *different scenario types*, not variations of the same input
- **Each example should**: show complete output, use realistic but anonymised data, match the skill's format, include frontmatter with `description` and `generated_by`
- **Location**: `{skill-folder}/examples/{scenario-type}.md` in lowercase-hyphen

**Creation flow**: Ask what scenario the user handles most often → generate an example or ask them to paste output they liked → review together → save → offer to create another for a different scenario.

See `@write-skill` for full file conventions and structure templates.

## Use Cases Best Practices

Use cases are the discovery mechanism — they help the system suggest the right skill.

- Phrase as things users actually say: "Prepare me for my next meeting", "Draft a follow-up email"
- 3-7 use cases is ideal
- Cover the main triggers, not every permutation
- Avoid overlap with other skills

## Improving Clarity

If the skill body reads as a wall of text:

- **Add headings**: `[PROCESS]`, `[IMPORTANT]`, `[CONTEXT]` sections following the standard structure
- **Convert prose to steps**: numbered steps that start with verbs
- **Body too long** (>500 lines): move reference material to `references/` files
- **Body too short** (<50 words): help the user flesh out the process

## Improving Structure (distillation)

If the skill has grown bloated through accumulated updates:

- **Recipe accretion**: Multiple deal-type/format-variant/edge-case sections? Move to `examples/` files, replace with "find relevant examples of similar type"
- **Redundant sections**: Separate [GOAL], [OUTPUT], [SUCCESS] with overlapping content? Fold SUCCESS into GOAL, remove OUTPUT if obvious
- **Over-prescribed process**: 10+ fields per step? Collapse to the 2-3 that actually matter — agent derives the rest
- **Hardcoded tools**: Specific model names, voice IDs, cost calculations? Replace with conditional references ("if you have X tool")
- **Lengthy CONTEXT**: Backstory, who discussed it, when? Reduce to 1-2 sentences: what this IS and ISN'T
- **Extract named sub-sections**: Quality criteria mixed into process steps? Extract to `[WHAT A GREAT X LOOKS LIKE]` — separates "what good looks like" from "how to make it"

See `@write-skill` for the standard skill structure template and distillation principles.

## Related Skills

- `@customise-and-extend-skill` - Personalize a skill for yourself (doesn't modify the original)
- `@write-skill` - Create a completely new skill
- `@skill-repair` - Fix broken skills or frontmatter
