const fs = require('node:fs');
const path = require('node:path');
function missingBundle() {
  throw new Error("Rebel's built-in document libraries were not found. This is a problem with the Rebel installation, not with your file: report it, and don't try to install packages.");
}
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES || missingBundle(), 'x.js'));
const ExcelJS = bundled('exceljs');
const ironcalc = bundled('@ironcalc/wasm');
ironcalc.initSync({ module: fs.readFileSync(bundled.resolve('@ironcalc/wasm/wasm_bg.wasm')) });

function excelDate(date) {
  return date.getTime() / 86400000 + 25569;
}

function inputFor(cell) {
  if (cell.formula) return `=${cell.formula}`;
  const value = cell.value;
  if (value instanceof Date) {
    // IronCalc has no fictitious 29 Feb 1900, so for serials 1 to 60 (January and February 1900) it disagrees with Excel. Times and durations below 1 day agree.
    if (value.getTime() >= Date.UTC(1899, 11, 31) && value.getTime() < Date.UTC(1900, 2, 1)) throw new Error(`Dates or durations in January or February 1900 cannot be recalculated (${cell.worksheet.name}!${cell.address}). Open the workbook in Excel to calculate it; no output was written.`);
    return String(excelDate(value));
  }
  if (typeof value === 'string') return `'${value}`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null) return '';
  const text = value.hyperlink ? (value.text ?? '') : value;
  if (text.richText) return `'${text.richText.map(run => run.text).join('')}`;
  if (value.hyperlink) return text === '' ? '' : `'${text}`;
  if (value.error) return value.error;
  throw new Error(`Unsupported cell value at ${cell.worksheet.name}!${cell.address}`);
}

function computedResult(model, sheet, row, column) {
  const type = model.getCellType(sheet, row, column);
  // IronCalc types: 1 number, 2 text, 4 boolean, 16 error.
  if (type === 1) {
    // IronCalc has no raw-number getter, so read the result at Excel's 15 significant digits (General shows only nine decimals; 17 digits turn 7*2 into 13.9999999999999).
    // When the mantissa rounds up to 10 its formatter prints "0.00000000000000E+015" for 999999999999998; one more digit then shows "0.999999999999998E+015".
    // Anything in neither shape is left uncached and reported.
    const read = numFmt => {
      model.updateRangeStyle({ sheet, row, column, width: 1, height: 1 }, 'num_fmt', numFmt);
      return model.getFormattedCellValue(sheet, row, column);
    };
    let text = read('0.00000000000000E+000');
    if (!/^-?(?:[1-9]\.\d{14}E[+-]\d{3}|0\.0{14}E\+000)$/.test(text)) {
      text = read('0.000000000000000E+000');
      if (!/^-?0\.[1-9]\d{14}E[+-]\d{3}$/.test(text)) return undefined;
    }
    const number = Number(text);
    return Number.isFinite(number) ? number : undefined;
  }
  if (type === 2) return model.getFormattedCellValue(sheet, row, column);
  if (type === 4) {
    const text = model.getFormattedCellValue(sheet, row, column);
    return text === 'TRUE' ? true : text === 'FALSE' ? false : undefined;
  }
  return undefined;
}

function recalculateWorkbook(workbook) {
  // IronCalc 0.9.1 has no calendar setting. Numeric serials and date-producing
  // formulas cannot safely be translated by looking only at cell formatting.
  if (workbook.properties.date1904) throw new Error('1904-calendar workbooks cannot be recalculated. Open the workbook in Excel to calculate it; no output was written.');
  const model = new ironcalc.Model('Recalculation', 'en', 'UTC', 'en');
  const formulas = [];
  const notRecalculated = [];
  let temporaryPrefix = '__rebel_recalc_';
  while (workbook.worksheets.some(sheet => sheet.name.toLowerCase().startsWith(temporaryPrefix))) temporaryPrefix += '_';
  try {
    // Create and name every sheet before loading cross-sheet references.
    workbook.worksheets.forEach((sheet, index) => {
      if (index > 0) model.newSheet();
      model.renameSheet(index, `${temporaryPrefix}${index}`);
    });
    workbook.worksheets.forEach((sheet, index) => model.renameSheet(index, sheet.name));
    workbook.worksheets.forEach((sheet, index) => sheet.eachRow(row => row.eachCell(cell => {
      // A merged block's value lives only in its top-left cell; the others are empty to Excel.
      if (cell.type === ExcelJS.ValueType.Merge) return;
      model.setUserInput(index, cell.row, cell.col, inputFor(cell));
      if (cell.formula) formulas.push({ cell, sheet: index, formula: cell.formula });
    })));
    model.evaluate();
    for (const { cell, sheet, formula } of formulas) {
      const result = computedResult(model, sheet, cell.row, cell.col);
      // Plan item 5: remove stale caches; never write a value IronCalc didn't compute.
      // Keep the rest of the formula model (array and shared formulas) as it was.
      const { result: _stale, ...kept } = cell.value;
      cell.value = result === undefined ? kept : { ...kept, result };
      if (result === undefined) notRecalculated.push(`${cell.worksheet.name}!${cell.address} (=${formula})`);
    }
    workbook.calcProperties.fullCalcOnLoad = true;
    return notRecalculated;
  } finally {
    model.free();
  }
}

async function recalc(input, output = input) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(input);
  const notRecalculated = recalculateWorkbook(workbook);
  await workbook.xlsx.writeFile(output);
  // Reopen so a successful command also proves the output can be read.
  await new ExcelJS.Workbook().xlsx.readFile(output);
  if (notRecalculated.length) console.log(`Not recalculated, Excel will calculate these when the file is opened: ${notRecalculated.join(', ')}`);
  return notRecalculated;
}
module.exports = { recalc, recalculateWorkbook, computedResult, excelDate };
if (require.main === module) recalc(...process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
