---
description: "Connect ElevenLabs Agents to manage voice agents: review conversations and recordings, author and test agents, manage phone numbers, and run outbound or batch calls"
last_updated: "2026-08-13"
---

# ElevenLabs Agents

Work with your ElevenLabs voice agents (Conversational AI) — the agents that answer or place phone calls for you. Browse their conversations, read transcripts, listen to recordings, tweak their setup, manage phone-number assignments, and run outbound or scheduled batch calls, all from Rebel.


## What You Can Do

- **Review conversations**: List recent conversations, read full transcripts and analysis, and download call recordings
- **Author and test agents**: Create, update, or duplicate agents — and simulate a conversation to test changes before they go near a real phone line
- **Manage phone numbers**: See which number is assigned to which agent, and reassign them
- **Place calls**: Make a single outbound call, or submit a batch call to many recipients — scheduled batches keep running on ElevenLabs' side even if you close Rebel
- **Manage the knowledge base**: Add, inspect, or remove the documents your agents answer from
- **Give feedback**: Submit ratings on past conversations to improve agent quality


## Setup

1. Open **Settings → Connectors**
2. Find **ElevenLabs Agents** and click **Set up**
3. Paste your ElevenLabs API key (starts with `sk_`)
4. Click **Connect**

This is the same key used by the [ElevenLabs audio connector](rebel://library/rebel-system%2Fhelp-for-humans%2Felevenlabs-text-to-speech.md) — if you've already set that up, Rebel reuses the key and there's nothing to paste.

> **Permissions note**: Your API key needs Conversational AI permissions enabled in your ElevenLabs account. If agents or conversations don't show up, check the key's settings on your [ElevenLabs API Keys page](https://elevenlabs.io/app/settings/api-keys).


## Tips

- **Start read-only**: "List my ElevenLabs voice agents" or "Show recent conversations for the support agent" — a safe way to see what's there
- **Review a call**: "Get the transcript of this morning's call with the sales agent" or "Download the recording for that conversation"
- **Test before you ship**: "Simulate a conversation with the updated agent" — try prompt changes without touching live telephony
- **Phone logistics**: "Which phone number is assigned to the receptionist agent?" or "Assign the new number to the support agent"
- **Batch campaigns**: "Submit a batch call to these 20 numbers for tomorrow at 9am" — ElevenLabs runs the schedule, Rebel doesn't need to stay open


## See Also

- [ElevenLabs connector (audio)](rebel://library/rebel-system%2Fhelp-for-humans%2Felevenlabs-text-to-speech.md) — text-to-speech, music, sound effects, and voices
- [Voice and audio](rebel://library/rebel-system%2Fhelp-for-humans%2Fvoice-and-audio.md) — Rebel's built-in voice features
- [MCP tools and other knowledge sources](rebel://library/rebel-system%2Fhelp-for-humans%2Fmcp-connectors-tools-and-integrations.md) — overview of all connectors
