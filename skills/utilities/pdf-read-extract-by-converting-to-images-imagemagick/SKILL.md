---
name: pdf-read-extract-by-converting-to-images-imagemagick
description: "FALLBACK: Convert PDF files to image sequences (JPG/PNG) using ImageMagick when text extraction methods fail - enables visual reading of PDFs in Cursor"
last_updated: 2025-11-08
tools_required: '["ImageMagick"]'
dependencies: '["PDF-read-extract.md"]'
---

# PDF Reading by Converting to Images (ImageMagick)

**⚠️ FALLBACK APPROACH** - Use this only when text extraction methods in [PDF-read-extract.md](../pdf-read-extract/SKILL.md) fail or are insufficient.

Convert PDF files to image sequences using ImageMagick, enabling visual PDF reading in Cursor through image file support.

## See also

- **[PDF form filling →](../pdf-fill-form/SKILL.md)** — fill in PDF forms (AcroForm). Node-based, no Python required. Use this for any "fill out this PDF" request.
- **[PDF-read-extract.md](../pdf-read-extract/SKILL.md)** - **PREFERRED**: Use text extraction with pdfplumber/pypdf first

## Quick start

Prerequisite: ImageMagick installed (`magick -version`).

- PDF → numbered JPEGs (flattened):

  ```bash
  magick convert "path/to/input.pdf" -flatten "path/to/output-%02d.jpg"
  ```

- Control output density (higher = sharper, larger files), page range, and format:

  ```bash
  magick -density 300 "path/to/input.pdf[0-4]" -quality 85 -flatten "path/to/output-%02d.jpg"
  # or PNG
  magick -density 300 "path/to/input.pdf" -flatten "path/to/output-%02d.png"
  ```

Notes:
- Quote paths with spaces.
- Use page selectors like `[0]` for first page only, `[2-5]` for a range.
- `convert` (legacy) is equivalent to `magick convert ...`; prefer `magick`.
- Default: write output next to the source unless otherwise specified.
- **Prioritize readability:** Use `-density 300` (or higher) to ensure text is clear - it doesn't need to be perfect resolution, but don't be too stingy with file size.



