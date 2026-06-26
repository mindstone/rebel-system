---
description: "Tips for getting the most out of Rebel on complex, long-running tasks"
last_updated: "2026-06-26"
---

# Running Big Jobs

Some tasks are bigger than a quick question. Multi-step research, large document creation, complex analysis—these benefit from a different approach. This guide covers techniques for getting Rebel to do more, better, with less hand-holding.


## The Async Mindset

Rebel isn't built for step-by-step hand-holding. It's designed to be trusted with substantial work—the kind that might take minutes or even hours to complete properly.

**Think delegation, not dictation.** Instead of micro-managing each step, describe the outcome you want and let Rebel figure out how to get there. It will decompose complex goals into smaller steps, persist through obstacles, and only interrupt you when genuinely stuck.

**Run multiple conversations at once.** While one conversation researches market trends, another can draft your presentation, and a third can organize your meeting notes. Each runs independently—you can check in when convenient.

**Work in the background.** With Rebel open, conversations continue processing even while you're reading email, in a meeting, or working in another app. Start a task, switch away, come back when it's done.

**Important limitation:** Rebel runs locally on your computer. If you close the app or your machine sleeps, work pauses. Cloud processing (continuing while your computer is off) isn't available yet.


## Define "Done" Clearly

The single most important thing you can do is tell Rebel what success looks like.

**Vague:** "Research our competitors"

**Clear:** "Create a comparison table of our top 5 competitors, covering pricing, key features, and target market. Save to my workspace as `competitor-analysis.md`"

Include:
- **Deliverables** — What should exist when this is done?
- **Format** — Markdown file? Table? Bullet points?
- **Location** — Where should output go?
- **Scope boundaries** — What's explicitly *not* included?

When Rebel knows what "done" means, it can work toward that goal without stopping to ask for clarification.


## The Unleashed Keyword

For extended autonomous work, add `//unleashed` anywhere in your message:

```
//unleashed Research all our Q3 product launches and create a summary document with timeline, key decisions, and lessons learned.
```

**What it does:**
- Tells Rebel to keep working unless explicitly complete
- Increases tolerance for continuation (10 auto-continues vs the normal 3)
- Only recognizes strict completion signals, not polite "let me know if you need anything" exits

**When to use it:**
- Multi-step research spanning many files
- Document creation that requires iteration
- Tasks where you want Rebel to figure out the approach

This is sometimes called the "Ralph Wiggum technique"—named after the Simpsons character—a pattern popularized in AI coding circles for letting agents work autonomously through a list of tasks.

**Safety note:** Rebel's safety guardrails remain fully active. `//unleashed` affects *continuation behavior*, not permissions. Tool approvals still apply.


## Auto-Done (Fire & Forget)

Auto-done embodies the async mindset: start work, trust it to complete, and have it filed away without babysitting.

**How it works:**

1. Click the done toggle button next to Send (turns green when enabled)
2. Send your message as normal
3. Rebel works on the task
4. When complete, Rebel evaluates whether the task looks finished
5. If it looks complete, the conversation is marked as done automatically. If something needs attention, it stays visible.

**The toggle button:**
- **Click** — Enable or disable auto-done mode (green = enabled)
- **Long-press** — Mark the current conversation as done immediately (when idle)

**Toggle any time:** Enable before sending, or even mid-turn if you decide you don't need to watch. Disable if things get complicated.

**Why it matters:** Auto-done supports running multiple conversations simultaneously without clutter. Start five tasks, each with auto-done enabled. Check back later to find completed work in your Done section—and anything that needs attention still visible in your conversation list.

This is about *your* conversations. [Automations](rebel://automations) are separate: scheduled or event-triggered runs live under Automations, not in **Active**, so they don't crowd the list while you parallelise your own work.

Perfect for:
- Background research you'll review later
- Routine tasks you've delegated before
- Parallel workflows where you're juggling multiple threads
- Anything where you trust the process

Find completed conversations in the Done section of your sidebar.


## Work in Parallel

Rebel handles multiple conversations simultaneously. Use this to your advantage.

**Instead of:** "Research competitors, update our positioning doc, and draft a blog post about our differentiators"

**Try:** Three separate conversations—one for research, one for positioning, one for the blog post. Run them all at once, each with auto-done enabled.

Benefits:
- Each conversation has full working memory for its task
- Failures don't cascade across tasks
- Easier to review and iterate on each piece
- Total time is limited by the slowest task, not the sum of all tasks

**When to keep it together:** Tasks that genuinely depend on each other's output, or when you need a coherent narrative across all deliverables.

**Tip:** Combine with auto-done for maximum efficiency. Start multiple tasks, minimize Rebel, and check back later. Completed work will be in your Done section; anything requiring attention will be waiting in your conversation list.

**Your conversations vs automations.** Parallel-workflow tips here apply to chats you start yourself. Automation runs stay under [Automations](rebel://automations) — kept out of **Active**, pinned tabs, and unread counts by design. Review them from Automations run history, or the **All** tab if you want the full picture.


## Use Skills for Repeatable Jobs

If you find yourself giving similar instructions repeatedly, turn it into a skill:

1. Ask Rebel: "Create a skill for [this kind of task]"
2. Save it to your workspace
3. Next time, just reference the skill: "Run the competitor analysis skill for Acme Corp"

Skills encode your preferences, format requirements, and quality standards so you don't have to repeat yourself.

See [Using Skills](library://rebel-system/help-for-humans/using-skills.md) for details.


## Monitor Long-Running Work

For extended tasks:

- **Progress indicators** — Rebel shows what it's working on in real-time
- **Stop button** — Always available if things go sideways
- **Message history** — Scroll up to see the full trail of work

If Rebel seems stuck or is going in the wrong direction, stop it, provide course correction, and let it continue.


## When Rebel stops on its own

On long or ambitious tasks, Rebel may stop a task that's looping or running away. The message tells you plainly what happened — not a generic retry prompt that doesn't fit.

- **Your conversation:** Read what stopped; send a follow-up, or click **Continue** if it's offered, to have Rebel pick up again.
- **A scheduled automation:** Rebel says it'll try again on its **next scheduled run**. Nothing for you to resend. Check the run in [Automations](rebel://automations) if you want details before the next run.


## Leverage Memory

For recurring big jobs, help Rebel remember the context:

- **Save key facts** to memory: "Remember that our fiscal year starts in April"
- **Reference past work**: "Look at the analysis I did last quarter in `Q2-analysis.md`"
- **Build on previous conversations**: Use `@` to mention relevant past sessions

The more context Rebel has, the less you need to explain each time.


## Tips for Complex Tasks

1. **Front-load constraints** — Mention limitations, preferences, and non-negotiables early
2. **Specify the model** — Opus for planning and strategy, Sonnet for execution (Settings → Models)
3. **Attach reference materials** — Drag in examples of what good output looks like
4. **Use explicit checkpoints** — "After completing the research phase, pause and show me what you've found before proceeding"


## Context Management

Rebel automatically manages conversation context to keep you within limits:

- **Lazy context escalation** — Conversations start at 200K tokens and automatically escalate to 1M when needed (if available). Watch the usage tooltip to see your current utilization.
- **Context compaction** — When context gets full, Rebel summarizes the conversation and continues seamlessly
- **Extended context** — Enable in **Settings → Agent & Voice → Intelligence** for access to 1M tokens (requires API Tier 4). See [AI Models](library://rebel-system/help-for-humans/AI-models.md#extended-context) for details.


## Related

- [How Rebel Works](library://rebel-system/help-for-humans/how-it-works.md) — Mental model for conversations, spaces, and memory
- [Using Skills](library://rebel-system/help-for-humans/using-skills.md) — Reusable workflows for common tasks
- [Privacy Mode](library://rebel-system/help-for-humans/privacy-mode.md) — Extra caution for sensitive work
- [Automations](library://rebel-system/help-for-humans/automations.md) — Schedule recurring tasks
