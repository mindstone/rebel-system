#!/usr/bin/env node
// Runs one SQL query with DuckDB, Rebel's on-demand large-data pack, and prints the rows as JSON.
// The pack downloads once on first use; later runs work offline.
'use strict';
const path = require('node:path');
const { createRequire } = require('node:module');

const MAX_ROWS = 200;

function packModules() {
  const installer = process.env.REBEL_INSTALL_PACK;
  if (!installer) throw new Error('Rebel on-demand packs are not available in this shell; report an installation problem.');
  return require(installer).ensurePack('duckdb');
}

async function main() {
  const sql = process.argv[2];
  if (!sql) {
    console.error('Usage: node query.cjs "<SQL>"');
    process.exit(2);
  }
  const { DuckDBInstance } = createRequire(path.join(packModules(), 'x.js'))('@duckdb/node-api');
  const instance = await DuckDBInstance.create(':memory:');
  const connection = await instance.connect();
  try {
    // Streams only the first chunks, so a huge result never has to fit in memory.
    const reader = await connection.streamAndReadUntil(sql, MAX_ROWS + 1);
    const rows = reader.getRowObjectsJson();
    console.log(JSON.stringify({ rows: rows.slice(0, MAX_ROWS), truncated: rows.length > MAX_ROWS || !reader.done }, null, 2));
  } finally {
    connection.closeSync();
    instance.closeSync();
  }
}

main().catch(error => {
  console.error(`[duckdb] ${error.message}`);
  process.exit(1);
});
