---
description: "How to fill out PDF forms with Rebel, what works today, and what to do when a form needs the fallback path"
last_updated: "2026-05-19"
---

# Filling out PDF forms

Rebel can fill out PDF forms for you — the kind with tab-able fields in your PDF viewer. Drop the PDF into a conversation, tell Rebel what to put in each field, and you get back a filled copy.

## What works today

- Fillable PDF fields (text fields, checkboxes, radio buttons, dropdowns).
- Most forms from common e-sign and document tools (DocuSign, HelloSign, PandaDoc, and similar).
- Output stays editable by default. If you want a locked version, ask Rebel to flatten it.

## Coming soon

- Scanned forms and "flat" PDFs (looks like a form, behaves like an image).
- For those today, Rebel can switch to a Python fallback path that may need a one-time install.

## What to ask

- "Fill out this PDF with these details: ..."
- "Check this form, ask me for missing details, then fill it in."
- "Fill this one with the same details as the previous form."

## Where the filled file goes

- By default: next to the original PDF, with `-filled` added to the filename.
- If Rebel cannot write there (common with temporary attachment folders), it falls back to your Desktop.
- You can also tell Rebel exactly where to save it.

## If something does not work

- **"This PDF uses XFA forms"** — older LiveCycle-style forms. Open it in a PDF tool that can convert XFA into a standard fillable PDF, then retry.
- **"PDF is password-protected"** — Stage 1 doesn't yet handle password-protected PDFs in the Node path. Remove the password from the PDF first (in your PDF viewer), or ask Rebel to use the Python fallback.
- **Fields look blank** — open in a different PDF viewer (e.g. your browser's built-in PDF viewer). If they are blank there too, tell Rebel. That's a bug, not a lifestyle choice.
