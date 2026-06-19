---
name: chief-of-staff-review-and-refine
description: Interactive review and refinement of Chief-of-Staff configuration file (README.md or AGENTS.md) to optimize AI assistant behavior, preferences, and context. Use when users want to update their personal AI assistant configuration.
last_updated: 2025-12-16
tools_required: [Read, Edit]
agent_type: main_agent
---

# Chief-of-Staff Configuration Review & Refinement

**Goal**: Help users review and refine their Chief-of-Staff configuration file (README.md or AGENTS.md) through an interactive, guided process that improves how their AI assistant works with them.

## About the Chief-of-Staff Configuration File

The Chief-of-Staff configuration file acts as **your AI assistant's instruction manual**. It defines:

- **Identity** - Who you are, what teams you're on, contact information
- **Behavior** - How the assistant should work with you (communication style, boundaries, decision-making)
- **Context** - What information should be auto-loaded for every task
- **Tools** - Which integrations (MCPs) the assistant can access
- **References** - Links to important memory files and resources
- **Privacy** - What information is personal vs shareable

This file is auto-loaded into every conversation, so keeping it focused and accurate is crucial.

## File Location & Naming

`Chief-of-Staff/README.md`


## When to Use This Skill

Use this skill when users want to:
- Review their current AI assistant configuration
- Update preferences or working style
- Refine communication boundaries
- Add or remove auto-loaded context
- Update tool/MCP preferences
- Clean up outdated information
- Improve assistant behavior based on experience

## Key Configuration Sections

Most Chief-of-Staff configuration files contain these sections:

### Core Identity Sections
- **Profile** - Basic identity (name, email, teams, location, timezone)
- **Company Variables** - Placeholders used in skills (`{COMPANY_NAME}`, etc.)
- **Related Spaces** - Other work areas in the Rebel workspace

### Behavioral Sections (Where Boundaries Are Set)
- **AI Working Context** - Behavior patterns, communication preferences, workflow patterns
- **Frequently Useful References** - Links to memory files and resources
- **Safety & Privacy** - Information handling rules and sensitive action protocols

### Technical Sections
- **MCPs (integrations)** - Which services the assistant can access
- **Memory storage** - Where different types of information live
- **Auto-Loaded Memory** - High-frequency context (aim for 50%+ utility)

## Review Process

Follow this structured approach to review and refine the configuration:

### Step 1: Locate and Read Current Configuration

1. Check for `Chief-of-Staff/README.md` first
2. If not found, check for `Chief-of-Staff/AGENTS.md`
3. Read the entire file to understand current configuration
4. Note the file path for future updates

### Step 2: Initial Assessment

After reading the configuration, provide a brief assessment covering:
- Overall structure and organization
- Potentially outdated information (old dates, completed projects, former priorities)
- Sections that appear incomplete or unclear
- Balance between high-frequency (auto-loaded) and low-frequency (should be in memory/topics/) context

Ask the user: **"Would you like to review your configuration section by section, or focus on specific areas you want to change?"**

### Step 3: Section-by-Section Review (if chosen)

For each section, present a focused analysis:

1. **Quote the current content** (or summarize if very long)
2. **Ask targeted questions**:
   - "Is this still accurate?"
   - "Should this be more/less detailed?"
   - "Is this used frequently enough to auto-load?"
   - "Would you like to add/remove anything?"
3. **Wait for response** before moving to the next section
4. **Propose specific edits** when changes are requested

### Step 4: Focused Review (alternative path)

If the user wants to focus on specific sections:

1. Ask: **"Which section would you like to focus on?"** (list the major sections)
2. Deep dive into that section with targeted questions
3. Propose refinements based on responses
4. Ask if they want to review additional sections

## Common Areas to Review

### Communication Style & Boundaries
**Key questions to explore**:
- How direct should the assistant be?
- Should the assistant ask permission before actions, or just execute?
- What tone is preferred (formal, casual, balanced)?
- What decisions should be escalated vs handled autonomously?

**Example refinements**:
- Adding explicit "ask first" rules for sensitive actions
- Defining preferred response length (concise vs detailed)
- Setting boundaries on proactive suggestions

### Task Management & Workflows
**Key questions to explore**:
- What recurring tasks should the assistant track?
- What workflows have been established that should be followed?
- Are there successful patterns that should be documented?

**Example refinements**:
- Adding workflow patterns that have proven effective
- Documenting preferences discovered through use
- Recording tool/service preferences for specific tasks

### Privacy & Information Handling
**Key questions to explore**:
- What information should never be shared in company spaces?
- What actions require explicit permission?
- Are there sources the assistant should avoid accessing?

**Example refinements**:
- Adding sensitivity markers for compensation/personal info
- Defining which spaces are shareable vs private
- Setting explicit rules for draft-first workflows

### Context & Memory Management
**Key questions to explore**:
- Is all auto-loaded context still high-frequency (50%+ utility)?
- Should some context move to `memory/topics/` instead?
- Are there missing references that would be frequently useful?

**Example refinements**:
- Moving completed project details to memory files
- Adding links to frequently referenced memory topics
- Removing outdated priorities or one-time contexts

### Tool & Integration Preferences
**Key questions to explore**:
- Which MCPs/services are actually used vs just available?
- Are there default tools for specific tasks?
- Are there integration quirks the assistant should know?

**Example refinements**:
- Documenting which account to use for which work
- Adding tool-specific preferences or known issues
- Recording successful integration patterns

## Making Updates

When changes are agreed upon:

1. **Show before/after** for significant changes
2. **Get explicit approval** before editing
3. **Use Edit tool** to make minimal, focused changes
4. **Verify changes** were applied correctly
5. **Summarize updates** after completion

## Important Guidelines

### Keep It Focused
- Auto-loaded context should be **high-frequency** (used 50%+ of the time)
- Move topic-specific details to `memory/topics/`
- Remove completed projects and outdated priorities

### Respect Privacy
- Never save compensation/salary info to company-shared spaces
- Mark personal information clearly
- Ask before adding potentially sensitive details

### Minimal Changes
- Make focused, targeted updates
- Don't rewrite entire sections unless truly needed
- Preserve user's voice and terminology

### Cite Examples
- When suggesting patterns, reference actual usage
- When removing outdated info, explain why
- When adding new rules, tie to specific needs

## Example Interaction Flow

**User**: "I want to review my Chief-of-Staff configuration"

**Assistant**:
1. Reads `Chief-of-Staff/README.md` (or falls back to `AGENTS.md`)
2. Provides brief assessment of current state
3. Asks: "Would you like to review section by section, or focus on specific areas?"

**If section-by-section**:
- Start with Profile section
- Quote current content, ask if still accurate
- Wait for response
- Move to next section (AI Working Context)
- Continue through each section

**If focused**:
- Ask which section to focus on
- Deep dive into that section
- Make refinements
- Ask if another section needs attention

**After changes**:
- Show proposed edits
- Get approval
- Apply updates
- Summarize what changed

## Success Criteria

A successful review results in:
- ✅ All auto-loaded context is current and high-frequency
- ✅ Behavioral preferences accurately reflect how the user wants to work
- ✅ Privacy boundaries are clearly defined
- ✅ Tool/integration preferences are documented
- ✅ Outdated information is removed or moved to appropriate memory files
- ✅ The configuration feels like it represents current reality, not past state

## Related Resources

- `rebel-system/skills/documentation/documentation-update/` - General documentation maintenance
- `rebel-system/help-for-humans/terminology.md` - Rebel terminology reference
- `rebel-system/help-for-humans/variables-and-user-info.md` - Available variable placeholders
- Space-specific memory files in `memory/topics/` for detailed context that doesn't need auto-loading
