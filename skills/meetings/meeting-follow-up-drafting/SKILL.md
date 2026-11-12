---
name: meeting-follow-up-drafting
description: "Writes one concise follow-up email after a meeting from the transcript, invite and memory; safe to run automatically."
last_updated: 2026-11-12
agent_type: main_agent
---

[GOAL]
Write the one follow-up email the user owes after a meeting, ready to send after a quick read.

[PROCESS]
1. Gather context: the meeting transcript, the invite and its attendees, and memory about the people, company or project involved.
2. Write one concise email: what was agreed, who owns what and by when, the items the user promised (attached or linked when they are at hand), and the next step.
3. Re-read it once against the transcript: every fact, name, date and number must come from what you gathered.

[IMPORTANT]
- Plain text, down-to-earth tone: no flattery ("impressive", "perfect"), not salesy ("this is what I would suggest", not "here's why this fits perfectly").
- Keep the user's sign-off from their skill; don't invent a signature block.
- Write in the language of the meeting.
- Addresses come only from the invite, attendee data or transcript; never invent one.
- Mark anything you could not confirm with `[VERIFY]` instead of guessing.
- Don't stop to ask questions: the user reviews and adjusts the draft before it is sent.
