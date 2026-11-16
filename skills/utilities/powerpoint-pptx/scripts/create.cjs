const fs = require('node:fs');
const path = require('node:path');
function missingBundle() {
  throw new Error("Rebel's built-in document libraries were not found. This is a problem with the Rebel installation, not with your file: report it, and don't try to install packages.");
}
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES || missingBundle(), 'x.js'));
const PptxGenJS = bundled('pptxgenjs');

async function create(input, output) {
  if (!input || !output) throw new Error('Usage: create.cjs input.json output.pptx');
  const content = JSON.parse(fs.readFileSync(input, 'utf8'));
  const presentation = new PptxGenJS();
  presentation.layout = 'LAYOUT_WIDE';
  for (const item of content.slides) {
    const slide = presentation.addSlide();
    slide.addText(item.title, { x: 0.6, y: 0.5, w: 12, h: 0.7, fontSize: 30 });
    slide.addText(item.body, { x: 0.6, y: 1.6, w: 12, h: 5, fontSize: 20 });
  }
  await presentation.writeFile({ fileName: output });
}
module.exports = { create };
if (require.main === module) create(...process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
