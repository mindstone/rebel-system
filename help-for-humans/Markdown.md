---
description: "Complete guide to Markdown files and syntax for non-technical users, including essential formatting, editing tips, and comprehensive syntax examples"
last_updated: "2026-05-11"
---

# Markdown file format

A quick guide to Markdown files for non-technical users. Markdown is a simple way to format text documents using plain text - it's like a lightweight version of Microsoft Word that works seamlessly with AI tools.

- [See also](#see-also)
- [What is Markdown?](#what-is-markdown)
- [Quickstart: Essential Syntax](#quickstart-essential-syntax)
- [Tips for Working with Markdown](#tips-for-working-with-markdown)
  - [Viewing Markdown in Rebel](#viewing-markdown-in-rebel)
  - [Editing Markdown Files](#editing-markdown-files)
  - [Common Gotchas](#common-gotchas)
- [Appendix: Detailed Syntax Examples](#appendix-detailed-syntax-examples)
  - [Headings](#headings)
  - [Text Formatting](#text-formatting)
  - [Lists](#lists)
  - [Links and References](#links-and-references)
  - [Code Blocks](#code-blocks)
  - [Blockquotes and Callouts](#blockquotes-and-callouts)
  - [Tables](#tables)
  - [Horizontal Rules](#horizontal-rules)
  - [Images](#images)
  - [Task Lists](#task-lists)
  - [Escaping Special Characters](#escaping-special-characters)
  - [Combining Formats](#combining-formats)


## See also

- [getting-started](library://rebel-system/help-for-humans/getting-started.md) - includes instructions on viewing Markdown in Preview mode
- [Rebel Interface](library://rebel-system/help-for-humans/Rebel-interface.md) - explains the Library, conversations, and other app basics
- [Markdown Guide](https://www.markdownguide.org/) - comprehensive external resource


## What is Markdown?

Markdown is a simple formatting language that lets you create formatted documents using plain text. Instead of clicking buttons like in Word, you use simple symbols:

- Type `**bold**` to get **bold** text
- Type `*italic*` to get *italic* text
- Type `# Heading` to create a heading

**Why we use it:**
- Works seamlessly with AI tools (they can read and write Markdown easily)
- Files are small and sync quickly
- You can edit files anywhere - even on your phone
- It's easy to compare and see differences
- It's the standard format for documentation

All the `.md` files you see in Rebel are Markdown files.


## Quickstart: Essential Syntax

Here are the most common formatting patterns you'll use:

```markdown
# Main Heading
## Section Heading
### Subsection Heading

**Bold text** for emphasis
*Italic text* for subtle emphasis

- Bullet point
- Another bullet point
  - Indented sub-point

1. Numbered list
2. Second item
3. Third item

[Link text](https://example.com)

`inline code` for technical terms

> Quote or callout text
```

That's honestly 90% of what you'll need for most documents!


## Tips for Working with Markdown

### Viewing Markdown in Rebel

When viewing `.md` files in Rebel, the document preview drawer renders them with nice formatting automatically. Click any Markdown file in your library to see it rendered.

For editing Markdown files, you can:
- Ask Rebel to make changes directly ("update the meeting notes to add...")
- Use any text editor on your computer
- Use another editor you already like if you prefer working outside Rebel

### Editing Markdown Files

1. **Start simple** - Just type plain text. Add formatting symbols only where you need them.

2. **Use headings liberally** - They create automatic navigation and make documents scannable:
   ```markdown
   # Main topic
   ## Subtopic
   ### Detail
   ```

3. **Don't worry about perfection** - Markdown is forgiving. If you forget a symbol, the text still displays.

### Common Gotchas

- **Blank lines matter**: Put a blank line before and after headings, lists, and quotes.
- **Indentation for sub-lists**: Use 2-4 spaces to indent sub-items.
- **Link syntax**: Remember the order: `[text you see](url-you-go-to)`
- **Line breaks**: Single line breaks in your text are preserved—no need to add two spaces at the end of lines.

### Images: paste, drop, and remove

You can add images to a Markdown file in a few ways:

- **Paste** — Copy an image to your clipboard, then paste it directly into the editor. Rebel saves the image file next to your document and inserts the Markdown link for you.
- **Drag and drop** — Drag an image file from your computer and drop it onto the editor. Same result: file saved, link inserted.
- **Remove** — Delete the Markdown image link (`![alt text](path)`) from the file. The image file stays on disk but is no longer linked.

### Write-conflict detection

If Rebel or another device edits a file you currently have open, you'll see a **conflict notice** banner at the top of the editor:

- The banner explains that the file was changed elsewhere
- You'll be given two options: **Keep my version** (your edits win, the incoming change is discarded) or **Keep external version** (the incoming change wins, your unsaved edits are dropped)

This keeps you in control when cloud sync or an agent update touches something you are working on. Choose the option that fits — no work is silently overwritten.


## Appendix: Detailed Syntax Examples

### Headings

```markdown
# Level 1 Heading (Main title)
## Level 2 Heading (Section)
### Level 3 Heading (Subsection)
#### Level 4 Heading (Detail)
```

### Text Formatting

```markdown
**Bold text** or __also bold__
*Italic text* or _also italic_
***Bold and italic***
~~Strikethrough text~~
`Inline code or technical term`
```

### Lists

**Bullet lists:**
```markdown
- First item
- Second item
  - Nested item (indent with 2-4 spaces)
  - Another nested item
- Third item
```

**Numbered lists:**
```markdown
1. First step
2. Second step
   1. Sub-step (indent with 3-4 spaces)
   2. Another sub-step
3. Third step
```

**Mixed lists:**
```markdown
1. Main point
   - Supporting detail
   - Another detail
2. Next main point
```

### Links and References

```markdown
[Link text visible to reader](https://example.com)
[Link to another doc](meeting-notes.md)
[Jump to section on same page](#section-heading)

Reference-style link: [link text][1]

[1]: https://example.com
```

### Code Blocks

For multi-line code or examples:

````markdown
```
Plain code block
No syntax highlighting
```

```python
# Code block with Python syntax highlighting
def hello():
    print("Hello, world!")
```
````

### Blockquotes and Callouts

```markdown
> This is a quote or callout.
> It can span multiple lines.

> **Note**: You can use formatting inside quotes too!

> [!NOTE]
> This is a callout block with a type indicator.

> [!WARNING]
> This highlights important warnings.

> [!TIP]
> Useful tips appear with special styling.
```

Rebel supports GitHub-style callout blocks: `[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!IMPORTANT]`, and `[!CAUTION]`. These render with distinct visual styling to help information stand out.

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |
```

### Horizontal Rules

```markdown
---
(Creates a horizontal line to separate sections)
```

### Images

```markdown
![Alt text description](path/to/image.png)
![Logo](https://example.com/logo.png)
```

### Task Lists

```markdown
- [ ] Incomplete task
- [x] Completed task
- [ ] Another task
```

### Escaping Special Characters

If you want to show a symbol literally (not as formatting), put a backslash before it:

```markdown
\* This appears as an asterisk, not italic
\# This appears as a hash, not a heading
```

### Combining Formats

```markdown
**Bold with [a link](https://example.com) inside**
*Italic with `code` inside*
- Bullet with **bold** and *italic* text
```
