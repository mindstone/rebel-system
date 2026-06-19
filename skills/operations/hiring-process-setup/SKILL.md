---
name: hiring-process-setup
description: "Sets up complete hiring process infrastructure with organized folders, templates, scorecards, and candidate tracking for any role."
last_updated: 2025-10-28
agent_type: main_agent
---

# Setup Hiring Process

Create complete, organized infrastructure for hiring any role - from folder structure to interview scorecards.

## See also

- [ask-questions-one-at-a-time](../thinking/ask-questions-one-at-a-time/SKILL.md) - for gathering requirements from hiring manager
- `memory/teams/[Team]/Hiring-[OperationsRole]-[MMM-YYYY]/` - reference example of complete setup
- `memory/teams/[Team]/Hiring-[TechnicalRole]-[MMM-YYYY]/` - reference example for technical role
- {TEAMS_FILE_PATH} - team directory and context

## Agent Use

Run when starting a new hiring process. Requires input from hiring manager about role requirements and process.

## Persona

You are an experienced recruiting operations specialist who builds systematic, scalable hiring processes with clear evaluation criteria and organized candidate tracking.

## Goal

Create complete hiring process infrastructure with organized folders, role-specific interview scorecards, candidate tracking, and all necessary documentation.

## Context

{COMPANY_NAME} hiring processes need consistent structure to:
- Track multiple candidates systematically
- Ensure fair, structured evaluation across interviewers
- Maintain organized documentation (CVs, notes, scorecards)
- Enable team collaboration on hiring decisions
- Scale as we add more candidates

This skill creates the infrastructure; actual interviews and decisions happen separately.

## Process

### 1. Gather requirements from hiring manager

Ask these questions one at a time (use [ask-questions-one-at-a-time](../thinking/ask-questions-one-at-a-time/SKILL.md)):

**Basic Information:**
- What role are we hiring for? (e.g., "COO", "Tech Lead", "Product Designer")
- What team is this for? (e.g., "Exec", "Engineering", "Product")
- When did this hiring process start? (format: Month-Year, e.g., "Oct-2025")
- Who is on the hiring team? (names and roles)

**Role Requirements:**
- What are the must-have requirements? (skills, experience, attributes)
- What are nice-to-have requirements?
- Any specific cultural fit requirements?
- Any location/timezone requirements?
- Any non-negotiable requirements?

**Process & Timeline:**
- What's the interview process? (stages and who conducts each)
- What's the timeline/urgency?
- Target start date for new hire?
- Do we have a job description already? (if yes, get link/document)

**Evaluation:**
- What are the 3-5 most critical things we're evaluating for?
- Any specific scenarios or exercises to include in interviews?
- Who makes the final decision?

### 2. Create folder structure

Create in `memory/teams/[TEAM-NAME]/`:

```
Hiring-[Role]-[Month-Year]/
├── Overview.md
├── Interview-Scorecard.md
└── candidates/
    └── (candidate folders will be created as they apply)
```

**Path variables:**
- `[TEAM-NAME]` = team name in title case with spaces (e.g., "Exec", "Engineering", "Product Marketing")
- `[Role]` = role title in title case with hyphens (e.g., "COO", "Tech-Lead", "Senior-Engineer")
- `[Month-Year]` = start month and year (e.g., "Oct-2025", "Nov-2025")

### 3. Create Overview.md

Use this template structure:

```markdown
# [Role] Hiring - [Month Year]

**Status:** [Active/Planning/On-hold]
**Target Start Date:** [Date or TBD]
**Hiring Team:** [Names and roles]

---

## Context

[1-2 paragraphs about why we're hiring, what the role will do, company stage/state]

Current {COMPANY_NAME} state:
- [Key metrics: team size, revenue, etc.]
- [Strategic context relevant to role]

The role requires [key attributes in 1 sentence].

---

## Key Requirements

### Must-Haves
- [Requirement 1 with brief explanation]
- [Requirement 2 with brief explanation]
- [...]

### Nice-to-Haves
- [Nice-to-have 1]
- [Nice-to-have 2]
- [...]

---

## Current Candidates

### Active Candidates
- **[Name](candidates/[Name]/README)** - [One-line summary: status, key background]

### Candidate Folders
Each candidate has a dedicated folder in `candidates/[Name]/` containing:
- Candidate profile and interview prep
- CV and supporting documents
- Interview notes and scorecards

---

## Resources

- **General interview scorecard:** [Interview-Scorecard.md](Interview-Scorecard/SKILL.md) (template for all [role] interviews)
- **Job description:** [Link if available]
- **Team context:** [Team.md](../../background/[Team]/[Team]/SKILL.md)
- **Company context:** [{COMPANY_NAME}-context.md](../../background/Common/{COMPANY_NAME}-context/SKILL.md)

---

## Process & Timeline

### Interview Stages
1. [Stage 1 - who, what, duration]
2. [Stage 2 - who, what, duration]
3. [Stage 3 - who, what, duration]
4. [Final stage]

### Key Dates
- [Date]: [Milestone]
- Next: [TBD or specific date]

---

## Notes

- [Any important context or constraints]
- [Special considerations]

---

*Last updated: [YYYY-MM-DD]*
```

### 4. Create Interview-Scorecard.md

Build role-specific scorecard with these sections:

**Header:**
- Candidate name (blank)
- Position
- Interview date (blank)
- Interviewer name (blank)
- Duration (blank)

**Instructions:**
- Rating scale 1-5 with definitions
- Emphasis on providing specific evidence

**Core Competencies (5-10 criteria):**
For each critical requirement, include:
- Rating checkboxes (1-5, N/A)
- Key questions to probe this competency
- Space for evidence/examples
- Space for concerns/red flags
- Mark as ⭐ CRITICAL if truly essential

**Role-Specific Focus Areas:**
- Section for each interviewer with their specific focus
- Checkboxes for what they should cover
- Space for scenario/exercise notes

**Summary Sections:**
- Red flags/concerns (numbered list)
- Standout moments/strengths (numbered list)
- Questions to probe further
- Work product/references requested
- Overall rating (Strong Hire → Strong No Hire)
- Summary assessment
- Key strengths (top 3)
- Key concerns (top 3)
- Recommendation

**Critical Questions:**
- 3-5 questions the team collectively needs to answer
- Checkbox format for yes/no

**Reference Examples:**
- See `memory/teams/[Team]/Hiring-[OperationsRole]-[MMM-YYYY]/Interview-Scorecard.md` for operations role
- See `memory/teams/[Team]/Hiring-[TechnicalRole]-[MMM-YYYY]/Interview-Scorecard.md` for technical role

### 5. Update team README

Add to the team's README.md:

```markdown
## Active Hiring Processes

- **[Hiring-[Role]-[Month-Year] Overview](Hiring-[Role]-[Month-Year]/Overview/SKILL.md)** - [Role] hiring process
```

### 6. Set up first candidate (if already identified)

If there's already a candidate, create:

```
candidates/[Candidate-Name]/
├── README.md
└── [Candidate-Name]-CV.pdf (if available)
```

**Candidate README.md structure:**
- **Frontmatter:** Add GDPR-PII tag (see [GDPR-PII-tag-files](../../system/gdpr-pii-tag-files/SKILL.md))
- Header: Name, position, status, location, current role
- Documents section: CV, job description, scorecard links, external notes
- Interview timeline: Initial screening, team interviews (scheduled)
- Quick summary: Background, key strengths, key gaps
- Critical questions for team interviews
- Interviewer-specific focus areas (customized from hiring manager input)
- Work product requests
- Post-interview actions checklist
- See also links

**GDPR Compliance:**
All candidate files must include frontmatter:
```yaml
---
GDPR-PII-sensitive: true
candidate_name: [Full Name]
position: [Role]
---
```

**Naming convention for candidates:**
- Folder: `First-Last` (e.g., `Jane-Smith`)
- CV: `First-Last-CV.pdf` or `FirstLast-CV.pdf`

### 7. Create signposts and cross-references

**If interviewer has personal notes:**
- Link from candidate README to `[[memory/people/[interviewer]/topics/[Name]-Interview-Notes]]`
- Link from interviewer's notes to `[[memory/teams/[TEAM]/Hiring-[Role]-[Date]/candidates/[Name]/README]]`
- Add GDPR-PII tags to all interviewer notes containing candidate information

**Avoiding bias (HiPPO effect):**
- Each interviewer should form independent assessment before comparing notes
- Personal interview prep docs should guide focus areas without revealing other interviewers' opinions
- After interviews, compare notes to identify alignment and differences
- Senior interviewer notes available for reference but not required reading before interview

**In Overview.md:**
- Link to team context: [Team.md](../../background/[Team]/[Team]/SKILL.md)
- Link to company context: [{COMPANY_NAME}-context.md](../../background/Common/{COMPANY_NAME}-context/SKILL.md)
- Link each candidate: [Name](candidates/[Name]/README)

### 8. Provide navigation summary

Give hiring manager:
- Main entry point: path to Overview.md
- How to add new candidates
- How to use scorecards
- Where interviewers should store their notes

## Important

- **Ask questions one at a time** - don't overwhelm hiring manager
- **Follow naming conventions**:
  - Folders: `Hiring-[Role]-[Month-Year]`
  - Candidates: `First-Last` or `FirstLast`
  - Team names: Title case with spaces (e.g., "Product Marketing")
- **Customize scorecard to role** - don't use generic criteria
  - Operations roles: hands-on execution, systems building, commercial contracts
  - Technical roles: code quality, system complexity, AI curiosity, communication
  - Product roles: user empathy, design thinking, prioritization, collaboration
  - Sales roles: relationship building, pipeline management, closing capability
- **Mark 3-5 criteria as CRITICAL** (⭐) - not everything can be critical
- **Include specific probe questions** in scorecard for each competency
- **Create space for evidence** - interviewers need to document concrete examples
- **Scale for multiple candidates** - folder structure makes this easy
- **Privacy considerations** - this is shared drive, be mindful of sensitive information
- **GDPR compliance** - all candidate files must have `GDPR-PII-sensitive: true` frontmatter
- **Avoid interviewer bias** - interviewers form independent assessments before comparing notes
- **Link don't duplicate** - use signposts to existing resources
- **Update paths carefully** - use relative paths within hiring folder (e.g., `[[../../Overview]]`)

## Examples

**Good folder names:**
- `memory/teams/[Team]/Hiring-[OperationsRole]-[MMM-YYYY]/`
- `memory/teams/Engineering/Hiring-Senior-Engineer-Nov-2025/`
- `memory/teams/Product Marketing/Hiring-Content-Lead-Dec-2025/`

**Bad folder names:**
- `hiring_coo/` (wrong location, wrong format)
- `memory/teams/Exec/coo-hiring/` (not descriptive enough)
- `NewHire2025/` (too vague)

**Good candidate folders:**
- `candidates/John-Smith/`

**Bad candidate folders:**
- `candidate1/` (no name)
- `john/` (need full name)
- `candidates/john-smith/` (wrong capitalization)

## Success Criteria

- [ ] Folder structure created in correct location
- [ ] Overview.md includes role context, requirements, and process
- [ ] Interview-Scorecard.md has role-specific criteria (not generic)
- [ ] 3-5 criteria marked as CRITICAL
- [ ] Scorecard includes specific probe questions for each competency
- [ ] Team README updated with link to new hiring process
- [ ] If candidate exists, their folder is set up with README and CV
- [ ] All candidate files tagged with `GDPR-PII-sensitive: true` frontmatter
- [ ] All cross-references and signposts in place
- [ ] Hiring manager knows where everything is and how to use it

## Output

Provide hiring manager with:

```
✅ Hiring process created: memory/teams/[TEAM]/Hiring-[Role]-[Date]/

📁 Structure:
- Overview.md - Process overview and candidate list
- Interview-Scorecard.md - Evaluation template
- candidates/ - Folder for candidate materials

🔗 Quick Links:
- Main entry: [[Hiring-[Role]-[Date]/Overview]]
- Scorecard template: [[Hiring-[Role]-[Date]/Interview-Scorecard]]

📝 To add a candidate:
1. Create folder: candidates/[First-Last]/
2. Add README.md with interview prep
3. Add CV: [First-Last]-CV.pdf
4. Update Overview.md Active Candidates section

👥 Hiring team: [Names]
🎯 Next steps: [What's next in process]
```

