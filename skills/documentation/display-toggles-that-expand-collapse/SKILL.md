---
name: display-toggles-that-expand-collapse
description: "Use collapsible sections to make verbose agent output more readable"
last_updated: 2026-01-13
tools_required: []
dependencies: []
agent_type: main_agent
---

# Display Toggles (Expand/Collapse)

Use collapsible sections when your response contains verbose content that users may want to hide/show.

## Syntax

Use fenced code blocks with `collapse` language:

~~~markdown
```collapse
Summary text (first line)
Body content that will be hidden by default.
Can include **markdown**, links, code blocks, etc.
```
~~~

For sections that should be **expanded by default**:

~~~markdown
```collapse-open
Summary (visible, expanded)
Body content visible immediately.
```
~~~

## When to Use

**Good candidates for collapsing:**
- Detailed step-by-step breakdowns after a summary
- Long code diffs or file contents
- Verbose logs or traces
- Lists of more than 10 items
- Technical details that support a main point

**Keep expanded:**
- The main answer or recommendation
- Critical information the user asked for
- Short content (collapsing adds friction)

**Prefer multiple small toggles over one large one.** If you have several distinct sections of verbose content, give each its own collapse block rather than lumping everything into a single toggle. This lets users expand only what they need.

## Example

Instead of:

> Here are the 47 files that match your search:
> - file1.md
> - file2.md
> - ... (45 more)

Use:

~~~markdown
Found 47 matching files.

```collapse
Full file list (47 files)
- file1.md
- file2.md
- file3.md
...
```
~~~

## Important

**Do NOT use raw HTML `<details>`/`<summary>` tags.** They will not render correctly. Always use the fenced code block syntax above.

## Limitations

- **Nested collapse blocks are not supported** — if you nest one inside another, the inner block renders as a literal code block instead of a toggle. Keep all collapse blocks at the same level.
- Content inside collapsed sections not searchable until expanded
- Collapse state resets when scrolling in long conversations
