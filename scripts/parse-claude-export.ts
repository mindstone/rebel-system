#!/usr/bin/env -S npx -y -p tsx@^4 tsx

/**
 * Claude.ai Export Parser
 *
 * Parses a Claude.ai data export and extracts valuable content for migration to Rebel:
 * - Conversation statistics and frequent topics
 * - Longest conversations (by message count)
 * - User account information
 *
 * Note: Claude.ai exports do NOT include:
 * - Memory entries (must be exported separately via Settings → Capabilities)
 * - Project instructions (must be copied manually)
 * - Deleted conversations
 *
 * For very large exports (>50MB conversations.json), stats may be skipped
 * to avoid memory issues.
 *
 * Usage:
 *   npx tsx rebel-system/scripts/parse-claude-export.ts <export-folder>
 *   npx tsx rebel-system/scripts/parse-claude-export.ts ~/Downloads/claude-export
 *   npx tsx rebel-system/scripts/parse-claude-export.ts ~/Downloads/claude-export --output ~/Documents
 *   npx tsx rebel-system/scripts/parse-claude-export.ts ~/Downloads/claude-export --verbose
 *   npx tsx rebel-system/scripts/parse-claude-export.ts ~/Downloads/claude-export --json
 *
 * Output:
 *   - Console summary of what was found
 *   - Creates claude-imported-context.md in output folder (or current directory)
 *   - With --json: outputs machine-readable JSON to stdout
 *
 * Cross-platform: Works on macOS, Windows, and Linux
 */

import { readdir, readFile, writeFile, stat, mkdir } from 'fs/promises';
import { resolve, join } from 'path';
import { homedir } from 'os';

interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  dateRange: { earliest?: string; latest?: string };
  frequentTopics: Array<{ topic: string; count: number }>;
  longestConversations: Array<{ title: string; messageCount: number; id: string }>;
}

interface ParsedExport {
  conversationStats: ConversationStats;
  userInfo: {
    email?: string;
    name?: string;
    uuid?: string;
  };
  exportDate?: string;
}

interface ParsedArgs {
  exportPath?: string;
  outputPath?: string;
  verbose: boolean;
  jsonOutput: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = { verbose: false, jsonOutput: false };
  let i = 0;

  while (i < argv.length) {
    const token = argv[i];

    if (token === '-v' || token === '--verbose') {
      parsed.verbose = true;
      i += 1;
      continue;
    }

    if (token === '--json') {
      parsed.jsonOutput = true;
      i += 1;
      continue;
    }

    if (token === '-o' || token === '--output') {
      const nextArg = argv[i + 1];
      if (!nextArg || nextArg.startsWith('-')) {
        process.stderr.write('Error: --output requires a path argument\n');
        process.exit(1);
      }
      parsed.outputPath = nextArg;
      i += 2;
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

    if (!parsed.exportPath) {
      parsed.exportPath = token;
    }
    i += 1;
  }

  return parsed;
}

function showHelp(): void {
  process.stdout.write(`
Claude.ai Export Parser
=======================

Parses a Claude.ai data export and extracts valuable content for migration to Rebel.

Usage:
  npx tsx parse-claude-export.ts <export-folder> [options]

Arguments:
  export-folder    Path to the unzipped Claude.ai export folder

Options:
  -o, --output <path>  Output folder for generated files (default: current directory)
  -v, --verbose        Show detailed output during parsing
  --json               Output machine-readable JSON to stdout
  -h, --help           Show this help message

Examples:
  npx tsx parse-claude-export.ts ~/Downloads/claude-export
  npx tsx parse-claude-export.ts ~/Downloads/claude-export --output ~/Documents
  npx tsx parse-claude-export.ts ~/Downloads/claude-export --verbose
  npx tsx parse-claude-export.ts ~/Downloads/claude-export --json > export.json

Output:
  - claude-imported-context.md: Markdown file with extracted content ready for Rebel
  - Console summary of what was found

Note: Claude.ai memory and Projects are NOT in the export.
      Memory must be exported via Settings → Capabilities → View and edit memory.
      Projects must be copied manually from each Project's settings.

Cross-Platform:
  This script works on macOS, Windows, and Linux. Use forward slashes or
  platform-appropriate path separators.

Common Export Locations:
  - macOS/Linux: ~/Downloads/
  - Windows: %USERPROFILE%\\Downloads\\
`);
}

function expandPath(inputPath: string): string {
  if (inputPath.startsWith('~/') || inputPath === '~') {
    return join(homedir(), inputPath.slice(2)); // slice(2) to skip "~/"
  }
  if (inputPath.startsWith('~')) {
    // ~username format - just resolve as-is (won't work, but don't mangle)
    return resolve(inputPath);
  }
  return resolve(inputPath);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile<T>(filePath: string, verbose: boolean = false): Promise<T | null> {
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      if (verbose) process.stderr.write(`  Not a file: ${filePath}\n`);
      return null;
    }
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content) as T;
  } catch (err: unknown) {
    if (verbose) {
      const error = err as NodeJS.ErrnoException;
      if (error.code === 'ENOENT') {
        process.stderr.write(`  File not found: ${filePath}\n`);
      } else if (error instanceof SyntaxError) {
        process.stderr.write(`  Invalid JSON in: ${filePath}\n`);
      } else {
        process.stderr.write(`  Error reading ${filePath}: ${error.message}\n`);
      }
    }
    return null;
  }
}

// Claude.ai conversation message structure
interface ClaudeMessage {
  uuid?: string;
  text?: string;
  content?: string | Array<{ type: string; text?: string }>;
  sender?: string;
  created_at?: string;
  updated_at?: string;
}

// Claude.ai conversation structure
interface ClaudeConversation {
  uuid?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  chat_messages?: ClaudeMessage[];
  messages?: ClaudeMessage[];
}

// Claude.ai export can be an array or object with conversations
type ClaudeExportData = ClaudeConversation[] | { conversations?: ClaudeConversation[]; chats?: ClaudeConversation[] };

const MAX_CONVERSATIONS_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

async function parseConversations(exportPath: string, verbose: boolean): Promise<ConversationStats> {
  const stats: ConversationStats = {
    totalConversations: 0,
    totalMessages: 0,
    dateRange: {},
    frequentTopics: [],
    longestConversations: [],
  };

  // Try different possible file names for conversations
  const possiblePaths = [
    join(exportPath, 'conversations.json'),
    join(exportPath, 'chats.json'),
    join(exportPath, 'data.json'),
  ];

  let conversationsPath: string | null = null;
  for (const path of possiblePaths) {
    if (await fileExists(path)) {
      conversationsPath = path;
      break;
    }
  }

  if (!conversationsPath) {
    if (verbose) {
      process.stderr.write('  No conversations file found (tried conversations.json, chats.json, data.json)\n');
    }
    return stats;
  }

  if (verbose) {
    process.stderr.write(`Looking for conversations at: ${conversationsPath}\n`);
  }

  // Check file size before attempting to parse
  try {
    const fileStat = await stat(conversationsPath);
    if (fileStat.size > MAX_CONVERSATIONS_FILE_SIZE) {
      const sizeMB = Math.round(fileStat.size / 1024 / 1024);
      process.stderr.write(`  Warning: Conversations file is ${sizeMB}MB (>${MAX_CONVERSATIONS_FILE_SIZE / 1024 / 1024}MB limit)\n`);
      process.stderr.write(`  Skipping conversation analysis to avoid memory issues.\n`);
      return stats;
    }
  } catch {
    // File doesn't exist or can't be accessed
  }

  const rawData = await readJsonFile<ClaudeExportData>(conversationsPath, verbose);
  if (!rawData) {
    return stats;
  }

  // Handle different export formats
  let conversations: ClaudeConversation[];
  if (Array.isArray(rawData)) {
    conversations = rawData;
  } else if (rawData.conversations) {
    conversations = rawData.conversations;
  } else if (rawData.chats) {
    conversations = rawData.chats;
  } else {
    if (verbose) {
      process.stderr.write('  Unknown conversations format\n');
    }
    return stats;
  }

  if (verbose) {
    process.stderr.write(`  Found ${conversations.length} conversations\n`);
  }

  stats.totalConversations = conversations.length;

  const topicCounts = new Map<string, number>();
  const conversationLengths: Array<{ title: string; messageCount: number; id: string }> = [];

  for (const conv of conversations) {
    // Count messages
    const messages = conv.chat_messages || conv.messages || [];
    const messageCount = messages.length;
    stats.totalMessages += messageCount;

    // Track conversation length
    const title = conv.name || 'Untitled';
    const id = conv.uuid || '';
    conversationLengths.push({ title, messageCount, id });

    // Track date range
    const dateStr = conv.created_at?.split('T')[0];
    if (dateStr) {
      if (!stats.dateRange.earliest || dateStr < stats.dateRange.earliest) {
        stats.dateRange.earliest = dateStr;
      }
      if (!stats.dateRange.latest || dateStr > stats.dateRange.latest) {
        stats.dateRange.latest = dateStr;
      }
    }

    // Extract topics from conversation names
    if (conv.name) {
      const words = conv.name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3);

      for (const word of words) {
        topicCounts.set(word, (topicCounts.get(word) || 0) + 1);
      }
    }
  }

  // Get top 20 frequent topics
  stats.frequentTopics = Array.from(topicCounts.entries())
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([topic, count]) => ({ topic, count }));

  // Get top 10 longest conversations
  stats.longestConversations = conversationLengths
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 10);

  return stats;
}

// Try to find user info from various possible files
interface UserData {
  email?: string;
  name?: string;
  full_name?: string;
  uuid?: string;
  id?: string;
}

async function parseUserInfo(exportPath: string, verbose: boolean): Promise<ParsedExport['userInfo']> {
  const result: ParsedExport['userInfo'] = {};

  const possiblePaths = [
    join(exportPath, 'user.json'),
    join(exportPath, 'account.json'),
    join(exportPath, 'profile.json'),
  ];

  for (const userPath of possiblePaths) {
    if (verbose) {
      process.stderr.write(`Checking for user info at: ${userPath}\n`);
    }

    const userData = await readJsonFile<UserData>(userPath, verbose);
    if (userData) {
      result.email = userData.email;
      result.name = userData.name || userData.full_name;
      result.uuid = userData.uuid || userData.id;
      if (verbose) {
        process.stderr.write(`  Found user info: ${result.email || result.name || 'partial'}\n`);
      }
      break;
    }
  }

  return result;
}

async function findExportFolder(inputPath: string, verbose: boolean): Promise<string | null> {
  const expandedPath = expandPath(inputPath);

  if (!await fileExists(expandedPath)) {
    return null;
  }

  // Check if it's already the export folder
  const indicatorFiles = ['conversations.json', 'chats.json', 'data.json', 'user.json'];
  for (const file of indicatorFiles) {
    if (await fileExists(join(expandedPath, file))) {
      if (verbose) {
        process.stderr.write(`Found export at: ${expandedPath}\n`);
      }
      return expandedPath;
    }
  }

  // Check subdirectories (common after unzipping)
  try {
    const entries = await readdir(expandedPath);
    for (const entry of entries) {
      const subPath = join(expandedPath, entry);
      const subStat = await stat(subPath);
      if (subStat.isDirectory()) {
        for (const file of indicatorFiles) {
          if (await fileExists(join(subPath, file))) {
            if (verbose) {
              process.stderr.write(`Found export in subfolder: ${subPath}\n`);
            }
            return subPath;
          }
        }
      }
    }
  } catch {
    // Ignore directory read errors
  }

  return null;
}

function generateMarkdownOutput(parsed: ParsedExport): string {
  const today = new Date().toISOString().split('T')[0];
  const lines: string[] = [];

  lines.push('---');
  lines.push(`description: "Context imported from Claude.ai on ${today}"`);
  lines.push('source: "Claude.ai Export"');
  lines.push(`imported_date: ${today}`);
  lines.push('---');
  lines.push('');
  lines.push('# Imported Claude.ai Context');
  lines.push('');

  // User info
  if (parsed.userInfo.name || parsed.userInfo.email) {
    lines.push('## User Info');
    lines.push('');
    if (parsed.userInfo.name) {
      lines.push(`- **Name**: ${parsed.userInfo.name}`);
    }
    if (parsed.userInfo.email) {
      lines.push(`- **Email**: ${parsed.userInfo.email}`);
    }
    lines.push('');
  }

  // Note about memory
  lines.push('## Memory');
  lines.push('');
  lines.push('*Claude.ai memory is NOT included in the data export.*');
  lines.push('');
  lines.push('To export your Claude.ai memory:');
  lines.push('1. Go to claude.ai → Settings → Capabilities');
  lines.push('2. Click "View and edit memory"');
  lines.push('3. Copy the memory entries and paste them below');
  lines.push('');
  lines.push('**Your Claude.ai memory entries:**');
  lines.push('');
  lines.push('*(Paste your memory entries here)*');
  lines.push('');

  // Conversation statistics
  lines.push('## Conversation History Summary');
  lines.push('');
  lines.push(`- **Total conversations**: ${parsed.conversationStats.totalConversations}`);
  lines.push(`- **Total messages**: ${parsed.conversationStats.totalMessages}`);
  if (parsed.conversationStats.dateRange.earliest && parsed.conversationStats.dateRange.latest) {
    lines.push(`- **Date range**: ${parsed.conversationStats.dateRange.earliest} to ${parsed.conversationStats.dateRange.latest}`);
  }
  lines.push('');

  // Frequent topics
  if (parsed.conversationStats.frequentTopics.length > 0) {
    lines.push('### Frequent Topics');
    lines.push('');
    lines.push('*Topics you discussed often - consider creating Rebel skills for recurring tasks:*');
    lines.push('');
    for (const { topic, count } of parsed.conversationStats.frequentTopics.slice(0, 10)) {
      lines.push(`- ${topic} (${count} mentions)`);
    }
    lines.push('');
  }

  // Longest conversations
  if (parsed.conversationStats.longestConversations.length > 0) {
    lines.push('### Most Substantial Conversations');
    lines.push('');
    lines.push('*Your longest conversations - may contain valuable patterns:*');
    lines.push('');
    for (const { title, messageCount } of parsed.conversationStats.longestConversations.slice(0, 5)) {
      lines.push(`- "${title}" (${messageCount} messages)`);
    }
    lines.push('');
  }

  // Note about Projects
  lines.push('## Projects');
  lines.push('');
  lines.push('*Claude.ai Projects are NOT included in the data export.*');
  lines.push('');
  lines.push('To migrate your Projects:');
  lines.push('1. Go to claude.ai and open each Project');
  lines.push('2. Click the gear icon to view Project settings');
  lines.push('3. Copy the Project instructions');
  lines.push('4. Paste them below or convert them to Rebel skills');
  lines.push('');
  lines.push('**Your Project instructions:**');
  lines.push('');
  lines.push('*(Paste your Project instructions here)*');
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('## Next Steps');
  lines.push('');
  lines.push('1. **Export your memory** from Claude.ai Settings → Capabilities and paste above');
  lines.push('2. **Copy Project instructions** from each Project and paste above');
  lines.push('3. **Save to Rebel memory**: Use `@memory-update` to incorporate relevant facts');
  lines.push('4. **Convert Projects to skills**: Use `@write-skill` for workflow-oriented Projects');
  lines.push('5. **Frequent topics → Automations**: Consider creating Rebel automations for recurring tasks');
  lines.push('');
  lines.push('*This file was generated by parse-claude-export.ts. Review and update as needed.*');

  return lines.join('\n');
}

async function main(): Promise<void> {
  const { exportPath, outputPath, verbose, jsonOutput } = parseArgs(process.argv.slice(2));

  if (!exportPath) {
    showHelp();
    process.exit(1);
  }

  const actualExportPath = await findExportFolder(exportPath, verbose);
  if (!actualExportPath) {
    process.stderr.write(`\nError: Could not find Claude.ai export at: ${exportPath}\n`);
    process.stderr.write('\nMake sure the path points to the unzipped export folder.\n');
    process.stderr.write('The folder should contain conversations.json, chats.json, or data.json.\n');
    process.stderr.write('\nCommon locations:\n');
    process.stderr.write('  - macOS/Linux: ~/Downloads/\n');
    process.stderr.write('  - Windows: %USERPROFILE%\\Downloads\\\n');
    process.exit(1);
  }

  if (verbose) {
    process.stderr.write(`\nParsing Claude.ai export from: ${actualExportPath}\n\n`);
  }

  const userInfo = await parseUserInfo(actualExportPath, verbose);
  const conversationStats = await parseConversations(actualExportPath, verbose);

  const parsed: ParsedExport = {
    conversationStats,
    userInfo,
    exportDate: new Date().toISOString(),
  };

  if (jsonOutput) {
    process.stdout.write(JSON.stringify(parsed, null, 2) + '\n');
    return;
  }

  const markdown = generateMarkdownOutput(parsed);
  const outputDir = outputPath ? expandPath(outputPath) : process.cwd();
  const outputFile = join(outputDir, 'claude-imported-context.md');

  try {
    await mkdir(outputDir, { recursive: true });
    await writeFile(outputFile, markdown, 'utf8');
  } catch (err) {
    process.stderr.write(`\nError writing output file: ${err}\n`);
    process.exit(1);
  }

  // Print summary
  process.stdout.write('\n========================================\n');
  process.stdout.write('Claude.ai Export Parsed Successfully\n');
  process.stdout.write('========================================\n\n');

  process.stdout.write('WHAT WE FOUND:\n\n');

  if (userInfo.name || userInfo.email) {
    process.stdout.write(`User: ${userInfo.name || ''} ${userInfo.email ? `<${userInfo.email}>` : ''}\n`);
  }

  process.stdout.write(`\nConversations: ${conversationStats.totalConversations} total, ${conversationStats.totalMessages} messages\n`);
  if (conversationStats.dateRange.earliest && conversationStats.dateRange.latest) {
    process.stdout.write(`Date range: ${conversationStats.dateRange.earliest} to ${conversationStats.dateRange.latest}\n`);
  }

  if (conversationStats.frequentTopics.length > 0) {
    process.stdout.write('\nTop topics: ');
    process.stdout.write(conversationStats.frequentTopics.slice(0, 5).map(t => t.topic).join(', ') + '\n');
  }

  process.stdout.write(`\n========================================\n`);
  process.stdout.write(`OUTPUT SAVED TO: ${outputFile}\n`);
  process.stdout.write(`========================================\n\n`);

  process.stdout.write('WHAT\'S NOT IN THE EXPORT:\n');
  process.stdout.write('- Memory entries (export via Settings → Capabilities → View and edit memory)\n');
  process.stdout.write('- Project instructions (copy manually from each Project)\n');
  process.stdout.write('- Deleted conversations\n');
  process.stdout.write('\nNEXT STEPS:\n');
  process.stdout.write('1. Review the generated file above\n');
  process.stdout.write('2. Export your memory from claude.ai Settings → Capabilities\n');
  process.stdout.write('3. Copy any Project instructions you want to migrate\n');
  process.stdout.write('4. Ask Rebel: "@claude-migration - I\'ve exported my data, help me import it"\n');
}

main().catch(err => {
  process.stderr.write(`\nError: ${err.message || err}\n`);
  process.exit(1);
});
