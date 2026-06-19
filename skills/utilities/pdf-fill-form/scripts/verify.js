#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

const SKILL_SCRIPTS_RELATIVE_PATH = 'rebel-system/skills/utilities/pdf-fill-form/scripts';

function buildMissingDependencyError() {
  const error = new Error(
    [
      'Missing dependency: "pdf-lib" is not installed for this scripts copy.',
      'Run:',
      `cp -r ${SKILL_SCRIPTS_RELATIVE_PATH} /tmp/pdf-fill-form-stage3-test`,
      'cd /tmp/pdf-fill-form-stage3-test',
      'npm install',
      'node verify.js',
    ].join('\n')
  );
  error.code = 'MISSING_DEPENDENCY';
  return error;
}

function assertPdfLibInstalled() {
  const localNodeModules = path.resolve(__dirname, 'node_modules');
  const localPdfLibPackage = path.resolve(localNodeModules, 'pdf-lib', 'package.json');

  if (!fs.existsSync(localPdfLibPackage)) {
    throw buildMissingDependencyError();
  }

  try {
    require.resolve('pdf-lib', { paths: [localNodeModules] });
  } catch (_error) {
    throw buildMissingDependencyError();
  }
}

function resolveFixturePath(filename) {
  const candidates = [
    path.resolve(__dirname, '..', 'fixtures', filename),
    path.resolve(__dirname, 'fixtures', filename),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  const error = new Error(
    `Fixture ${filename} not found. Tried:\n  ${candidates.join(
      '\n  '
    )}\nCopy the fixtures/ folder from the skill into your temp dir.`
  );
  error.code = 'MISSING_FIXTURE';
  throw error;
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

async function verify() {
  assertPdfLibInstalled();

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
    os.tmpdir(),
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

module.exports = { verify, valuesMatch, assertPdfLibInstalled, resolveFixturePath };

if (require.main === module) {
  (async () => {
    try {
      const result = await verify();
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
        console.log(
          `\nNext step: open ${result.filledPdfPath} in Preview + Chrome and confirm all fields render populated (D10 visual acceptance).`
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
      process.exit(error && error.code === 'MISSING_DEPENDENCY' ? 2 : 1);
    }
  })();
}
