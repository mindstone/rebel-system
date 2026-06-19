---
name: knowledge-extraction-report
description: "Extract structured knowledge from messy multi-format documents — turn piles of PDFs, slides, emails, and notes into a coherent report."
last_updated: 2026-02-24
tools_required: []
agent_type: main_agent
---

# Knowledge Extraction & Report

Take a collection of documents in mixed formats and produce a structured, coherent report. Useful when you've accumulated research, meeting notes, articles, and files that need to be synthesised into something actionable.

## See also

- [`web-researcher`](../web-researcher/SKILL.md) — when you need to gather information from the web
- [`transcript-analysis`](../../meetings/transcript-analysis/SKILL.md) — for individual meeting transcripts

## [GOAL]

Transform a messy collection of documents into a structured report with clear findings, themes, and recommendations.

## [PROCESS]

1. **Intake**
   - Ask: "What documents should I work with?" (file paths, folder, pasted text)
   - Ask: "What's this report for? Who will read it?"
   - Ask: "Is there a specific question you want answered, or should I find the themes?"
   - Ask: "Any template or structure you'd like me to follow?"

2. **Ingest and catalogue**
   - Read all provided documents
   - Create a source inventory: file name, type, date, brief description of contents
   - Note quality issues: incomplete documents, conflicting information, gaps

3. **Extract and cross-reference**
   - Pull out key facts, claims, data points, decisions, and quotes from each source
   - Tag each extraction with its source for attribution
   - Identify themes that appear across multiple documents
   - Flag contradictions between sources
   - Note gaps: what questions remain unanswered?

4. **Synthesise**
   - Organise findings by theme (not by source document)
   - For each theme:
     - What do the sources collectively say?
     - Where do they agree and disagree?
     - What's the confidence level? (well-supported / emerging / speculative)
   - Identify the 3-5 most important findings

5. **Produce the report**
   - Structure based on audience:
     - **Executive audience**: Lead with recommendations, then supporting evidence
     - **Research audience**: Lead with methodology and findings, then implications
     - **Working team**: Lead with decisions needed, then context
   - Include a source appendix so the reader can verify claims
   - Keep it as short as the content allows — no padding

6. **Quality check**
   - Every claim should cite its source
   - Contradictions should be noted, not hidden
   - Gaps should be flagged: "This report does not cover [X] because no source addressed it"
   - Ask the user: "Anything missing, or should I dig deeper on any theme?"

## [IMPORTANT]

- Synthesise, don't summarise. The value is in connecting information across sources, not restating each one.
- Attribute everything. "According to [source]..." or "(Source: [file], p.X)"
- Be honest about confidence levels. Don't present speculative synthesis as established fact.
- If documents are too large to process at once, work in batches and maintain a running synthesis.
- Respect the user's time: the report should be shorter than the source material, not longer.
