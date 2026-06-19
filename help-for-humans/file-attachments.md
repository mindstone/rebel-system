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


## How Attachments Work

When you attach a file, Rebel processes it before sending:

1. **Images** are resized if needed (to avoid slow processing) and sent to the AI, which can see and describe them. HEIC/HEIF photos (common from iPhones) are automatically converted to JPEG
2. **PDFs** under 25MB are sent whole; larger PDFs have their text extracted so the AI can read the content (but won't see images or charts in the PDF)
3. **Office documents** (Word, Excel, PowerPoint, RTF) have their text extracted so the AI can read the content
4. **Text files** are included directly in your message

The AI receives the extracted content as part of your conversation, so it can answer questions, summarize, analyze, or help you work with the material.


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
The file exceeds the size limit. For large documents, try:
- Splitting into smaller files
- Saving to your workspace and asking Rebel to read it directly
- For PDFs, the text will be extracted automatically if over 25MB

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
