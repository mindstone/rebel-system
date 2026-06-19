---
name: pdf-read-extract
description: "Read and extract text, tables, and data from PDF files using Python libraries (pdfplumber, pypdf). For filling out a PDF form, use pdf-fill-form instead (no Python required)."
last_updated: 2025-11-08
tools_required: '["Python 3", "pdfplumber", "pypdf"]'
dependencies: '["python-setup-and-check.md"]'
reference: 'https://github.com/anthropics/skills/tree/main/document-skills/pdf'
---

# PDF Reading and Extraction

**Quick guide** for extracting text and tables from PDF files using Python. For comprehensive documentation, see the [Anthropic official pdf skill](../../Anthropic-official-skills/document-skills/pdf/SKILL.md).

**Default assumption**: Python and required libraries (`pdfplumber`, `pypdf`) are already installed. If you encounter import errors or command-not-found errors, see the Setup section below.

## See also

- **[PDF form filling →](../pdf-fill-form/SKILL.md)** — fill in PDF forms (AcroForm). Node-based, no Python required. Use this for any "fill out this PDF" request.
- [python-setup-and-check](../../coding/python-setup-and-check/SKILL.md) - **Start here if this is your first time using Python** (non-technical friendly)
- **[Anthropic pdf skill](../../Anthropic-official-skills/document-skills/pdf/SKILL.md)** - **Comprehensive guide** with advanced examples, form handling, merging/splitting, and complete API reference
- [PDF-read-extract-by-converting-to-images-ImageMagick](../pdf-read-extract-by-converting-to-images-imagemagick/SKILL.md) - **Fallback approach** for when text extraction fails - converts PDFs to images for visual reading in Cursor
- [Anthropic pdf on GitHub](https://github.com/anthropics/skills/tree/main/document-skills/pdf) - Source repository

## Quick Start

### Setup (if needed)

**First time using Python?** See [python-setup-and-check](../../coding/python-setup-and-check/SKILL.md) for beginner-friendly setup instructions.

```bash
# Mac:
pip3 install --break-system-packages pdfplumber pypdf

# Windows:
pip install pdfplumber pypdf
```

### Basic Usage

**Extract text with pdfplumber** (recommended for most tasks):

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    
    # Extract text from all pages
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        print(f"--- Page {i+1} ---")
        print(text)
```

**Extract tables**:

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            for row in table:
                print(row)
```

**Get metadata**:

```python
from pypdf import PdfReader

reader = PdfReader("document.pdf")
meta = reader.metadata

print(f"Title: {meta.title}")
print(f"Author: {meta.author}")
print(f"Pages: {len(reader.pages)}")
```

## Library Choice

- **pdfplumber** - Best for text extraction with layout preservation and table detection
- **pypdf** - Best for metadata, form fields, and basic text extraction
- **pytesseract + pdf2image** - For scanned PDFs requiring OCR

## Important Notes

- **CRITICAL**: Always ask for explicit user permission before any write/modify/destructive operations (writing files, modifying PDFs, deleting content)
- **Mac**: Use `python3` and `pip3`; **Windows**: Use `python` and `pip`
- Use pdfplumber for most text/table extraction (better layout preservation)
- For scanned PDFs without text layer, you'll need OCR (pytesseract)
- Always use `encoding='utf-8'` when writing extracted text to files
- Password-protected PDFs require decryption: `reader.decrypt("password")`

## Complete Documentation

See the **[Anthropic pdf skill](../../Anthropic-official-skills/document-skills/pdf/SKILL.md)** for:
- Advanced text extraction and region-specific extraction
- Form field reading and manipulation
- PDF merging, splitting, and page manipulation
- OCR for scanned documents
- Batch processing patterns
- Performance optimization
- Complete API reference

