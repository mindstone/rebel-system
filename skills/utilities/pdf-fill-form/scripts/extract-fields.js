#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {
  PDFDocument,
  PDFTextField,
  PDFCheckBox,
  PDFRadioGroup,
  PDFOptionList,
  PDFDropdown,
  PDFName,
} = require('pdf-lib');

const XFA_UNSUPPORTED_MESSAGE =
  "This PDF uses XFA forms (Adobe LiveCycle). pdf-lib doesn't support XFA. Fall back to the Anthropic Python PDF skill, or convert the PDF in Acrobat first (Tools → Forms → Convert).";

function usage() {
  return [
    'Usage: node extract-fields.js <path-to-pdf>',
    'Example: node extract-fields.js ~/Desktop/form.pdf',
  ].join('\n');
}

function isEncryptionError(error) {
  if (!error) return false;
  const message = String(error.message || error).toLowerCase();
  return message.includes('encrypted') || message.includes('password');
}

function createXfaFormError() {
  const error = new Error(XFA_UNSUPPORTED_MESSAGE);
  error.code = 'XFA_FORM';
  return error;
}

function normalizeString(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value.replace(/^\//, '');
  if (typeof value.decodeText === 'function') return String(value.decodeText());
  return String(value).replace(/^\//, '');
}

function toNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value && typeof value.asNumber === 'function') {
    const parsed = value.asNumber();
    if (typeof parsed === 'number' && Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function readFlagValue(dict, key) {
  if (!dict || typeof dict.get !== 'function') return 0;
  const raw = dict.get(PDFName.of(key));
  const parsed = toNumber(raw);
  return parsed === null ? 0 : parsed;
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

function pushWarning(warnings, fieldId, reason, message) {
  warnings.push({
    field_id: fieldId || null,
    reason,
    message,
  });
}

function normalizeRect(rect) {
  if (!rect) return null;

  if (Array.isArray(rect) && rect.length === 4) {
    const parsed = rect.map(toNumber);
    if (parsed.every((n) => n !== null)) return parsed;
    return null;
  }

  const x = toNumber(rect.x);
  const y = toNumber(rect.y);
  const width = toNumber(rect.width);
  const height = toNumber(rect.height);
  if (x !== null && y !== null && width !== null && height !== null) {
    return [x, y, x + width, y + height];
  }

  const x1 = toNumber(rect.x1);
  const y1 = toNumber(rect.y1);
  const x2 = toNumber(rect.x2);
  const y2 = toNumber(rect.y2);
  if (x1 !== null && y1 !== null && x2 !== null && y2 !== null) {
    return [x1, y1, x2, y2];
  }

  return null;
}

function buildPageByWidgetRef(doc) {
  const pageByWidgetRef = new Map();
  const pageByWidgetDict = new WeakMap();
  const pageByPageRef = new Map();

  doc.getPages().forEach((page, pageIndex) => {
    if (page.ref) {
      pageByPageRef.set(String(page.ref), pageIndex + 1);
    }

    const annots = typeof page.node.Annots === 'function' ? page.node.Annots() : null;
    if (!annots || typeof annots.asArray !== 'function') return;

    for (const annotRef of annots.asArray()) {
      pageByWidgetRef.set(String(annotRef), pageIndex + 1);
      const annotDict = doc.context.lookup(annotRef);
      if (annotDict && typeof annotDict === 'object') {
        pageByWidgetDict.set(annotDict, pageIndex + 1);
      }
    }
  });

  return {
    pageByWidgetRef,
    pageByWidgetDict,
    pageByPageRef,
  };
}

function deriveWidgetOnValue(widget) {
  if (!widget || !widget.dict || typeof widget.dict.lookup !== 'function') return null;
  try {
    const ap = widget.dict.lookup(PDFName.of('AP'));
    if (!ap || typeof ap.lookup !== 'function') return null;
    const normal = ap.lookup(PDFName.of('N'));
    if (!normal || typeof normal.keys !== 'function') return null;

    for (const key of normal.keys()) {
      const value = normalizeString(key);
      if (value && value !== 'Off') return value;
    }
  } catch (_error) {
    // Best-effort only.
  }
  return null;
}

function getWidgetPage(widget, pageLookup) {
  if (!widget || !pageLookup) return null;

  if (widget.ref && pageLookup.pageByWidgetRef.has(String(widget.ref))) {
    return pageLookup.pageByWidgetRef.get(String(widget.ref)) || null;
  }

  if (widget.dict && pageLookup.pageByWidgetDict.has(widget.dict)) {
    return pageLookup.pageByWidgetDict.get(widget.dict) || null;
  }

  if (widget.dict && typeof widget.dict.get === 'function') {
    const pageRef = widget.dict.get(PDFName.of('P'));
    if (pageRef && pageLookup.pageByPageRef.has(String(pageRef))) {
      return pageLookup.pageByPageRef.get(String(pageRef)) || null;
    }
  }

  return null;
}

function getWidgetRect(widget) {
  if (!widget || typeof widget.getRectangle !== 'function') return null;
  return normalizeRect(widget.getRectangle());
}

function getFieldFlags(field) {
  if (!field || !field.acroField) return 0;
  if (typeof field.acroField.getFlags === 'function') {
    try {
      const flags = field.acroField.getFlags();
      if (typeof flags === 'number' && Number.isFinite(flags)) return flags;
    } catch (_error) {
      // Best-effort only.
    }
  }
  return readFlagValue(field.acroField.dict, 'Ff');
}

function getWidgetFlags(widget) {
  if (!widget || !widget.dict) return 0;
  return readFlagValue(widget.dict, 'F');
}

function isRequiredField(field) {
  return (getFieldFlags(field) & 2) !== 0;
}

function isHiddenWidget(widget) {
  return (getWidgetFlags(widget) & 2) !== 0;
}

function isChoiceEditable(field) {
  return (getFieldFlags(field) & (1 << 18)) !== 0;
}

function deriveCheckboxValues(field, widgets) {
  let checkedValue = null;
  let uncheckedValue = 'Off';

  try {
    if (field.acroField && typeof field.acroField.getOnValue === 'function') {
      checkedValue = normalizeString(field.acroField.getOnValue());
    }
  } catch (_error) {
    // Best-effort only.
  }

  if (!checkedValue) {
    for (const widget of widgets) {
      const widgetValue = deriveWidgetOnValue(widget);
      if (widgetValue) {
        checkedValue = widgetValue;
        break;
      }
    }
  }

  if (!checkedValue) checkedValue = 'Yes';

  return {
    checkedValue,
    uncheckedValue,
  };
}

function getCheckboxCurrentValue(field, checkedValue, uncheckedValue) {
  try {
    if (field.acroField && typeof field.acroField.getValue === 'function') {
      const rawValue = normalizeString(field.acroField.getValue());
      if (rawValue) return rawValue;
    }
  } catch (_error) {
    // Best-effort only.
  }

  try {
    return field.isChecked() ? checkedValue : uncheckedValue;
  } catch (_error) {
    return null;
  }
}

function normalizeChoiceOptions(options) {
  if (!Array.isArray(options)) return [];

  return options
    .map((option) => {
      if (Array.isArray(option)) return normalizeString(option[0]);
      if (option && typeof option === 'object') {
        if ('value' in option) return normalizeString(option.value);
        if ('display' in option) return normalizeString(option.display);
      }
      return normalizeString(option);
    })
    .filter((value) => Boolean(value));
}

function getChoiceCurrentValue(field) {
  if (!field || typeof field.getSelected !== 'function') return null;
  const selected = field.getSelected();
  if (Array.isArray(selected)) return selected.length ? normalizeString(selected[0]) : null;
  return normalizeString(selected);
}

function buildFieldEntry(field, pageLookup, warnings) {
  const fieldId = field.getName();
  const widgets = field.acroField.getWidgets();

  if (!widgets || widgets.length === 0) {
    pushWarning(
      warnings,
      fieldId,
      'missing_widget',
      `Skipped "${fieldId}" because it has no widget annotations.`
    );
    return null;
  }

  const firstWidget = widgets[0];
  const page = getWidgetPage(firstWidget, pageLookup);
  const rect = getWidgetRect(firstWidget);
  const required = isRequiredField(field);
  const hidden = isHiddenWidget(firstWidget);

  if (page === null) {
    pushWarning(
      warnings,
      fieldId,
      'missing_page',
      `Skipped "${fieldId}" because page mapping could not be determined from widget annotations.`
    );
    return null;
  }
  if (rect === null) {
    pushWarning(
      warnings,
      fieldId,
      'missing_rect',
      `Skipped "${fieldId}" because widget rectangle data is missing or invalid.`
    );
    return null;
  }

  if (field instanceof PDFTextField) {
    const maxLength = typeof field.getMaxLength === 'function' ? field.getMaxLength() : null;
    return {
      field_id: fieldId,
      page,
      rect,
      type: 'text',
      current_value: normalizeString(field.getText()),
      max_length: typeof maxLength === 'number' ? maxLength : null,
      required,
      hidden,
    };
  }

  if (field instanceof PDFCheckBox) {
    const checkboxValues = deriveCheckboxValues(field, widgets);
    return {
      field_id: fieldId,
      page,
      rect,
      type: 'checkbox',
      checked_value: checkboxValues.checkedValue,
      unchecked_value: checkboxValues.uncheckedValue,
      current_value: getCheckboxCurrentValue(
        field,
        checkboxValues.checkedValue,
        checkboxValues.uncheckedValue
      ),
      required,
      hidden,
    };
  }

  if (field instanceof PDFRadioGroup) {
    const groupOptions = Array.isArray(field.getOptions()) ? field.getOptions() : [];
    const radioOptions = widgets.map((widget, index) => {
      const value =
        normalizeString(groupOptions[index]) || deriveWidgetOnValue(widget) || `option_${index + 1}`;
      return {
        value,
        text: value,
        rect: getWidgetRect(widget),
      };
    });

    return {
      field_id: fieldId,
      page,
      rect,
      type: 'radio_group',
      radio_options: radioOptions,
      current_value: normalizeString(
        typeof field.getSelected === 'function' ? field.getSelected() : null
      ),
      required,
      hidden,
    };
  }

  if (field instanceof PDFOptionList || field instanceof PDFDropdown) {
    const choiceOptions = normalizeChoiceOptions(field.getOptions()).map((value) => ({
      value,
      text: value,
    }));

    return {
      field_id: fieldId,
      page,
      rect,
      type: 'choice',
      choice_options: choiceOptions,
      current_value: getChoiceCurrentValue(field),
      required,
      hidden,
      editable: isChoiceEditable(field),
    };
  }

  pushWarning(
    warnings,
    fieldId,
    'unsupported_type',
    `Skipped "${fieldId}" because its field type is unsupported in v1.`
  );
  return null;
}

function sortFields(fields) {
  return [...fields].sort((left, right) => {
    const leftPage = left.page || Number.MAX_SAFE_INTEGER;
    const rightPage = right.page || Number.MAX_SAFE_INTEGER;
    if (leftPage !== rightPage) return leftPage - rightPage;

    const leftRect = left.rect || (left.radio_options && left.radio_options[0]?.rect) || [0, 0, 0, 0];
    const rightRect =
      right.rect || (right.radio_options && right.radio_options[0]?.rect) || [0, 0, 0, 0];
    if (leftRect[1] !== rightRect[1]) return rightRect[1] - leftRect[1];
    return leftRect[0] - rightRect[0];
  });
}

async function extractFields(pdfPath) {
  if (!pdfPath) {
    throw new Error('Missing PDF path');
  }

  const absolutePdfPath = path.resolve(pdfPath);
  const bytes = fs.readFileSync(absolutePdfPath);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });

  if (hasXfaForm(doc)) {
    throw createXfaFormError();
  }

  const form = doc.getForm();
  const fields = form.getFields();

  const pageLookup = buildPageByWidgetRef(doc);
  const warnings = [];
  const extracted = [];

  for (const field of fields) {
    const entry = buildFieldEntry(field, pageLookup, warnings);
    if (entry) extracted.push(entry);
  }

  return {
    fields: sortFields(extracted),
    warnings,
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
    const result = await extractFields(pdfPath);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    if (error && error.code === 'XFA_FORM') {
      console.error(
        JSON.stringify(
          {
            error: 'xfa_form',
            message: XFA_UNSUPPORTED_MESSAGE,
            pdfPath: path.resolve(pdfPath),
          },
          null,
          2
        )
      );
      process.exit(2);
      return;
    }

    if (isEncryptionError(error)) {
      console.error(
        JSON.stringify(
          {
            error: 'encrypted',
            message:
              'PDF is password-protected; not supported in v1. Fall back to the Anthropic Python skill or remove the password first.',
            pdfPath: path.resolve(pdfPath),
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
          error: 'extract_failed',
          message: String(error.message || error),
          pdfPath: path.resolve(pdfPath),
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

module.exports = {
  extractFields,
  hasXfaForm,
  createXfaFormError,
  buildPageByWidgetRef,
  buildFieldEntry,
  normalizeChoiceOptions,
  deriveCheckboxValues,
  readFlagValue,
};
