---
name: gdpr-pii-tag-files
description: "Add GDPR-PII-sensitive frontmatter tags to files containing candidate or personal information for compliance tracking."
last_updated: 2025-10-28
tools_required: []
agent_type: either
dependencies: []
---

# Tag GDPR PII Files

Add `GDPR-PII-sensitive: true` frontmatter to files containing personally identifiable information.

## Process

Add this frontmatter to any file containing candidate or personal information:

```yaml
---
GDPR-PII-sensitive: true
candidate_name: [Full Name]
position: [Role if hiring-related]
---
```

**Files requiring this tag:**
- Candidate profiles and interview notes
- Personal interview prep documents
- Any file with names, locations, contact details, or employment history

**Exclude:** Template files, scorecards without candidate names, process documentation.

## Important

- Always add when creating new candidate files during hiring
- Use exact field name: `GDPR-PII-sensitive` (not `GDPR_PII` or `gdpr-pii`)
- Add `candidate_name` for searchability
- See `hiring-process-setup.md` (if available) for automated inclusion in hiring workflows
- This is particularly important for companies subject to GDPR or similar privacy regulations













