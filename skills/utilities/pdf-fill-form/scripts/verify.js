#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

function resolveFixturePath(filename) {
  const fixture = path.resolve(__dirname, '..', 'fixtures', filename);
  if (!fs.existsSync(fixture)) throw new Error('A built-in PDF verification fixture was not found. Report this installation problem.');
  return fixture;
}

function valuesMatch(requested, actual, type) {
  if (type === 'checkbox') {
    const requestedBool =
      requested === true ||
      requested === 'Yes' ||
      String(requested).toLowerCase() === 'true';
    const actualBool = actual === true || actual === 'Yes' || String(actual).toLowerCase() === 'true';
    return requestedBool === actualBool;
  }

  if (requested === null || requested === undefined) {
    return actual === null || actual === undefined || String(actual) === '';
  }

  return String(actual) === String(requested);
}

function pushFailed(results, payload) {
  results.failed.push(payload);
}

function hasStepFailure(results, step) {
  return results.failed.some((entry) => entry.step === step);
}

async function verify(outputDirectory = os.tmpdir()) {
  const { checkFillable } = require('./check-fillable');
  const { extractFields } = require('./extract-fields');
  const { fillFillable } = require('./fill-fillable');

  const fixturePdfPath = resolveFixturePath('smoke-fillable.pdf');
  const fixtureValuesPath = resolveFixturePath('expected-field-values.json');

  const results = {
    fixturePdfPath,
    fixtureValuesPath,
    filledPdfPath: null,
    passed: [],
    failed: [],
  };

  const fieldValues = JSON.parse(fs.readFileSync(fixtureValuesPath, 'utf8'));

  // 1) check-fillable
  const check = await checkFillable(fixturePdfPath);
  if (check.fillable !== true || check.fieldCount < 5) {
    pushFailed(results, {
      step: 'check-fillable',
      expected: '{ fillable: true, fieldCount: >= 5 }',
      actual: check,
    });
  } else {
    results.passed.push('check-fillable');
  }

  // 2) extract-fields
  const extracted = await extractFields(fixturePdfPath);
  const typeCounts = extracted.fields.reduce((acc, field) => {
    const type = field.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const requiredTypes = ['text', 'checkbox', 'radio_group', 'choice'];
  const missingTypes = requiredTypes.filter((type) => !typeCounts[type]);
  const hasTwoTextFields = (typeCounts.text || 0) >= 2;
  if (extracted.fields.length < 5 || missingTypes.length || !hasTwoTextFields) {
    pushFailed(results, {
      step: 'extract-fields',
      expected: {
        minFieldCount: 5,
        requiredTypes,
        minTextFields: 2,
      },
      actual: {
        fieldCount: extracted.fields.length,
        typeCounts,
      },
    });
  } else {
    results.passed.push('extract-fields');
  }

  // 3) fill-fillable
  const tmpOut = path.resolve(
    outputDirectory,
    `pdf-fill-form-verify-${process.pid}-${Date.now()}.pdf`
  );
  const fillResult = await fillFillable(fixturePdfPath, fixtureValuesPath, {
    outputPath: tmpOut,
    flatten: false,
  });
  results.filledPdfPath = tmpOut;

  if (
    path.resolve(fillResult.outputPath || '') !== tmpOut ||
    fillResult.fieldsFilled !== fieldValues.length
  ) {
    pushFailed(results, {
      step: 'fill-fillable',
      expected: {
        outputPath: tmpOut,
        fieldsFilled: fieldValues.length,
      },
      actual: fillResult,
    });
  } else {
    results.passed.push('fill-fillable');
  }

  // 4) re-extract and verify values persisted
  const refilled = await extractFields(tmpOut);
  const fieldMap = Object.fromEntries(refilled.fields.map((field) => [field.field_id, field]));
  for (const { field_id, value } of fieldValues) {
    const field = fieldMap[field_id];
    const actual = field?.current_value;
    if (!valuesMatch(value, actual, field?.type)) {
      pushFailed(results, {
        step: 're-extract-verify',
        field_id,
        expected: value,
        actual,
      });
    }
  }
  if (!hasStepFailure(results, 're-extract-verify')) {
    results.passed.push('re-extract-verify');
  }

  return results;
}

module.exports = { verify, valuesMatch, resolveFixturePath };

if (require.main === module) {
  (async () => {
    try {
      const result = await verify(process.argv[2]);
      if (result.failed.length === 0) {
        console.log(
          JSON.stringify(
            {
              verdict: 'pass',
              passed: result.passed,
              fixturePdfPath: result.fixturePdfPath,
              filledPdfPath: result.filledPdfPath,
            },
            null,
            2
          )
        );
        process.exit(0);
      }

      console.error(
        JSON.stringify(
          {
            verdict: 'fail',
            failed: result.failed,
            passed: result.passed,
            fixturePdfPath: result.fixturePdfPath,
            filledPdfPath: result.filledPdfPath,
          },
          null,
          2
        )
      );
      process.exit(1);
    } catch (error) {
      console.error(
        JSON.stringify(
          {
            verdict: 'error',
            code: error && error.code ? error.code : 'VERIFY_ERROR',
            error: String((error && error.message) || error),
            stack: error && error.stack ? error.stack : null,
          },
          null,
          2
        )
      );
      process.exit(1);
    }
  })();
}
