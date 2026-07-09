---
description: "Guide to attaching files to Rebel conversations - supported formats, how attachments work, and tips for deeper document analysis"
---

# File Attachments

Attach files directly to your conversations by dragging them into the composer or pasting from your clipboard. You can also attach files from the homepage hero input to start a new conversation with context already included. Rebel extracts the content and includes it in your message so the AI can read and work with it.


## Supported File Types

| Type | Formats | How It Works |
|------|---------|--------------|
| **Images** | PNG, JPEG, GIF, WebP, HEIC/HEIF | Sent directly to the AI for visual analysis |
| **PDFs** | .pdf | Small PDFs sent as-is; large PDFs have text extracted |
| **Word** | .doc, .docx | Text extracted and included in message |
| **Excel** | .xls, .xlsx | Spreadsheet data extracted as text |
| **PowerPoint** | .pptx | Slide text extracted (one section per slide) |
| **RTF** | .rtf | Rich text converted to plain text |
| **Text files** | .txt, .md, .json, .csv, code files | Read directly as text |

**Limits:**
- Up to 5 files per message
- Images: 10MB max
- PDFs: 32MB max  
- Office documents: 50MB max
- Text files: 5MB max

These limits are soft ceilings for non-image files you attach straight from your own computer — see **Big Files: Linked Instead of Rejected** below. They're hard limits for images, anything pasted from your clipboard, and anything attached through the cloud or mobile app.


## How Attachments Work

When you attach a file, Rebel processes it before sending:

1. **Images** are resized if needed (to avoid slow processing) and sent to the AI, which can see and describe them. HEIC/HEIF photos (common from iPhones) are automatically converted to JPEG
2. **PDFs** under 25MB are sent whole; larger PDFs have their text extracted so the AI can read the content (but won't see images or charts in the PDF)
3. **Office documents** (Word, Excel, PowerPoint, RTF) have their text extracted so the AI can read the content
4. **Text files** are included directly in your message

The AI receives the extracted content as part of your conversation, so it can answer questions, summarize, analyze, or help you work with the material.


## Big Files: Linked Instead of Rejected

If a file you attach straight from your own computer is too big to send as a copy, Rebel doesn't just bounce it — it opens the file live from where it lives on your computer instead. No copying it into a folder first, no upload, no size ceiling.

You'll see a small link badge on the attachment. It means: Rebel opens this file from your computer when it runs — leave it where it is (don't move, rename, or delete it) until Rebel's finished with it in that conversation.

This applies to any non-image file you drag or pick from your own computer — PDFs, Word/Excel/PowerPoint documents, RTF, text/code files, videos, archives, design files, and more. It doesn't apply to:
- **Images** — an oversized image is still rejected; Rebel needs the actual image to look at, not just a pointer to it
- **Files pasted from your clipboard** — these always travel as a copy, so the size limits above still apply
- **The cloud and mobile app** — there, every attachment travels as a copy regardless of size, so the usual limits apply too


## What Gets Extracted

For office documents, Rebel extracts the main text content:

| Format | What's Included | What's Not Included |
|--------|-----------------|---------------------|
| **Word** | All text, paragraphs | Images, formatting, comments |
| **Excel** | Cell data as CSV (all sheets) | Charts, formatting, formulas |
| **PowerPoint** | Slide text (labeled by slide number) | Speaker notes, images, animations |
| **RTF** | Text content | Special formatting |

This is usually enough for summarizing, answering questions, or extracting key information. For deeper analysis, see the section below.


## Tips for Better Results

**Be specific about what you need:**
> "Summarize the key points from slides 5-10"
> "What are the main figures in this spreadsheet?"
> "Find any mentions of Project Alpha in this document"

**For images:**
> "What does this screenshot show?"
> "Describe the chart in this image"
> "Read the text in this photo"

**Combine with questions:**
> "Here's the meeting notes - what action items were assigned to me?"
> "Based on this contract, what are the key dates I need to track?"


## Deeper Document Analysis

The quick extraction above works well for most tasks. But if you need more from a document—like speaker notes from a PowerPoint, or you want Rebel to create a new presentation based on content—you can ask Rebel to use its full document skills.

**How to do it:**
1. Save the file to your workspace (drag it into your Library or save to a Space folder)
2. Ask Rebel to work with it directly: "Analyze the presentation at Company/Q4-Review.pptx including speaker notes"

**What this enables:**
- **PowerPoint**: Access to speaker notes, slide layouts, detailed structure, and the ability to create or edit presentations
- **Other documents**: Full access to document metadata, structure, and advanced manipulation

**Note for Windows users:** Some advanced document skills require Python to be installed on your system. If Rebel mentions needing Python, see [coding-setup-with-Python](library://rebel-system/help-for-humans/coding-setup-with-Python.md) for setup instructions.


## Troubleshooting

**"Unsupported file type" message:**
The file format isn't recognized. Try converting to a supported format (e.g., export as PDF or save as .docx).

**"File too large" message:**
For an image, a file pasted from your clipboard, or anything attached through the cloud or mobile app, this means it exceeds the size limit. Try:
- Splitting into smaller files
- Saving to your workspace and asking Rebel to read it directly
- For PDFs, the text will be extracted automatically if over 25MB

For a non-image file you attach directly from your own computer, you shouldn't see this anymore — Rebel links to it instead of rejecting it (see **Big Files: Linked Instead of Rejected** above). If you do see it for a file attached that way, Rebel couldn't get a usable location for the file on disk — try re-attaching it, or save it to your workspace and ask Rebel to read it directly.

**Extracted text looks wrong:**
Some documents with complex formatting may not extract perfectly. If the content looks garbled:
- Try a different format (e.g., export Word doc as PDF)
- Save to workspace and ask Rebel to analyze it with full document tools

**PowerPoint missing content:**
Quick extraction gets slide text only. For speaker notes or detailed analysis, save to your workspace and ask Rebel to use its PowerPoint skill.


## See Also

- [Rebel Interface](library://rebel-system/help-for-humans/Rebel-interface.md) — Overview of Rebel's features
- [Spaces](library://rebel-system/help-for-humans/spaces.md) — Organizing files in your workspace
- [Using Skills](library://rebel-system/help-for-humans/using-skills.md) — How Rebel's skills work
- [Coding Setup with Python](library://rebel-system/help-for-humans/coding-setup-with-Python.md) — Installing Python for advanced features
