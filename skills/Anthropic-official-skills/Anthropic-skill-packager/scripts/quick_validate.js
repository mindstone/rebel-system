#!/usr/bin/env node
/**
 * Quick validation script for skills - minimal version
 * 
 * Usage: node quick_validate.js <skill_directory>
 */

import fs from 'node:fs';
import path from 'node:path';

function validateSkill(skillPath) {
  const resolvedPath = path.resolve(skillPath);
  const skillMdPath = path.join(resolvedPath, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    return [false, 'SKILL.md not found'];
  }

  const content = fs.readFileSync(skillMdPath, 'utf-8');

  if (!content.startsWith('---')) {
    return [false, 'No YAML frontmatter found'];
  }

  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return [false, 'Invalid frontmatter format'];
  }

  const frontmatter = match[1];

  if (!frontmatter.includes('name:')) {
    return [false, "Missing 'name' in frontmatter"];
  }
  if (!frontmatter.includes('description:')) {
    return [false, "Missing 'description' in frontmatter"];
  }

  const nameMatch = frontmatter.match(/name:\s*(.+)/);
  if (nameMatch) {
    const name = nameMatch[1].trim();
    if (!/^[a-z0-9-]+$/.test(name)) {
      return [false, `Name '${name}' should be hyphen-case (lowercase letters, digits, and hyphens only)`];
    }
    if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) {
      return [false, `Name '${name}' cannot start/end with hyphen or contain consecutive hyphens`];
    }
  }

  const descMatch = frontmatter.match(/description:\s*(.+)/);
  if (descMatch) {
    const description = descMatch[1].trim();
    if (description.includes('<') || description.includes('>')) {
      return [false, 'Description cannot contain angle brackets (< or >)'];
    }
  }

  return [true, 'Skill is valid!'];
}

function main() {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.log('Usage: node quick_validate.js <skill_directory>');
    process.exit(1);
  }

  const [valid, message] = validateSkill(args[0]);
  console.log(message);
  process.exit(valid ? 0 : 1);
}

main();
