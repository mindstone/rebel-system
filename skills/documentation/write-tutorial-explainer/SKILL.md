---
name: write-tutorial-explainer
description: "Creates comprehensive HTML tutorial explainers that build mental models of complex systems through layered explanations, visual diagrams, and progressive disclosure."
last_updated: 2026-03-24
agent_type: main_agent
---

# Write Tutorial Explainer

Create deep-dive tutorial explainers that help people build strong mental models of complex systems, workflows, or knowledge work processes.

## See also

- `write-tutorial-explainer-TEMPLATE.html` - HTML template to copy and fill in (in this directory)
- [write-help-evergreen-doc.md](documentation/write-help-evergreen-doc/SKILL.md) - For reference documentation on how systems work
- [write-deep-dive-as-doc.md](documentation/write-deep-dive-as-doc/SKILL.md) - For researching external technologies
- [generate-Mermaid-diagram.md](documentation/generate-Mermaid-diagram/SKILL.md) - For creating visual flow diagrams
- [sounding-board-mode.md](thinking/sounding-board-mode/SKILL.md) - For collaborative planning before writing
- [write-skill.md](documentation/write-skill/SKILL.md) - For writing skill documentation specifically

**Original inspiration**:
- `/Users/yourname/dev/company-work/CompanyDrive/src/github.com/example/tutorial-project/docs/instructions/WRITE_TUTORIAL_EXPLAINER.md` - Code tutorial writing guide
- `/Users/yourname/dev/company-work/CompanyDrive/src/github.com/example/tutorial-project/docs/tutorials/TUTORIAL_TEMPLATE.html` - Code tutorial template
- Adapted for general knowledge work (not just code)


## [PERSONA]

You are an experienced technical educator and knowledge architect, expert at transforming complex systems into pedagogical content that builds deep understanding. You excel at spiral curriculum teaching, creating multiple mental models, and structuring information in layers that serve both skimmers and deep divers.


## [GOAL]

Create comprehensive HTML tutorial explainers that help experienced knowledge workers understand complex systems, workflows, or processes through mental models, visual diagrams, and layered explanations.


## [CONTEXT]

Tutorial explainers are pedagogical documents focused on **building mental models** rather than just cataloging facts. They differ from reference documentation by prioritizing understanding and providing multiple passes at increasing depth.

**Target use cases**:
- Understanding complex skill systems (e.g., JW skills/playbooks architecture)
- Learning workflow automation patterns
- Grasping script or code architectures
- Onboarding to complex processes or knowledge systems

**Not for**:
- Simple how-to guides (use `write-help-evergreen-doc.md`)
- External technology research (use `write-deep-dive-as-doc.md`)
- API reference (evergreen docs)


## [PROCESS]

### 1. Understand the learner and scope

Ask these questions upfront (1-2 at a time to avoid cognitive overload):

- **Experience level**: What's your familiarity with this topic? (beginner / intermediate / expert)
- **Comparative expertise**: What similar systems are you familiar with? (for analogies)
- **Specific focus**: What specifically are you trying to understand?
- **Context**: Are you debugging, building, or exploring?

Use their answers to determine:
- **Tutorial depth**: Full structure vs. simplified
- **Location**: Personal (`memory/people/[USERNAME]/tutorials/`), team (`memory/teams/[TEAM]/tutorials/`), or shared (`help/tutorials/`), or in code projects (`docs/tutorials/`), or similar as appropriate for the project.
- **Analogies to use**: Tailor to their existing expertise

### 2. Assess complexity and choose structure

Based on the topic:

**Simple topics** (workflows, single scripts, straightforward processes):
- TL;DR summary
- Key mental models (2-3)
- Visual flow (if applicable)
- Main explanation with progressive disclosure
- File map / references

**Complex topics** (multi-component systems, architectures, intricate processes):
- Full tutorial structure with:
  - Mental models section (3-5 models)
  - Spiral curriculum (overview → components → detailed walkthrough → deep dive)
  - Code/file catalogue
  - Data dictionary (if applicable)
  - Cookbook of common tasks

**Use judgment**: If uncertain, start with full structure and simplify during writing.

### 3. Gather information and create visuals

- Explore the topic thoroughly (use codebase search, file reading, web research as needed)
- **Generate Mermaid diagram** if the topic has clear flow/structure:
  - Use `generate-Mermaid-diagram.md` as needed
  - Show complete flow with color coding
  - Use subgraphs to organize related components
  - Generate both `.mermaid` source and `.svg` for embedding
  - Save diagrams alongside tutorial (same directory)
- For non-flow topics, consider other visual aids (architecture diagrams, hierarchy charts)

### 4. Write the tutorial

**Start from template**: Copy `skills/documentation/write-tutorial-explainer-TEMPLATE.html` to your target location and fill it in.

**Frontmatter/Description**:
- For `.md` files: Include YAML frontmatter with at least a one-line `description` field (may include other optional fields like `use_cases`, `last_updated`, `tools_required`, `dependencies`, `agent_type`)
- For `.html` files: Include a meta description tag in the `<head>` section for programmatic extraction:
  ```html
  <meta name="description" content="One-line description of the tutorial (can be a long line if needed)">
  ```

Include metadata comment at top (already in template):
```html
<!--
    TUTORIAL REQUEST
    
    User prompt: [EXACT USER REQUEST]
    
    Generated: [DATE]
    Audience: [TARGET_AUDIENCE]
    Complexity: [simple|medium|complex]
    
    Source files analyzed:
    - [list of key files examined]
    
    Related resources:
    - [related docs, playbooks, etc]
-->
```

**Core sections** (always include):
- Title & metadata (audience, reading time, prerequisites)
- TL;DR executive summary (2-3 sentences)
- **Table of contents** with anchor links to all major sections
  - Use `<h2 id="section-name">` for sections
  - Link format: `<a href="#section-name">Section Name</a>`
  - Include nested structure for complex tutorials
  - Style with `.toc` class for consistent formatting
- Key mental models (2-5 models)
- Main content (structure varies by complexity - see below)
- File map & cross-references

**For complex topics, add**:
- Spiral curriculum structure:
  - Pass 1: High-level overview (what happens, no code)
  - Pass 2: Key components (what each part does)
  - Pass 3: Detailed walkthrough (step-by-step execution)
  - Pass 4: Deep dive (edge cases, advanced topics)
- Code/file catalogue (comprehensive reference with links)
- Data dictionary (if data structures are involved)
- Cookbook (common tasks and how-tos)

**Structure principles**:
- Use `<details>` extensively for progressive disclosure (default to closed for easier skimming)
- Show simplified but accurate examples
- Include ">>> WE ARE HERE <<<" markers in walkthroughs
- Link between sections (catalogue → walkthrough → mental models)
- Use callout boxes for mental models, warnings, tips
- **Use `cursor://file/` links for local files** - When linking to `.md` files or other local files in Mindstone Rebel, use the `cursor://file/` protocol so users can click to open them directly in Cursor
  - Format: `cursor://file/[ABSOLUTE_PATH]` where ABSOLUTE_PATH is the full workspace path
  - Get the workspace path from `<user_info>` Workspace Path
  - Example: `<a href="cursor://file//Users/username/Library/CloudStorage/GoogleDrive-you@example.com/Shared drives/CompanyDrive/help/README.md">README.md</a>`
  - Worst case: link doesn't work and user opens file manually

### 5. Polish and finalize

- Apply syntax highlighting with language classes (`language-python`, `language-bash`, etc.)
- Ensure all internal links work (`id` attributes, anchor links)
- Test progressive disclosure flow (can reader skim or dive deep?)
- Verify file paths and line numbers are accurate
- Save to appropriate location:
  - Personal: `memory/people/[USERNAME]/tutorials/yyMMdd[letter]_topic.html`
  - Team: `memory/teams/[TEAM]/tutorials/yyMMdd[letter]_topic.html`
  - Shared: `help/tutorials/yyMMdd[letter]_topic.html`
- Open in browser automatically after saving


## [EXAMPLE]

Below is a condensed example showing the key structural patterns in action. Imagine a user asked: "Help me understand how our email triage automation works."

```html
<!--
    TUTORIAL REQUEST
    User prompt: "Help me understand how our email triage automation works"
    Generated: 2026-03-24
    Audience: Product managers, intermediate familiarity
    Complexity: medium
-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="description" content="How the email triage automation classifies, routes, and escalates inbound messages">
  <title>Email Triage Automation — How It Actually Works</title>
</head>
<body>

<h1>Email Triage Automation</h1>
<p><strong>Reading time:</strong> 8 min skim, 20 min deep dive<br>
<strong>Audience:</strong> Anyone who's wondered why their inbox suddenly got quieter</p>

<h2>TL;DR</h2>
<p>Every inbound email passes through three stages — <em>classify</em>, <em>route</em>,
<em>act</em> — like a postal sorting office staffed by extremely literal robots.
Classification uses keyword rules first, then falls back to an LLM for
ambiguous messages. Routing sends each email to the right queue. Actions
range from auto-reply to human escalation.</p>

<h2>Table of Contents</h2>
<ol class="toc">
  <li><a href="#mental-models">Mental Models</a></li>
  <li><a href="#the-three-stages">The Three Stages</a></li>
  <li><a href="#deep-dive">Deep Dive: Classification Logic</a></li>
</ol>

<h2 id="mental-models">Mental Models</h2>

<div class="callout mental-model">
  <strong>🏤 The Postal Sorting Office</strong><br>
  Think of the system as a post office. Letters (emails) arrive at a single
  intake desk. A clerk (classifier) reads each envelope, stamps it with a
  category, and drops it into the right bin (queue). Downstream workers
  (actions) pick up from their bin and do the work — reply, file, or
  escalate to a human.
</div>

<div class="callout mental-model">
  <strong>🪆 The Two-Pass Filter</strong><br>
  Classification is a funnel: cheap keyword rules catch 80% of emails
  instantly. The remaining 20% of ambiguous messages get sent to the LLM
  for a second opinion — like escalating from a junior clerk to a senior
  one. This keeps costs low and latency fast.
</div>

<h2 id="the-three-stages">The Three Stages</h2>
<p><em>Pass 1 — high level, no code, just what happens:</em></p>
<ol>
  <li><strong>Classify</strong> — Determine what kind of email this is
      (support request, sales inquiry, spam, internal).</li>
  <li><strong>Route</strong> — Send it to the right queue based on
      classification. <!-- >>> WE ARE HERE <<< --></li>
  <li><strong>Act</strong> — Execute the appropriate action: auto-reply,
      create ticket, or flag for human review.</li>
</ol>

<details>
  <summary><strong>Pass 2 — what each component does</strong></summary>
  <h3>Classifier</h3>
  <p>Lives in <code>src/core/triage/classifier.ts</code>. Runs keyword
  rules from <code>rules.json</code>, then falls back to LLM via
  <code>classifyWithLLM()</code> for anything unmatched.</p>

  <h3>Router</h3>
  <p>A simple lookup table in <code>src/core/triage/router.ts</code>.
  Maps category → queue name. New categories need a one-line addition
  here.</p>

  <h3>Actor</h3>
  <p>Queue consumers in <code>src/core/triage/actions/</code>. Each file
  handles one action type. Adding a new action = new file + register in
  <code>actionRegistry.ts</code>.</p>
</details>

<h2 id="deep-dive">Deep Dive: Classification Logic</h2>
<details>
  <summary><strong>How the two-pass filter actually decides</strong></summary>
  <p>Keywords are matched case-insensitively against subject + first 200
  chars of body. The rule file supports AND/OR groups:</p>
  <pre><code class="language-json">{
  "support": { "any": ["help", "broken", "not working", "bug"] },
  "sales":   { "all": ["pricing", "demo"] }
}</code></pre>
  <p>If no rule matches with confidence &gt; 0.7, the message is handed to
  the LLM with a one-shot prompt. Average LLM classification adds ~800ms
  latency but catches nuanced requests like "I'd love to explore whether
  your platform could replace our current workflow."</p>
</details>

</body>
</html>
```

**What this example demonstrates:**
- **TL;DR up front** — reader knows the shape of the system in 3 sentences
- **Mental models before mechanics** — the postal office analogy makes the architecture intuitive before any detail appears
- **Progressive disclosure** — Pass 1 is always visible; Pass 2 and the deep dive are collapsed in `<details>` tags
- **">>> WE ARE HERE <<<" marker** — orients the reader during walkthroughs
- **Skimmable structure** — headings, bold terms, and the ToC let someone get value in 30 seconds or 20 minutes
- **Concrete, simplified examples** — the JSON rule snippet is trimmed to essence, not a real production dump


## [IMPORTANT]

- **Record the user's request** in HTML comment at top - capture their exact prompt and intent
- **Scale structure to complexity** - don't force full structure on simple topics
- **Generate diagrams when valuable** - if there's a flow/architecture, visualize it
- **Use progressive disclosure** - `<details>` tags extensively so readers can choose depth
- **Target the right audience** - adjust depth/analogies based on expertise level
- **Simplify examples** - remove boilerplate, focus on core concepts
- **Link comprehensively** - between sections, to source files, to related docs
- **Make it skimmable** - clear headings, mental model callouts, TL;DR up front
- **Open in browser after creation** - user should see the result immediately


## [TEMPLATE]

**Copy the template file**: `skills/documentation/write-tutorial-explainer-TEMPLATE.html`

This template includes:
- Complete HTML structure with styling
- Metadata comment section for recording user request
- Table of contents with anchor link structure
- Mental model callout boxes
- Progressive disclosure with `<details>` tags
- Code highlighting setup
- Responsive design
- All CSS styling pre-configured

Simply copy it to your target location, rename with the `yyMMdd[letter]_topic.html` pattern, and fill in the bracketed placeholders.


## [OUTPUT]

After creation:
- Save HTML file to appropriate location with `yyMMdd[letter]_descriptive-topic.html` naming
- Save any generated diagrams (`.mermaid` and `.svg`) in same directory
- Open the HTML file in default browser automatically
- Report location and provide summary of what was created


## [SUCCESS]

Tutorial is successful when:
- [ ] User's exact request captured in HTML comment
- [ ] Complexity appropriately assessed and structure adapted
- [ ] Mental models are clear and actionable
- [ ] Content is skimmable (TL;DR, headings, progressive disclosure)
- [ ] Visual diagrams included where valuable
- [ ] Examples simplified but accurate
- [ ] Comprehensive cross-references to source files/docs
- [ ] File opened in browser automatically
- [ ] Reader can choose their depth (skim vs. deep dive)

