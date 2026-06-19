#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName } = require('pdf-lib');

function usage() {
  return [
    'Usage: node check-fillable.js <path-to-pdf>',
    'Example: node check-fillable.js ~/Desktop/form.pdf',
  ].join('\n');
}

function isEncryptionError(error) {
  if (!error) return false;
  const message = String(error.message || error).toLowerCase();
  return message.includes('encrypted') || message.includes('password');
}

function hasXfaInDictionary(dict) {
  if (!dict || typeof dict.get !== 'function') return false;
  const xfa = dict.get(PDFName.of('XFA'));
  return Boolean(xfa);
}

function hasXfaForm(doc) {
  if (!doc || !doc.catalog || typeof doc.catalog.get !== 'function') return false;

  if (hasXfaInDictionary(doc.catalog)) {
    return true;
  }

  const acroFormRef = doc.catalog.get(PDFName.of('AcroForm'));
  if (!acroFormRef) return false;

  let acroFormDict = null;
  try {
    acroFormDict = doc.context.lookup(acroFormRef);
  } catch (_error) {
    acroFormDict = null;
  }

  return hasXfaInDictionary(acroFormDict);
}

async function checkFillable(pdfPath) {
  if (!pdfPath) {
    throw new Error('Missing PDF path');
  }

  const absolutePdfPath = path.resolve(pdfPath);
  const bytes = fs.readFileSync(absolutePdfPath);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });

  if (hasXfaForm(doc)) {
    const error = new Error(
      "This PDF uses XFA forms (Adobe LiveCycle). pdf-lib doesn't support XFA. Fall back to the Anthropic Python PDF skill, or convert the PDF in Acrobat first (Tools → Forms → Convert)."
    );
    error.code = 'XFA_FORM';
    throw error;
  }

  const fieldCount = doc.getForm().getFields().length;

  return {
    fillable: fieldCount > 0,
    fieldCount,
    pdfPath: absolutePdfPath,
  };
}

async function main(argv) {
  const pdfPath = argv[2];

  if (pdfPath === '--help' || pdfPath === '-h') {
    console.log(usage());
    return;
  }

  if (!pdfPath) {
    console.error(usage());
    process.exit(1);
    return;
  }

  try {
    const result = await checkFillable(pdfPath);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    const absolutePdfPath = path.resolve(pdfPath);

    if (error && error.code === 'XFA_FORM') {
      console.log(
        JSON.stringify(
          {
            fillable: false,
            error: 'xfa_form',
            message:
              "This PDF uses XFA forms (Adobe LiveCycle). pdf-lib doesn't support XFA. Fall back to the Anthropic Python PDF skill, or convert the PDF in Acrobat first (Tools → Forms → Convert).",
            pdfPath: absolutePdfPath,
          },
          null,
          2
        )
      );
      process.exit(2);
      return;
    }

    if (isEncryptionError(error)) {
      console.log(
        JSON.stringify(
          {
            fillable: false,
            error: 'encrypted',
            message:
              'PDF is password-protected; not supported in v1. Fall back to the Anthropic Python skill or remove the password first.',
            pdfPath: absolutePdfPath,
          },
          null,
          2
        )
      );
      process.exit(2);
      return;
    }

    console.error(
      JSON.stringify(
        {
          fillable: false,
          error: 'load_failed',
          message: String(error.message || error),
          pdfPath: absolutePdfPath,
        },
        null,
        2
      )
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main(process.argv);
}

module.exports = { checkFillable, isEncryptionError, hasXfaForm };
