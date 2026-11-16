const fs = require('node:fs');
const path = require('node:path');
function missingBundle() {
  throw new Error("Rebel's built-in document libraries were not found. This is a problem with the Rebel installation, not with your file: report it, and don't try to install packages.");
}
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES || missingBundle(), 'x.js'));
const { Document, Packer, Paragraph, HeadingLevel } = bundled('docx');

async function create(input, output) {
  if (!input || !output) throw new Error('Usage: create.cjs input.json output.docx');
  const content = JSON.parse(fs.readFileSync(input, 'utf8'));
  const document = new Document({ sections: [{ children: [
    new Paragraph({ text: content.title, heading: HeadingLevel.TITLE }),
    ...content.paragraphs.map(text => new Paragraph(text)),
  ] }] });
  fs.writeFileSync(output, await Packer.toBuffer(document));
}
module.exports = { create };
if (require.main === module) create(...process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
