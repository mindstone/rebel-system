const fs = require('node:fs');
const path = require('node:path');
function missingBundle() {
  throw new Error("Rebel's built-in document libraries were not found. This is a problem with the Rebel installation, not with your file: report it, and don't try to install packages.");
}
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES || missingBundle(), 'x.js'));
const ExcelJS = bundled('exceljs');

async function create(input, output) {
  if (!input || !output) throw new Error('Usage: create.cjs input.json output.xlsx');
  const content = JSON.parse(fs.readFileSync(input, 'utf8'));
  const workbook = new ExcelJS.Workbook();
  for (const item of content.sheets) {
    const sheet = workbook.addWorksheet(item.name);
    for (const [address, value] of Object.entries(item.cells)) sheet.getCell(address).value = value;
  }
  await workbook.xlsx.writeFile(output);
}
module.exports = { create };
if (require.main === module) create(...process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
