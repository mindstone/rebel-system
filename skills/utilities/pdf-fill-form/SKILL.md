---
name: pdf-fill-form
description: "Fill out a PDF form for the user. Handles fillable AcroForm PDFs (text fields, checkboxes, radio groups, dropdowns) using Node.js (no Python required). Use this first for any 'fill out this PDF' request before the Anthropic PDF skill."
last_updated: 2026-05-19
tools_required: ["Node.js (bundled with Rebel)"]
agent_type: main_agent
---

# PDF Fill Form

Use this skill before `Anthropic-official-skills/document-skills/pdf` for any user request to **fill in** a PDF form. This skill handles fillable AcroForm PDFs in Node — no Python or poppler setup required.

## When to Use

- The PDF has fillable fields (tab-able boxes/buttons in Preview/Acrobat)
- The user wants those fields populated and saved into a new PDF
- You need a local, no-Python path for text fields, checkboxes, radio groups, and dropdown/choice fields

## Surface Support

**Desktop only.** Cloud and mobile surfaces don't execute local scripts; users on those surfaces should fill PDFs via the Rebel desktop app or fall back to a web-based form filler. See the [Cross-Surface Parity Checklist](../../../../docs/project/CROSS_SURFACE_PARITY_CHECKLIST.md).

## Process

1. Confirm the PDF is fillable:
   - `node check-fillable.js <path-to-pdf>`
2. Extract field metadata:
   - `node extract-fields.js <path-to-pdf>`
3. Map user answers to field IDs and create `field_values.json`:
   - Shape: `[{"field_id":"...","value":"...|true|false|null"}]`
4. Fill the form:
   - `node fill-fillable.js <path-to-pdf> <field_values.json> [--output <path>] [--flatten]`

## Setup — Copy to temp + npm install

The scripts require npm dependencies. Since `rebel-system/` may be read-only in production builds, always copy scripts to a writable temp directory before running:

```bash
# POSIX (macOS/Linux)
cp -r rebel-system/skills/utilities/pdf-fill-form/scripts /tmp/pdf-fill-form
cd /tmp/pdf-fill-form
npm install
```

```powershell
# Windows (PowerShell/cmd)
xcopy /E /I rebel-system\skills\utilities\pdf-fill-form\scripts %TEMP%\pdf-fill-form
cd %TEMP%\pdf-fill-form
npm install
```

## Script Reference

| Script | Purpose | Input | Output |
| --- | --- | --- | --- |
| `check-fillable.js` | Detect whether a PDF has AcroForm fields | `<path-to-pdf>` | JSON with `fillable`, `fieldCount`, `pdfPath` (or `error: "xfa_form"` / `error: "encrypted"` with exit 2) |
| `extract-fields.js` | List form fields in Anthropic-compatible JSON shape | `<path-to-pdf>` | JSON object `{ fields, warnings, pdfPath }` |
| `fill-fillable.js` | Validate + apply user values to fields, verify persisted values, then write output PDF | `<path-to-pdf> <field-values.json> [--output <path>] [--flatten]` | JSON with `outputPath`, `outputPathFallback`, `fieldsFilled`, `warnings` (exit 3 if verification fails) |

Example stdout (`check-fillable.js`):

```json
{
  "fillable": true,
  "fieldCount": 14,
  "pdfPath": "/absolute/path/to/form.pdf"
}
```

Example stdout (`extract-fields.js`):

```json
{
  "fields": [
    {
      "field_id": "Contact.Name",
      "page": 1,
      "rect": [72, 640, 280, 660],
      "type": "text",
      "current_value": "",
      "max_length": 128,
      "required": true,
      "hidden": false
    },
    {
      "field_id": "Preferences.Channel",
      "page": 1,
      "rect": [72, 560, 220, 580],
      "type": "choice",
      "choice_options": [
        { "value": "Email", "text": "Email" },
        { "value": "Phone", "text": "Phone" }
      ],
      "current_value": "Email",
      "required": false,
      "hidden": false,
      "editable": false
    },
    {
      "field_id": "Approvals.SignatureType",
      "page": 1,
      "rect": [72, 500, 220, 520],
      "type": "radio_group",
      "radio_options": [
        { "value": "digital", "text": "digital", "rect": [72, 500, 84, 512] },
        { "value": "wet", "text": "wet", "rect": [140, 500, 152, 512] }
      ],
      "current_value": null,
      "required": false,
      "hidden": false
    }
  ],
  "warnings": [
    {
      "field_id": "Legacy.Field42",
      "reason": "missing_rect",
      "message": "Skipped \"Legacy.Field42\" because widget rectangle data is missing or invalid."
    }
  ],
  "pdfPath": "/absolute/path/to/form.pdf"
}
```

Example stdout (`fill-fillable.js`):

```json
{
  "outputPath": "/absolute/path/to/form-filled.pdf",
  "outputPathFallback": "next-to-source",
  "fieldsFilled": 14,
  "warnings": []
}
```

`radio_group` values are validated against `radio_options[].value`. `choice` values are validated against `choice_options[].value`. `text` and `checkbox` keep the same field shape as before.

`fill-fillable.js` verification is strict. Text values are compared exactly (no whitespace normalization). If `--flatten` is used, verification runs against the in-memory unflattened bytes first, then the script flattens and writes the final PDF. This avoids false failures because flattened PDFs no longer expose form fields for machine-readable verification.

When verification fails, mismatch entries may include `readError` / `readErrorMessage` when a field could not be read back (different from "value was read but did not match"). Validation also rejects duplicate `field_id` entries in `field_values.json`.

## Output Location

Default output is next to the source PDF as `<name>-filled.pdf`, with this fallback chain:

1. Next to source PDF (`next-to-source`)
2. `~/Desktop/<name>-filled.pdf` (`desktop`)
3. `os.tmpdir()/<name>-filled.pdf` (`tmp`)

If `--output <path>` is provided, that path is used (`override`). The final absolute output path is always echoed in stdout JSON.

## Fallback: Python

Use the Python fallback when this Node path can't do the job:

- **XFA forms** (Adobe LiveCycle forms)
- **Encrypted/password-protected PDFs**
- **Scanned or non-fillable PDFs** where a vision-led annotation path is needed (coming soon in this skill; not shipped yet)

Install the pinned fallback dependencies from this skill:

```bash
# macOS/Linux
pip3 install -r <skill-dir>/python-fallback/requirements.txt
```

```powershell
# Windows
pip install -r <skill-dir>\python-fallback\requirements.txt
```

Then run the workflow in the Anthropic PDF forms guide:
- [Anthropic PDF forms workflow](../../Anthropic-official-skills/document-skills/pdf/forms.md)

If Python setup is questionable, run:
- [python-setup-and-check](../../coding/python-setup-and-check/SKILL.md)

## Troubleshooting

- **XFA form (looks fillable in Acrobat, no fields detected here):** this Node path handles AcroForm; use the Python fallback workflow.
- **Encrypted PDF:** password-protected PDFs are not supported in v1 of this skill; remove encryption first or use the fallback path.
- **Fields appear blank after fill:** open the output in both Preview and Chrome to verify rendering. If one viewer still hides values, re-run fill and verify `outputPath` in stdout JSON points to the expected file.

## Testing

After running `npm install`, run:

```bash
node verify.js
```

Fixture availability is required for `verify.js`:

- If running from the skill source tree, run it from `rebel-system/skills/utilities/pdf-fill-form/scripts` (it will use `../fixtures/`).
- If running from a copied temp scripts directory, also copy `fixtures/` alongside that scripts directory (so `./fixtures/` exists next to `verify.js`).

This checks the AcroForm path end-to-end against the smoke fixture (`smoke-fillable.pdf`):

1. `check-fillable.js` reports the fixture as fillable with 5 fields.
2. `extract-fields.js` returns all 4 supported field types (text, checkbox, radio_group, choice).
3. `fill-fillable.js` fills the fixture and verifies values persisted correctly.

For visual rendering verification (D10 — fields render populated in third-party viewers), manually open the filled PDF in your PDF viewer and another (e.g. browser PDF viewer) and confirm fields display the expected values.

## Related

- [pdf-read-extract](../pdf-read-extract/SKILL.md)
- [Anthropic PDF skill](../../Anthropic-official-skills/document-skills/pdf/SKILL.md)
- [running-skill-scripts-with-dependencies](../../../help-for-humans/running-skill-scripts-with-dependencies.md)
