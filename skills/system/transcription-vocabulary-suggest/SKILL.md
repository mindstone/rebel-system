---
name: transcription-vocabulary-suggest
description: "Intelligently suggest and add custom vocabulary for speech transcription by analyzing Chief-of-Staff README, space context, and key memory files."
last_updated: 2026-01-15
tools_required: [RebelSettings__rebel_vocabulary_get, RebelSettings__rebel_vocabulary_update]
agent_type: main
---

# Update Transcription Vocabulary

Intelligently analyze your context to suggest custom vocabulary that improves speech-to-text accuracy, then update the vocabulary with your approval.

## Goal

Generate high-quality vocabulary suggestions by understanding your role, relationships, companies, and projects through semantic analysis of key context files. Then add approved terms to your transcription vocabulary.

## Context

Rebel uses OpenAI's speech-to-text API with custom vocabulary hints. These hints significantly improve accuracy for domain-specific terms:
- People's names (especially non-English or unusual spellings)
- Company names and product names (unusual/non-English)
- Technical terms and industry jargon (rare, domain-specific)
- Acronyms spoken as words (LLM, MCP, ARR)
- Internal project names and codenames

**Focus on RARE terms that STT would struggle with:**
- Unusual company names (Mindstone, Vantiq, Zylker)
- Non-English names (Søren Müller, Aoife)
- Technical neologisms (MCP, LLM, Rebel)
- Uncommon proper nouns (Anthropic, Claude)

**Not needed (STT handles these well):**
- Common English names (Peter, Hannah, Harry, John, Sarah)
- Common English words
- Well-known technical terms (JavaScript, GitHub, email, API, OpenAI)
- Numbers or dates
- Standard acronyms (CEO, CTO, CFO)

## Process

### 1. Get current vocabulary

Call `rebel_vocabulary_get` to see what's already configured.

### 2. Read Chief-of-Staff README (ALWAYS)

**CRITICAL**: Always read `Chief-of-Staff/README.md` first, regardless of scope.

This provides essential cross-space context:
- User's role and current focus
- Key relationships (partner, colleagues, team)
- Companies they work with/for
- Products and tools they use daily
- Recent priorities and projects

**Why always**: Even when scoped to a specific space (e.g., "personal"), terms from work context (company names, colleague names) appear in daily vocabulary.

### 3. Read target space README (if scoped)

If the user specified a space (e.g., "update vocabulary for my personal space"):
- Read `[space-path]/README.md`
- Check the space description in frontmatter
- Identify space-specific companies, projects, people

If no space specified, scan key spaces:
- `personal/README.md`
- `work/[Company]/[Space]/README.md` files

### 4. Follow key references

Based on README content, read referenced high-value files:
- `personal/memory/aboutme.md` - Biographical info, companies, education
- `Chief-of-Staff/memory/topics/[topic].md` - If referenced and relevant
- Space-specific memory topics if mentioned

**Smart reading**: Don't read everything - follow what's mentioned or clearly relevant.

### 5. Extract vocabulary candidates using semantic understanding

Analyze the content for:

**People:**
- Names mentioned in relationships, teams, partnerships
- Colleagues, clients, co-founders
- Filter: Distinguish real people from common names
- **IMPORTANT**: Focus on people the USER interacts with directly, not just names appearing in company context. Check:
  - Meeting participants and direct collaborators
  - People in `Chief-of-Staff/README.md` "AI Working Context"
  - Recurring names in recent sources (`memory/sources/`)
  - Names from the user's own speech patterns (meeting transcripts, emails they authored)

**Companies & Organizations:**
- Employers (current and former)
- Client companies
- Partner organizations
- Competitors mentioned frequently

**Products & Projects:**
- Products you've built or work on
- Tools you use daily (especially if uncommon)
- Internal project names and codenames
- Active personal projects

**Technical Terms:**
- Domain-specific jargon
- Acronyms you use frequently (LLM, MCP, SDK, API, etc.)
- Technical tools and platforms (if frequently mentioned)

**Relationship awareness:**
- Understand "Co-founded Acme with Jordan" → Jordan is important
- Understand "transitioning to CTO at Mindstone" → Mindstone is your employer
- Understand "Former CTO at Globex" → Globex is a past company

**Prioritize the user's own vocabulary:**
- Sample recent sources authored by the user (their meetings, emails, Slack messages)
- Focus on terms THEY actually say, not just company context they receive
- Example: If user frequently mentions "Stefan" in meetings → high priority; if "SEEK" only appears in company docs → lower priority

### 6. Filter intelligently

**Remove:**
- Common English words
- Fragments, typos, malformed names
- Exposed credentials or sensitive data
- Terms already in current vocabulary
- Standard well-transcribed technical terms
- **Names the user never mentions** (e.g., companies only in sales docs, not meetings/emails)
- **Third-party entities** (e.g., "SEEK" if user hasn't authored content about them)

**Keep:**
- Terms you actually talk about in daily work/life
- Non-English names or unusual spellings
- Domain-specific terminology
- Acronyms you say as words (not spell out)
- Companies, products, people in your context
- **Terms from the user's own speech** (meeting transcripts, authored emails, Slack messages)
- **Frequent collaborators** (check recent meeting participants, "AI Working Context" in README)

**Quality over quantity**: 20-30 high-quality terms >> 100 noisy terms
**Prioritize authenticity**: Terms the user SAYS > terms they just READ

### 7. Present categorized suggestions

Show suggestions in categories with reasoning:

```markdown
## Suggested Vocabulary Additions

**Current vocabulary**: [X terms]
**New suggestions**: [Y terms]

### People (N NEW)
- **[Name]** - [Why: Co-founder of X, CTO at Y, etc.]
- ...

### Companies & Organizations (N NEW)
- **[Company]** - [Why: Your employer, major client, partner, etc.]
- ...

### Products & Projects (N NEW)
- **[Product]** - [Why: Product you built, tool you use daily, etc.]
- ...

### Technical Terms & Acronyms (N NEW)
- **[Term]** - [Why: Domain-specific, frequently mentioned, etc.]
- ...
```

### 8. Get user approval

Ask: **"Shall I add these [Y] terms to your transcription vocabulary?"**

Options:
- "Yes, add all"
- "Add only: [specific terms]"
- "No, don't add"

### 9. Update vocabulary

If approved, call `rebel_vocabulary_update`:

```javascript
rebel_vocabulary_update({
  action: "add",
  words: ["Term1", "Term2", "Term3", ...]
})
```

### 10. Confirm success

Report what was added:
```markdown
✅ Added [N] terms to your transcription vocabulary:
- [Term1], [Term2], [Term3]...

These will be used as hints for all future voice transcriptions with OpenAI.
```

## Important Guidelines

**Always read Chief-of-Staff README first** - This is the single most important file for context, regardless of scope.

**Use semantic understanding** - Don't just pattern match. Understand:
- "Co-founded with X" → X is important
- "Transitioning to CTO" → Current role context
- "Major customer" → Company is relevant

**Privacy-conscious** - Never include:
- Exposed credentials (API keys, tokens)
- Sensitive personal information
- Private financial details

**Quality filtering** - Don't suggest:
- Fragments (ARD, ANNN, AUTOM)
- Typos or malformed names
- Terms that appear once without context
- Common words or well-transcribed standards

**Explain reasoning** - For each category, briefly explain why terms are relevant ("your employer", "co-founder", "frequently mentioned product").

**Respect existing vocabulary** - Don't re-suggest terms already configured.

## Example Execution

**User request**: "Update my transcription vocabulary for personal space"

**Agent actions:**
1. Call `rebel_vocabulary_get` → 14 existing terms
2. Read `Chief-of-Staff/README.md` → Learn: CTO at Mindstone, partner is Alex, uses Rebel/Claude daily
3. Read `personal/README.md` → Learn: Co-founded Acme, active projects (Widgetly, FitTrack)
4. Read `personal/memory/aboutme.md` → Learn: Former CTO at Globex, worked at Initech, Hooli
5. Extract candidates with semantic understanding
6. Filter out noise, existing terms, common words
7. Present 25 categorized suggestions with reasoning
8. Get approval: "Yes, add all"
9. Call `rebel_vocabulary_update` with approved terms
10. Confirm: "✅ Added 25 terms to your vocabulary"

## Success Criteria

- Agent reads Chief-of-Staff README in all cases
- Agent reads relevant space README if scoped
- Agent follows key references intelligently
- Suggestions are high-quality (real entities, relevant terms)
- Suggestions include brief reasoning
- Agent gets explicit approval before updating
- Agent calls the update tool (doesn't just suggest copy-paste)
- User confirms terms were added successfully
