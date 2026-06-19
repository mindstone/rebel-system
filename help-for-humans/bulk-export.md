---
description: "How Rebel downloads and searches large datasets (emails, messages, contacts) locally for fast analysis."
---

# Bulk Export

When you ask Rebel to analyse a large amount of data — like "review my last 3 months of emails" or "find patterns in my Slack messages" — it can download that data to a local file and search it quickly, rather than reading every item one by one through the conversation.

## How it works

1. You ask Rebel to analyse a large dataset
2. Rebel downloads the data from your connected service (Gmail, Slack, HubSpot, etc.) directly to a file on your computer
3. Rebel searches the file for what you need, and shows you the results
4. The data stays on your computer until you ask Rebel to clean it up

## When Rebel uses this

Rebel will use Bulk Export automatically when:
- You ask to analyse hundreds or thousands of items (emails, messages, contacts)
- The dataset is too large to process efficiently through normal conversation

You don't need to do anything special — just ask your question and Rebel will decide the best approach.

## Where is the data stored?

Exported data is saved as files in your workspace's `.rebel/exports/` folder. These are plain text files (NDJSON format — one record per line) that Rebel can search very quickly.

The data stays on your computer — it's never sent to any external service beyond the original source (e.g., Gmail).

## Privacy

Bulk Export data is subject to the same privacy protections as your other connected services:
- Data is stored locally on your computer
- It's only accessible within your workspace
- You can ask Rebel to delete exported files at any time
- Exported files are not included in your conversation history

## Cleaning up

Ask Rebel to "clean up old exports" or "delete the exported email files" when you no longer need them. Exported files persist until you explicitly remove them.
