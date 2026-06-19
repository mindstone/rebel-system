---
name: meeting-insights-analyzer
description: "Go beyond action items — analyse meeting dynamics, communication patterns, decision quality, and what wasn't said."
last_updated: 2026-02-24
tools_required: []
agent_type: main_agent
---

# Meeting Insights Analyzer

Analyse a meeting transcript for the things most summaries miss: who drove the conversation, how decisions were actually made, what was left unsaid, and where the energy was.

## See also

- [`transcript-analysis`](../transcript-analysis/SKILL.md) — action item extraction and Actions routing
- [`meeting-prep`](../meeting-prep/SKILL.md) — pre-meeting preparation

## [GOAL]

Help the user understand the dynamics of a meeting, not just the content — so they can improve how their meetings work and catch signals they might have missed.

## [PROCESS]

1. **Intake**
   - Ask for the transcript (file path, paste, or reference to a recent meeting)
   - Ask: "What would be most useful — a dynamics overview, decision analysis, or specific person/topic focus?"

2. **Dynamics analysis**
   - **Airtime distribution**: Who spoke most vs least? Approximate percentage breakdown.
   - **Conversation flow**: Who initiated topics? Who redirected? Were there monologues?
   - **Energy map**: Where was the conversation most engaged (rapid back-and-forth, building on ideas) vs flat (long pauses, topic changes, formalities)?
   - **Influence patterns**: Who moved the group toward decisions? Who slowed things down? Were there silent influencers (spoke little but others deferred to them)?

3. **Decision quality**
   - What decisions were made? Were they explicit ("we've decided X") or implicit (topic moved on without clear resolution)?
   - Was dissent expressed or was agreement too quick? (rapid consensus can signal groupthink or disengagement)
   - Were alternatives discussed before deciding?
   - Who owns each decision? Is it clear?

4. **What wasn't said**
   - Topics that were raised but deflected or tabled
   - Questions that were asked but not answered
   - Elephants in the room: tensions, disagreements, or concerns that seem present but unspoken
   - People who were notably quiet on topics you'd expect them to have opinions about

5. **Relationship signals**
   - Alignment and tension between specific participants
   - Who supported whose ideas? Who challenged?
   - Any shifts in tone or engagement when specific people or topics came up

6. **Recommendations**
   - "Based on these dynamics, here's what I'd suggest for your next meeting with this group"
   - Specific: "Consider directly asking [person] for their view on [topic] — they were quiet but it's in their domain"
   - Process suggestions: "The decision on [X] wasn't clearly closed. Worth confirming via email."

## [IMPORTANT]

- Be specific and evidence-based. Quote or reference specific moments, not vibes.
- This is analysis, not judgment. "Sarah spoke 40% of the time" is useful. "Sarah dominated" is editorial.
- The user may be one of the participants. Be tactful but honest about their own patterns if relevant.
- If the transcript is low quality (auto-generated, speaker attribution unclear), note the limitations upfront.
- Don't speculate about intent. Report observable behaviour and let the user draw conclusions.
- This complements transcript-analysis (which focuses on action items). This skill focuses on the meta-layer.
