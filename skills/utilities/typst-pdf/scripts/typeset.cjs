#!/usr/bin/env node
// Typesets a PDF from a Typst file with Typst, Rebel's on-demand typesetting pack.
// The pack downloads once on first use; later runs work offline.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

// Typst reports positions zero-based, as editors' language servers do; people count from one.
function describe(diagnostic, kind) {
  const start = diagnostic.range?.start;
  const where = start ? `${diagnostic.path || '<input>'}:${start.line + 1}:${start.character + 1}` : (diagnostic.path || '<input>');
  return `${where}: ${kind}: ${diagnostic.message}`;
}

/** Compiles `input`; writes `output` only when there is no error. Returns the process exit code. */
function typeset(NodeCompiler, input, output) {
  const source = path.resolve(input);
  // The input's folder is the workspace, so images and includes resolve next to it.
  const compiler = NodeCompiler.create({ workspace: path.dirname(source) });
  const result = compiler.compile({ mainFilePath: source });
  const warnings = result.takeWarnings();
  const error = result.takeError();
  const warned = warnings ? compiler.fetchDiagnostics(warnings) : [];
  for (const diagnostic of warned) console.error(describe(diagnostic, 'warning'));
  if (error) {
    const diagnostics = compiler.fetchDiagnostics(error);
    for (const diagnostic of diagnostics) console.error(describe(diagnostic, 'error'));
    if (diagnostics.length === 0) console.error(`${source}: error: Typst could not compile this file`);
    return 1;
  }
  const pdf = compiler.pdf(result.result);
  const target = path.resolve(output);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  // Written beside the target and renamed, so a failed write never leaves a partial PDF
  // or truncates an earlier good one.
  const partial = `${target}.${process.pid}.partial`;
  try {
    fs.writeFileSync(partial, pdf);
    fs.renameSync(partial, target);
  } catch (error) {
    fs.rmSync(partial, { force: true });
    throw error;
  }
  console.log(JSON.stringify({ output: target, bytes: pdf.length, warnings: warned.length }));
  return 0;
}

function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || !output || !output.toLowerCase().endsWith('.pdf')) {
    console.error('Usage: node typeset.cjs <input.typ> <output.pdf>');
    process.exit(2);
  }
  if (!fs.existsSync(input)) {
    console.error(`[typst] ${input} does not exist`);
    process.exit(2);
  }
  const installer = process.env.REBEL_INSTALL_PACK;
  if (!installer) throw new Error('Rebel on-demand packs are not available in this shell; report an installation problem.');
  const modules = require(installer).ensurePack('typst');
  const { NodeCompiler } = createRequire(path.join(modules, 'x.js'))('@myriaddreamin/typst-ts-node-compiler');
  process.exitCode = typeset(NodeCompiler, input, output);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`[typst] ${error.message}`);
    process.exit(1);
  }
}
module.exports = { typeset };
