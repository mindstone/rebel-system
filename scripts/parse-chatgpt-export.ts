#!/usr/bin/env -S npx -y -p tsx@^4 tsx

/**
 * ChatGPT Export Parser
 *
 * Parses a ChatGPT data export and extracts valuable content for migration to Rebel:
 * - Custom instructions (about you + response style)
 * - Memories (if available in export)
 * - Conversation statistics and frequent topics
 * - Longest conversations (by message count)
 *
 * Note: For very large exports (>50MB conversations.json), stats may be skipped
 * to avoid memory issues. Custom instructions and memories are always extracted.
 *
 * Usage:
 *   npx tsx rebel-system/scripts/parse-chatgpt-export.ts <export-folder>
 *   npx tsx rebel-system/scripts/parse-chatgpt-export.ts ~/Downloads/chatgpt-export
 *   npx tsx rebel-system/scripts/parse-chatgpt-export.ts ~/Downloads/chatgpt-export --output ~/Documents
 *   npx tsx rebel-system/scripts/parse-chatgpt-export.ts ~/Downloads/chatgpt-export --verbose
 *   npx tsx rebel-system/scripts/parse-chatgpt-export.ts ~/Downloads/chatgpt-export --json
 *
 * Output:
 *   - Console summary of what was found
 *   - Creates chatgpt-imported-context.md in output folder (or current directory)
 *   - With --json: outputs machine-readable JSON to stdout
 *
 * Cross-platform: Works on macOS, Windows, and Linux
 */

import { readdir, readFile, writeFile, stat, mkdir } from 'fs/promises';
import { resolve, join } from 'path';
import { homedir } from 'os';

interface CustomInstructions {
  aboutUser?: string;
  responseStyle?: string;
}

interface Memory {
  content: string;
  createdAt?: string;
}

interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  dateRange: { earliest?: string; latest?: string };
  frequentTopics: Array<{ topic: string; count: number }>;
  longestConversations: Array<{ title: string; messageCount: number; id: string }>;
}

interface ParsedExport {
  customInstructions: CustomInstructions;
  memories: Memory[];
  conversationStats: ConversationStats;
  userInfo: {
    email?: string;
    name?: string;
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
ChatGPT Export Parser
=====================

Parses a ChatGPT data export and extracts valuable content for migration to Rebel.

Usage:
  npx tsx parse-chatgpt-export.ts <export-folder> [options]

Arguments:
  export-folder    Path to the unzipped ChatGPT export folder

Options:
  -o, --output <path>  Output folder for generated files (default: current directory)
  -v, --verbose        Show detailed output during parsing
  --json               Output machine-readable JSON to stdout
  -h, --help           Show this help message

Examples:
  npx tsx parse-chatgpt-export.ts ~/Downloads/chatgpt-export
  npx tsx parse-chatgpt-export.ts ~/Downloads/chatgpt-export --output ~/Documents
  npx tsx parse-chatgpt-export.ts ~/Downloads/chatgpt-export --verbose
  npx tsx parse-chatgpt-export.ts ~/Downloads/chatgpt-export --json > export.json

Output:
  - chatgpt-imported-context.md: Markdown file with extracted content ready for Rebel
  - Console summary of what was found

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

interface UserJsonData {
  id?: string;
  email?: string;
  name?: string;
  chatgpt_plus_user?: boolean;
  custom_instructions?: {
    about_user_message?: string;
    about_model_message?: string;
  };
}

async function parseUserJson(exportPath: string, verbose: boolean): Promise<{ userInfo: ParsedExport['userInfo']; customInstructions: CustomInstructions }> {
  const userJsonPath = join(exportPath, 'user.json');
  const result: { userInfo: ParsedExport['userInfo']; customInstructions: CustomInstructions } = {
    userInfo: {},
    customInstructions: {}
  };

  if (verbose) {
    process.stderr.write(`Looking for user.json at: ${userJsonPath}\n`);
  }

  const userData = await readJsonFile<UserJsonData>(userJsonPath, verbose);
  if (!userData) {
    return result;
  }

  if (verbose) {
    process.stderr.write('  Found user.json\n');
  }

  result.userInfo.email = userData.email;
  result.userInfo.name = userData.name;

  if (userData.custom_instructions) {
    result.customInstructions.aboutUser = userData.custom_instructions.about_user_message;
    result.customInstructions.responseStyle = userData.custom_instructions.about_model_message;

    if (verbose) {
      process.stderr.write(`  Custom instructions found: about_user=${!!result.customInstructions.aboutUser}, response_style=${!!result.customInstructions.responseStyle}\n`);
    }
  }

  return result;
}

interface MemoryJsonItem {
  content?: string;
  created_at?: string;
  memory?: string;
  timestamp?: string;
}

async function parseMemories(exportPath: string, verbose: boolean): Promise<Memory[]> {
  const memories: Memory[] = [];

  // Try various possible memory file locations
  const possiblePaths = [
    join(exportPath, 'memories.json'),
    join(exportPath, 'memory.json'),
    join(exportPath, 'saved_memories.json'),
  ];

  for (const memoryPath of possiblePaths) {
    if (verbose) {
      process.stderr.write(`Checking for memories at: ${memoryPath}\n`);
    }

    const memoryData = await readJsonFile<MemoryJsonItem[]>(memoryPath);
    if (memoryData && Array.isArray(memoryData)) {
      if (verbose) {
        process.stderr.write(`  Found ${memoryData.length} memories\n`);
      }

      for (const item of memoryData) {
        const content = item.content || item.memory;
        if (content) {
          memories.push({
            content,
            createdAt: item.created_at || item.timestamp,
          });
        }
      }
      break;
    }
  }

  // Also check for memories embedded in user.json or other structures
  const userJsonPath = join(exportPath, 'user.json');
  const userData = await readJsonFile<Record<string, unknown>>(userJsonPath);
  if (userData && 'memories' in userData && Array.isArray(userData.memories)) {
    for (const item of userData.memories as MemoryJsonItem[]) {
      const content = item.content || item.memory;
      if (content && !memories.some(m => m.content === content)) {
        memories.push({
          content,
          createdAt: item.created_at || item.timestamp,
        });
      }
    }
  }

  return memories;
}

interface ConversationMessage {
  id?: string;
  author?: { role?: string };
  content?: { parts?: string[] };
  create_time?: number;
}

interface ConversationMapping {
  [key: string]: {
    message?: ConversationMessage;
  };
}

interface ConversationItem {
  id?: string;
  title?: string;
  create_time?: number;
  update_time?: number;
  mapping?: ConversationMapping;
}

const MAX_CONVERSATIONS_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

async function parseConversations(exportPath: string, verbose: boolean): Promise<ConversationStats> {
  const stats: ConversationStats = {
    totalConversations: 0,
    totalMessages: 0,
    dateRange: {},
    frequentTopics: [],
    longestConversations: [],
  };

  const conversationsPath = join(exportPath, 'conversations.json');
  if (verbose) {
    process.stderr.write(`Looking for conversations.json at: ${conversationsPath}\n`);
  }

  // Check file size before attempting to parse
  try {
    const fileStat = await stat(conversationsPath);
    if (fileStat.size > MAX_CONVERSATIONS_FILE_SIZE) {
      const sizeMB = Math.round(fileStat.size / 1024 / 1024);
      process.stderr.write(`  Warning: conversations.json is ${sizeMB}MB (>${MAX_CONVERSATIONS_FILE_SIZE / 1024 / 1024}MB limit)\n`);
      process.stderr.write(`  Skipping conversation analysis to avoid memory issues.\n`);
      process.stderr.write(`  Custom instructions and memories will still be extracted.\n`);
      return stats;
    }
  } catch {
    // File doesn't exist or can't be accessed - will be handled below
  }

  const conversations = await readJsonFile<ConversationItem[]>(conversationsPath, verbose);
  if (!conversations || !Array.isArray(conversations)) {
    return stats;
  }

  if (verbose) {
    process.stderr.write(`  Found ${conversations.length} conversations\n`);
  }

  stats.totalConversations = conversations.length;

  const topicCounts = new Map<string, number>();
  const conversationLengths: Array<{ title: string; messageCount: number; id: string }> = [];

  for (const conv of conversations) {
    // Count messages in this conversation
    let messageCount = 0;
    if (conv.mapping) {
      for (const key of Object.keys(conv.mapping)) {
        const node = conv.mapping[key];
        if (node.message?.content?.parts?.length) {
          messageCount++;
        }
      }
    }

    stats.totalMessages += messageCount;

    // Track conversation length
    if (conv.title && conv.id) {
      conversationLengths.push({
        title: conv.title,
        messageCount,
        id: conv.id,
      });
    }

    // Track date range
    if (conv.create_time) {
      const dateStr = new Date(conv.create_time * 1000).toISOString().split('T')[0];
      if (!stats.dateRange.earliest || dateStr < stats.dateRange.earliest) {
        stats.dateRange.earliest = dateStr;
      }
      if (!stats.dateRange.latest || dateStr > stats.dateRange.latest) {
        stats.dateRange.latest = dateStr;
      }
    }

    // Extract topics from titles (simple word extraction)
    if (conv.title) {
      const words = conv.title
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
    .filter(([_, count]) => count > 1) // Only topics mentioned more than once
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([topic, count]) => ({ topic, count }));

  // Get top 10 longest conversations
  stats.longestConversations = conversationLengths
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 10);

  return stats;
}

async function findExportFolder(inputPath: string, verbose: boolean): Promise<string | null> {
  const expandedPath = expandPath(inputPath);

  // Check if the path exists
  if (!await fileExists(expandedPath)) {
    return null;
  }

  // Check if it's already the export folder (has conversations.json or user.json)
  if (await fileExists(join(expandedPath, 'conversations.json')) ||
      await fileExists(join(expandedPath, 'user.json'))) {
    if (verbose) {
      process.stderr.write(`Found export at: ${expandedPath}\n`);
    }
    return expandedPath;
  }

  // Check if it's a directory containing a single subfolder (common after unzipping)
  try {
    const entries = await readdir(expandedPath);
    for (const entry of entries) {
      const subPath = join(expandedPath, entry);
      const subStat = await stat(subPath);
      if (subStat.isDirectory()) {
        if (await fileExists(join(subPath, 'conversations.json')) ||
            await fileExists(join(subPath, 'user.json'))) {
          if (verbose) {
            process.stderr.write(`Found export in subfolder: ${subPath}\n`);
          }
          return subPath;
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
  lines.push(`description: "Context imported from ChatGPT on ${today}"`);
  lines.push('source: "ChatGPT Export"');
  lines.push(`imported_date: ${today}`);
  lines.push('---');
  lines.push('');
  lines.push('# Imported ChatGPT Context');
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

  // Custom instructions
  if (parsed.customInstructions.aboutUser || parsed.customInstructions.responseStyle) {
    lines.push('## Custom Instructions');
    lines.push('');

    if (parsed.customInstructions.aboutUser) {
      lines.push('### About Me (from "What would you like ChatGPT to know about you?")');
      lines.push('');
      lines.push(parsed.customInstructions.aboutUser);
      lines.push('');
    }

    if (parsed.customInstructions.responseStyle) {
      lines.push('### Preferred Response Style (from "How would you like ChatGPT to respond?")');
      lines.push('');
      lines.push(parsed.customInstructions.responseStyle);
      lines.push('');
    }
  }

  // Memories
  if (parsed.memories.length > 0) {
    lines.push('## Memories');
    lines.push('');
    lines.push('*These are facts ChatGPT remembered about you. Review and incorporate relevant ones into your Rebel memory.*');
    lines.push('');
    for (const memory of parsed.memories) {
      const dateNote = memory.createdAt ? ` *(${memory.createdAt})*` : '';
      lines.push(`- ${memory.content}${dateNote}`);
    }
    lines.push('');
  }

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
    lines.push('*Your longest conversations - may contain valuable prompts or patterns:*');
    lines.push('');
    for (const { title, messageCount } of parsed.conversationStats.longestConversations.slice(0, 5)) {
      lines.push(`- "${title}" (${messageCount} messages)`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## Next Steps');
  lines.push('');
  lines.push('1. **Review the content above** and decide what to keep');
  lines.push('2. **Save to Rebel memory**: Use `@memory-update` to incorporate relevant facts into your Chief-of-Staff space');
  lines.push('3. **Custom instructions → Skill extension**: Use `@customise-and-extend-skill` to personalize Rebel skills with your preferences');
  lines.push('4. **Frequent topics → Automations**: Consider creating Rebel automations for recurring tasks');
  lines.push('5. **Custom GPTs**: Manually copy prompts from your Custom GPTs (not included in export) - see skill for instructions');
  lines.push('');
  lines.push('*This file was generated by parse-chatgpt-export.ts. Review and update as needed.*');

  return lines.join('\n');
}

async function main(): Promise<void> {
  const { exportPath, outputPath, verbose, jsonOutput } = parseArgs(process.argv.slice(2));

  if (!exportPath) {
    showHelp();
    process.exit(1);
  }

  // Find the actual export folder
  const actualExportPath = await findExportFolder(exportPath, verbose);
  if (!actualExportPath) {
    process.stderr.write(`\nError: Could not find ChatGPT export at: ${exportPath}\n`);
    process.stderr.write('\nMake sure the path points to the unzipped export folder containing:\n');
    process.stderr.write('  - conversations.json\n');
    process.stderr.write('  - user.json\n');
    process.stderr.write('\nCommon locations:\n');
    process.stderr.write('  - macOS/Linux: ~/Downloads/\n');
    process.stderr.write('  - Windows: %USERPROFILE%\\Downloads\\\n');
    process.exit(1);
  }

  if (verbose) {
    process.stderr.write(`\nParsing ChatGPT export from: ${actualExportPath}\n\n`);
  }

  // Parse all components
  const { userInfo, customInstructions } = await parseUserJson(actualExportPath, verbose);
  const memories = await parseMemories(actualExportPath, verbose);
  const conversationStats = await parseConversations(actualExportPath, verbose);

  const parsed: ParsedExport = {
    customInstructions,
    memories,
    conversationStats,
    userInfo,
    exportDate: new Date().toISOString(),
  };

  // Output JSON if requested
  if (jsonOutput) {
    process.stdout.write(JSON.stringify(parsed, null, 2) + '\n');
    return;
  }

  // Generate and save markdown file
  const markdown = generateMarkdownOutput(parsed);
  const outputDir = outputPath ? expandPath(outputPath) : process.cwd();
  const outputFile = join(outputDir, 'chatgpt-imported-context.md');

  try {
    await mkdir(outputDir, { recursive: true });
    await writeFile(outputFile, markdown, 'utf8');
  } catch (err) {
    process.stderr.write(`\nError writing output file: ${err}\n`);
    process.exit(1);
  }

  // Print summary
  process.stdout.write('\n========================================\n');
  process.stdout.write('ChatGPT Export Parsed Successfully\n');
  process.stdout.write('========================================\n\n');

  process.stdout.write('WHAT WE FOUND:\n\n');

  if (userInfo.name || userInfo.email) {
    process.stdout.write(`User: ${userInfo.name || ''} ${userInfo.email ? `<${userInfo.email}>` : ''}\n`);
  }

  if (customInstructions.aboutUser) {
    process.stdout.write(`\nCustom Instructions (About You): YES (${customInstructions.aboutUser.length} chars)\n`);
  } else {
    process.stdout.write('\nCustom Instructions (About You): Not found\n');
  }

  if (customInstructions.responseStyle) {
    process.stdout.write(`Custom Instructions (Response Style): YES (${customInstructions.responseStyle.length} chars)\n`);
  } else {
    process.stdout.write('Custom Instructions (Response Style): Not found\n');
  }

  process.stdout.write(`\nMemories: ${memories.length} found\n`);
  if (memories.length > 0 && memories.length <= 5) {
    for (const m of memories) {
      process.stdout.write(`  - ${m.content.slice(0, 60)}${m.content.length > 60 ? '...' : ''}\n`);
    }
  } else if (memories.length > 5) {
    for (const m of memories.slice(0, 3)) {
      process.stdout.write(`  - ${m.content.slice(0, 60)}${m.content.length > 60 ? '...' : ''}\n`);
    }
    process.stdout.write(`  ... and ${memories.length - 3} more\n`);
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

  process.stdout.write('NEXT STEPS:\n');
  process.stdout.write('1. Review the generated file above\n');
  process.stdout.write('2. Ask Rebel: "@chatgpt-migration - I\'ve exported my data, help me import it"\n');
  process.stdout.write('3. Rebel will help you save relevant content to your memory spaces\n');
  process.stdout.write('\nNOTE: Custom GPT prompts are NOT in the export.\n');
  process.stdout.write('You\'ll need to manually copy them from chatgpt.com/gpts/mine\n');
}

main().catch(err => {
  process.stderr.write(`\nError: ${err.message || err}\n`);
  process.exit(1);
});
