---
name: write-skill
description: "Creates well-structured skills for AI agents (also: create skill, new skill, make skill). Checks for duplicates, references existing patterns, saves to Chief-of-Staff by default."
use_cases:
  - "Create a new skill"
  - "Make a skill for automating X"
  - "Build a reusable workflow"
  - "Write a skill to help with Y"
  - "Generalize a personal skill for team use"
last_updated: 2025-12-30
tools_required: []
agent_type: main_agent
---

# Writing Skills for AI Agents

Create well-structured, immediately executable skills for AI agents to automate workflows.

**Skills should be concise** - essential detail only, no fluff. Study existing skills (especially those in [EXAMPLES] below) to learn by pattern-matching.

**Note**: Users may have personal workflow optimizations in their `Chief-of-Staff/skills/` folder that override or extend this guide. Check there for user-specific preferences.


## Conciseness: the #1 principle

The context window is a shared resource. Your skill competes with conversation history, other skills' metadata, system prompts, and the user's actual request. Every token must earn its place.

**Default assumption: Claude is already very smart.** Only add context Claude doesn't already have. For every paragraph, ask:

- "Does Claude really need this explanation?"
- "Can I assume Claude knows this?"
- "Does this paragraph justify its token cost?"

**Token budget**: Keep SKILL.md body under 500 lines. If approaching this limit, split content into `references/` files using progressive disclosure.

**Good** (~50 tokens -- teaches something Claude doesn't know):

> `## Extract PDF text` / `Use pdfplumber for text extraction:` / `import pdfplumber` ...

**Bad** (~150 tokens -- explains what PDFs are):

> `PDF (Portable Document Format) files are a common file format that contains text, images, and other content. To extract text from a PDF, you'll need to use a library. There are many libraries available...`

The concise version assumes Claude knows what PDFs are and how libraries work. Apply this judgment to every section.


## Goal-oriented over prescriptive

Write skills that describe the **outcome to achieve**, not the exact format to produce. Trust the agent to find the best approach.

**Good GOAL**: "Create the most effective, short-but-complete proposal with the highest possible chance of conversion"
**Bad GOAL**: "Create a 2-page proposal with personalized 95+ rated AI use cases and clear ROI"

The good version lets the agent decide whether 1 page or 3 pages serves the goal. The bad version forces a format that may not fit every situation.

**Trust the agent.** Ask yourself for every instruction: "Am I adding this because the agent genuinely wouldn't know, or because I want control?" The more you prescribe, the less the agent can adapt.

- **Few powerful fields over many specific fields.** If each step in a [PROCESS] has 12 sub-fields to fill, the agent spends tokens on mechanical compliance instead of creative quality. Collapse to the 2-3 fields that actually matter — the agent derives the rest.
- **Conditional tool references over hardcoded ones.** Write "If you have an image creation tool, use it" not "Use NanoBanana with model X". Skills should adapt to available tooling.
- **Reference examples for specifics, don't encode recipes.** When a skill accumulates deal-type sections, scaling-stage recipes, or format variants, extract those to `examples/` files. The process step becomes "Find relevant examples of similar type/size" — patterns live in example files, not the skill body. This prevents unbounded skill growth.


## Resist recipe accumulation

Skills grow stale through accretion. Each successful execution adds a new recipe, a new edge case, a new deal-type section. Over months, a 100-line skill becomes 300 lines of accumulated recipes that obscure the core process.

**Periodically distill back to essence.** If a skill has grown significantly:
- Move specific recipes/templates to `examples/` (the agent finds the right one via "find relevant examples")
- Move reference material to named sub-sections or `references/` files
- Ask: "If I deleted this section, would the agent produce worse output?" If the answer is "not really, because the agent can derive it" — delete it


## See also

- [customise-and-extend-skill](../system/customise-and-extend-skill/SKILL.md) - personalize existing skills with your preferences (or generalize personal skills into shared + personal layers)
- [file-naming-and-organisation.md](../system/file-naming-and-organisation/SKILL.md) - naming conventions for skills and files
- [write-help-evergreen-doc](../write-help-evergreen-doc/SKILL.md) - for writing general documentation
- [using-skills.md](../../help-for-humans/using-skills.md) - how to run skills
- [signposting-to-single-source-of-truth](../signposting-to-single-source-of-truth/SKILL.md) - **IMPORTANT** include signposts to/from relevant files, avoid duplicating content, single source of truth
- [Anthropic-skill-packager](../Anthropic-official-skills/Anthropic-skill-packager/SKILL.md) - for packaging skills for external distribution (zip files, validation scripts)


## Skill folder structure

Skills follow the [Anthropic Agent Skills Spec](https://github.com/anthropics/skills). Each skill is a **folder** containing a `SKILL.md` file:

```
skill-name/
├── SKILL.md          # Required - skill instructions
├── scripts/          # Optional - executable code
├── references/       # Optional - documentation to load as needed
└── assets/           # Optional - templates, images, etc.
```

**Example**: `skills/documentation/write-skill/SKILL.md`


## Bundled resources (optional)

Most skills need only `SKILL.md`. Add bundled resources when they provide clear value.

### scripts/

Executable code for tasks requiring deterministic reliability or that would be repeatedly rewritten.

- **When to include**: Same code rewritten repeatedly, or deterministic reliability needed
- **Example**: `scripts/rotate_pdf.js` for PDF rotation
- **Benefits**: Token-efficient, deterministic, can execute without loading into context
- **Note**: Scripts may still need reading for patching or environment-specific adjustments
- **Prefer Node.js** (`.js`/`.mjs`) for Rebel skills - Rebel bundles Node, so these work out-of-the-box cross-platform. Use Python only when there's a strong library need; if so, signpost to [python-setup-and-check](../coding/python-setup-and-check/SKILL.md) for user setup guidance.
- **Scripts with npm dependencies**: If your script needs npm packages, include a `package.json` and `.gitignore` (for `node_modules/`). Since `rebel-system/` is read-only in production, instruct the agent to copy scripts to a temp dir before running `npm install`. See the [outlook-email-export-parser](../../data-analysis/outlook-email-export-parser/SKILL.md) for the template.

### references/

Documentation loaded into context as needed to inform Claude's process.

- **When to include**: Documentation Claude should reference while working
- **Examples**: `references/schema.md` for database schemas, `references/api_docs.md` for API specs
- **Use cases**: Database schemas, API documentation, domain knowledge, company policies
- **Benefits**: Keeps SKILL.md lean, loaded only when needed
- **Best practice**: For large files (>10k words), include grep patterns in SKILL.md
- **Avoid duplication**: Information should live in SKILL.md OR references, not both

### assets/

Files used in output, not loaded into context.

- **When to include**: Files that will be used in final output
- **Examples**: `assets/logo.png`, `assets/template.pptx`, `assets/boilerplate/`
- **Use cases**: Templates, images, icons, boilerplate code, fonts
- **Benefits**: Separates output resources from documentation


## Progressive disclosure

Skills use a three-level loading system for context efficiency:

1. **Metadata (name + description)** - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words ideal)
3. **Bundled resources** - As needed by Claude

**Implication**: Keep SKILL.md lean. Move detailed schemas, examples, and reference material to `references/` files.


## SKILL.md frontmatter (required)

```yaml
---
name: skill-name              # Required - must match folder name, lowercase-hyphen
description: "What this skill does and when to use it"  # Required
license: LICENSE.txt          # Optional
---
```

**Naming rules for `name` field**:
- Must match the folder name exactly
- Lowercase letters, numbers, and hyphens only
- No spaces, underscores, or uppercase

**Additional frontmatter fields** (optional): `use_cases`, `last_updated`, `tools_required`, `dependencies`, `agent_type`, `author`, `contributors`


## Standard skill content structure

Use exactly these section names in square brackets:

**[AGENT USE]** *(optional)* - When/how to use this skill (subagent vs direct, what context needed)

**[PERSONA]** - Specific expert role the AI should embody
- Good: "You are an experienced search professional, expert at formulating advanced search queries"
- Bad: "You are helpful and knowledgeable" *(too vague)*

**[GOAL]** - What this accomplishes AND what success looks like. Fold success criteria directly into the goal so the agent has the target upfront, not buried at the bottom. Prefer outcome-oriented goals over format-prescriptive ones.
- Good: "Create the most effective proposal with the highest possible chance of conversion. A successful proposal makes the buyer feel: this is relevant, this team understands our moment, I want to take the next step."
- Bad: "Help with proposals and provide useful information" *(too vague)*
- Also bad: "Create a 2-page proposal with 3 use cases rated 95+" *(too format-prescriptive — prevents adaptation)*

**[CONTEXT]** - 1-2 sentences only: what this IS and ISN'T. Not backstory, not who discussed it when, not the full product description.
- Good: "The video accompanies a proposal. It is not supposed to replicate the proposal and it is not a generic brand film."
- Bad: "This is the optional video step Josh and Marina discussed on 23 Mar 2026: one transformation methodology backbone, then overt personalisation..." *(backstory — irrelevant to execution)*

**[PROCESS]** - Numbered steps, specific, actionable
- Each step starts with a verb
- Reference tools/MCPs conditionally: "If you have X tool, use it" not hardcoded tool names
- Include a collaborative iteration loop: "Ask the user questions for anything that would improve the output" and "Iterate until the user is happy"
- Specific enough to execute without ambiguity

**[IMPORTANT]** - Critical rules, constraints, gotchas (bullets only)
- Non-negotiable requirements
- Common mistakes to avoid
- Tool-specific requirements

**Named sub-sections** *(extract from process when quality criteria or reference material would otherwise clutter the steps)*:
- Use for quality definitions: `[WHAT A GREAT X LOOKS LIKE]` — separates "what good looks like" from "how to make it"
- Use for tool-specific config: `[VISUAL GUIDELINES]`, `[VOICE SETTINGS]` — keeps process steps clean
- The process steps reference these sub-sections by name rather than inlining the detail
- Only create when the material is long enough to warrant extraction (5+ lines)

**Sections to avoid as standalone**: [OUTPUT] (agent knows what files a pipeline produces), [SUCCESS] (fold into [GOAL]). Only use [TEMPLATE] when the output format is genuinely non-obvious.


## Writing process

- Analyze requirements - understand core intent and scope
- Check if this skill already exists (use subagent if available):
   - Use semantic search (`@files`) or browse `skills/` categories for skills with same/similar goal
   - Use judgment to check other relevant locations based on content/topic:
     - Team-specific context → check `memory/teams/[TEAM-NAME]/`
     - Personal workflows → check `memory/people/[USERNAME]/`
   - If duplicate found, inform user and ask whether to use existing, modify existing, or create new variant
- Search relevant skill categories for similar patterns
- **Identify which existing skill elements to adopt (obvious matches) or adapt (needs modification)** - adopt patterns without asking when it's an obvious fit
- **Gather requirements** — titrate depth to task complexity. For simple skills, a couple of quick questions suffice. For complex workflows, invest more here:
   - Follow [ask-questions-one-at-a-time](../../thinking/ask-questions-one-at-a-time/SKILL.md) — 1-2 questions per turn, propose answers
   - Core objective, target user, critical constraints, expected outputs
   - Ask for 2-3 examples of what good output looks like — exemplars are the single best input for a great skill
   - Probe edge cases and failure modes: "What should this skill NOT do?" "What varies each time?"
   - *(Optional, for complex skills)* **Coach and refine before drafting:**
      - Flag pitfalls in what the user described (too broad, missing persona, ambiguous success criteria)
      - Suggest tradeoffs (e.g., "one broad skill vs two focused ones — focused is usually better")
      - Use a researcher subagent to surface domain best practices if the area is unfamiliar
      - Propose the skill's [GOAL] and [PERSONA] for user confirmation before full drafting
- Draft the skill following the standard structure above
- **Build in a collaborative iteration loop**: Every skill's [PROCESS] should include a step where the agent asks the user for clarifying questions ("Ask me questions for anything that would improve the output") and a step to iterate ("Iterate until the user is happy"). This turns linear execute-and-deliver into a dialogue.
- **Test the skill** (evaluation-driven development):
   - Run the skill against 2-3 representative scenarios before finalizing
   - Compare output quality against doing the task without the skill
   - If possible, use a fresh conversation (or subagent) to test — the author's context can mask gaps
   - *(Optional)* Work through a real example with the user: run it via a clean subagent, show the output, and ask "is this what good looks like?" Compare against their examples from the requirements step
   - Watch how the agent actually navigates the skill: does it read files in unexpected order? Miss references? Ignore sections?
   - Iterate: fix gaps revealed by testing, then test again
- Validate using checklist below


## Naming and saving

**Folder naming**: 
- Use lowercase-hyphen format: `meeting-external-prep/`, `web-researcher/`
- The folder name becomes the skill's `name` field in frontmatter
- See [file-naming-and-organisation](../system/file-naming-and-organisation/SKILL.md) for full conventions

**Where to save**:
- Default: your primary space's `skills/` folder (e.g., `Chief-of-Staff/skills/<category>/`)
- Team-specific → the relevant space's `skills/<team-name>/`
- Human-facing tutorials/guides (not AI-facing skills) → `help-for-humans/` in the relevant space
- **NEVER save to `rebel-system/`** — it is read-only and ships with the app. Writes will be blocked. To personalize built-in skills, use [customise-and-extend-skill](../system/customise-and-extend-skill/SKILL.md). Even if a directory already exists under `rebel-system/skills/`, save new skills to your own space instead.

**Creating a new skill**:
1. Create folder: `skills/<category>/<skill-name>/`
2. Create `SKILL.md` inside with required frontmatter (`name`, `description`)
3. Add optional subdirectories (`scripts/`, `references/`, `assets/`) as needed

**Generated outputs from skills**: When a skill generates .md files (e.g., audit reports, research briefs, analysis docs), include frontmatter with metadata:
```yaml
---
description: "Brief description of what this document contains"
generated_by: skills/category/skill-name/SKILL.md
generated_date: yyMMdd
author: [Full Name]
---
```


## Validation checklist

### Conciseness
- [ ] Every paragraph passes the test: "Does Claude really need this? Can I assume it knows this?"
- [ ] SKILL.md body is under 500 lines; detailed content moved to `references/`
- [ ] No verbose explanations or teaching — just execution steps
- [ ] Essential detail only — no subsections, no nested structure

### Structure & tone
- [ ] Keep it flat and simple like existing skills
- [ ] [IMPORTANT] section is short bullets, not elaborate guidelines
- [ ] References other docs/skills instead of duplicating
- [ ] Tool/MCP references included where relevant
- [ ] Direct, practical tone — no fluff, repetition or over-complicated/corporate speak
- [ ] Match tone of existing skills — direct, practical, no corporate speak

### Discoverability & testing
- [ ] Description frontmatter includes keywords for `@files` semantic search discoverability
- [ ] Description says both what the skill does AND when to use it
- [ ] Tested against 2-3 representative scenarios (ideally in a fresh conversation)
- [ ] Mental test: could someone execute this identically to your intent?
- [ ] No real PII in examples (no real emails, names, tokens, internal URLs) — use placeholders like `user@example.com`, `{USER_NAME}`, `{WORKSPACE}`


## Key principles

- **Check for duplicates first** - search existing skills before creating new ones
- **Adopt patterns** from similar skills without asking when obvious fit
- **Ask only when unclear** - pattern conflicts or ambiguity
- **Outcome over format** - describe what success looks like, not exact output structure
- **Trust the agent** - fewer, more powerful instructions beat many micro-managed fields
- **Examples over recipes** - move specific scenarios to `examples/`, not inline in the skill
- **Distill periodically** - if a skill has grown by accretion, shrink it back to its essence


## Common mistakes to avoid

**DON'T create nested subsections:**
```markdown
### [PROCESS]
#### Step 1: Research
##### Substep 1a: Check emails
##### Substep 1b: Check Slack
```

**DO use flat numbered list:**
```markdown
[PROCESS]
1. Search emails for context
2. Search Slack for recent discussion
3. Compile findings into briefing
```

**DON'T write verbose explanations:**
```markdown
[PROCESS]
1. Begin by analyzing the user's request to understand what they need.
   This is important because we want to make sure we're addressing
   the right problem. Take your time to really understand the nuances...
```

**DO write actionable steps:**
```markdown
[PROCESS]
1. Analyze user request to identify core objective
2. Search similar skills for patterns
3. Draft skill using standard structure
```

**DON'T elaborate in [IMPORTANT]:**
```markdown
[IMPORTANT]
- Always be thorough in your research. This means looking at multiple
  sources and cross-referencing information. You should consider...
```

**DO use short bullets:**
```markdown
[IMPORTANT]
- Search multiple sources before drafting
- Cross-reference information for accuracy
- Include sources in briefing
```


**DON'T use real user emails, names, or other PII in skill examples** (models treat examples as defaults).

**DO use generic placeholders:**
```markdown
[PROCESS]
1. Call rebel_mcp_add_server({ email: "user@example.com" })
```

**DON'T accumulate recipe sections as the skill is used:**
```markdown
**For type-A deals ($250K+):**
- 8 bullets of specific advice

**For type-B deals ($500K+):**
- 10 more bullets

**For type-C deals ($1M+):**
- 12 more bullets
```

**DO reference examples and trust the agent to derive patterns:**
```markdown
[PROCESS]
4. Find relevant examples of similar type/size/industry in examples/
5. Use them as patterns for the current task
```

**DON'T create separate SUCCESS, OUTPUT sections that repeat what's in GOAL:**
```markdown
[GOAL]
Create a video

[OUTPUT]
segment-01.mp4, segment-02.mp4, final.mp4

[SUCCESS]
A successful video makes the buyer feel X, Y, Z
```

**DO fold success criteria into GOAL and omit obvious output listings:**
```markdown
[GOAL]
Create a teaser video. A successful output feels like one persuasive film.
After one watch, the buyer should think: this is about us, the proposal is
worth opening, the next conversation feels obvious.
```


## Examples

Study these for patterns:
- [`web-researcher`](../research/web-researcher/SKILL.md) - simple research workflow
- [`meeting-external-prep`](../meetings/meeting-external-prep/SKILL.md) - multi-step with subagents
- [Anthropic official skills](../Anthropic-official-skills/) - complex skills with scripts, references, and assets (e.g., `document-skills`)
- [`build-custom-mcp-server`](../coding/build-custom-mcp-server/SKILL.md) - comprehensive skill with bundled references and scripts