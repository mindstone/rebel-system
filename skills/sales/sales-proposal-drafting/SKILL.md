---
name: sales-proposal-drafting
description: "Creates compelling 2-page sales proposals with personalized, high-value use cases and clear ROI for enterprise training and consulting services."
last_updated: 2025-12-26
agent_type: main_agent
use_cases:
  - "Draft proposal for enterprise training program"
  - "Create consulting engagement proposal"
  - "Prepare partnership proposal"
tools_required:
  - "Internal CRM/email search"
  - "Web research"
dependencies:
  - "skills/research/web-researcher"
  - "skills/research/internal-crm-researcher"
---

[GOAL]
Create compelling 2-page proposal with personalized use cases that convert prospects

[CONTEXT]
Enterprise proposals should be maximum 2 pages (3 only if critical), practical tone, specific use cases tailored to the prospect's industry and role.

[PROCESS]
1. Run internal CRM/email research for all customer context (emails, meetings, notes)
2. Run web research for company/industry/stakeholder information
3. Identify 2-3 key roles from transcripts/research
4. Identify high-value use cases for each role using all context
5. Select only the most impactful use cases (max 1 per role)
6. Calculate ROI based on time savings and role value
7. Draft using template below → Save to appropriate location

[TEMPLATE]
**Page 1:** 
- Executive Summary (3-4 lines: challenge/opportunity, solution, value)
- Challenge (2-3 specific bullets from transcript/research)
- Solution (your offering, personalized approach, key differentiators)

**Page 2:**
- Investment & ROI (pricing, annual value calculation, ROI percentage)
- Use Cases (tailored to specific roles identified)
- Results (relevant case studies from similar companies/industries)
- Next Steps (clear 3-4 step process to move forward)
- Contact information

[IMPORTANT]
- Use actual transcript/research data only - no assumptions
- Focus on non-technical use cases for business users
- Personalization from transcripts/CRM > generic web research
- Authentic tone, no flattery, timeframes not specific dates
- Verify: max 2 pages, high-impact use cases only, clear ROI
- Output: Ready-to-send markdown for PDF conversion
- Don't be overly dramatic or optimistic/flattering

[EXAMPLES]
See the `examples/` folder for:
- `strategic-partnership-proposal.md` - Partnership with equity/revenue share
- `enterprise-training-proposal.md` - Board session + team enablement pattern
