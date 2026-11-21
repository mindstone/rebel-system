---
name: large-data-duckdb
description: "Use for CSV, Parquet or JSON files too large to read whole (tens of MB to many GB): filter, join, group and summarise them with SQL through DuckDB, which Rebel downloads once on first use. For small files, read them directly; to create Excel workbooks, use excel-xlsx."
last_updated: 2026-11-21
tools_required: ["Node.js (bundled with Rebel)"]
---

# Ask questions of large data files

## [GOAL]

Answer questions about data files too large to open whole, with exact figures computed by SQL rather than estimated from a sample.

## [PROCESS]

1. Look at the shape first: column names and types, then a few rows.
   ```bash
   node "rebel-system/skills/data-analysis/large-data-duckdb/scripts/query.cjs" "DESCRIBE SELECT * FROM 'sales.csv'"
   node "rebel-system/skills/data-analysis/large-data-duckdb/scripts/query.cjs" "SELECT * FROM 'sales.csv' LIMIT 5"
   ```
   The first run downloads DuckDB (about 50 MB, once); say so if it takes a moment. Later runs work offline.
2. Answer with aggregate queries. DuckDB reads files by path in `FROM`: `'file.csv'`, `'file.parquet'`, `'file.json'`, or globs like `'exports/*.csv'`; `read_csv('file.csv', delim=';', header=true)` handles unusual CSVs.
   ```bash
   node "rebel-system/skills/data-analysis/large-data-duckdb/scripts/query.cjs" "SELECT region, sum(amount) AS total FROM 'sales.csv' GROUP BY region ORDER BY total DESC"
   ```
3. To keep a result, write it with `COPY`, then link the file:
   ```sql
   COPY (SELECT ...) TO 'summary.csv' (HEADER);
   ```
   Use `.parquet` for a large result. Save outputs in the workspace.

The script prints JSON with at most 200 `rows` and `truncated`; it reads only those rows, so a huge result is safe. When `truncated` is true, aggregate further or `COPY` the full result rather than paging through rows; use `SELECT count(*) ...` for a total. Each run is a fresh in-memory database: put the whole question in one query, using `WITH` for steps.

If the download fails, report it plainly (the user may be offline) and retry later; do not install DuckDB another way. If the shell has no `REBEL_INSTALL_PACK`, report an installation problem.
