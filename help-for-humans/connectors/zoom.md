---
description: "Connect Zoom for meeting scheduling; use Recall.ai or Fathom for transcripts"
---

# Zoom

Schedule and manage Zoom meetings — list upcoming calls, create new meetings, get details, or delete them.


## What You Can Do

- **List meetings** — see upcoming and past Zoom meetings
- **Create a meeting** — schedule a new Zoom call with a topic, time, and duration
- **Get meeting details** — look up specifics for a meeting by ID
- **Delete a meeting** — cancel a scheduled meeting


## Setup

Zoom uses Server-to-Server OAuth, which means an admin creates credentials once for your organization:

1. Open **Settings → Connectors**
2. Find **Zoom** and click **Set up with Rebel**
3. Enter your **Account ID**, **Client ID**, and **Client Secret**

To get these credentials, a Zoom admin needs to:

1. Go to the [Zoom Marketplace](https://marketplace.zoom.us/) and sign in
2. Click **Develop → Build App** and choose **Server-to-Server OAuth**
3. Name the app (e.g., `Rebel AI`) and copy the credentials
4. Under **Scopes**, add all Meeting permissions
5. Click **Activate**


## What About Meeting Transcripts?

The Zoom connector handles **meeting scheduling only** — it doesn't access recordings or transcripts.

For meeting transcripts, Rebel has better options built in:

- **Recall.ai Meeting Bot** — Rebel can join your Zoom calls automatically, record them, and provide full transcripts. Just share your Zoom link and Rebel handles the rest. This works with Zoom, Google Meet, and Microsoft Teams.
- **Fathom** — If you already use Fathom to record meetings, connect it in Settings → Connectors to pull in transcripts, summaries, and action items.
- **Fireflies** — Same idea — if your team uses Fireflies, connect it to access your meeting notes.
- **Otter.ai** — Connect Otter to bring in transcripts from your recorded meetings.

**Bottom line:** Use the Zoom connector to schedule and manage meetings. Use Recall.ai, Fathom, Fireflies, or Otter for transcripts.


## Troubleshooting

- **"Authentication failed"** — Double-check your Account ID, Client ID, and Client Secret. Make sure the app is activated in the Zoom Marketplace.
- **"Forbidden" errors** — Your Zoom app may need more scopes. Go to the Zoom Marketplace, open your app, and ensure all Meeting scopes are added.
- **No meetings showing up** — Server-to-Server OAuth works at the account level. The app needs permission to access the target user's meetings.


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
