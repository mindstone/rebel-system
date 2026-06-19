---
name: ask-questions-one-at-a-time
description: "Guide for gathering information from users by asking 1-2 questions at a time with proposed answers, building progressively to avoid cognitive overload."
last_updated: 2025-10-26
tools_required: []
agent_type: either
dependencies: []
---

# Ask Questions One at a Time

**Preferred tool: `AskUserQuestion`** — when you need information from the user, use this built-in tool to present structured multiple-choice questions. It renders clickable option cards inline in the conversation that the user can answer with a single tap — much faster and easier than typing. Supports 1-4 questions per batch, 2-4 options each, with an automatic "Something else" free-text option. Use it for clarification, preferences, decisions, or any structured input.

When gathering information from users:

- **Use `AskUserQuestion`** for structured choices — faster for users, reduces ambiguity, and avoids back-and-forth typing
- **Make every question self-contained** — the user sees each question on its own, without the surrounding conversation visible. Include all relevant context, background, and reasoning directly in the question text. Bad: "Which approach do you prefer?" Good: "For the quarterly report email to the board, should I use a formal executive summary format or a casual bullet-point update?"
- **Ask at most 1-4 questions at a time** (one `AskUserQuestion` batch) to avoid cognitive overload
- **Propose potential answers** as options — the tool's multiple-choice format does this naturally
- **Build progressively** — use earlier answers to tailor follow-up questions
- Give each question a clear, short header label (max 12 chars) so questions are scannable
- Fall back to plain text questions only when the question is truly open-ended with no reasonable options to propose
