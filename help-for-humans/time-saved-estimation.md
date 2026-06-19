---
description: "How Rebel estimates the time it saves you, including impact ratings, weekly tracking, and what the numbers mean"
---

# Time Saved

After each conversation, Rebel quietly estimates how long the same work would have taken you to do manually. Not how long *Rebel* took -- how long *you* would have spent gathering context, drafting, researching, and iterating.

These estimates are deliberately conservative. Rebel would rather undersell than overclaim.


## Where You'll See It

- **After conversations** -- A small time estimate appears below Rebel's final response (e.g., "~15 min saved")
- **Header indicator** -- Your weekly total shows in the top bar, with a trend arrow (up = ahead of your usual pace, sideways = on track)
- **Time Saved dashboard** -- Click the header indicator to open the full breakdown: this week, last week, and all-time totals. Click any day to filter your conversation list to that day's work.


## How It Works

When a conversation finishes, Rebel sends a summary of what was asked and what was delivered to a separate AI model. That model acts as a skeptical productivity consultant, estimating manual effort based on:

- What you asked for and what was actually delivered
- The type of work (research, writing, analysis, coordination, etc.)
- Whether the output was complete and useful
- Realistic human pace, including the time you'd spend gathering context, getting interrupted, and iterating

The estimate represents the **value of the final output**, not how busy Rebel was. Ten tool calls to find one fact still counts as "finding one fact."


## Impact Ratings

Not all saved time is equal. A quick email to a key client matters more than reorganizing your bookmarks. Rebel rates each task's organizational impact:

| Rating | What It Means | Visual Treatment |
|--------|--------------|------------------|
| **Critical** | Strategic, high-stakes, or unlocks others' work | Highlighted in orange with ⚡ |
| **High** | Important deliverable with real consequence | Highlighted in orange with ⚡ |
| **Medium** | Standard work task (the baseline -- most tasks land here) | Normal display |
| **Low** | Nice-to-have, no particular deadline | Slightly muted |
| **Trivial** | Work with no real benefit | Not shown |

Impact is independent of time. A two-minute task can be critical (e.g., a time-sensitive reply to a key stakeholder). A two-hour task can be trivial (e.g., reorganizing notes nobody reads).

These ratings also adjust the time-saved numbers: high-impact work gets a modest boost, low-impact work gets scaled down. The idea is that your weekly total reflects not just hours saved, but hours saved *on work that mattered*.


## What Gets Estimated (and What Doesn't)

**Estimated:**
- Conversations where Rebel produced a useful deliverable
- Turns lasting more than 30 seconds

**Not estimated:**
- Very short interactions (under 30 seconds)
- Conversations about configuring Rebel itself (setting up integrations, adjusting preferences)
- Failed or incomplete attempts
- Estimates under 5 minutes are tracked but not displayed -- "you saved 2 minutes" isn't worth mentioning

**AI-only overhead** is excluded: if you spent time teaching Rebel your preferences or troubleshooting a connection, that's time you wouldn't have spent without AI, so it doesn't count as "saved."


## Milestones

As your cumulative time saved grows, Rebel will occasionally note when you cross a milestone (your first hour, your first day, etc.). These appear once and can be dismissed.


## Turning It Off

Go to **Settings → Account & Preferences → Appearance** and uncheck **"Estimate time saved after conversations."**

When disabled, no estimation calls are made after conversations and the header indicator hides. Your existing historical data is preserved -- turning it back on picks up right where you left off.


## Good to Know

- Estimates are conservative by design. The model is instructed to return zero when uncertain rather than guess high.
- Impact ratings are based on the general nature of the task (e.g., "client-facing email" vs. "casual research"), not on your personal goals or priorities. Rebel doesn't currently factor in your Spark profile or Space context when rating impact.
- There's no way to correct individual estimates. If one seems off, it won't meaningfully affect your totals -- the averages smooth things out.
- The dashboard shows reasoning for each estimate, so you can see *why* Rebel thought something saved time.


## See Also

- [Settings and Configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) -- Where to toggle time-saved tracking
- [The Spark](library://rebel-system/help-for-humans/the-spark.md) -- Your personal profile and goals (not yet connected to impact ratings)
- [Rebel Interface](library://rebel-system/help-for-humans/Rebel-interface.md) -- Overview of the header, sidebar, and other UI elements
