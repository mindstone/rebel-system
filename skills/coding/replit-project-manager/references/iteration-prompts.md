---
description: "Copy-paste prompts for Replit Agent. Users paste these into the Replit chat to trigger work on task briefs written by Rebel."
---

# Iteration Prompts for Replit Agent

After Rebel writes a task brief to `./rebel/current-task.md`, the user needs to tell Replit Agent to read and execute it. Below are ready-to-paste prompts for different situations.

---

## Standard — Just Build It

Best for straightforward tasks where you trust Replit Agent to get it right.

```
Read the file at /rebel/current-task.md and implement everything described there. When you're done, write a summary of what you changed to /rebel/output/summary.md
```

---

## With Review — Check Before Building

Best for larger changes where you want to see the plan first.

```
Read the file at /rebel/current-task.md. Before implementing anything, summarise what you plan to change and wait for my confirmation.
```

---

## First Task — New Project Setup

Use after creating a new project and pasting the `replit.md`.

```
Read the replit.md file for project context, then read /rebel/current-task.md for the initial task. Build what's described there. When you're done, write a summary to /rebel/output/summary.md
```

---

## Bug Fix

Use when the user reported a problem and Rebel wrote a fix brief.

```
Read /rebel/current-task.md — it describes a bug to fix. Reproduce the issue first, then fix it. Write what you found and what you changed to /rebel/output/summary.md
```

---

## Tips for Users

- **Paste the prompt exactly as shown** — these are tested to work well with Replit Agent
- **Wait for Replit Agent to finish** before asking Rebel to pull results
- **If Replit Agent gets confused**, start a fresh chat in Replit and paste the prompt again
- **You can add extra context** after the prompt — e.g., "Also, the header colour should be blue not green"
