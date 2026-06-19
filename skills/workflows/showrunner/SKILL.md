# The Showrunner Workflow

Instructions for orchestrating complex, multi-step knowledge work tasks by delegating to specialized subagents and synthesizing their outputs.

> **Alternative name considered:** Quartermaster. Either works; Showrunner emphasises creative orchestration, Quartermaster emphasises logistical coordination. Both capture "manages many moving parts with quiet authority."

---

## Overview

This workflow coordinates complex knowledge work — the kind that requires gathering information from multiple sources, planning an approach, producing a deliverable, and checking quality before delivery.

**When to use this workflow:** When a task is complex, involves multiple steps, requires correctness, draws on multiple sources or tools, or would benefit from structured planning and review rather than a single-shot response. Examples:

- "Reconcile all my invoices across Xero and bank statements, check who hasn't responded, and send chase emails"
- "Adapt this presentation for a new audience based on recent research and feedback from multiple people"
- "Read through these legal contracts, summarise each one, highlight key issues, create a tracking spreadsheet, and draft a response to the solicitor"
- "We need to write a company strategy based on..."
- "Prep me for this board meeting — pull together financials, team updates, and likely questions"

**When NOT to use this workflow:** For quick, single-step tasks where a direct response is better. "Reply to this email," "Summarise this document," "What time is my next meeting" — these don't need orchestration.

This workflow uses five roles:

| Role | Responsibility |
|------|----------------|
| **Main Agent (You)** | Coordinates workflow, captures user intent, challenges the approach, synthesizes feedback, makes refinements. **You are the final arbiter** — independently verify every reviewer finding before acting on it. |
| **Forager(s)** | Gathers information from available sources: MCPs, tools, memories, previous conversations, files, web. Fresh instance per invocation. |
| **Planner** | Researches the task landscape and creates a structured approach with staged breakdown. Fresh instance. |
| **Implementer** | Executes one stage at a time: drafting, synthesizing, calculating, creating, sending. Fresh instance per stage. |
| **Reviewer(s)** | Reviews plans and deliverables through specific quality lenses. **Triple-review** by default. |

**Why this architecture?**
- **Subagents get fresh context** — They bring full intelligence to focused tasks without accumulated confusion
- **Main agent coordinates** — Lightweight synthesis work, but has continuous context to bridge handoffs
- **Working document is the memory** — All agents read/write here, ensuring continuity without context bleed
- **Foragers discover what's available** — Knowledge work requires finding information across scattered tools and sources before planning can begin

**How this relates to existing skills:**
Skills are atomic operations (a single research query, a single meeting prep). This workflow *orchestrates* skills and subagents across multiple steps. A Showrunner task might invoke the `web-researcher` skill, the `meeting-prep` skill, and several MCP tools as part of its execution. Skills are the building blocks; the Showrunner is the construction plan.

---

## Quality Philosophy

**Pursue the most accurate, well-structured, audience-appropriate output — even if it takes longer.** At the same time, **keep things as simple as the task allows.** Thoroughness does not mean verbosity.

When evaluating approaches, ask:
- **Does this serve the user's actual goal?** Not what they literally asked for, but what they're trying to achieve.
- **Is this the right level of depth?** Not everything needs exhaustive research. Match effort to stakes.
- **Would the intended audience find this useful?** If it's going to a CEO, is it concise enough? If it's a legal review, is it thorough enough?
- **Are we hiding uncertainty?** Surface what we don't know. "I couldn't find data on X" is more valuable than pretending X doesn't matter.

Additional principles:
- **Accurate and concise are not opposites** — the best outputs are both. If your "thorough" deliverable requires a table of contents, it might be too long.
- **Attribution matters** — claims should be traceable to sources. "According to the Q3 report..." not "Revenue increased."
- **Reuse before re-researching** — check memories, previous conversations, and existing documents before launching new research.
- **Audience-first, always** — a brilliant analysis that's wrong for its reader is a failed analysis.
- **Surface contradictions, don't bury them** — when sources disagree, say so. Let the user decide, don't paper over it.
- **Root cause, not surface treatment** — if asked to "fix this email," understand why it's not working (wrong tone? missing context? unclear ask?) before rewriting.

---

## The Source & Tool Landscape

Knowledge work tasks typically require gathering information from many places. Unlike coding (where the codebase is the primary source), knowledge work draws from a scattered landscape:

### Source Types

| Source | Examples | How to Access |
|--------|----------|---------------|
| **Connected tools (MCPs)** | Gmail, Slack, Google Calendar, Notion, HubSpot, Xero, Linear, Google Drive | MCP tool calls. Check what's connected before planning. |
| **Memories** | User preferences, company context, contact info, past decisions, project history | Memory search. Critical for personalisation and continuity. |
| **Previous conversations** | Prior research, earlier drafts, decisions made, context gathered | Conversation search. Avoids re-doing work. |
| **Local files** | Documents, spreadsheets, presentations, PDFs, images | File system access. User may provide paths or describe locations. |
| **Web** | Current information, industry data, competitor intelligence, public records | Web search tool. Best for external/current information. |
| **The user themselves** | Intent, preferences, constraints, context only they know | Ask clarifying questions. The most valuable source — use judiciously. |

### Source Discovery Principles

1. **Check what's connected first.** Before planning research, discover which MCPs and tools are available. Don't plan to "check Slack" if Slack isn't connected.
2. **Memories are gold.** Previous conversations and memories often contain exactly what's needed — preferences, decisions, context, even prior research on the same topic.
3. **Ask the user strategically.** Every question is an interruption. Batch questions. Prioritise questions that would change the approach if answered differently.
4. **Cross-reference sources.** Information from one source can validate or contradict another. Flag discrepancies.
5. **Note what's missing.** If a relevant source isn't connected or information can't be found, say so. "I couldn't find your Q3 financials — is that in a different tool?" is better than guessing.

---

## Model Strategy & Cost Awareness

The Showrunner orchestrates across multiple models. The user's available models will vary — they might have Opus + Sonnet + Haiku, or also GPT, Gemini, Kimi, MiniMax, or others. The orchestrator must adapt to what's available while optimising for quality, diversity, and cost.

### Role-to-Model Mapping

Different roles have different needs. Match models to roles based on what the role actually requires:

| Role | Needs | Ideal Model Tier | Why |
|------|-------|-------------------|-----|
| **Orchestrator (You)** | Judgment, synthesis, coordination | Top-tier (e.g., Opus, GPT-5.5) | Must make good decisions about approach, feedback, and quality |
| **Planner** | Strategic thinking, task decomposition | Top-tier or strong mid-tier | Planning quality determines everything downstream |
| **Reviewer** | Critical reading, pattern recognition | Mid-tier is often sufficient | Reads more than writes; reviewing is cheaper than generating |
| **Devil's Advocate** | Adversarial thinking, assumption-challenging | Top-tier or strong mid-tier | Needs genuine independent thinking, not rubber-stamping |
| **Implementer** | Execution: drafting, synthesizing, calculating | Mid-tier or economy-tier | Does the most writing (most expensive per token); smaller models are also faster |
| **Forager** | Information retrieval, tool calling | Economy-tier is fine | Mechanical work: search, fetch, extract. Doesn't need deep reasoning. |

### Principles

1. **Diverse model families for review.** The biggest value of multi-model review comes from different model families catching different things. An Opus reviewer + a GPT reviewer is far more valuable than two Opus reviewers. When assigning reviewers, maximise family diversity.

2. **Reading is cheap, writing is expensive.** Models consume fewer tokens reading (input) than writing (output). This means reviewers (who read a lot and write short feedback) are cheaper than implementers (who write the deliverable). Assign more expensive models to review rather than implementation when budget is constrained.

3. **Smaller models for heavy lifting.** Foraging, data extraction, and high-volume implementation stages (e.g., summarising 20 contracts) should use the most cost-effective model available. Save top-tier models for judgment: planning, reviewing, and synthesis.

4. **Faster is better for intermediate steps.** Smaller models are typically faster. For foraging and implementation stages where the user is waiting, speed matters. Use the fastest adequate model.

5. **Adapt to what's available.** Don't assume specific models exist. At the start of each task, assess what models are available and assign roles accordingly. If only one model family is available, still use it for all roles — multi-agent fresh-context benefits apply regardless of model diversity.

### Model Selection (Phase 0, step 3)

At task start, assess available models and assign roles:

1. **Inventory available models** — which model families and tiers are accessible?
2. **Assign orchestrator** — you (the main agent) are already assigned; note your model for logging
3. **Assign planner** — use the same tier as orchestrator, or one step down
4. **Assign implementer** — use a mid-tier or economy-tier model. If GPT-5.5 is available alongside Opus, GPT-5.5 is an excellent implementer (capable but cheaper than Opus). For cost-sensitive tasks, Haiku or MiniMax can handle straightforward execution.
5. **Assign reviewers** — maximise model family diversity. If 3 reviewers are needed and Opus, GPT, and Gemini are all available, use one of each. If only Opus + Sonnet are available, use both (different model sizes within a family still provide some diversity).
6. **Assign forager** — use the most cost-effective model available (Haiku, MiniMax, or equivalent)

Log: `[SHOWRUNNER] Model assignments: orchestrator=<model>, planner=<model>, implementer=<model>, reviewers=[<model>, ...], forager=<model>`

**Example assignments** (with typical model sets):

| Available Models | Orchestrator | Planner | Implementer | Reviewers (triple) | Forager |
|------------------|-------------|---------|-------------|--------------------| --------|
| Opus, Sonnet, Haiku | Opus | Opus | Sonnet | Sonnet, Haiku, Opus | Haiku |
| Opus, GPT-5.5, Haiku | Opus | Opus | GPT-5.5 | GPT-5.5, Haiku, Opus | Haiku |
| Opus, GPT-5.5, Gemini, Haiku | Opus | Opus | GPT-5.5 | GPT-5.5, Gemini, Opus | Haiku |
| Sonnet, Haiku only | Sonnet | Sonnet | Haiku | Haiku, Sonnet | Haiku |
| Single model only | That model | That model | That model | That model | That model |

---

## Available Subagents

The specific models assigned to each role depend on what's available (see Model Strategy above). This table describes the roles themselves:

| Role | Responsibility | When Used |
|------|----------------|-----------|
| **Forager** | Gathers information from MCPs, tools, memories, conversations, files, web | Phase 2 (Source Discovery), Phase 3 (Research) |
| **Planner** | Creates structured approach and staged breakdown | Phase 3 (Planning) |
| **Implementer** | Executes stages: drafts, synthesizes, calculates, creates, sends | Phase 6 (Execution) |
| **Reviewer** | Reviews plans and deliverables through quality lenses | Phase 4 (Plan Review), Phase 7 (Quality Review) |
| **Researcher** | Deep research on specific topics (web, documents, analysis) | Phase 3 (Research), ad-hoc |

### Subagent Type for MCP Access

When running inside Rebel, subagents that need MCP tool access (Gmail, Slack, Calendar, etc.) should use `subagent_type: "knowledge-worker"` when delegating. The default subagent type only has built-in tools (Read, Write, Bash, etc.).

**Which roles need MCP access:**
- **Forager** — Almost always. Foraging by definition involves querying external tools.
- **Implementer** — Often. Execution stages frequently need to search emails, post messages, check calendars, etc.
- **Researcher** — Sometimes. Deep research may require MCP tools for email/Slack/calendar queries.
- **Planner** — Rarely. Planning typically uses filesystem tools only. Use default subagent type unless the planner needs to query external sources directly.
- **Reviewer** — Never. Reviewers read the working document and deliverables — they don't need external tool access.

This is a recommendation, not a hard requirement. The orchestrator should assess each delegation based on whether the subagent needs external tool access.

**Background subagents:** Subagents running in the background (`run_in_background: true`) do NOT have MCP tool access. MCP-dependent tasks must use foreground execution.

---

## Key Principles

- **You are the coordinator AND the quality gatekeeper** — delegate heavy work, but challenge approaches and protect the user's interests
- **You are the final arbiter** — independently verify every reviewer finding before acting on it. Do not blindly accept or rubber-stamp.
- **Challenge before delegating** — before planning begins, assess whether the task needs orchestration at all, or whether a direct response would be better
- **Source discovery is a first-class phase** — unlike coding where the codebase is known, knowledge work requires figuring out *where* information lives before you can plan how to use it
- **Skills are building blocks** — invoke existing skills where they fit rather than reinventing their logic
- **Memories provide continuity** — always check for relevant memories and previous conversations. The user shouldn't have to re-explain things Rebel already knows.
- **The working document is the task's source of truth** — all subagents read and write here, updated throughout with decisions, learnings, and rationale
- **Re-read the working doc when in doubt** — long sessions get compacted. The working document on disk is the canonical state.
- **Right-size the effort** — not every task needs full orchestration. A straightforward 3-step task doesn't need lenses and multiple review rounds.
- **Parallelise where possible** — launch independent subagents simultaneously. This is faster and doesn't sacrifice quality. See the parallelism rules below.

### Parallelism Rules

Launch subagents in parallel when they don't depend on each other's output. Wait when they do.

| Can run in parallel | Must be sequential |
|--------------------|--------------------|
| Multiple reviewers (they read the same working doc independently) | Foraging → Planning (planner needs the source inventory) |
| Multiple foragers searching different sources | Planning → User checkpoint (user needs to see the plan) |
| Forager + memory search + conversation search | Stage execution → Stage review (reviewer needs the output) |
| Devil's Advocate + standard reviewers | Source discovery → Stage execution (implementer needs the gathered info) |
| Lenses (each reviewer focuses on their own lens) | Sequential stages with dependencies (Stage 2 needs Stage 1's output) |

**Rule of thumb:** If subagent A needs to *read* what subagent B *wrote*, they must be sequential. If they're both reading the same existing document, they can be parallel.

---

## Quality Lenses

Lenses give reviewers focused mandates. Each lens asks specific questions about the output. Lenses are supplementary — they augment, not replace, general review.

### Available Lenses

| Lens | What it Checks |
|------|---------------|
| **Accuracy** | Are claims factually correct? Supported by sources? Any fabrication? Are numbers right? |
| **Completeness** | Is anything important missing? Are all parts of the task addressed? Any gaps in coverage? |
| **Audience Fit** | Is the tone right for the reader? Right level of detail? Right framing? Would the intended recipient find this useful and clear? |
| **Actionability** | Are next steps clear? Are recommendations concrete? Can the user act on this without further research? |
| **Sensitivity** | Any political, interpersonal, confidential, or legal risks? Anything that could embarrass the user or harm relationships? |
| **Data Integrity** | Are calculations correct? Do numbers reconcile? Are comparisons fair? Is data from the right time period? |
| **Persuasion** | Is the argument compelling? Are objections anticipated? Is the ask clear? Would this convince a skeptical reader? |
| **Conciseness** | Could this be shorter without losing value? Any padding, repetition, or unnecessary caveats? |

### Lens Selection (Phase 0)

**Always active (medium+ complexity):**
- **Accuracy** — always. Factual correctness is non-negotiable.
- **Completeness** — always. Missing pieces are the most common knowledge work failure.

**Trigger-based:**
- **Audience Fit** — when the output goes to someone (email, memo, presentation, brief)
- **Sensitivity** — when touching: financials, personnel matters, legal, competitive intelligence, investor relations, difficult relationships, internal politics
- **Data Integrity** — when working with: numbers, financial data, reconciliation, calculations, comparisons, spreadsheets
- **Persuasion** — when the goal is to convince: proposals, pitches, asks, negotiations, recommendations
- **Actionability** — when producing: recommendations, briefs, strategy documents, meeting prep
- **Conciseness** — when output must be: read quickly, sent to busy executives, fit a format constraint

**Caps:**
- Simple tasks: 0-1 lenses
- Medium complexity: 2-3 lenses (Accuracy + Completeness + 1 trigger-based)
- High complexity: 3-5 lenses (Accuracy + Completeness + trigger-based)
- Maximum: 5 lenses per task

Log: `[SHOWRUNNER] Lenses selected: <list or "none">`

### Lens Prompt Template

> "You are the **[LENS_NAME]** reviewer. Read the working document first, then review the deliverable.
>
> **Focus exclusively on your lens.** Do not perform broad review. If this lens is not materially applicable, say so and stop.
>
> **Your focus:** [SPECIFIC QUESTIONS FROM LENS TABLE ABOVE]
>
> Return:
> 1. **Applicability:** why this lens does or does not apply
> 2. **Must-address issues** specific to this lens
> 3. **Suggestions** for improvement
> 4. **Evidence reviewed** — sources checked, facts verified
> 5. **Confidence** (0-100%) and **what you could not verify**"

---

## Review Modes

> **Cross-family review is always required.** Even the lightest review mode must use a different model family from the main agent. This is non-negotiable because different model families catch genuinely different things — same-family review provides much less value. The review mode controls how many reviewers, not whether review happens.

| Mode | When to Use | Reviewers |
|------|-------------|-----------|
| **Cross-check** | SHOWRUNNER-lite, low-complexity tasks | 1 reviewer from a **different model family** than the main agent |
| **Triple-review** (default) | Standard knowledge work tasks | 3 reviewers, maximising model family diversity |
| **Full-review** | High-stakes deliverables (board packs, legal analysis, financial reconciliation, strategy docs) | 5 reviewers in parallel, maximising diversity |

**If only one model family is available** (e.g., only Anthropic models), use different model sizes (e.g., Opus + Haiku) for some diversity. Log a warning: `[SHOWRUNNER] Warning: single model family available — cross-family review not possible, using size diversity instead`

**Parallel execution:** Launch all reviewers simultaneously (see [Parallelism Rules](#parallelism-rules)). They read the same working document but focus on their assigned lenses.

**Devil's Advocate (triple-review and full-review):** Assign exactly **1 reviewer** to operate in Devil's Advocate mode. This reviewer challenges assumptions, questions the approach, and pushes for simplicity.

**Devil's Advocate prompt:**
> "Review this deliverable **as a Devil's Advocate**. Your mission is to challenge assumptions, find weaknesses, and push for clarity.
>
> Think like the toughest, most skeptical person who will read this output. Additionally:
> - **Challenge the framing**: Is this the right way to present this? Would a different angle be more effective?
> - **Find the weak spots**: What claims are undersupported? What logic doesn't hold?
> - **Simulate objections**: What would a skeptical reader push back on?
> - **Surface hidden assumptions**: What is this taking for granted?
> - **Check for blind spots**: What perspective or information is missing?
> - **Propose alternatives**: Is there a fundamentally better approach the user should consider?
>
> End your review with:
> ```
> ## Devil's Advocate Assessment
> - **Confidence score (1-10):** (10 = rock-solid, 1 = full of holes)
> - **Biggest assumption to challenge:** <the riskiest assumption>
> - **Toughest question this would face:** <what a skeptical reader would ask>
> - **What's missing:** <the most important gap>
> - **Simpler alternative:** <if there's a dramatically simpler approach>
> ```"

Log: `[SHOWRUNNER] Devil's Advocate: <reviewer>`

### Handling Subagent Failures

If any subagent doesn't return output (timeout, error, etc.):

1. **Retry** the failed subagent once
2. **Substitute** with an alternative model if available
3. **Continue without it** if no substitute available, and inform the user which role could not be filled
4. Log: `[SHOWRUNNER] Subagent failure: <role> failed → substituted <alternate>` or `[SHOWRUNNER] Subagent failure: <role> failed, no alternates remaining`

---

## Workflow Phases

### Phase 0: Task Intake & Assessment

**You do this.**

1. If no task provided, ask: *"What would you like me to help you with?"*

2. Log: `[SHOWRUNNER] Task received: <brief description>`

3. **Assess available models and assign roles** (see [Model Strategy](#model-strategy--cost-awareness)):
   - Inventory which models/families are available
   - Assign roles following the cost-awareness principles (top-tier for judgment, mid-tier for implementation, economy for foraging)
   - Ensure at least one cross-family model is available for review
   - Log assignments: `[SHOWRUNNER] Model assignments: orchestrator=<model>, planner=<model>, implementer=<model>, reviewers=[...], forager=<model>`

4. **Assess whether this needs orchestration.** Not every complex-sounding task needs the full workflow. Ask:
   - Does this involve multiple distinct steps?
   - Does it require gathering information from multiple sources?
   - Would the user benefit from reviewing an approach before execution?
   - Is the deliverable high-stakes enough to warrant review?

   If the answer to most of these is "no," handle it directly or use SHOWRUNNER-lite (skip planner, cross-check review only). Log: `[SHOWRUNNER] Mode: SHOWRUNNER-lite` or `[SHOWRUNNER] Mode: full`

5. **Check for relevant context:**
   - Search memories for relevant information (user preferences, company context, prior work)
   - Check for previous conversations on the same or related topics
   - Note what you find — this feeds into Source Discovery

6. **Assess complexity:**
   - **Low** — 2-3 steps, familiar tools, straightforward deliverable
   - **Medium** — 4-6 steps, multiple sources, needs some judgment
   - **High** — many steps, many sources, high stakes, significant uncertainty

7. Ask (or determine from context): *"This looks like a [low/medium/high] complexity task. I'll use [cross-check/triple/full] review. Would you like me to check in with you before I start executing, or proceed autonomously after planning?"*

   By default, use **adaptive autonomy**: proceed automatically unless a surprise-test trigger fires. If the user explicitly asks for checkpoints, use **hard-checkpoint** mode.

8. **Select lenses** using the trigger rules above.

9. Log: `[SHOWRUNNER] Review mode: <mode>, Complexity: <level>, Autonomy: <adaptive|hard-checkpoint>, Lenses: <list>`

10. Proceed to Phase 1.

### Phase 1: Understand Intent

**You do this. Do NOT delegate.**

Before any planning or work, you must be **confident you understand what the user actually wants.** Ambiguity at this stage compounds into wasted effort and wrong deliverables.

**Actions:**

1. Restate your understanding of the task in 2-3 sentences: what's needed, who it's for, what success looks like.
2. Assess your confidence that you understand:
   - **What** the user wants produced (the deliverable or outcome)
   - **Why** they want it (the underlying goal — a meeting going well, a decision being made, a relationship being maintained)
   - **Who** it's for (the audience, if there is one)
   - **What good looks like** (how they'd know it's done well)
   - **What's out of scope** (what they explicitly don't want)
   - **What constraints exist** (tone, format, length, deadline, sensitivity)
3. If confidence < 90%, ask targeted clarifying questions. **Batch your questions** — the user is busy. Ask 2-4 focused questions, not a long interrogation. Focus on:
   - Ambiguous requirements ("when you say 'summarise,' do you mean a one-pager or detailed notes?")
   - Audience ("who's reading this? What do they already know?")
   - Stakes ("is this exploratory or is it going to the board?")
   - Constraints ("any format requirements? Tone preferences? Deadline?")
4. If the user has provided extensive detail, don't ask unnecessary questions — just confirm your understanding.

**Do NOT proceed to Phase 2 until you're confident in the user's intent.**

Log: `[SHOWRUNNER] Intent confidence: X%. Clarifications needed: Y/N`

Proceed to Phase 2.

### Phase 2: Source Discovery

**You do this, with optional Forager delegation for broad discovery.**

This phase is unique to knowledge work — it answers: "Where is the information I need, and what tools do I have to get it?"

**Actions:**

1. **Inventory available tools:**
   - What MCPs are connected? (Gmail, Slack, Calendar, Notion, CRM, accounting, etc.)
   - What file access exists? (local files, shared drives, etc.)
   - What skills are relevant? (web-researcher, meeting-prep, etc.)
   - Log the inventory — the planner needs to know what's available.

2. **Check memories and prior work:**
   - Search memories for: the topic, relevant people, relevant companies, relevant projects
   - Search previous conversations for: prior research on this topic, earlier decisions, drafts that were created
   - Note what's found and what's missing

3. **Identify information gaps:**
   - What does the task need that we don't yet have?
   - Which sources are likely to have it?
   - What can't be found and must be asked of the user?

4. **For broad discovery tasks**, delegate to Forager subagent(s):
   > "Gather all available information relevant to this task:
   >
   > **Task:** <description>
   > **Available tools:** <MCP list>
   > **Already known:** <from memories and prior conversations>
   >
   > Search for: <specific things to look for>
   > Check: <specific sources to query>
   >
   > Return: structured summary of what you found, organised by source. Include the actual content, not just descriptions of what you found."

5. **Compile a source inventory** in the working document:
   - What was found and where
   - What's missing and where to look next
   - What must be asked of the user

Log: `[SHOWRUNNER] Source discovery complete. Sources found: <count>. Gaps: <count>.`

Proceed to Phase 3.

### Phase 3: Research & Planning

**Delegate to Planner subagent.**

The planner brings fresh context and full intelligence to structuring the approach. Pass the planner everything from Phase 2 (source inventory, memories, prior work).

**Prompt to Planner:**

> "Create a plan for the following knowledge work task:
>
> **Task:** <task description>
> **User intent:** <from Phase 1 — audience, purpose, constraints, success criteria>
>
> ### Available Sources & Tools
> <source inventory from Phase 2 — what's connected, what was found, what's missing>
>
> ### Relevant Context
> <memories, prior conversations, existing documents>
>
> Instructions:
> 1. **Understand the landscape** — review the available sources and context. What do we already have? What do we still need?
> 2. **Plan the approach** — break the task into stages. Each stage should produce a concrete intermediate output. Consider:
>    - What information needs to be gathered first?
>    - What depends on what? (e.g., can't draft the email until the analysis is done)
>    - Where can work happen in parallel?
>    - Which skills or tools are needed at each stage?
> 3. **Identify risks and assumptions** — what could go wrong? What are we assuming that might not be true?
> 4. **Create the working document** in the relevant space's `memory/planning/` folder using `YYMMDDx_task_description.md` naming (see [Artifacts Produced](#artifacts-produced))
> 5. Include:
>    - Task description and user intent
>    - Source inventory
>    - Staged breakdown with rationale
>    - For each stage: what it produces, what tools/sources it uses, what it depends on
>    - Assumptions and risks
>    - Definition of done — how we'll know the task is complete
>
> Flag any blocking unknowns or questions for the user."

**After receiving the plan:**
1. Log: `[SHOWRUNNER] Plan created (confidence: X%, stages: N)`
2. Review the plan — does it address the task? Are the stages logical? Is anything missing?
3. If planner confidence < 85%, investigate the gaps yourself or with a Researcher subagent before proceeding.

Proceed to Phase 4.

### Phase 4: Plan Review

**Delegate to Reviewer subagent(s).**

Use the number of reviewers from the selected review mode. Pass the working document.

**Key review questions for plans:**
- Does the plan actually address what the user asked for?
- Are the stages in the right order? Any missing dependencies?
- Are the right sources being used? Any obvious sources overlooked?
- Is the plan proportionate to the task? (Not over-engineered for something simple, not too light for something complex)
- Are assumptions reasonable?
- Will the deliverable serve the intended audience?

**Launch active lenses in parallel with reviewers** (if applicable at plan stage — typically Completeness and Accuracy).

**After receiving feedback:**
1. Log: `[SHOWRUNNER] Plan review received`
2. Proceed to Phase 4.5 (Plan Refinement)

### Phase 4.5: Plan Refinement

**You address reviewer feedback. You are the final arbiter.**

For each piece of feedback:
1. **Verify it** — does the concern actually apply?
2. **Accept** what you genuinely agree with
3. **Reject** what you disagree with, documenting reasoning
4. **Update the working document** with accepted changes

**Reviewer scoring:** After synthesizing, emit a score per reviewer:
```
[SHOWRUNNER-REVIEW-SCORE] {"phase":"plan-review","reviewer":"<name>","confidence":<0-100>,"accepted":<count>,"rejected":<count>,"highlight":"<one-line summary>"}
```

> **Confidence gate:** If any reviewer's confidence is below 85%, address their specific concerns before proceeding. Maximum 2 plan review iterations.

Proceed to Phase 5.

### Phase 5: Adaptive User Checkpoint

**If the user chose `hard-checkpoint` in Phase 0:** Always stop here and present the plan.

**If the user chose `adaptive` (default):** Skip this phase and proceed to Phase 6 **only if you are confident the user would endorse the next step.** Apply the surprise test below.

**The surprise test:** Before proceeding autonomously, ask yourself: *"If I'm wrong about my assumptions here, would the user be frustrated and think 'why on earth did it do that without checking with me first?'"*

Proceed only when the next step is the obvious, mechanical continuation of clear requirements. **Stop and checkpoint** if you are:
- Sending external communications (emails, Slack messages, calendar invites) without explicit approval
- Making assumptions about audience, tone, or sensitivity that could embarrass the user
- Acting on incomplete or conflicting information without flagging it first
- Choosing between fundamentally different approaches where the user might have a preference
- About to execute a stage that involves irreversible actions (sending, publishing, deleting)

This list is **not exhaustive** — it illustrates the principle, not the boundary. When in doubt, stop. A quick clarifying question is always cheaper than rolling back a sent email.

Log: `[SHOWRUNNER] Adaptive checkpoint: skipped (sanity check passed) | triggered (<reason>)`

**When presenting a checkpoint (hard or triggered):**

> "I've planned the approach for your task.
>
> **Working Document:** `<path>`
>
> **Approach:**
> <brief summary of stages — what will happen in what order>
>
> **Sources I'll use:**
> <which tools, documents, memories>
>
> **Assumptions:**
> <key assumptions — things that could change the approach if wrong>
>
> **Questions (if any):**
> <anything that needs the user's input before proceeding>
>
> **Shall I proceed?** (yes / no / modify)"

**User options:**
- **yes** → Proceed to Phase 6
- **no** → Abort or discuss
- **modify** → Update plan and return to Phase 4

Proceed to Phase 6.

### Phase 6: Stage Execution

**Delegate to Implementer subagent. Fresh instance for each stage.**

**Use the Execution Packet template** (see [Handoff Templates](#handoff-templates)) to structure the delegation.

**Key differences from coding implementation:**
- The "output" varies wildly: a draft document, a spreadsheet, a set of emails, a synthesized analysis, a reconciliation report
- The implementer may need to invoke MCPs and tools as part of execution
- The implementer may need to invoke existing skills
- Quality is about accuracy, tone, and completeness — not compilation and tests

**After execution:**
1. Log: `[SHOWRUNNER] Stage <N> executed (confidence: X%)`
2. If the implementer reports low confidence (< 80%), flag for heightened scrutiny in review
3. Proceed to Phase 7

### Phase 7: Quality Review

**Delegate to Reviewer subagent(s) with assigned lenses.**

**Use the Review Packet template** (see [Handoff Templates](#handoff-templates)).

**Launch active lenses in parallel with general reviewers.**

**Key review questions for deliverables:**
1. Does this deliver what the user asked for?
2. Is it accurate? Are claims supported?
3. Is anything important missing?
4. Is it appropriate for the intended audience?
5. Is it the right length and level of detail?
6. Are there any sensitivity concerns?
7. Would the user be proud to send/present this?

**After review:**
1. Log: `[SHOWRUNNER] Stage <N> review received`
2. If all reviewers' confidence >= 85%, proceed to next stage (or Phase 9 if last stage)
3. If any reviewer's confidence < 85%, proceed to Phase 8

### Phase 8: Refinement

**You synthesize feedback and make improvements. You are the final arbiter.**

**Actions:**
1. **Review each point of feedback** against the working document and the deliverable
2. **Accept** valid issues — fix directly for small changes, delegate to implementer for larger ones
3. **Reject** issues you disagree with — document reasoning
4. **Update the working document** with changes made
5. Log: `[SHOWRUNNER] Stage <N> refined (iteration X/3)`

**Reviewer scoring:** Emit score per reviewer:
```
[SHOWRUNNER-REVIEW-SCORE] {"phase":"stage-review","stage_id":"<N>","reviewer":"<name>","confidence":<0-100>,"accepted":<count>,"rejected":<count>,"highlight":"<one-line summary>"}
```

> **Confidence gate:** If any reviewer remains below 85% after refinement, return to Phase 7. Maximum 3 iterations. If still below after 3 iterations, present to user:
> *"After 3 review rounds, reviewer X is at Y% confidence because: <concerns>. Options: (a) proceed anyway, (b) continue refining, (c) take a different approach."*

After refinement, proceed to next stage or Phase 9.

### Phase 9: Final Review (Full-review mode only)

**Skip unless using full-review mode.** After all stages complete, launch all reviewers one final time across the complete deliverable. This catches cross-stage inconsistencies.

1. Log: `[SHOWRUNNER] Phase 9: Final review`
2. Evaluate feedback, accept/reject, fix as needed
3. Log: `[SHOWRUNNER] Final review complete. Accepted N/M suggestions.`
4. Proceed to Phase 10

### Phase 10: Delivery

**Present the completed work to the user.**

1. **Verify completeness** — check the working document's definition of done. Has every item been addressed?

2. **Present the output:**

> "Here's what I've put together:
>
> **[Deliverable]**
> <the output — inline, as a file, or summary with pointer to file>
>
> **Sources used:**
> <where information came from>
>
> **Assumptions made:**
> <key assumptions, flagged so the user can verify>
>
> **Things I couldn't find/verify:**
> <explicit gaps — don't hide these>
>
> **Reviewer confidence:** X%
>
> **Suggested next steps:**
> <if applicable — who to send it to, what to verify, what to do next>"

3. **Offer follow-up actions:**
   - "Would you like me to send this?"
   - "Want me to adjust anything?"
   - "Should I save this as a template for next time?"

4. **Log session summary:**
```
[SHOWRUNNER-SESSION-SUMMARY] {"stages_completed":<N>,"total_review_rounds":<X>,"reviewers":[...],"lenses":[...],"sources_used":[...],"status":"<complete|partial|aborted>"}
```

---

## Artifacts Produced

The Showrunner produces two categories of artifacts:

### 1. Working Document (always produced)

The working document is the task's internal memory — the source of truth that all subagents read and write. It captures intent, sources, approach, execution notes, and review history.

**Location:** The relevant space's `memory/planning/` folder, following the standard planning doc convention:
- Personal tasks: `personal/memory/planning/YYMMDDx_task_description.md`
- Work tasks: `work/[COMPANY-NAME]/solo/memory/planning/YYMMDDx_task_description.md`
- Cross-space tasks: `Chief-of-Staff/memory/planning/YYMMDDx_task_description.md`

Use `date +"%y%m%d"` for the date prefix. Append an auto-incrementing letter (a, b, c...) for multiple docs on the same day. See [write-planning-doc](../skills/documentation/write-planning-doc/SKILL.md) for full naming conventions.

**Lifecycle:** Created in Phase 3 (Planning), updated throughout, kept after completion for reference. On completion, can be moved to `memory/planning/finished/` if the space uses that convention.

### 2. Deliverables (task-dependent)

The actual output the user asked for. The form varies wildly by task:

| Task Type | Typical Deliverable | Where It Goes |
|-----------|-------------------|---------------|
| Research / analysis | Summary document, report | Relevant space's `memory/research/` or user-specified location |
| Draft email / message | Text ready to send | Presented inline for user to send (or sent via MCP if user approves) |
| Meeting prep / brief | Briefing document | Relevant space's `memory/planning/` or presented inline |
| Document creation | The document itself | User-specified location, or relevant space folder |
| Spreadsheet / data work | Updated/created spreadsheet | User-specified location, or alongside source files |
| Multi-step operations | Actions taken + summary of results | Summary in working document; actions executed via MCPs |
| Presentation | Updated/created slides | User-specified location |

**Principles for deliverable location:**
1. **Ask if unclear.** If the user didn't specify where the output should go, ask — or place it alongside the source material with a clear name.
2. **Don't bury things.** Deliverables should be easy to find. Use descriptive filenames.
3. **Record where things went.** The working document should note the path of every file created or modified, so the user can find them later.
4. **Some deliverables aren't files.** Sending emails, updating a CRM, posting to Slack — these are actions, not files. The working document records what was done.

---

## Working Document

The working document is the task's source of truth. All subagents read it for context.

**Template:** [`showrunner/references/working-document-template.md`](references/working-document-template.md)

Copy this template when creating the working document. Key sections:

| Section | Purpose | Who updates |
|---------|---------|-------------|
| **Frontmatter** (YAML) | Machine-readable metadata: workflow, status, models, lenses, sources, deliverables | Orchestrator updates throughout |
| **User Intent** | What, why, audience, success criteria, constraints | Orchestrator (Phase 1) |
| **Current State** | Authoritative snapshot — subagents read this FIRST | Orchestrator after each phase |
| **Source Inventory** | What's connected, what was found, what's missing | Forager + Orchestrator (Phase 2) |
| **Approach** | Staged breakdown with execution notes per stage | Planner (Phase 3), Implementer (Phase 6) |
| **Deliverables** | Every file created/modified, every action taken, with locations | Implementer + Orchestrator |
| **Review History** | Who reviewed, key feedback, what was accepted/rejected | Orchestrator (Phases 4, 7, 8) |
| **Activity Log** | Append-only timeline of key workflow events | Orchestrator throughout |

### Frontmatter Metadata

The working document uses YAML frontmatter for machine-readable metadata. This enables:
- Other workflows or automations to find and reference past work
- Pattern detection across tasks (which models performed well, which lenses were useful)
- The Fixer/Pathologist workflow (future) to trace how a deliverable was produced

Key frontmatter fields:
- `workflow: showrunner` — identifies this as a Showrunner task
- `status` — current workflow state
- `models` — which models were assigned to each role
- `lenses` — which quality lenses were activated
- `sources_used` — populated as sources are consumed (list of MCP names, file paths, etc.)
- `deliverables_produced` — populated as outputs are created (list of file paths or action descriptions)

### Activity Log

The Activity Log section in the working document is the human-readable record of what happened. Every significant workflow event should be appended here:

- Source discovery results
- Plan creation and confidence
- Stage execution and confidence
- Review results (accepted/rejected counts, confidence)
- Refinement iterations
- User checkpoint outcomes
- Deliverable creation (what was produced, where it went)
- Errors or substitutions

This replaces the need for users to parse structured log lines. The `[SHOWRUNNER]` log lines (see [Logging Format](#logging-format)) are for the orchestrator's own use during the session; the Activity Log is the persistent record that survives after the conversation ends.

---

## Handoff Templates

### Forager Packet (Showrunner → Forager)

Used in Phase 2 (Source Discovery).

```
## Forager Packet

**Task:** <brief description>
**User Intent:** <what they need and why>

### Sources to Check
- <MCP/tool>: <what to look for>
- <Memory search>: <terms to search>
- <Conversation search>: <topics to look for>
- <Files>: <paths or descriptions>

### What to Return
Return the ACTUAL CONTENT found, not just descriptions. Organise by source.
For each finding, include:
- Source (where it came from)
- Content (the actual information)
- Relevance (why it matters for this task)
- Freshness (how current the information is)

If a source is unavailable or returns nothing useful, say so explicitly.
```

### Execution Packet (Showrunner → Implementer)

Used in Phase 6 (Stage Execution).

```
## Execution Packet

**Working Document:** `<path>`
**Stage:** <N> — <title>

### What to Produce
<clear description of the expected output for this stage>

### Sources & Tools Available
- <what MCPs, files, memories, prior stage outputs to use>

### Context
<relevant findings from research, user preferences, audience info>

### Quality Criteria
- [ ] <specific quality check for this stage>
- [ ] <e.g., "All financial figures sourced from Q3 report">
- [ ] <e.g., "Tone appropriate for board-level audience">

### Skills to Use                               <!-- optional -->
- <skill name>: <when/how to use it>

### Known Constraints                           <!-- optional -->
- <e.g., "User prefers bullet points over prose">
- <e.g., "Keep under 2 pages">
- <e.g., "Use British English">

### Previous Stage Outputs                      <!-- optional, stages 2+ -->
- Stage <N-1> produced: <summary of what's available>

Read the working document first for full context.
Update the Execution Notes for your stage before declaring complete.
Report confidence (0-100%).
```

### Review Packet (Showrunner → Reviewer)

Used in Phase 4 (Plan Review) and Phase 7 (Quality Review).

```
## Review Packet

**Review Type:** plan | deliverable
**Working Document:** `<path>`
**Focus:** <what to review — "the overall approach" or "Stage N output">

### Assigned Lens                               <!-- if applicable -->
<lens name and specific questions from the Lens table>

### What Changed                                <!-- deliverable reviews -->
<summary of what was produced>

### Key Decisions                                <!-- deliverable reviews -->
<decisions made during execution, with rationale>

### Concern Areas                               <!-- optional -->
- <specific things to scrutinise>

### Ignore List                                 <!-- optional -->
- <known limitations or out-of-scope items>

### Required Output
- Confidence (0-100%)
- Issues: must-address (blocks delivery) vs suggestions (nice-to-have)
- For deliverable reviews: Would you be comfortable if the user sent/presented
  this as-is? If not, what must change?
- If confidence < 85%, explain specifically why.

Read the working document first.
Review the actual deliverable content, not just the plan.
```

---

## Confidence Thresholds

### Plan Confidence
| Level | Threshold | Action |
|-------|-----------|--------|
| High | All reviewers >= 85% | Proceed to execution |
| Below | Any reviewer < 85% | Address concerns, re-review (max 2 iterations) |

### Deliverable Confidence
| Level | Threshold | Action |
|-------|-----------|--------|
| High | All reviewers >= 85% | Proceed to next stage or delivery |
| Below | Any reviewer < 85% | Refine and re-review (max 3 iterations) |
| Stuck | Below 85% after 3 iterations | Present to user with specific concerns |

---

## Iteration Limits

- **Plan review iterations:** Maximum 2
- **Stage review iterations:** Maximum 3 per stage
- If limits reached: present user with specific unresolved concerns and options (proceed / refine / change approach)

---

## SHOWRUNNER-lite (Low Complexity)

For tasks assessed as low complexity where the approach is clear:

- Skip Phase 3 (planner) — create the plan yourself
- Skip Phase 4 (plan review)
- Use **cross-check** review mode: one reviewer from a **different model family** than you. This is the minimum — cross-family review is never skipped because it catches things same-family review misses.
- No lenses (unless the task has obvious sensitivity or data integrity concerns)
- All other phases still apply

The cross-check reviewer should be a cost-effective model from a different family — this is cheap but high-value. For example, if you're Opus, a Haiku cross-check is insufficient (same family); use GPT, Gemini, Kimi, or MiniMax instead. If only one model family is available, use a different model size as a fallback.

Log: `[SHOWRUNNER] Mode: SHOWRUNNER-lite (cross-check reviewer: <model>)`

---

## Abort Protocol

If user says "stop" or wants to change direction:

1. Halt immediately
2. Log: `[SHOWRUNNER] Abort requested`
3. Summarise work completed and current state
4. Save anything useful (research, partial drafts) for potential future use
5. Ask if the user wants to keep any of the work done so far

---

## Eval & Headless Mode

When running in eval or headless mode (no interactive user available):

- **Skip Phase 5** (User Checkpoint) entirely — proceed autonomously regardless of autonomy setting
- **Skip Phase 1 clarifying questions** — proceed with high confidence based on the prompt and available context. Do not ask the user questions that will never be answered.
- **Phase 0 complexity assessment** still runs (determines review mode and lenses)
- **All execution phases** (source discovery, planning, execution, review) run normally
- **Working document** is still created and maintained (useful for post-eval analysis)

Log: `[SHOWRUNNER] Eval mode: headless — skipping user interactions`

---

## Logging Format

Two logging channels serve different purposes:

### 1. Session logs (`[SHOWRUNNER]` prefix)

Used by the orchestrator during the conversation for real-time coordination. These are ephemeral — they exist in the conversation transcript but don't persist beyond the session.

```
[SHOWRUNNER] <message>
[SHOWRUNNER] Phase X: <phase name>
[SHOWRUNNER] Confidence: X%
[SHOWRUNNER] Delegating to <role>...
[SHOWRUNNER] Warning: <message>
[SHOWRUNNER-REVIEW-SCORE] {"phase":"...","reviewer":"...","confidence":...,"accepted":...,"rejected":...,"highlight":"..."}
[SHOWRUNNER-SESSION-SUMMARY] {"stages_completed":...,"total_review_rounds":...,"reviewers":[...],"lenses":[...],"sources_used":[...],"status":"..."}
```

### 2. Working document Activity Log (persistent)

Key events are also appended to the **Activity Log** section of the working document. This is the persistent record that survives after the conversation ends. Write a human-readable summary, not raw log lines.

**What to log in the Activity Log:** Phase transitions, source discovery results, plan creation, stage execution (with confidence), review results, refinement decisions, deliverable creation, errors. See the [Working Document](#working-document) section for details.

---

## Quick Reference

| Phase | Who | Action |
|-------|-----|--------|
| 0 | You | Task intake, inventory models, assign roles, assess complexity, select review mode and lenses |
| 1 | You | Understand user intent (don't proceed until confident) |
| 2 | You + Forager(s) | Discover sources: MCPs, memories, prior work, files, tools |
| 3 | Planner subagent | Research and create staged approach |
| 4 | Reviewer subagent(s) | Review the plan |
| 4.5 | You | Synthesize plan feedback, refine (final arbiter) |
| 5 | User (adaptive) | Adaptive checkpoint — approve / modify / abort (skipped if surprise test passes) |
| 6 | Implementer subagent | Execute stage (draft, synthesize, calculate, send) |
| 7 | Reviewer subagent(s) | Review stage output with lenses |
| 8 | You | Synthesize feedback, refine (final arbiter) |
| 9 | Reviewer subagent(s) | Final review (full-review mode only) |
| 10 | You | Deliver to user, offer follow-up actions |

---

## Checklist

- [ ] Task received and assessed
- [ ] Available models inventoried and roles assigned (cross-family review confirmed)
- [ ] Complexity and review mode determined
- [ ] Lenses selected
- [ ] User intent confirmed (confident)
- [ ] Source discovery completed (MCPs, memories, prior work)
- [ ] Plan created (by planner or self for SHOWRUNNER-lite)
- [ ] Plan reviewed and refined
- [ ] Adaptive user checkpoint passed or skipped (surprise test)
- [ ] For each stage:
  - [ ] Executed by implementer
  - [ ] Working document updated with execution notes
  - [ ] Reviewed by reviewer(s) with lenses (cross-family diversity confirmed)
  - [ ] Feedback synthesized and output refined (max 3 iterations, all reviewers >= 85%)
  - [ ] Reviewer scores emitted
- [ ] Final review completed (if full-review mode)
- [ ] Deliverable presented to user
- [ ] Follow-up actions offered
- [ ] Session summary logged
