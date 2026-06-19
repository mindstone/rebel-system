# Use Case Inspiration Catalog

Reference document for the `rebel-os-use-case-finder` skill. Provides a comprehensive catalog of inspiration patterns to help generate creative, personalized, and high-impact use case suggestions.

> **Audience**: AI agent (use-case-finder skill). Not end-user-facing.
> **Last updated**: 2026-02-19

---

## 1. Connector-Driven Inspiration

### Communication (Slack, Gmail, Outlook, Teams, Intercom)

1. **Cross-channel sentiment tracker** — Pull last week's Slack threads + email threads with a specific client/stakeholder, analyze tone shifts over time, and surface early warning signs of dissatisfaction or disengagement before it becomes a problem.
2. **Meeting follow-up composer** — After a meeting transcript is ready, search Gmail/Outlook for the most recent email thread with each attendee, then draft personalized follow-up emails that reference both the meeting discussion and the email history, matching the user's writing style from past emails.
3. **Slack-to-Actions triage** — Scan Slack channels for messages that mention the user or contain action items directed at them, score by urgency/importance, and add the top items to Actions with suggested responses.
4. **Cross-platform response gap detector** — Identify emails and Slack DMs that have gone unanswered for 48+ hours, prioritize by sender importance (using CRM data if available), and draft catch-up responses.
5. **Internal comms drafter from meeting decisions** — After a leadership meeting, pull the transcript + any Slack discussion in related channels, then draft a company-wide update (3P format or newsletter) summarizing decisions made and next steps.

### Productivity (Google Workspace, Notion, Asana, Jira, Linear, monday.com, Todoist, ClickUp)

1. **Weekly project pulse report** — Pull task status from Linear/Jira/Asana + recent Slack updates from project channels + any relevant meeting transcripts, then generate a one-page project health dashboard with blockers, risks, and wins.
2. **Notion knowledge base gap finder** — Search Notion pages for a topic the user asks about, identify where documentation is thin or outdated, and draft updated content by pulling context from recent emails, Slack threads, and meeting transcripts.
3. **Calendar-driven task prioritizer** — Check today's calendar for meetings, cross-reference with task lists in Todoist/Asana/Linear, and produce a prioritized daily plan that accounts for prep time, focus blocks, and deadlines.
4. **Sprint retrospective synthesizer** — Pull completed tickets from Linear/Jira for the last sprint + relevant Slack discussions + any retro meeting transcripts, then produce a structured retrospective document with themes, metrics, and improvement suggestions.
5. **Cross-tool action item reconciler** — Scan meeting transcripts, Slack messages, and email threads from the past week for action items assigned to the user, cross-reference against task management tools, and flag anything that's been committed to but not tracked.

### Analytics (BigQuery, Looker, Metabase, PostHog, ChartMogul)

1. **Metric anomaly briefing** — Query ChartMogul/PostHog for key metrics (MRR, churn, activation), detect week-over-week anomalies, cross-reference with recent product changes in Linear/Jira, and produce an executive briefing explaining likely causes.
2. **Board deck data refresher** — Pull latest metrics from analytics tools, compare against targets set in Notion/Google Sheets, and update narrative slides with current performance and variance explanations.
3. **Customer cohort storyteller** — Query analytics for a specific customer cohort's behavior, combine with CRM notes and support tickets, and produce a narrative explaining adoption patterns with recommendations.
4. **Funnel drop-off investigator** — Pull conversion funnel data from PostHog/Metabase, identify the biggest drop-off point, search Slack and support tickets for related user complaints, and produce an actionable diagnosis.

### Sales (HubSpot, Salesforce, Affinity CRM, Gong)

1. **Pre-call intelligence brief** — Before a sales call, pull the contact's CRM record + all email history + any Gong call recordings/transcripts + LinkedIn profile + company news, then produce a one-page brief with relationship timeline, key concerns raised, and suggested talking points.
2. **Pipeline hygiene audit** — Scan CRM deals that haven't been updated in 14+ days, cross-reference with email/Slack activity for those accounts, and flag deals that are likely stale vs. those with hidden activity.
3. **Quarterly account health scorer** — For each active account, aggregate CRM data + support tickets + email/Slack activity + meeting frequency + contract dates, then produce a ranked health scorecard with red/amber/green ratings.
4. **Win/loss post-mortem generator** — After a deal closes (won or lost), pull the full CRM timeline + all email threads + Gong call transcripts + any Slack discussions, and produce a structured post-mortem identifying what worked, what didn't, and lessons for the team.
5. **Proposal auto-drafter** — Pull CRM data + past proposals + email correspondence + meeting transcripts for a prospect, then draft a personalized proposal using the company's standard template with specific use cases and pricing tailored to the prospect's stated needs.

### Development (GitHub, Sentry, Linear, PostgreSQL)

1. **Release impact communicator** — After a release, pull the changelog from GitHub, cross-reference with Linear tickets and Sentry error rates, then draft a customer-facing release note and an internal Slack update.
2. **Bug triage prioritizer** — Pull recent Sentry errors + related customer support tickets from Intercom/Zendesk + internal Slack bug reports, then produce a prioritized triage list with business impact context.
3. **Technical debt narrator** — Query Linear/Jira for technical debt tickets, cross-reference with Sentry error frequency and GitHub code age, and produce an executive-friendly summary of tech debt impact on reliability and velocity.

### Design (Canva, Miro, Figma, Framer, Webflow)

1. **Design review prep package** — Pull the latest Figma designs for a feature, cross-reference with the product spec in Notion, user research notes, and any Slack discussion threads, and produce a structured design review document with context, open questions, and comparison to spec.
2. **Brand asset auditor** — Scan Figma files and Canva projects for brand guideline inconsistencies, cross-reference with the brand guidelines doc in the workspace, and produce a report of deviations with fix suggestions.
3. **User feedback to design brief** — Aggregate user feedback from Intercom/Zendesk + NPS comments + Slack user-research channels, identify UX pain patterns, and produce a prioritized design brief for the most impactful improvements.

### Payments & Finance (Stripe, PayPal, Xero, Ramp)

1. **Revenue reconciliation narrator** — Pull Stripe/PayPal transaction data + Xero accounting entries, identify discrepancies, and produce a reconciliation report with flagged items for the finance team.
2. **Expense anomaly flagger** — Query Ramp/Xero for team expenses, identify unusual patterns (sudden spikes, new vendors, duplicate charges), and produce a summary with recommended actions.
3. **Subscription churn risk predictor** — Combine Stripe billing data (failed payments, downgrades, usage decline) with CRM activity and support tickets to identify accounts at risk of churning, with suggested retention actions.
4. **Invoice follow-up automator** — Check Stripe/Xero for overdue invoices, pull the latest email thread with each customer, and draft personalized follow-up emails that reference the relationship context.

### Media & Creative (ElevenLabs, Kling AI, OpenAI Image Generation)

1. **Podcast episode producer** — Given a meeting transcript or research document, produce a script, generate voice narration via ElevenLabs, and save the audio file to the workspace.
2. **Social media visual generator** — Draft social posts from a product update, generate accompanying images via OpenAI Image Generation, and prepare the full post package ready for review.
3. **Video explainer from docs** — Convert a product feature doc into a short video script, generate visuals with Kling AI, and produce a shareable video explainer.

---

## 2. Feature-Driven Inspiration

### Voice

- **Walking meeting debrief** — While walking after a meeting, verbally recap key decisions and action items. Rebel transcribes, structures into a formal summary, and distributes to attendees.
- **Commute briefing** — On the way to work, ask Rebel for a voice briefing covering today's calendar, overnight emails that need attention, and updates on tracked projects.
- **Voice-dictated email batch** — Dictate responses to 5-10 emails in a row while on a walk. Rebel drafts each, queues them for review, and sends after approval.
- **Hands-free research capture** — While reading or watching content, verbally note key insights. Rebel transcribes, categorizes by topic, and saves to memory.
- **Global hotkey screen reader** — From any app, hit the hotkey and ask Rebel about what's on screen. Rebel captures a screenshot and provides context-aware assistance.

### Automations

- **Morning executive briefing** — Daily at 8 AM: pull calendar, flag urgent emails, summarize overnight Slack activity, check CRM for deals closing this week, and deliver a 2-minute voice-ready briefing.
- **Weekly stakeholder report** — Every Friday: aggregate project updates from Linear/Jira, pull key metrics from analytics, compile team wins from Slack, and produce a formatted report saved to workspace.
- **Post-meeting transcript processor** — Event-triggered when any transcript arrives: extract action items, update relevant tasks in project tools, draft follow-up emails, and add items to Actions.
- **Content calendar executor** — Weekly: check the content calendar in Notion, research trending topics in the user's industry, draft social posts and blog outlines, and add them to Actions for review.
- **CRM hygiene sweep** — Weekly: scan CRM for stale deals, contacts without recent activity, and missing data fields, then produce a cleanup report with suggested actions.

### Actions

- **Eisenhower triage workflow** — Ask Rebel to scan email + Slack + CRM for today's actionable items, auto-sort them into the Eisenhower matrix, and queue the "Do Now" items for immediate execution.
- **Deferred deep work queue** — Save complex research or analysis tasks to Actions during the day, then batch-execute them during a scheduled focus block.
- **Meeting prep queue** — Automatically add meeting prep tasks to Actions 2 hours before each external meeting, with pre-filled context from CRM and email history.
- **End-of-day capture** — Voice-dictate loose thoughts, ideas, and follow-ups at end of day. Rebel adds them to Actions, categorized and prioritized for tomorrow.

### Meetings & Notetaker

- **Live meeting knowledge assistant** — During a client call, enable Knowledge Q&A so Rebel can answer questions like "What did we agree on pricing last quarter?" by searching past transcripts and notes.
- **Multi-meeting synthesis** — After a series of related meetings (e.g., user interviews), ask Rebel to analyze all transcripts together and produce a synthesis report with patterns, themes, and outliers.
- **Meeting-to-task pipeline** — After each meeting, Rebel automatically extracts action items, creates tasks in Linear/Jira/Asana, assigns owners, and posts a summary to the relevant Slack channel.
- **Quarterly review prep** — Before a quarterly review, Rebel pulls all meeting transcripts with a client/partner from the quarter, summarizes key topics, tracks commitments made and kept, and produces a relationship health report.
- **Prep-to-debrief loop** — Rebel generates meeting prep, you have the meeting, Rebel captures the transcript, then compares what you planned to discuss vs. what was actually discussed, flagging missed topics.

### Memory

- **Evolving stakeholder profiles** — As Rebel processes emails, meetings, and Slack interactions, it builds and maintains profiles for key contacts: their priorities, communication preferences, concerns, and relationship history.
- **Project context accumulator** — Over weeks of working on a project, Rebel builds a rich context file that makes every subsequent conversation about that project more efficient and informed.
- **Preference learning** — Rebel remembers formatting preferences, writing style, preferred tools, timezone, and communication norms, making every interaction increasingly personalized.
- **Institutional knowledge builder** — In team spaces, Rebel accumulates shared context about processes, decisions, and rationale that persists across team member changes.

### Skills

- **Custom weekly digest skill** — Create a skill that produces a personalized weekly digest pulling from exactly the sources and format the user prefers.
- **Client onboarding playbook** — A composable skill that walks through the standard client onboarding process: creates folders, sends welcome emails, schedules kickoff, populates CRM fields.
- **Competitive intelligence monitor** — A skill that runs periodically, searching the web and internal tools for competitor mentions, product updates, and market shifts.
- **Personal OKR tracker** — A skill that checks progress against quarterly objectives by pulling data from project tools, meeting transcripts, and metrics dashboards.

### Semantic File Search

- **"What did we decide about X?"** — Search across all workspace files, transcripts, and notes for decisions related to a specific topic, even when the exact wording varies.
- **Cross-project pattern finder** — Search for a concept across multiple project folders to find how similar problems were solved before.
- **Source finder for claims** — When drafting a document, search the workspace for supporting evidence, data, or prior decisions to cite.

### Big Jobs (Unleashed + Auto-Archive)

- **Parallel research sprint** — Fire off 5 separate research conversations simultaneously (each with auto-archive), covering different aspects of a market analysis. Review all completed work later.
- **Document generation pipeline** — Unleash Rebel on creating a comprehensive report: research → outline → draft → self-review → revision → final, all in one extended session.
- **Bulk content creation** — Create a content batch: 10 social posts, 3 blog outlines, and 5 email templates, all running as parallel auto-archived conversations.
- **Due diligence package** — For an investment or partnership, unleash Rebel to research the company across web, CRM, email history, and public filings, producing a comprehensive due diligence report.

### Spaces

- **Client-specific spaces** — Each major client gets their own space with dedicated memory, skills, and account context, so every conversation about that client has full history.
- **Team knowledge space** — A shared space where team process docs, decision logs, and tribal knowledge accumulate, accessible to all team members through Rebel.
- **Personal learning space** — A space dedicated to professional development, where Rebel tracks reading notes, course progress, and learning goals.

---

## 3. Role-Based Inspiration

### Executive / C-Suite

1. **Morning strategic briefing** — Automated daily briefing combining calendar, overnight emails, Slack @mentions, CRM pipeline changes, key metrics, and market news. Delivered via voice while commuting.
2. **Board meeting prep package** — Pull latest financials from Xero/Stripe, team updates from Linear/Jira, customer metrics from ChartMogul, and strategic context from Notion, then produce a board deck narrative.
3. **1:1 prep with direct reports** — Before each 1:1, pull the report's recent activity (commits, tickets completed, emails sent, Slack activity), review past 1:1 notes, and suggest discussion topics and feedback points.
4. **Strategic decision journaling** — After making a significant decision, voice-dictate the reasoning. Rebel saves it to memory with context, creating a decision log that can be reviewed in future retrospectives.
5. **Investor update auto-drafter** — Monthly: pull key metrics, milestones from project tools, hiring updates, and recent press/wins, then draft an investor update email in the company's standard format.

### Product Manager

1. **Feature research synthesizer** — Before speccing a feature, Rebel searches internal customer feedback (Intercom, Slack, meeting transcripts), competitor offerings (web research), and past related decisions (workspace search), producing a research brief.
2. **PRD drafter from conversations** — After a series of stakeholder conversations about a feature, Rebel pulls all relevant transcripts and Slack threads, then drafts a PRD following the team's template.
3. **Release communication pipeline** — When a release ships, Rebel generates: internal Slack announcement, customer-facing changelog entry, support team FAQ, and social media posts.
4. **User interview synthesis** — After conducting 5-10 user interviews, Rebel analyzes all transcripts together, identifies patterns and outliers, and produces a structured research report with direct quotes.
5. **Sprint planning prep** — Pull backlog from Linear/Jira, recent customer requests from Intercom, strategic priorities from Notion, and tech debt items from Sentry, then produce a prioritized sprint planning brief.

### Researcher / Analyst

1. **Literature review automator** — Given a research question, Rebel searches the web for recent publications, internal docs for prior research, and meeting transcripts for expert opinions, then produces an annotated bibliography with synthesis.
2. **Data storytelling assistant** — Pull data from BigQuery/Metabase, generate visualizations via Mermaid diagrams, and produce a narrative report that explains findings to non-technical stakeholders.
3. **Competitive landscape mapper** — Web research + CRM notes + past meeting discussions about competitors, compiled into a living competitive landscape document updated monthly.
4. **Market sizing calculator** — Combine public data (web research) with internal sales data (CRM) and usage analytics to produce a bottom-up market sizing model.

### Sales & Account Management

1. **Pre-call 60-second brief** — Voice-activated: "Prep me for my next call." Rebel checks calendar, pulls CRM record, scans recent emails, and delivers a voice briefing in under 60 seconds.
2. **Objection response library builder** — After sales calls (via Gong transcripts), Rebel identifies objections raised and how they were handled, building a searchable library of objection patterns and effective responses.
3. **QBR preparation engine** — Before a quarterly business review, Rebel compiles: account health metrics, support ticket trends, feature usage data, meeting summary timeline, and renewal/expansion opportunities.
4. **Lost deal recovery identifier** — Quarterly: scan CRM for lost deals from 3-6 months ago, check if circumstances have changed (new funding, leadership changes via web research), and flag re-engagement opportunities.
5. **Territory planning assistant** — Combine CRM pipeline data, historical win rates by segment, market data from web research, and calendar capacity to produce a territory allocation recommendation.

### Marketing & Content

1. **Content repurposing pipeline** — Take a long-form piece (blog, whitepaper, webinar transcript) and produce: 5 LinkedIn posts, 3 Twitter threads, 1 email newsletter section, and 1 slide deck summary.
2. **Campaign performance narrator** — Pull campaign metrics from analytics, compare against targets in Notion, cross-reference with sales pipeline movement in CRM, and produce a campaign performance story.
3. **SEO content brief generator** — Web research for keyword opportunities + internal content audit (workspace search) + competitor content analysis, producing a detailed content brief with suggested structure and angle.
4. **Event follow-up orchestrator** — After a conference/event, Rebel processes business cards (via photos), enriches contacts with web research, drafts personalized follow-up emails, and adds leads to CRM.
5. **Brand voice enforcer** — Review draft content against brand guidelines doc in workspace, flag inconsistencies, and suggest edits that align with the established voice.

### Customer Success

1. **Renewal risk radar** — Weekly automation: scan support tickets, product usage data, email sentiment, and meeting frequency to produce a ranked list of at-risk accounts with recommended interventions.
2. **Onboarding progress tracker** — For each new customer, track onboarding milestones (tasks completed, meetings held, features activated), flag overdue items, and draft nudge emails.
3. **Customer health narrative** — Before any customer touchpoint, produce a narrative summary of the relationship: satisfaction trends, feature adoption, support history, key contacts, and upcoming milestones.
4. **Escalation brief for leadership** — When an account escalates, Rebel compiles the full history (CRM + support tickets + emails + meeting transcripts) into a 1-page brief for leadership review.
5. **Success story identifier** — Scan customer metrics for standout performers, pull their usage patterns and quotes from transcripts/emails, and draft case study raw material.

### Operations & Admin

1. **Hiring process orchestrator** — Set up interview pipelines: create evaluation scorecards, schedule interviews via calendar, draft interview questions based on the job spec, and track candidates across stages.
2. **Vendor comparison matrix** — Research vendors via web + pull internal discussions from Slack/email + check past vendor evaluations in workspace, then produce a comparison matrix with recommendation.
3. **Process documentation generator** — Observe a workflow across tools (email, Slack, project management, CRM) and produce step-by-step process documentation for team onboarding.
4. **Budget tracking narrator** — Pull expenses from Ramp/Xero, compare against budget in Sheets/Notion, and produce a monthly budget narrative with variance explanations and recommendations.
5. **Team capacity planner** — Combine calendar data (meeting load), project tool data (task assignments), and PTO schedules to produce a team capacity forecast with over-allocation warnings.

---

## 4. Cross-Cutting Compound Workflows

These are the highest-impact use cases — multi-connector, multi-feature workflows that demonstrate Rebel's unique value.

### Strategic Intelligence

1. **Account 360 briefing** — CRM record + email history + Slack mentions + meeting transcripts + support tickets + product usage analytics + web research on the company → comprehensive account intelligence document with relationship timeline, health score, and strategic recommendations.

2. **Weekly strategic pulse** — Automated: Calendar analysis (where time was spent) + email/Slack volume trends + CRM pipeline movement + key metrics from analytics + meeting transcript themes → executive-level weekly pulse with "signals that matter" highlighted.

3. **Competitive move detector** — Automated: Web research for competitor announcements + Gong call transcripts (mentions of competitors) + CRM lost deal reasons + internal Slack competitive intelligence channel → real-time competitive alert with strategic implications.

### Revenue Operations

4. **Quote-to-close orchestrator** — CRM opportunity data + email thread history + meeting transcripts + pricing in Stripe + legal templates in workspace → automated proposal draft, followed by deal tracking through close, with auto-generated win/loss analysis.

5. **Expansion opportunity finder** — Product usage analytics + support ticket themes + CRM contract dates + meeting transcripts → identify accounts where usage patterns suggest expansion potential, with specific product recommendations and talking points.

6. **Forecast accuracy improver** — CRM pipeline + email activity (response times, engagement) + meeting frequency + Gong call sentiment + historical close rates → adjusted forecast with confidence levels and risk flags per deal.

### Knowledge Operations

7. **Organizational knowledge compiler** — Meeting transcripts + Slack discussions + email threads + Notion docs + workspace files, searched semantically for a topic → comprehensive knowledge document with source attribution, suitable for onboarding new team members.

8. **Decision audit trail** — Search all meeting transcripts + email threads + Slack messages for discussions about a specific decision, reconstruct the timeline of how and why the decision was made, with links to source material.

9. **Expert finder** — Search meeting transcripts and Slack for who speaks most authoritatively about a topic, cross-reference with their role and projects in CRM/project tools → identify the go-to person for any subject.

### Relationship Management

10. **Relationship warming automation** — CRM + Calendar: identify important contacts you haven't interacted with in 30+ days, pull their latest LinkedIn activity and company news via web research, draft personalized check-in messages.

11. **Network intelligence for events** — Before a conference, pull the attendee list, search CRM + email + LinkedIn for existing relationships, web-research unfamiliar names, and produce a networking brief with conversation starters and priority connections.

12. **Stakeholder mapping for deals** — CRM contacts + meeting transcripts + email CC patterns + LinkedIn research → produce an org chart with influence mapping, sentiment tracking, and suggested engagement strategy for complex deals.

### Content & Communication

13. **Thought leadership pipeline** — Meeting transcripts (identifying novel insights) + web research (trending topics) + analytics data (unique data points) + workspace search (past writing) → identify 3 thought leadership angles, draft outlines, and schedule content creation in Actions.

14. **All-hands prep machine** — Pull: team wins from Slack + metrics from analytics + customer testimonials from CRM/email + product milestones from Linear + hiring updates → draft all-hands presentation with talking points and Q&A prep.

15. **Crisis communication coordinator** — Sentry alerts + support ticket spike + Slack incident channel + status page → draft customer communication, internal update, support team FAQ, and post-mortem template, all in parallel.

---

## 5. Web Research Findings

Key insights from 2025-2026 research on AI assistant productivity patterns:

### Emerging Patterns

- **Agent-centric workflow redesign** — MIT Harvard Data Science Review (2026) reports 2-10x productivity gains when workflows are redesigned around AI agents rather than just adding AI to existing human-centric processes. Implications: suggest workflows that reimagine the process, not just automate existing steps.
- **Compound automation beats single-task** — Multiple sources confirm that cross-tool, multi-step automations deliver 5-10x more value than single-tool automations. The most impactful workflows combine 3+ connectors.
- **"If you could run AI in your sleep"** — Reid Robinson (Zapier PM) suggests the mental model: "What would you automate if it could run while you're asleep?" This unlocks creative thinking about overnight processing, morning briefings, and fire-and-forget delegation.
- **Decision meeting focus** — AI meeting tools are shifting from "capture everything" to "ensure decision meetings are well-informed." Pre-meeting intelligence + post-meeting action tracking is the highest-ROI meeting workflow.
- **Self-improving knowledge bases** — Customer feedback → knowledge base updates → better support responses → better feedback. This feedback loop pattern applies to many domains.

### High-Value Use Case Categories (from industry research)

1. **Meeting intelligence lifecycle** — Prep → capture → analyze → act → track. Each step can be automated, but the compound workflow connecting all steps is where the real value lives.
2. **CRM as truth source, not data entry** — AI agents that listen to calls, read emails, and watch calendar, then auto-update CRM, eliminate the #1 CRM adoption blocker (manual data entry).
3. **Async decision-making support** — Gathering context from multiple tools, synthesizing it, and presenting it for decision — reducing the need for "status update" meetings.
4. **Personal CRM / relationship intelligence** — Beyond company CRM: tracking personal network relationships, conversation history, and connection opportunities.
5. **Content repurposing at scale** — One piece of deep content → many derivative pieces across channels. AI makes the ratio 1:10+ practical.

### Notable Statistics

- Professionals spend an average of 4.1 hours/day on email management (Jenova AI, 2026)
- AI agents can reduce meeting prep time by 80%+ when integrating CRM + email + transcript data (MaxIQ, 2026)
- 88% of executives plan to increase AI budgets (Journey Platform, 2026)
- AI-driven CRM copilots improve forecast accuracy by 15-25% when combining call transcripts + email activity + deal stage data (G2, 2026)
- Up to 40% of routine knowledge work can be automated by AI agents by end of 2026 (HumAI, 2026)

---

## 6. Existing Skills Catalog

Summary of skills already available in the Rebel system, grouped by category. The use-case finder should reference these when generating suggestions.

### Meetings & Transcripts
- **meeting-prep** — Auto-detects internal vs. external meetings, routes to appropriate prep skill
- **meeting-internal-prep** — Pulls email/Slack context for internal meetings
- **meeting-external-prep** — Adds web research on attendees/companies for external meetings
- **meeting-weekly-brief** — Weekly meeting briefing aggregation
- **meeting-performance-review** — Prep for performance review meetings
- **meeting-follow-up-drafting** — Drafts follow-up communications after meetings
- **transcript-analysis** — Processes transcripts from any source (Notetaker, Plaud, external), extracts action items and summaries
- **process-plaud-recording** — Handles Plaud voice recorder transcription
- **calendar-check-availability** — Checks calendar availability

### Communication
- **gmail-mcp-work-with** — Gmail integration patterns
- **slack-mcp-work-with** — Slack integration patterns
- **linear-mcp-work-with** — Linear integration patterns
- **write-intro-email** — Drafts introduction emails
- **internal-comms** — Internal communications (3P updates, newsletters, FAQs, status reports)

### Research
- **web-researcher** — Multi-query web research with synthesis and attribution
- **internal-crm-researcher** — Internal research across meetings, transcripts, and emails
- **notion-read-page** — Reads and processes Notion pages
- **hubspot-tool-guide** — HubSpot CRM interaction patterns

### Thinking & Strategy
- **sounding-board-mode** — Interactive brainstorming and advisory mode
- **devils-advocate** — Challenges assumptions and proposes alternatives
- **discuss-plan-implement-complex-task** — Structured approach for complex initiatives
- **set-company-values** — Facilitated company values workshop
- **set-personal-goals** — Personal goal setting guidance
- **prioritise-by-ease-value** — Ease/value prioritization framework
- **interview-me-to-look-for-ai-automations** — Structured interview for automation discovery
- **coaching-conversation** — General coaching conversation format
- **post-onboarding-executive-coach** — Executive coaching after initial onboarding

### Coaching (Real-time)
- **pitch-coach** — Real-time coaching during investor pitches and board presentations
- **sales-coach** — Real-time coaching during sales calls (objection handling, qualification, closing)

### Sales & Proposals
- **sales-proposal-drafting** — Creates 2-page personalized proposals with CRM + web research

### Operations
- **rebel-os-use-case-finder** — Personalized use case discovery (this skill's companion)
- **wins-and-learnings-uncover** — Analyzes recent communications to surface wins and learnings
- **session-coaching-reflection** — Post-session analysis for what Rebel could have done better
- **hiring-process-setup** — Complete hiring infrastructure setup (folders, templates, scorecards)
- **create-automation** / **edit-automation** — Automation CRUD operations
- **chatgpt-migration** — Import ChatGPT history, memories, and custom GPTs
- **claude-migration** — Import Claude conversation history
- **diagnose-conversation** — Debug conversation issues

### Data & Analysis
- **linkedin-export-parser** — Parse LinkedIn data exports for network analysis

### Documentation
- **write-skill** — Create new Rebel skills
- **write-tutorial-explainer** — Tutorial and explainer documents
- **writing-scripts** — Utility script creation
- **generate-mermaid-diagram** — Visual diagram generation
- **edit-lightly-human-conversation-transcript** — Light editing of conversation transcripts
- **documentation-update** — General doc maintenance

### Memory & Knowledge
- **memory-update** — Save facts to memory during conversations
- **source-capture** — Capture citable sources with provenance metadata
- **memory-cleanup** — Memory hygiene maintenance
- **space-memory-populate** — Interactive memory setup for new spaces

### System & Utilities
- **onboarding-discovery** — Combined onboarding: memory + use cases + Actions seeding
- **skill-updater** / **improve-skill** / **skill-repair** — Skill maintenance
- **build-custom-mcp-server** — Create custom integrations
- **mcp-add-update-remove-connector** — Connector management
- **rebel-doctor** — System diagnostics
- **file-naming-and-organisation** — Workspace organization
- **pdf-read-extract** — PDF content extraction
- **screenshot-capture** — Screenshot utility
- **export-llm-chat** — Export conversation transcripts
- **calendar-create-event-mcp** — Calendar event creation
- **time-saved-estimation** — ROI estimation for automation

### Presentations
- **generate-slidev-html-presentation-slides** — HTML presentation generation
- **keynote-parser** — Parse Keynote files

### Integrations
- **limitless-transcripts** — Import Limitless Pendant recordings

### Anthropic Official Skills
- **artifacts-builder** — Interactive artifact creation
- **canvas-design** — Visual design in canvas
- **brand-guidelines** — Brand guideline creation and enforcement
- **document-skills** (Excel, PowerPoint, PDF, Word) — Document creation for each format
- **slack-gif-creator** — Animated GIF creation for Slack

### Safety
- **safety-guard** — Safety evaluation for actions
- **memory-sensitivity** — Sensitivity assessment for memory writes

### Admin
- **read-mac-stickies** — Read, search, and filter macOS Stickies notes
- **accountability-buddy-calendar-commitments** — Turn goals into calendar pre-commitments

### Investor Relations
- **data-room** — Investor data room access and resources

---

## 7. Use Case Quality Checklist

When generating use cases, verify against these criteria:

### What makes a HIGH-IMPACT use case:
- ✅ Combines 2+ connectors or features
- ✅ Specific to the user's actual role, projects, and contacts
- ✅ Uses real names (clients, projects, colleagues) over generics
- ✅ Addresses a recurring pain point (not a one-off)
- ✅ Produces a tangible deliverable (document, email, report, action item)
- ✅ Leverages Rebel's unique capabilities (voice, memory, automations, multi-tool)
- ✅ The user couldn't easily do this with ChatGPT alone
- ✅ Time savings are significant (30+ minutes per occurrence)

### What makes a SHALLOW use case:
- ❌ Generic task description ("write emails," "summarize documents")
- ❌ Single-tool, single-step workflow
- ❌ No personalization to the user's context
- ❌ Could be done equally well in ChatGPT
- ❌ One-time task with no recurring value
- ❌ Assumes access to tools the user doesn't have
- ❌ Vague outcome ("help with strategy," "improve productivity")
