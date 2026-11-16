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
// Pages are "3" or "2-5", counted from 1; all pages when omitted.
async function render(input, folder, pages) {
  const { getDocumentProxy, renderPageAsImage } = bundled('unpdf');
  const canvasImport = async () => bundled('@napi-rs/canvas');
  const pdf = await getDocumentProxy(new Uint8Array(fs.readFileSync(input)));
  try {
    const [first, last = first] = pages === undefined ? [1, pdf.numPages] : (/^\d+(-\d+)?$/.test(pages) ? pages.split('-').map(Number) : []);
    if (first === undefined || first < 1 || last > pdf.numPages || first > last) {
      throw new Error(`Pages must be a page or range between 1 and ${pdf.numPages}, such as 2 or 2-5.`);
    }
    fs.mkdirSync(folder, { recursive: true });
    const files = [];
    for (let page = first; page <= last; page++) {
      const file = path.join(folder, `page-${page}.png`);
      fs.writeFileSync(file, await renderPageAsImage(pdf, page, { canvasImport, scale: 2 }));
      files.push(file);
    }
    return { totalPages: pdf.numPages, files };
  } finally {
    await pdf.loadingTask.destroy();
  }
}
module.exports = { merge, stamp, read, render };
if (require.main === module) {
  const [command, ...args] = process.argv.slice(2);
  (async () => {
    if (command === 'merge' && args.length >= 3) await merge(args[0], args.slice(1));
    else if (command === 'stamp' && args.length === 3) await stamp(...args);
    else if (command === 'read' && args.length === 1) console.log(JSON.stringify(await read(args[0])));
    else if (command === 'render' && (args.length === 2 || args.length === 3)) console.log(JSON.stringify(await render(...args)));
    else throw new Error('Usage: pdf.cjs merge output.pdf input1.pdf input2.pdf | stamp input.pdf output.pdf "text" | read input.pdf | render input.pdf output-folder [pages]');
  })().catch(error => { console.error(error.message); process.exitCode = 1; });
}
