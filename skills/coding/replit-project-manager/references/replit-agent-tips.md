---
description: "Best practices for getting great results from Replit Agent. Distilled from research and testing."
---

# Getting the Best from Replit Agent

## The Golden Rule

**You are the product manager; Replit Agent is your engineering team.** Give clear requirements and specific goals — don't try to dictate how it writes code.

## Top Tips

1. **Start small.** Get a basic working version before adding features. A working MVP you can iterate on beats an ambitious broken mess.

2. **One thing at a time.** Ask for one feature per prompt. "Build login AND add a database AND make it dark mode" leads to half-baked results. Send them as separate tasks.

3. **Be specific.** "Add a contact form with Name, Email (validated), and Message fields at `/contact`" beats "Add a way for users to reach out."

4. **Say what you want, not what you don't want.** "Make the profile page clean with the username prominent and an Edit button" beats "Don't make it confusing."

5. **Use checkpoints.** When the app is working well, create a checkpoint in Replit before asking for the next change. If something breaks, you can roll back instantly.

6. **Show, don't tell.** Upload screenshots, wireframes, or mockups for UI work. Replit Agent understands images better than lengthy descriptions.

7. **Give exact error messages.** When something breaks, copy-paste the error — don't paraphrase. Include what you clicked and what you expected to happen.

8. **Fresh chat for fresh starts.** If Replit Agent gets confused or loops, start a new chat. This clears its memory of failed attempts.

9. **Keep `replit.md` concise.** This is Replit Agent's "system prompt" for your project. Include project context and coding preferences, but keep it under 10KB.

10. **Separate test data from real data.** If your app uses a database, test with fake data before letting real users in.

## What Replit Agent Does Well

- New apps from scratch (websites, dashboards, APIs)
- Standard web stacks (React, Next.js, Node.js, Python/Flask)
- Deployment (one-click via Replit Deployments)
- Database setup and basic CRUD operations

## Where It Needs More Guidance

- Large codebase refactors (break into smaller steps)
- Complex database migrations (provide explicit schemas)
- Multi-service architectures (build one service at a time)
