#!/usr/bin/env -S npx -y -p tsx@^4 tsx

/**
 * Markdown Description Scanner
 *
 * Scans a folder recursively for .md files and extracts their `description`
 * field from YAML frontmatter. Outputs a JSON structure useful for:
 * - Generating abbreviated skills index for AGENTS.md
 * - Space discovery (scan for AGENTS.md files with frontmatter)
 * - Documentation validation (find docs missing descriptions)
 *
 * Usage:
 *   npx tsx rebel-system/scripts/scan-md-descriptions.ts <path>
 *   npx tsx rebel-system/scripts/scan-md-descriptions.ts rebel-system/skills/
 *   npx tsx rebel-system/scripts/scan-md-descriptions.ts rebel-system/skills/ --verbose
 *   npx tsx rebel-system/scripts/scan-md-descriptions.ts rebel-system/skills/ --flat
 *   npx tsx rebel-system/scripts/scan-md-descriptions.ts . --filter "AGENTS.md"
 *
 * Output format (hierarchical, default):
 *   {
 *     "folder": "skills",
 *     "docs": [{ "path": "skills/foo.md", "filename": "foo.md", "description": "..." }],
 *     "subfolders": [{ "folder": "skills/coding", "docs": [...], "subfolders": [...] }]
 *   }
 *
 * Output format (flat, with --flat):
 *   [
 *     { "path": "skills/foo.md", "filename": "foo.md", "description": "..." },
 *     { "path": "skills/coding/bar.md", "filename": "bar.md", "description": "..." }
 *   ]
 *
 * Note: Requires front-matter package (npm install front-matter)
 */

import { readdir, readFile, stat } from 'fs/promises';
import { resolve, join, basename, relative } from 'path';

interface ScannedDoc {
  path: string;
  filename: string;
  description?: string;
}

interface ScannedFolder {
  folder: string;
  docs: ScannedDoc[];
  subfolders: ScannedFolder[];
}

interface ParsedArgs {
  folderPath?: string;
  verbose: boolean;
  flat: boolean;
  filter?: string;
}

// Simple frontmatter parser (avoids external dependency for portability)
function parseFrontmatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yamlContent = match[1];
  const result: Record<string, unknown> = {};

  // Simple YAML parsing for common cases (key: value, key: "value")
  const lines = yamlContent.split(/\r?\n/);
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Skip empty keys or nested YAML
    if (!key || key.startsWith('-') || key.startsWith(' ')) continue;

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = { verbose: false, flat: false };
  let i = 0;

  while (i < argv.length) {
    const token = argv[i];

    if (token === '-v' || token === '--verbose') {
      parsed.verbose = true;
      i += 1;
      continue;
    }

    if (token === '--flat') {
      parsed.flat = true;
      i += 1;
      continue;
    }

    if (token === '--filter' || token.startsWith('--filter=')) {
      let value: string | undefined;
      if (token.includes('=')) {
        value = token.split('=')[1];
      } else {
        value = argv[i + 1];
        i += 1;
      }
      parsed.filter = value;
      i += 1;
      continue;
    }

    if (token === '-h' || token === '--help') {
      showHelp();
      process.exit(0);
    }

    if (token.startsWith('-')) {
      process.stderr.write(`Unknown option: ${token}\n`);
      process.stderr.write('Use --help for usage information.\n');
      process.exit(1);
    }

    if (!parsed.folderPath) {
      parsed.folderPath = token;
    }
    i += 1;
  }

  return parsed;
}

function showHelp(): void {
  process.stdout.write(`
Markdown Description Scanner
============================

Scans a folder recursively for .md files and extracts their \`description\`
field from YAML frontmatter.

Usage:
  npx tsx scan-md-descriptions.ts <folder> [options]

Options:
  --verbose, -v    Show detailed output during scanning
  --flat           Output flat array instead of hierarchical structure
  --filter <name>  Only include files matching this filename (e.g., "AGENTS.md")
  --help, -h       Show this help message

Examples:
  npx tsx scan-md-descriptions.ts rebel-system/skills/
  npx tsx scan-md-descriptions.ts rebel-system/skills/ --verbose
  npx tsx scan-md-descriptions.ts rebel-system/skills/ --flat
  npx tsx scan-md-descriptions.ts . --filter "AGENTS.md"

Output (hierarchical, default):
  {
    "folder": "skills",
    "docs": [{ "path": "skills/foo.md", "filename": "foo.md", "description": "..." }],
    "subfolders": [...]
  }

Output (flat, with --flat):
  [
    { "path": "skills/foo.md", "filename": "foo.md", "description": "..." },
    ...
  ]
`);
}

async function scanFile(filePath: string, basePath: string): Promise<ScannedDoc | null> {
  try {
    const content = await readFile(filePath, 'utf8');
    const frontmatter = parseFrontmatter(content);
    const relativePath = relative(basePath, filePath);
    const filename = basename(filePath);

    return {
      path: relativePath,
      filename,
      description: frontmatter?.description as string | undefined,
    };
  } catch (err) {
    return null;
  }
}

async function scanFolderRecursive(
  folderPath: string,
  basePath: string,
  verbose: boolean,
  filter?: string
): Promise<ScannedFolder> {
  const absolutePath = resolve(folderPath);
  const relativePath = relative(basePath, absolutePath) || basename(absolutePath);

  const result: ScannedFolder = {
    folder: relativePath,
    docs: [],
    subfolders: [],
  };

  let entries: string[];
  try {
    entries = await readdir(absolutePath);
  } catch (err: any) {
    if (verbose) {
      process.stderr.write(`Warning: Could not read directory: ${absolutePath}\n`);
    }
    return result;
  }

  // Sort entries for consistent output
  entries.sort();

  for (const entry of entries) {
    // Skip hidden files/folders
    if (entry.startsWith('.')) continue;

    const entryPath = join(absolutePath, entry);
    let entryStat;

    try {
      entryStat = await stat(entryPath);
    } catch {
      continue;
    }

    if (entryStat.isDirectory()) {
      const subfolder = await scanFolderRecursive(entryPath, basePath, verbose, filter);
      // Only include subfolders that have content
      if (subfolder.docs.length > 0 || subfolder.subfolders.length > 0) {
        result.subfolders.push(subfolder);
      }
    } else if (entry.endsWith('.md')) {
      // Apply filter if specified
      if (filter && entry !== filter) continue;

      const doc = await scanFile(entryPath, basePath);
      if (doc) {
        result.docs.push(doc);
        if (verbose) {
          const desc = doc.description ? `"${doc.description.slice(0, 50)}..."` : '(no description)';
          process.stderr.write(`  ${doc.path}: ${desc}\n`);
        }
      }
    }
  }

  return result;
}

function flattenScannedFolder(folder: ScannedFolder): ScannedDoc[] {
  const docs: ScannedDoc[] = [...folder.docs];
  for (const subfolder of folder.subfolders) {
    docs.push(...flattenScannedFolder(subfolder));
  }
  return docs;
}

async function main(): Promise<void> {
  try {
    const { folderPath, verbose, flat, filter } = parseArgs(process.argv.slice(2));

    if (!folderPath) {
      showHelp();
      process.exit(1);
    }

    const absolutePath = resolve(folderPath);
    const basePath = resolve(folderPath);

    if (verbose) {
      process.stderr.write(`Scanning: ${absolutePath}\n`);
      if (filter) {
        process.stderr.write(`Filter: ${filter}\n`);
      }
      process.stderr.write('\n');
    }

    const result = await scanFolderRecursive(absolutePath, basePath, verbose, filter);

    if (flat) {
      const flatDocs = flattenScannedFolder(result);
      process.stdout.write(JSON.stringify(flatDocs, null, 2) + '\n');
    } else {
      process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    }

    if (verbose) {
      const flatDocs = flattenScannedFolder(result);
      const withDesc = flatDocs.filter(d => d.description).length;
      const withoutDesc = flatDocs.filter(d => !d.description).length;
      process.stderr.write(`\nSummary: ${flatDocs.length} files scanned\n`);
      process.stderr.write(`  With description: ${withDesc}\n`);
      process.stderr.write(`  Missing description: ${withoutDesc}\n`);
    }
  } catch (err: any) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    process.stderr.write(`\nError: ${errorMessage}\n`);
    process.exit(1);
  }
}

main();
