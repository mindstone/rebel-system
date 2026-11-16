const fs = require('node:fs');
const path = require('node:path');
function missingBundle() {
  throw new Error("Rebel's built-in document libraries were not found. This is a problem with the Rebel installation, not with your file: report it, and don't try to install packages.");
}
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES || missingBundle(), 'x.js'));
const { PDFDocument, StandardFonts } = bundled('pdf-lib');

async function merge(output, inputs) {
  const document = await PDFDocument.create();
  for (const input of inputs) {
    const source = await PDFDocument.load(fs.readFileSync(input));
    for (const page of await document.copyPages(source, source.getPageIndices())) document.addPage(page);
  }
  fs.writeFileSync(output, await document.save());
}
async function stamp(input, output, text) {
  const document = await PDFDocument.load(fs.readFileSync(input));
  const font = await document.embedFont(StandardFonts.Helvetica);
  for (const page of document.getPages()) page.drawText(text, { x: 36, y: 36, size: 12, font });
  fs.writeFileSync(output, await document.save());
}
async function read(input) {
  const { extractText } = bundled('unpdf');
  return extractText(new Uint8Array(fs.readFileSync(input)), { mergePages: true });
}
module.exports = { merge, stamp, read };
if (require.main === module) {
  const [command, ...args] = process.argv.slice(2);
  (async () => {
    if (command === 'merge' && args.length >= 3) await merge(args[0], args.slice(1));
    else if (command === 'stamp' && args.length === 3) await stamp(...args);
    else if (command === 'read' && args.length === 1) console.log(JSON.stringify(await read(args[0])));
    else throw new Error('Usage: pdf.cjs merge output.pdf input1.pdf input2.pdf | stamp input.pdf output.pdf "text" | read input.pdf');
  })().catch(error => { console.error(error.message); process.exitCode = 1; });
}
