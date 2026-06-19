#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  PDFDocument,
  PDFTextField,
  PDFCheckBox,
  PDFRadioGroup,
  PDFOptionList,
  PDFDropdown,
  StandardFonts,
  PDFName,
  PDFBool,
} = require('pdf-lib');
const { extractFields, hasXfaForm } = require('./extract-fields');

const XFA_UNSUPPORTED_MESSAGE =
  "This PDF uses XFA forms (Adobe LiveCycle). pdf-lib doesn't support XFA. Fall back to the Anthropic Python PDF skill, or convert the PDF in Acrobat first (Tools → Forms → Convert).";

function usage() {
  return [
    'Usage: node fill-fillable.js <path-to-pdf> <field-values.json> [--output <path>] [--flatten]',
    'Example: node fill-fillable.js ~/Desktop/form.pdf ./field_values.json --flatten',
  ].join('\n');
}

function isEncryptionError(error) {
  if (!error) return false;
  const message = String(error.message || error).toLowerCase();
  return message.includes('encrypted') || message.includes('password');
}

function normalizeString(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value.replace(/^\//, '');
  if (typeof value.decodeText === 'function') return String(value.decodeText());
  return String(value).replace(/^\//, '');
}

function normalizeStem(sourcePath) {
  const ext = path.extname(sourcePath);
  return path.basename(sourcePath, ext || undefined);
}

function isTempLikeDirectory(sourceDir) {
  const lower = sourceDir.toLowerCase().replace(/\\/g, '/');
  const home = os.homedir().toLowerCase().replace(/\\/g, '/');

  if (lower.startsWith('/tmp') || lower.startsWith('/var/folders') || lower.startsWith('/private/var')) {
    return true;
  }
  if (lower.includes('/library/containers')) {
    return true;
  }
  if (lower.includes('/appdata/local/temp') || lower.includes('/temp/')) {
    return true;
  }
  if (lower.startsWith(`${home}/library/containers`)) {
    return true;
  }
  return false;
}

function canWriteDirectory(directoryPath) {
  try {
    fs.accessSync(directoryPath, fs.constants.W_OK);
    return true;
  } catch (_error) {
    return false;
  }
}

function pickOutputPath(sourcePath, overridePath) {
  const absoluteSourcePath = path.resolve(sourcePath);
  const sourceDir = path.dirname(absoluteSourcePath);
  const stem = normalizeStem(absoluteSourcePath);
  const candidates = [];
  const seen = new Set();
  const addCandidate = (candidatePath, fallback) => {
    const resolvedPath = path.resolve(candidatePath);
    if (seen.has(resolvedPath)) return;
    seen.add(resolvedPath);
    candidates.push({ path: resolvedPath, fallback });
  };

  if (overridePath) {
    addCandidate(overridePath, 'override');
  }

  const nextToSource = path.join(sourceDir, `${stem}-filled.pdf`);
  if (!isTempLikeDirectory(sourceDir) && canWriteDirectory(sourceDir)) {
    addCandidate(nextToSource, 'next-to-source');
  }

  const desktop = path.join(os.homedir(), 'Desktop');
  if (canWriteDirectory(desktop)) {
    addCandidate(path.join(desktop, `${stem}-filled.pdf`), 'desktop');
  }

  addCandidate(path.join(os.tmpdir(), `${stem}-filled.pdf`), 'tmp');
  return candidates;
}

async function writeToFallbackChain(candidates, bytes) {
  const errors = [];

  for (const candidate of candidates) {
    const filePath = path.resolve(candidate.path);

    try {
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, bytes);
      return { outputPath: filePath, outputPathFallback: candidate.fallback };
    } catch (err) {
      errors.push({
        path: filePath,
        fallback: candidate.fallback,
        error: (err && (err.code || err.message)) || String(err),
      });
    }
  }

  const error = new Error(`All output paths failed: ${JSON.stringify(errors)}`);
  error.code = 'NO_WRITABLE_OUTPUT';
  error.attemptedPaths = errors;
  throw error;
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (!args.length || args[0] === '--help' || args[0] === '-h') {
    return { help: true };
  }

  if (args.length < 2) {
    throw new Error('Missing required arguments');
  }

  const pdfPath = args[0];
  const fieldValuesPath = args[1];
  let outputPath = null;
  let flatten = false;

  for (let i = 2; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--flatten') {
      flatten = true;
      continue;
    }
    if (arg === '--output') {
      const outputArg = args[i + 1];
      if (!outputArg) {
        throw new Error('Missing value after --output');
      }
      outputPath = outputArg;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    help: false,
    pdfPath,
    fieldValuesPath,
    outputPath,
    flatten,
  };
}

function buildValidationError(message, fieldId) {
  return { field_id: fieldId || null, message };
}

function buildRuntimeError(fieldId, fieldType, reason, message) {
  return {
    field_id: fieldId || null,
    type: fieldType || null,
    reason,
    message,
  };
}

function createXfaFormError() {
  const error = new Error(XFA_UNSUPPORTED_MESSAGE);
  error.code = 'XFA_FORM';
  return error;
}

function extractOptionValue(option) {
  if (option === null || option === undefined) return null;
  if (Array.isArray(option)) return normalizeString(option[0]);
  if (typeof option === 'object' && Object.prototype.hasOwnProperty.call(option, 'value')) {
    return normalizeString(option.value);
  }
  return normalizeString(option);
}

function optionValues(options) {
  if (!Array.isArray(options)) return [];
  return options.map(extractOptionValue).filter((value) => Boolean(value));
}

function validateCheckboxValue(fieldInfo, value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return null;
  if (typeof value !== 'string') {
    return `Invalid value type for checkbox "${fieldInfo.field_id}". Use true/false or "${fieldInfo.checked_value}"/"${fieldInfo.unchecked_value}".`;
  }

  const normalizedValue = normalizeString(value);
  const accepted = [
    normalizeString(fieldInfo.checked_value),
    normalizeString(fieldInfo.unchecked_value),
  ].filter(Boolean);

  if (!accepted.includes(normalizedValue)) {
    return `Invalid value "${value}" for checkbox "${fieldInfo.field_id}". Valid values: true, false, "${fieldInfo.checked_value}", "${fieldInfo.unchecked_value}".`;
  }
  return null;
}

function validateChoiceValue(fieldInfo, value, fieldTypeName, options) {
  const validValues = optionValues(options);
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') {
    return `Invalid value type for ${fieldTypeName} "${fieldInfo.field_id}". Use one of: ${JSON.stringify(validValues)}.`;
  }
  const normalizedValue = normalizeString(value);
  if (!validValues.includes(normalizedValue)) {
    return `Invalid value "${value}" for ${fieldTypeName} "${fieldInfo.field_id}". Valid values: ${JSON.stringify(validValues)}.`;
  }
  return null;
}

function validateTextValue(fieldInfo, value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') {
    return `Invalid value type for text field "${fieldInfo.field_id}". Use a string or null.`;
  }
  if (typeof fieldInfo.max_length === 'number' && value.length > fieldInfo.max_length) {
    return `Value for text field "${fieldInfo.field_id}" exceeds max_length=${fieldInfo.max_length}.`;
  }
  return null;
}

function validateFieldValues(fieldInfos, fieldValues) {
  const errors = [];
  const fieldInfoById = new Map(fieldInfos.map((field) => [field.field_id, field]));
  const seenFieldIds = new Set();

  if (!Array.isArray(fieldValues)) {
    return [buildValidationError('field_values.json must contain a JSON array.')];
  }

  fieldValues.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(buildValidationError(`Entry at index ${index} must be an object.`));
      return;
    }

    const hasFieldId = Object.prototype.hasOwnProperty.call(entry, 'field_id');
    const hasValue = Object.prototype.hasOwnProperty.call(entry, 'value');
    if (!hasFieldId || typeof entry.field_id !== 'string' || !entry.field_id.trim()) {
      errors.push(buildValidationError(`Entry at index ${index} is missing a valid "field_id".`));
      return;
    }
    if (seenFieldIds.has(entry.field_id)) {
      errors.push(
        buildValidationError(
          'Duplicate field_id in field_values.json — each field must appear at most once.',
          entry.field_id
        )
      );
      return;
    }
    seenFieldIds.add(entry.field_id);

    if (!hasValue) {
      errors.push(buildValidationError(`Entry for "${entry.field_id}" is missing "value".`, entry.field_id));
      return;
    }

    const fieldInfo = fieldInfoById.get(entry.field_id);
    if (!fieldInfo) {
      errors.push(buildValidationError(`"${entry.field_id}" is not a valid field ID.`, entry.field_id));
      return;
    }

    let validationMessage = null;
    if (fieldInfo.type === 'checkbox') {
      validationMessage = validateCheckboxValue(fieldInfo, entry.value);
    } else if (fieldInfo.type === 'radio_group') {
      validationMessage = validateChoiceValue(fieldInfo, entry.value, 'radio group', fieldInfo.radio_options);
    } else if (fieldInfo.type === 'choice') {
      validationMessage = validateChoiceValue(
        fieldInfo,
        entry.value,
        'choice field',
        fieldInfo.choice_options
      );
    } else if (fieldInfo.type === 'text') {
      validationMessage = validateTextValue(fieldInfo, entry.value);
    }

    if (validationMessage) {
      errors.push(buildValidationError(validationMessage, entry.field_id));
    }
  });

  return errors;
}

function coerceCheckboxToBoolean(fieldInfo, value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'boolean') return value;

  const normalizedValue = normalizeString(value);
  return normalizedValue === normalizeString(fieldInfo.checked_value);
}

function resolveCanonicalChoiceValue(options, value) {
  if (value === null || value === undefined) return value;
  const normalizedValue = normalizeString(value);
  const list = Array.isArray(options) ? options : [];

  for (const option of list) {
    const candidate = extractOptionValue(option);
    if (candidate === normalizedValue) {
      if (option && typeof option === 'object' && Object.prototype.hasOwnProperty.call(option, 'value')) {
        return option.value;
      }
      return option;
    }
  }
  return value;
}

function ensureNeedAppearances(doc, form) {
  if (form && form.acroForm && form.acroForm.dict && typeof form.acroForm.dict.set === 'function') {
    form.acroForm.dict.set(PDFName.of('NeedAppearances'), PDFBool.True);
    return;
  }

  const acroFormRef = doc.catalog.get(PDFName.of('AcroForm'));
  if (!acroFormRef) return;

  const acroForm = doc.context.lookup(acroFormRef);
  if (acroForm && typeof acroForm.set === 'function') {
    acroForm.set(PDFName.of('NeedAppearances'), PDFBool.True);
  }
}

function buildReadFailure(error) {
  return {
    ok: false,
    reason: 'unreadable',
    message: String((error && error.message) || error || 'Unknown read error'),
  };
}

function readChoiceCurrentValue(field) {
  try {
    if (!field || typeof field.getSelected !== 'function') {
      return { ok: true, value: null };
    }
    const selected = field.getSelected();
    if (Array.isArray(selected)) {
      return { ok: true, value: selected.length ? normalizeString(selected[0]) : null };
    }
    return { ok: true, value: normalizeString(selected) };
  } catch (error) {
    return buildReadFailure(error);
  }
}

function readCheckboxState(field) {
  try {
    return {
      ok: true,
      checked: Boolean(field && typeof field.isChecked === 'function' && field.isChecked()),
    };
  } catch (error) {
    return buildReadFailure(error);
  }
}

function readFieldValueResult(field, fieldInfo) {
  if (!field || !fieldInfo) return { ok: true, value: null };

  if (fieldInfo.type === 'text' && field instanceof PDFTextField) {
    try {
      const text = field.getText();
      return {
        ok: true,
        value: text === null || text === undefined ? '' : String(text),
      };
    } catch (error) {
      return buildReadFailure(error);
    }
  }

  if (fieldInfo.type === 'checkbox' && field instanceof PDFCheckBox) {
    const checkboxState = readCheckboxState(field);
    if (!checkboxState.ok) return checkboxState;
    return { ok: true, value: checkboxState.checked };
  }

  if (fieldInfo.type === 'radio_group' && field instanceof PDFRadioGroup) {
    try {
      const selected = typeof field.getSelected === 'function' ? field.getSelected() : null;
      return { ok: true, value: normalizeString(selected) };
    } catch (error) {
      return buildReadFailure(error);
    }
  }

  if (
    fieldInfo.type === 'choice' &&
    (field instanceof PDFDropdown || field instanceof PDFOptionList)
  ) {
    return readChoiceCurrentValue(field);
  }

  return { ok: true, value: null };
}

function readFieldValue(field, fieldInfo) {
  const result = readFieldValueResult(field, fieldInfo);
  if (!result.ok) return null;
  if (Object.prototype.hasOwnProperty.call(result, 'value')) return result.value;
  return null;
}

function fieldValuesEqual(actual, requested, fieldInfo) {
  if (!fieldInfo) return false;

  if (fieldInfo.type === 'text') {
    const actualText = actual === null || actual === undefined ? '' : String(actual);
    const requestedText = requested === null || requested === undefined ? '' : String(requested);
    return actualText === requestedText;
  }

  if (fieldInfo.type === 'checkbox') {
    if (typeof actual !== 'boolean') return false;
    if (
      typeof requested === 'boolean' ||
      typeof requested === 'string' ||
      requested === null ||
      requested === undefined
    ) {
      return actual === coerceCheckboxToBoolean(fieldInfo, requested);
    }
    return false;
  }

  if (fieldInfo.type === 'radio_group') {
    const actualNormalized = normalizeString(actual);
    if (requested === null || requested === undefined) {
      return actualNormalized === null || actualNormalized === '';
    }

    const expectedValue = normalizeString(requested);
    const validValues = optionValues(fieldInfo.radio_options);
    if (validValues.length > 0 && !validValues.includes(expectedValue)) {
      return false;
    }
    return actualNormalized === expectedValue;
  }

  if (fieldInfo.type === 'choice') {
    const actualNormalized = normalizeString(actual);
    if (requested === null || requested === undefined) {
      return actualNormalized === null || actualNormalized === '';
    }

    const expectedValue = normalizeString(requested);
    const validValues = optionValues(fieldInfo.choice_options);
    if (validValues.length > 0 && !validValues.includes(expectedValue)) {
      return false;
    }
    return actualNormalized === expectedValue;
  }

  return normalizeString(actual) === normalizeString(requested);
}

async function verifyFilledValues(filledBytes, fieldValues, fieldInfoById) {
  const verificationDoc = await PDFDocument.load(filledBytes, { ignoreEncryption: false });
  const verificationForm = verificationDoc.getForm();
  const verificationFieldById = new Map(
    verificationForm.getFields().map((field) => [field.getName(), field])
  );
  const mismatches = [];

  for (const entry of fieldValues) {
    const fieldInfo = fieldInfoById.get(entry.field_id);
    const field = verificationFieldById.get(entry.field_id);
    if (!field || !fieldInfo) {
      mismatches.push({
        field_id: entry.field_id,
        requested: entry.value,
        actual: null,
        type: fieldInfo ? fieldInfo.type : null,
      });
      continue;
    }

    const readResult = readFieldValueResult(field, fieldInfo);
    if (!readResult.ok) {
      mismatches.push({
        field_id: entry.field_id,
        requested: entry.value,
        actual: null,
        type: fieldInfo.type,
        readError: readResult.reason || 'unreadable',
        readErrorMessage: readResult.message || null,
      });
      continue;
    }

    const actual = Object.prototype.hasOwnProperty.call(readResult, 'value')
      ? readResult.value
      : null;

    if (!fieldValuesEqual(actual, entry.value, fieldInfo)) {
      mismatches.push({
        field_id: entry.field_id,
        requested: entry.value,
        actual,
        type: fieldInfo.type,
      });
    }
  }

  return mismatches;
}

async function fillFillable(pdfPath, fieldValuesPath, options = {}) {
  const absolutePdfPath = path.resolve(pdfPath);
  const absoluteFieldValuesPath = path.resolve(fieldValuesPath);
  const extracted = await extractFields(absolutePdfPath);
  const fieldValues = JSON.parse(fs.readFileSync(absoluteFieldValuesPath, 'utf8'));

  const validationErrors = validateFieldValues(extracted.fields, fieldValues);
  if (validationErrors.length) {
    const error = new Error('Field value validation failed');
    error.code = 'VALIDATION_FAILED';
    error.validationErrors = validationErrors;
    throw error;
  }

  const bytes = fs.readFileSync(absolutePdfPath);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
  if (hasXfaForm(doc)) {
    throw createXfaFormError();
  }

  const form = doc.getForm();
  const fieldById = new Map(form.getFields().map((field) => [field.getName(), field]));
  const fieldInfoById = new Map(extracted.fields.map((field) => [field.field_id, field]));
  const warnings = Array.isArray(extracted.warnings) ? [...extracted.warnings] : [];
  const applyErrors = [];
  let appliedFieldCount = 0;

  for (const entry of fieldValues) {
    const field = fieldById.get(entry.field_id);
    const fieldInfo = fieldInfoById.get(entry.field_id);
    if (!field || !fieldInfo) {
      applyErrors.push(
        buildRuntimeError(
          entry.field_id,
          fieldInfo ? fieldInfo.type : null,
          'missing_field',
          `Field "${entry.field_id}" could not be loaded for fill operation.`
        )
      );
      continue;
    }

    const value = entry.value;

    try {
      if (fieldInfo.type === 'text' && field instanceof PDFTextField) {
        field.setText(value === null ? '' : value);
        appliedFieldCount += 1;
        continue;
      }

      if (fieldInfo.type === 'checkbox' && field instanceof PDFCheckBox) {
        const checked = coerceCheckboxToBoolean(fieldInfo, value);
        if (checked) field.check();
        else field.uncheck();
        appliedFieldCount += 1;
        continue;
      }

      if (fieldInfo.type === 'radio_group' && field instanceof PDFRadioGroup) {
        if (value === null || value === undefined) {
          if (typeof field.clear === 'function') {
            field.clear();
            appliedFieldCount += 1;
          } else {
            applyErrors.push(
              buildRuntimeError(
                entry.field_id,
                fieldInfo.type,
                'clear_unsupported',
                `Radio group "${entry.field_id}" does not support clear().`
              )
            );
          }
        } else {
          const canonicalValue = resolveCanonicalChoiceValue(fieldInfo.radio_options || [], value);
          field.select(canonicalValue);
          appliedFieldCount += 1;
        }
        continue;
      }

      if (
        fieldInfo.type === 'choice' &&
        (field instanceof PDFDropdown || field instanceof PDFOptionList)
      ) {
        if (value === null || value === undefined) {
          if (typeof field.clear === 'function') {
            field.clear();
            appliedFieldCount += 1;
          } else {
            applyErrors.push(
              buildRuntimeError(
                entry.field_id,
                fieldInfo.type,
                'clear_unsupported',
                `Choice field "${entry.field_id}" does not support clear().`
              )
            );
          }
        } else {
          const canonicalValue = resolveCanonicalChoiceValue(fieldInfo.choice_options || [], value);
          field.select(canonicalValue);
          appliedFieldCount += 1;
        }
        continue;
      }
    } catch (applyError) {
      applyErrors.push(
        buildRuntimeError(
          entry.field_id,
          fieldInfo.type,
          'apply_failed',
          String(applyError.message || applyError)
        )
      );
      continue;
    }

    applyErrors.push(
      buildRuntimeError(
        entry.field_id,
        fieldInfo.type,
        'type_mismatch',
        `Field "${entry.field_id}" did not match expected type "${fieldInfo.type}".`
      )
    );
  }

  if (applyErrors.length) {
    const error = new Error('One or more field updates could not be applied.');
    error.code = 'APPLY_FAILED';
    error.details = applyErrors;
    throw error;
  }

  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  form.updateFieldAppearances(helvetica);
  ensureNeedAppearances(doc, form);

  const unflattenedBytes = await doc.save();
  const mismatches = await verifyFilledValues(unflattenedBytes, fieldValues, fieldInfoById);
  if (mismatches.length) {
    const error = new Error('Filled PDF does not contain the requested values.');
    error.code = 'VERIFICATION_FAILED';
    error.mismatches = mismatches;
    throw error;
  }

  let finalBytes = unflattenedBytes;
  if (options.flatten) {
    const flattenDoc = await PDFDocument.load(unflattenedBytes, { ignoreEncryption: false });
    const flattenForm = flattenDoc.getForm();
    flattenForm.flatten();
    finalBytes = await flattenDoc.save();
  }

  const outputCandidates = pickOutputPath(absolutePdfPath, options.outputPath || null);
  const writeResult = await writeToFallbackChain(outputCandidates, finalBytes);

  return {
    outputPath: writeResult.outputPath,
    outputPathFallback: writeResult.outputPathFallback,
    fieldsFilled: appliedFieldCount,
    warnings,
  };
}

async function main(argv) {
  let parsedArgs;
  try {
    parsedArgs = parseArgs(argv);
  } catch (error) {
    console.error(usage());
    console.error(String(error.message || error));
    process.exit(1);
    return;
  }

  if (parsedArgs.help) {
    console.log(usage());
    return;
  }

  try {
    const result = await fillFillable(parsedArgs.pdfPath, parsedArgs.fieldValuesPath, {
      outputPath: parsedArgs.outputPath,
      flatten: parsedArgs.flatten,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    if (error && error.code === 'VALIDATION_FAILED') {
      console.error(
        JSON.stringify(
          {
            error: 'validation_failed',
            message: 'Field value validation failed.',
            details: error.validationErrors || [],
          },
          null,
          2
        )
      );
      process.exit(1);
      return;
    }

    if (error && error.code === 'APPLY_FAILED') {
      console.error(
        JSON.stringify(
          {
            error: 'fill_failed',
            message: 'One or more field updates could not be applied.',
            details: error.details || [],
          },
          null,
          2
        )
      );
      process.exit(1);
      return;
    }

    if (error && error.code === 'VERIFICATION_FAILED') {
      console.error(
        JSON.stringify(
          {
            error: 'fill_verification_failed',
            message:
              'Filled PDF does not contain the requested values. pdf-lib may not support this field shape.',
            mismatches: error.mismatches || [],
          },
          null,
          2
        )
      );
      process.exit(3);
      return;
    }

    if (error && error.code === 'XFA_FORM') {
      console.error(
        JSON.stringify(
          {
            error: 'xfa_form',
            message: XFA_UNSUPPORTED_MESSAGE,
            pdfPath: path.resolve(parsedArgs.pdfPath),
          },
          null,
          2
        )
      );
      process.exit(2);
      return;
    }

    if (error && error.code === 'NO_WRITABLE_OUTPUT') {
      console.error(
        JSON.stringify(
          {
            error: 'no_writable_output',
            message: 'Filled PDF could not be written to any candidate output path.',
            attemptedPaths: error.attemptedPaths || [],
          },
          null,
          2
        )
      );
      process.exit(4);
      return;
    }

    if (isEncryptionError(error)) {
      console.error(
        JSON.stringify(
          {
            error: 'encrypted',
            message:
              'PDF is password-protected; not supported in v1. Fall back to the Anthropic Python skill or remove the password first.',
            pdfPath: path.resolve(parsedArgs.pdfPath),
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
          error: 'fill_failed',
          message: String(error.message || error),
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
  fillFillable,
  parseArgs,
  pickOutputPath,
  writeToFallbackChain,
  validateFieldValues,
  ensureNeedAppearances,
  resolveCanonicalChoiceValue,
  readCheckboxState,
  readFieldValue,
  readFieldValueResult,
  fieldValuesEqual,
  verifyFilledValues,
};
