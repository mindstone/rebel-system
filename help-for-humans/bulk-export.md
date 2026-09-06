---
description: "How Rebel downloads, stores, and searches large datasets (emails, messages, contacts) for fast analysis."
---

# Bulk Export

When you ask Rebel to analyse a large amount of data — like "review my last 3 months of emails" or "find patterns in my Slack messages" — it can download that data to a workspace file and search it quickly, rather than reading every item one by one through the conversation.

## How it works

1. You ask Rebel to analyse a large dataset
2. Rebel downloads the data from your connected service (Gmail, Slack, HubSpot, etc.) to a file in your workspace
3. Rebel searches the file for what you need, and shows you the results
4. The data follows your workspace's Cloud Continuity custody until you ask Rebel to clean it up

## When Rebel uses this

Rebel will use Bulk Export automatically when:
- You ask to analyse hundreds or thousands of items (emails, messages, contacts)
- The dataset is too large to process efficiently through normal conversation

You don't need to do anything special — just ask your question and Rebel will decide the best approach.

## Where is the data stored?

Exported data is saved as files in your workspace's `.rebel/exports/` folder. These are plain text files (NDJSON format — one record per line) that Rebel can search very quickly.

With Cloud Continuity off, the data stays on this device. With your own provider, it is copied to a machine 100% under your control and Mindstone does not get it. With Mindstone Cloud, Mindstone holds a copy and never looks at it. For a manual connection, Rebel cannot verify who operates the configured machine. The data may also be sent to the AI provider handling your request.

## Privacy

Bulk Export data is subject to the same privacy protections as your other connected services:
- Data is stored on your device and follows the Cloud Continuity custody cases above
- It's only accessible within your workspace
- You can ask Rebel to delete exported files at any time
- Exported files are not included in your conversation history

## Cleaning up

Ask Rebel to "clean up old exports" or "delete the exported email files" when you no longer need them. Exported files persist until you explicitly remove them.
