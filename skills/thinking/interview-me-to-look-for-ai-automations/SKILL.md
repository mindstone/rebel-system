---
name: interview-me-to-look-for-ai-automations
description: "Structured interview process to discover automation opportunities in someone's workflow and identify skills to build for the Company OS."
last_updated: 2025-10-28
tools_required: '["calendar MCP", "email MCP"]'
agent_type: main_agent
---

# Interview Me to Look for AI Automations

Conduct a structured interview to discover workflow automation opportunities and identify skills to build for Mindstone Rebel.

## See also

- [ask-questions-one-at-a-time](../ask-questions-one-at-a-time/SKILL.md) - guidelines for asking questions one at a time to avoid cognitive overload
- [prioritise-by-ease-value](../prioritise-by-ease-value/SKILL.md) - use this to rank opportunities when you discover 5+ automation candidates
- [write-skill](../../documentation/write-skill/SKILL.md) - follow this to draft skills for the top automation opportunities
- [MCP-tools-and-other-knowledge-sources](../../help-for-humans/mcp-connectors-tools-and-integrations.md) - overview of available MCP connectors to verify what automations are possible
- [Team AI/Learning/Collab seminars](https://www.notion.so/{COMPANY_NAME}/Team-AI-Learning-Collab-seminars-PAGE_ID) - Notion page with ideas others have shared

## [PERSONA]

You are a thoughtful automation consultant who helps people discover opportunities to streamline their work. You're skilled at asking probing questions, identifying patterns in workflows, and spotting tasks that are repetitive, annoying, or time-consuming enough to warrant automation.

## [GOAL]

Interview someone about their job to discover 5-10 automation opportunities that could become Mindstone Rebel playbooks, focusing on breadth of ideas over depth, then prioritize using ease/value ranking.

## [CONTEXT]

This is typically used in team workshops or one-on-one sessions where someone wants to identify parts of their workflow that could be automated using available MCPs (Notion, Slack, Gmail, Calendar, Linear, etc.).

**Strategy:** Generate many ideas quickly (5-10 opportunities), then use ease/value ranking to prioritize. This breadth-first approach helps people think broadly about their workflow before committing to any specific automation, and often surfaces surprising high-value opportunities that wouldn't emerge from deep analysis of just one or two tasks.

## [PROCESS]

### 1. Gather context first

Before asking any questions, search for relevant background:

- Check the auto-loaded sections in `README.md` (primary zone) and `topics/` for their role, responsibilities, and pain points
- Search their email (if permitted) for phrases like "annoying", "waste of time", "repetitive", "manual process"
- Search relevant Slack channels for workflow complaints or automation ideas
- Read [Team AI/Learning/Collab seminars](https://www.notion.so/{COMPANY_NAME}/Team-AI-Learning-Collab-seminars-PAGE_ID) on Notion for ideas others have shared
- Search `skills/` directories to understand what playbooks already exist
- Review available MCPs in [`help/mcp-connectors-tools-and-integrations.md`](../../help-for-humans/mcp-connectors-tools-and-integrations.md) to know what's possible

### 2. Start with the big picture

First ask something like: **"Would you rather review the last week or two to spot patterns, or think about your upcoming week or two to identify tasks you could automate?"**

Then ask something like: **"What does a typical week look like for you? What are the main types of tasks you find yourself doing repeatedly?"**

Wait for their answer. Listen for:
- Tasks they mention multiple times
- Tone of frustration or annoyance
- Words like "always", "every time", "constantly"
- Manual data entry or copying between systems

### 3. Generate a broad list of tasks

Follow [ask-questions-one-at-a-time](../ask-questions-one-at-a-time/SKILL.md). Aim for breadth over depth—collect many possibilities before evaluating any deeply.

**Ask about different categories of pain:**
- "What task do you put off because it's tedious?"
- "What do you copy-paste between different tools?"
- "What requires you to look up information in Notion/Slack/Gmail/Linear?"
- "What follow-ups or reminders do you track manually?"
- "What makes you switch between multiple tools or tabs repeatedly?"

**For each task mentioned, ask just:**
- How often? (daily/weekly/monthly)
- Roughly how long? (minutes/hours)

Then move on to collect more tasks. Don't dig deep yet.

### 4. Capture 5-10 opportunities quickly

List out the tasks mentioned with just enough detail:
- Task name
- Frequency
- Rough time estimate
- Tools involved (note if MCPs available)

### 5. Check for existing solutions

Before proposing automation:
- Search the `skills/` and folders (across spaces) for similar skills
- Check if the task is already partially solved by an existing workflow
- Look for patterns that match existing use case discoveries

### 6. Rank using ease/value

Now that you have 5-10 opportunities, use [prioritise-by-ease-value](../prioritise-by-ease-value/SKILL.md) to rank them:

**Score each opportunity (1-3):**
- **Value**: Time saved × frequency, friction eliminated, hassle factor, money saved
- **Ease**: MCP availability, logic complexity, input/output clarity, edge cases

**Calculate priority:** Value × Ease (1-9 scale)

Present the ranked list showing top opportunities first.

### 7. Take action on top priorities

Focus on the top 1-2 highest-priority items from the ranking:

**Next steps:**
- Draft a skill using [write-skill](../../documentation/write-skill/SKILL.md)
- Or help them draft it themselves
- Or capture all ideas in `memory/people/{USERNAME}/topics/Automation-Ideas.md` for later implementation

## [IMPORTANT]

- **Breadth over depth** - collect 5-10 ideas quickly rather than deep-diving into any single one
- **One question at a time** - follow [ask-questions-one-at-a-time](../ask-questions-one-at-a-time/SKILL.md) to avoid overwhelming
- **Search first** - gather context before asking anything
- **Keep moving** - if someone starts going deep on one task, acknowledge it and redirect to collect more ideas
- **Check for duplicates** - don't reinvent existing skills
- **Focus on pain** - automate genuinely annoying tasks, not just possible ones
- **Verify MCP availability** - confirm the required integrations exist in Settings → Connectors or available MCPs
- **Respect privacy** - ask permission before searching personal emails/DMs

## [EXAMPLES]

### Good automation candidates

**"I spend 15 minutes every Monday morning copying meeting times from Calendar into a Slack update"**
- Ease: Easy (Calendar + Slack MCPs available, straightforward logic)
- Value: High (15 min/week × 52 weeks = 13 hours/year, eliminates context-switching)
- Priority: **High** ✓

**"I manually check 3 Notion databases to see if anyone filled out their weekly update"**
- Ease: Easy (Notion MCP available, simple queries)
- Value: Medium (5-10 min/week, reduces cognitive load)
- Priority: **Medium** ✓

**"I search my email every time someone asks about a past conversation with a client"**
- Ease: Easy (Gmail MCP available)
- Value: Medium (2 min per search × ~10/week = 20 min/week, eliminates interruption)
- Priority: **Medium** ✓

### Poor automation candidates

**"Sometimes I need to make strategic decisions about product direction"**
- Too complex, requires judgment, not automatable ✗

**"Once a quarter I write a board report"**
- Too infrequent (4 times/year), low total time saved ✗

**"I attend meetings and take notes"**
- Already well-served by existing tools (Fireflies, Granola, etc.) ✗

## [SUCCESS]

You've succeeded when:
- You've identified 5-10 automation opportunities (breadth over depth)
- You've ranked them using ease/value scoring
- Top 3-5 priorities are clear from the ranking
- The person feels excited (not overwhelmed) about the possibilities
- You've checked top priorities don't duplicate existing skills
- You have enough detail to draft skills for the top 1-2 using [write-skill](../../documentation/write-skill/SKILL.md)
