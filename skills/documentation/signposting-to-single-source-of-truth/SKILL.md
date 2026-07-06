---
name: signposting-to-single-source-of-truth
description: "Guidelines for maintaining single sources of truth and using signposting to connect documentation without duplication"
last_updated: 2025-10-30
tools_required: []
dependencies: []
agent_type: main_agent
---

# Signposting to Single Source of Truth

## Principle

**Core rule**: Each piece of information should have one canonical location. Link to it rather than duplicating content.

**Benefits**: Reduces maintenance burden, prevents inconsistencies, improves navigation.

## See Also

- [write-help-evergreen-doc.md](documentation/write-help-evergreen-doc/SKILL.md) - complete documentation writing guidelines
- [`documentation-update.md`](documentation-update/SKILL.md) - keeping documentation current
- [`../../help-for-humans/terminology.md`](../../help-for-humans/terminology.md) - includes wikilink syntax and cross-referencing examples


## Guidelines

### What to Include vs. Signpost

**Include locally**: Essential context, brief summaries (2-3 sentences max), critical frequently-needed information

**Signpost instead**: Detailed specifications, implementation details, frequently-changing content, deep technical details

Memory example (v3):
- Include in `README.md`: high-frequency facts and brief summaries that should auto-load (50%+ utility).
- Signpost to details in `memory/topics/` rather than duplicating.
- Cross-space topics live in `Chief-of-Staff/memory/topics/` and are linked from the top-level `README.md`.
- Space-specific topics live in `<Space Name>/memory/topics/` and are linked from that space's `README.md`.
- Raw sources (`memory/sources/`) are canonical — like code; topics and summaries are derived from them.
- **Within a space**: signpost to the canonical source rather than duplicating.
- **Across a privacy boundary** (e.g. Chief-of-Staff → shared space): never link — copy the least-derived safe shape instead. See [share-across-spaces](../../memory/share-across-spaces/SKILL.md).


### Cross-Reference Format

Use bullet lists with 1-sentence context:

**Documentation:**
```markdown
- [write-planning-doc](write-planning-doc/SKILL.md) - for writing ephemeral decision/planning docs
- [reference/AUTHENTICATION_SECURITY](../reference/AUTHENTICATION_SECURITY/SKILL.md) - security implementation details
```

Format: Use filestem (without `.md` extension) as link text. Include relative path in link text when it adds useful context.

**Code:**
```markdown
- `src/utils/auth.ts` - see `validateToken()` function for validation logic
```

**External:**
```markdown
- [React Hook Form docs](https://react-hook-form.com/) - for advanced form patterns
```


### Two-Way Signposting

When creating new documentation or signposts:
- Add references TO this new doc from related docs
- Add references FROM this new doc to related docs

