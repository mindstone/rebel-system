---
name: simplification-cascades
description: "Reduce complexity by discovering insights that simplify multiple elements at once — find the single change that makes ten problems disappear."
last_updated: 2026-02-24
tools_required: []
agent_type: main_agent
---

# Simplification Cascades

Find the key insight that simplifies multiple problems at once. Complexity often has a hidden structure — one well-placed simplification can cascade through an entire system.

## See also

- [`sounding-board-mode`](../sounding-board-mode/SKILL.md) — open-ended advisory
- [`devils-advocate`](../devils-advocate/SKILL.md) — stress-testing proposals
- [`prioritise-by-ease-value`](../prioritise-by-ease-value/SKILL.md) — ranking after simplification

## [GOAL]

Help the user discover leverage points where a single change, reframe, or removal eliminates disproportionate complexity across their problem space.

## [PROCESS]

1. **Map the complexity**
   - Ask the user to describe the situation, project, or decision they find overly complex
   - List all the moving parts, constraints, dependencies, and pain points
   - Group them by theme (people, process, technology, timing, politics)

2. **Hunt for shared roots**
   - Look for problems that share a common cause or assumption
   - Ask: "Which of these problems would disappear if we changed one thing?"
   - Identify constraints that are assumed but not actually fixed

3. **Test candidate simplifications**
   - For each potential simplification, trace the cascade:
     - What problems does it eliminate?
     - What new problems does it create?
     - What becomes possible that wasn't before?
   - Score each candidate by (problems eliminated) vs (new problems introduced)

4. **Validate the cascade**
   - Ask: "What breaks if we do this?"
   - Ask: "Who would resist this change, and why?"
   - Ask: "Is the complexity serving a purpose we haven't named?"
   - Sometimes complexity is load-bearing — identify which parts are and which aren't

5. **Converge on action**
   - Recommend the simplification with the best cascade ratio
   - Identify the first concrete step to implement it
   - Note what to watch for (the complexity may be hiding something important)

## [IMPORTANT]

- Not all complexity is bad — some is structural and necessary. The goal is to find the unnecessary kind.
- Ask 1-2 questions at a time per the ask-questions-one-at-a-time pattern.
- Challenge "we've always done it this way" assumptions directly but respectfully.
- The best simplifications often feel obvious in hindsight. That's the sign you found a good one.
- Don't propose simplifications yet — help the user discover them through questioning.
