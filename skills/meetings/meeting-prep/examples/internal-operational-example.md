---
description: "Example of internal operational meeting prep - Sprint planning with open blockers"
generated_by: skills/meetings/meeting-prep/SKILL.md
---

# Example: Internal Operational Meeting Prep

**Sprint 24 Planning - Product & Engineering Team**
**Monday, January 15, 2025, 2:00 PM - 3:30 PM GMT**

---

## Executive Summary

Sprint 23 wrapped with 3 incomplete stories (authentication bug, mobile UI regression, API rate limiting), and the team needs to finalize Sprint 24 scope while resolving blockers from the last sprint. The authentication bug is blocking 2 enterprise customer launches scheduled for Jan 22, and Product wants to add a new "quick export" feature that wasn't in the roadmap. Decision needed on whether to carry forward incomplete work or deprioritize in favor of new customer requests.

---

## Attendees

- **Alex Chen** - Engineering Lead
- **Priya Sharma** - Senior Backend Engineer
- **Jordan Lee** - Frontend Engineer
- **Sam Taylor** - Product Manager
- **Casey Morgan** - QA Lead

---

## Desired Outcomes

- **Finalize Sprint 24 scope** (target: 8 stories, 32 story points)
- **Resolve blocker** on authentication bug (assign owner, timeline)
- **Decide on "quick export" feature request** - add to Sprint 24 or backlog?
- **Align on priorities** if we can't complete all carried-forward work

---

## Key Questions to Ask

- What's the root cause of the authentication bug, and why wasn't it caught in Sprint 23?
- Can we ship a partial fix for auth bug by Jan 22 to unblock customers, or is it all-or-nothing?
- How many story points is the "quick export" feature realistically? (Sam estimated 5, but Jordan thinks 8-10)
- Do we have enough QA capacity if we carry forward 3 stories + add new work?
- What's our plan for preventing UI regressions like the one from Sprint 23?

---

## Context & Recent Activity

**Sprint 23 outcomes (ended Jan 12):**
- Completed: 6/9 stories (21/34 story points = 62% velocity)
- Incomplete: Authentication bug fix (8 pts), Mobile UI polish (3 pts), API rate limiting (2 pts)
- Retrospective sentiment: Team frustrated by scope creep and lack of clear priorities

**Recent developments:**
- **Slack #engineering (Jan 13)**: Priya posted that auth bug is more complex than expected - involves OAuth token refresh logic and may require library upgrade
- **Email from Customer Success (Jan 12)**: Two enterprise customers (Acme Corp, TechFlow) are blocked on launch due to auth bug; escalated to "urgent" status
- **Slack DM with Sam (Jan 14)**: Product team received "quick export" feature request from 3 customers last week; Sam pushing to fast-track into Sprint 24
- **Sprint 23 retro notes (Jan 12)**: Team noted QA bottleneck (Casey at 150% capacity), requests to limit WIP to 2 stories per engineer

**Open threads:**
- Jordan flagged that mobile UI regression was caused by a dependency update and suggests adding automated visual regression tests
- Alex concerned about team morale - Sprint 23 was 3rd consecutive sprint below 70% velocity
- Casey requested additional QA support or reduced scope; hasn't been addressed yet

---

## Likely Topics

1. **Authentication bug deep-dive** - Priya will explain root cause and proposed fix (OAuth library upgrade)
2. **Customer urgency vs. technical debt** - Debate whether to "band-aid fix" auth bug or do it properly (clean solution takes longer)
3. **Quick export feature scoping** - Sam will advocate for adding to Sprint 24; engineering likely to push back on timeline
4. **Velocity concerns** - Alex may raise pattern of under-delivering and need to reduce commitment
5. **QA capacity** - Casey will raise bottleneck issue; may need to defer some testing or reduce scope

---

## Quick Reference for During Meeting

**Key numbers to remember:**
- Sprint 23 velocity: 62% (21/34 story points completed)
- Sprint 24 target: 8 stories, 32 story points
- Auth bug customer impact: 2 enterprise launches blocked (Jan 22 deadline)
- Current QA capacity: 150% (Casey overloaded)

**Points to raise:**
- Suggest splitting auth bug into "quick fix" (unblock customers by Jan 22) + "proper fix" (add to Sprint 25)
- Push back on "quick export" feature - ask Sam to prioritize against other backlog items rather than auto-add to Sprint 24
- Request that we commit to 25 story points (realistic based on recent velocity) rather than 32
- Address QA bottleneck before finalizing scope - either reduce scope or get Casey support

**What you owe:**
- Decision on Sprint 24 final scope by end of meeting
- Communicate any timeline changes to Customer Success (if auth bug delayed)

**What they owe you:**
- Priya: Detailed timeline for auth bug fix (both quick fix and proper fix options) by EOD
- Sam: Prioritized backlog ranking for "quick export" feature vs. other requests by Wednesday
- Casey: Estimate of realistic QA capacity for Sprint 24 with current workload

---

## See Also

- **Slack #engineering thread** (Jan 13, 2025) - Priya's explanation of auth bug complexity and OAuth library issue
- **Email: "URGENT - Enterprise Customers Blocked on Launch"** (Jan 12, 2025) - Customer Success escalation with Acme Corp and TechFlow details
- **Slack DM with Sam** (Jan 14, 2025) - Discussion of "quick export" feature request and customer demand
- **Sprint 23 Retrospective Notes** (Jan 12, 2025, Google Doc) - Team feedback on scope creep, QA bottleneck, and morale concerns
- **Jira Sprint 23 Board** - View of incomplete stories and carry-forward candidates
- **Sprint 23 velocity chart** (Jira dashboard) - Historical context showing 3 consecutive sprints <70% velocity
