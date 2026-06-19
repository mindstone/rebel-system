---
description: Phase 2 synthesis for safety prompt migration — merges Phase 1 outputs into unified Safety Principles
service: src/core/safetyPromptMigration.ts
variables: []
model_hint: sonnet
critical: true
---
You are creating a unified Safety Principles document for a user.
This document governs ALL actions the AI assistant takes on the user's behalf:
tool calls, memory writes, file operations, and communications — in both
automated workflows AND interactive conversations. It is NOT specific to
automations.

You are given:
- Universal principles (apply everywhere)
- Scoped principles grouped by automation purpose (apply only in that context)
- The user's global safety preferences

Produce a clean Markdown document with:
1. A "Universal Principles" section. The intro line MUST say these principles
   apply to "all actions — tool calls, memory writes, and communications — in
   both automated workflows and interactive conversations."
   Always include: "When uncertain whether an action is appropriate, ask for
   confirmation before proceeding." and "Never share passwords, API keys, or
   other credentials."
2. Optionally, domain-specific sections for scoped principles that don't
   generalize well. Use domain categories (e.g., "Communication & Messaging")
   rather than automation names as section headers.

Rules:
- Do NOT use the phrase "access rules" anywhere.
- Do NOT include specific channel names, directory paths, CLI commands, or
  service names — use general categories instead.
- Keep principles actionable: an LLM evaluating a tool call should be able to
  decide allow/block based on each principle.
- Deduplicate: if multiple automations share the same universal principle, include
  it once.

CRITICAL — Scope preservation:
- Do NOT lift scoped principles into universal bans. A restriction that applies
  to one automation's external messaging must NOT become a universal "never send
  messages" ban.
- Do NOT create universal "read-only" or "never modify" rules. Many legitimate
  actions involve writing (saving files, updating memory, sending messages,
  creating calendar reminders). The correct principle is "confirm before
  modifying or sending" for a cautious user, not "never modify."
- If a principle would contradict an explicitly allowed action in a domain
  section, it is too broad. Narrow it or move it to the relevant domain section.
- You may downgrade a purported universal principle to scoped if it is clearly
  automation-specific. For example, "only use independent third-party sources"
  is a content-curation preference, not a universal safety principle.
- When one section says "do not X without authorization" and another section
  explicitly permits X in a specific context, add "unless explicitly permitted
  by domain-specific principles below" to the restrictive rule, or remove the
  contradiction.

CRITICAL — Interactive usability:
- The user will ask the assistant to do things in conversation: send messages,
  write files, update memory, search email. Universal principles must NOT block
  actions the user explicitly requests. Use "confirm before" rather than "never"
  for actions the user might legitimately ask for.
- "Protect sensitive content" means do not share it with THIRD PARTIES or log
  it externally — not that the assistant cannot show information to the user.
- Avoid the phrase "automation's purpose" in domain sections — use neutral
  phrasing like "the task's purpose" or "the declared scope" so principles
  read naturally in both automated and interactive contexts.

CRITICAL — Memory writes:
- This document governs memory writes (saving information to the user's knowledge
  base). Principles about memory should distinguish between personal memory
  (generally allowed) and shared/team memory (requires more caution).
- Updating existing memory entries is a normal operation (e.g., adding citations,
  enriching metadata). Do NOT prohibit memory updates universally.

Return JSON: { "markdown": "..." }
