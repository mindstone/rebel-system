---
name: meeting-prep
description: "Prepares briefing notes for any meeting by detecting if it's internal or external and routing to the appropriate prep skill."
last_updated: 2025-12-17
agent_type: main_agent
---

[GOAL]
Prepare meeting briefing notes by automatically detecting the meeting type and using the right preparation approach.

[PROCESS]
1. Find the meeting on the calendar (by name, time, or next upcoming)
2. Check the attendee list:
   - If ALL attendees are from {COMPANY_DOMAIN} → Internal meeting
   - If ANY attendees are from outside {COMPANY_DOMAIN} → External meeting
3. Route to the appropriate skill:
   - **Internal**: Use [meeting-internal-prep](meeting-internal-prep/SKILL.md) — focuses on recent emails/Slack context
   - **External**: Use [meeting-external-prep](meeting-external-prep/SKILL.md) — includes web research on people/companies
4. **VERIFY the subagent output**: When the subagent Task completes, check that you received a proper briefing document. A valid briefing:
   - Starts with a bold title like `**[Meeting Title] - [Date, Time]**`
   - Has sections: Attendees, See also, Context, Likely Topics, Prep Notes
   - Contains actual content (not just "I searched for emails and found...")
   
   If the subagent returned metadata/summary instead of the actual briefing, tell the user: "The skill returned incomplete results. Let me show you what I can based on what was gathered."
   
5. **Display the briefing prominently**: Copy the subagent's full briefing into your response. The briefing IS the deliverable — the user is here to see it. Example format:
   
   > Here's your briefing for the meeting:
   >
   > **Team Sync - December 17, 2024, 2:00 PM**
   >
   > **Attendees:** [names]
   > 
   > [rest of briefing...]

[USAGE EXAMPLES]
- "Prepare me for my next meeting"
- "Prep me for my 2pm meeting"
- "Get me ready for the meeting with Sarah"
- "Meeting prep for the Q4 planning session"

**Example briefings** demonstrating best practices:
- [Internal Strategic Meeting](examples/internal-strategic-example.md) - Q1 budget allocation decision with exec team
- [Internal Operational Meeting](examples/internal-operational-example.md) - Sprint planning with blockers and prioritization
- [External Sales Meeting](examples/external-sales-example.md) - Discovery call with enterprise prospect, deep stakeholder research
- [External Strategic Partnership](examples/external-strategic-example.md) - Integration partnership discussion with power dynamics

[IMPORTANT]
- **When asked for relative meetings** (e.g., "my next meeting", "my 2pm meeting"), always check the current time first to ensure you're finding the correct meeting relative to NOW
- Default to the user's next upcoming meeting if not specified
- If the meeting can't be found, ask for clarification
- If calendar access fails, explain and suggest checking Settings
- Always tell the user whether you detected it as internal or external
- **NEVER fabricate briefing content.** If the subagent fails to return a proper briefing, tell the user what went wrong — do not fill in the gaps yourself.

[FALLBACK]
If you can't determine meeting type (e.g., no attendees listed):
1. Ask the user: "Is this an internal team meeting or does it include people outside your company?"
2. Route based on their answer
