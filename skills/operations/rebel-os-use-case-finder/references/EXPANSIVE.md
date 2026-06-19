# Expansive Use-Case Discovery

Reference for the `rebel-os-use-case-finder` skill. When generating use cases, go beyond the user's most recent emails/Slack — systematically gather context about who the user is and draw inspiration from the full breadth of what Rebel can do.

> **See also:** [USE_CASE_INSPIRATION_CATALOG.md](USE_CASE_INSPIRATION_CATALOG.md) — Comprehensive catalog of connector-driven, feature-driven, role-based, and compound workflow inspiration patterns.

---

## Part 1: Gathering Context About the User

Before generating use cases, build the richest possible picture of the user. Draw from these signal sources in order of reliability.

### 1.1 Memory-Based Context (highest signal, already curated)

**Always-loaded profile (Chief-of-Staff space README):**
- Name, role, seniority, function
- Personal goals cascade (vision → 10-year → 5-year → 1-year → quarter) and the "why" behind each
- Key contacts, working style, communication preferences
- Current priorities and active projects

**Space topology:**
- Which spaces exist and their types (personal / company / team / project / router)
- Space descriptions and purposes (from `rebel_space_description` in frontmatter)
- Related spaces and ownership — reveals org complexity, multi-company work, role adjacency

**Company/team context (company space README):**
- Company values (and when last reviewed)
- Team structure, processes, and norms
- Shared skills and team workflows

**On-demand memory topics:**
- `<Space>/memory/topics/` — active workstreams, project notes, people dossiers, process docs
- Reveals timelines, stakeholders, recurring patterns, and opportunities for automation

**Memory sources:**
- `<Space>/memory/sources/` — meeting transcripts, captured web content, imported docs
- Reveals what domains have rich ground truth for evidence-based use cases

**Pending memory writes:**
- `Chief-of-Staff/memory/pending/` — recently learned, not yet approved
- Signals what's top-of-mind and newly important

### 1.2 Activity-Based Context (from connected tools)

**Connector availability:**
- Check **Settings → Connectors** (or ask) for which services are connected
- Only suggest use cases for tools the user actually has connected
- Note multi-account setups and space-account associations

**Email patterns (Gmail / Outlook):**
- Top correspondents and relationship clusters (customers, internal, vendors)
- Recurring subjects and thread frequency — reveals active workstreams
- Drafting style from sent mail — enables personalized tone matching
- Unanswered threads — reveals overwhelm points

**Calendar density:**
- External vs internal meeting ratio — signals whether meeting prep is high-impact
- Meeting cadence and time blocks — reveals when deep work is possible
- Upcoming meetings — immediate prep opportunities

**Messaging patterns (Slack / Teams):**
- Most active channels and DMs — where work actually happens
- Common requests the user receives — automation candidates
- Unresolved threads — capture opportunities

**CRM data (HubSpot / Salesforce / Affinity):**
- Active deals/accounts and their stages
- Pipeline health and stale deals
- Customer relationship timeline

**Project boards (Linear / Jira / Asana):**
- Active projects and their status
- Task backlog and overdue items
- Sprint/cycle patterns

### 1.3 Workspace-Based Context

**Skills the user has created or uses frequently:**
- Custom skills in `<Space>/skills/` — reveals what workflows they've already formalized
- Avoid suggesting use cases that duplicate existing skills
- Look for gaps — recurring tasks that don't have skills yet

**Documents they work with:**
- File types, naming patterns, folder structure
- Reveals the kind of work product they create (proposals, reports, decks, code)

**Workspace structure:**
- Number and types of spaces — signals complexity of their work life
- Company vs personal vs project organization

### 1.4 Behavioral Context (how they use Rebel)

**Past conversations:**
- What they ask Rebel for most often
- Which skills they invoke
- Where conversations get long (= complex recurring needs)

**Action items:**
- What they save for later — reveals deferred priorities
- Execution patterns — what they act on vs archive

**Automations:**
- Existing automations — what they've already scheduled
- Gaps — recurring work not yet automated

**Usage patterns:**
- Voice vs typing preference — informs whether to suggest voice-first workflows
- Session mode preference (Quick Question vs On the Case) — signals tool-use comfort
- Big Jobs usage — appetite for autonomous delegation

**Safety settings:**
- Memory safety level per space — whether to propose automation-heavy workflows
- Tool safety preferences — "run without asking" vs "always ask"

### 1.5 Stated Context (ask the user directly when signals are sparse)

When memory and connectors don't provide enough, ask about:
- **Role and responsibilities** — "What do you own?"
- **Top 3 outcomes this quarter** — strategic alignment
- **Biggest recurring friction** — the pain-to-automation match
- **Which tools are source of truth** — where to focus subagent research
- **Preferred working style** — daily cadence vs weekly reviews vs event-triggered
- **What "great" looks like** — time saved, fewer context switches, better output, fewer dropped balls

---

## Part 2: Gathering Inspiration

Don't generate use cases only from what you know about the user — actively explore what's possible.

### 2.1 Connector-Driven Inspiration

For each connector the user has enabled, consider what cross-connector workflows it unlocks. The highest-impact use cases combine 3+ connectors.

**Key connector categories and creative patterns:**

| Category | Connectors | Creative Pattern |
|----------|-----------|-----------------|
| Communication | Slack, Gmail, Outlook, Teams, Intercom | Cross-channel sentiment tracking, response gap detection, comms drafting from meetings |
| Productivity | Google Workspace, Notion, Asana, Jira, Linear, Todoist | Cross-tool action item reconciliation, knowledge base gap finding, sprint synthesis |
| Analytics | BigQuery, Looker, Metabase, PostHog, ChartMogul | Metric anomaly briefings, funnel diagnostics, board deck data refresh |
| Sales | HubSpot, Salesforce, Affinity, Gong | Pre-call intelligence, pipeline hygiene, win/loss post-mortems, account health scoring |
| Development | GitHub, Sentry, Linear, PostgreSQL | Release impact communication, bug triage with business context, tech debt narration |
| Design | Canva, Miro, Figma, Framer, Webflow | Design review prep, user feedback to design brief, brand consistency auditing |
| Payments | Stripe, PayPal, Xero, Ramp | Revenue reconciliation, expense anomaly detection, subscription churn prediction |
| Media | ElevenLabs, Kling AI, OpenAI Image Gen | Content repurposing with generated media, podcast production from transcripts |

> **Full catalog:** [USE_CASE_INSPIRATION_CATALOG.md § 1. Connector-Driven Inspiration](USE_CASE_INSPIRATION_CATALOG.md)

### 2.2 Feature-Driven Inspiration

Each Rebel feature unlocks unique use-case categories:

- **Voice** — commute briefings, walking debriefs, hands-free email batching, dictation capture
- **Automations** — morning briefings, weekly reports, post-meeting processors, CRM hygiene sweeps, content calendar execution
- **Actions** — Eisenhower triage, deferred deep work queues, meeting prep queuing, end-of-day capture
- **Meetings** — live knowledge Q&A, multi-meeting synthesis, meeting-to-task pipeline, prep-to-debrief loops
- **Memory** — evolving stakeholder profiles, project context accumulation, preference learning, institutional knowledge building
- **Skills** — custom weekly digests, client onboarding playbooks, competitive intelligence monitors, OKR trackers
- **Semantic Search** — decision archaeology, cross-project pattern finding, source attribution for claims
- **Big Jobs** — parallel research sprints, document generation pipelines, bulk content creation, due diligence packages
- **Spaces** — client-specific spaces, team knowledge spaces, personal learning spaces

> **Full catalog:** [USE_CASE_INSPIRATION_CATALOG.md § 2. Feature-Driven Inspiration](USE_CASE_INSPIRATION_CATALOG.md)

### 2.3 Role-Based Patterns

Match the user's role to the highest-impact patterns for that persona:

- **Executive / C-Suite** — strategic briefings, board prep, 1:1 prep, decision journaling, investor updates
- **Product Manager** — feature research synthesis, PRD drafting from conversations, release comms, user interview synthesis
- **Researcher / Analyst** — literature reviews, data storytelling, competitive landscapes, market sizing
- **Sales** — pre-call briefs, objection libraries, QBR prep, lost deal recovery, territory planning
- **Marketing** — content repurposing, campaign performance narratives, SEO briefs, event follow-up orchestration
- **Customer Success** — renewal risk radar, onboarding tracking, customer health narratives, escalation briefs
- **Operations / Admin** — hiring orchestration, vendor comparison, process documentation, budget tracking

> **Full catalog:** [USE_CASE_INSPIRATION_CATALOG.md § 3. Role-Based Inspiration](USE_CASE_INSPIRATION_CATALOG.md)

### 2.4 Cross-Cutting Compound Workflows

The most impactful use cases span multiple connectors and features:

- **Account 360 briefing** — CRM + email + Slack + transcripts + analytics + web → comprehensive account intelligence
- **Weekly strategic pulse** — Calendar + email + Slack + CRM + analytics + transcripts → executive weekly pulse
- **Competitive move detector** — Web research + Gong transcripts + CRM lost deals + Slack → competitive alerts
- **Quote-to-close orchestrator** — CRM + email + transcripts + Stripe + templates → automated sales workflow
- **Organizational knowledge compiler** — Transcripts + Slack + email + Notion + files → searchable knowledge base
- **Relationship warming automation** — CRM + Calendar + LinkedIn + web → personalized re-engagement
- **Crisis communication coordinator** — Sentry + support tickets + Slack + status page → parallel crisis comms

> **Full catalog:** [USE_CASE_INSPIRATION_CATALOG.md § 4. Cross-Cutting Compound Workflows](USE_CASE_INSPIRATION_CATALOG.md)

### 2.5 Web Research

When generating use cases, optionally search the web for fresh inspiration:
- "AI assistant use cases for [user's specific role] 2025 2026"
- "AI agent productivity workflows [user's industry]"
- "compound AI automation [user's function]"

Key industry insights:
- Workflows redesigned around AI agents yield 2-10x more productivity than adding AI to existing processes
- Cross-tool, multi-step automations deliver 5-10x more value than single-tool automations
- The most impactful meeting workflows connect the full lifecycle: prep → capture → analyze → act → track
- "What would you automate if it could run while you're asleep?" unlocks creative fire-and-forget suggestions

### 2.6 Existing Skills Awareness

Before suggesting use cases, check what skills already exist to avoid duplication and to reference them in suggestions:
- Use `rebel_usecases_list` to see existing use case library entries
- Review the user's custom skills in their spaces
- Reference built-in skills where relevant (e.g., "this use case would invoke meeting-prep + web-researcher + sales-proposal-drafting")

> **Full skill catalog:** [USE_CASE_INSPIRATION_CATALOG.md § 6. Existing Skills Catalog](USE_CASE_INSPIRATION_CATALOG.md)

---

## Part 3: Quality Checklist

Before presenting a use case, verify:

**High-impact indicators (aim for all):**
- [ ] Combines 2+ connectors or features
- [ ] Specific to the user's actual role, projects, and contacts
- [ ] Uses real names (clients, projects, colleagues) over generics
- [ ] Addresses a recurring pain point, not a one-off
- [ ] Produces a tangible deliverable (document, email, report, action item)
- [ ] Leverages Rebel's unique capabilities (voice, memory, automations, multi-tool)
- [ ] The user couldn't easily do this with ChatGPT alone
- [ ] Time savings are significant (30+ minutes per occurrence)

**Shallow indicators (reject if any):**
- [ ] Generic task description ("write emails," "summarize documents")
- [ ] Single-tool, single-step workflow
- [ ] No personalization to the user's context
- [ ] Could be done equally well in ChatGPT
- [ ] Assumes access to tools the user doesn't have connected
- [ ] Vague outcome ("help with strategy," "improve productivity")
