#!/usr/bin/env node
/**
 * Skill Packager - Creates a distributable zip file of a skill folder
 *
 * Usage:
 *   node package_skill.js <path/to/skill-folder> [output-directory]
 *
 * Example:
 *   node package_skill.js skills/public/my-skill
 *   node package_skill.js skills/public/my-skill ./dist
 * 
 * Note: This script uses only Node.js built-in modules for maximum portability.
 * For production use with many files, consider using the Python version or
 * installing archiver: npm install archiver
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

// Import the validate function by reading and evaluating quick_validate.js
// For simplicity, we inline a minimal validation here
function validateSkill(skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');

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

  return [true, 'Skill is valid!'];
}

function getAllFiles(dirPath, arrayOfFiles = [], basePath = dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles, basePath);
    } else {
      arrayOfFiles.push({
        fullPath,
        relativePath: path.relative(path.dirname(basePath), fullPath)
      });
    }
  }

  return arrayOfFiles;
}

function packageSkill(skillPath, outputDir = null) {
  const resolvedSkillPath = path.resolve(skillPath);

  if (!fs.existsSync(resolvedSkillPath)) {
    console.error(`❌ Error: Skill folder not found: ${resolvedSkillPath}`);
    return null;
  }

  if (!fs.statSync(resolvedSkillPath).isDirectory()) {
    console.error(`❌ Error: Path is not a directory: ${resolvedSkillPath}`);
    return null;
  }

  const skillMdPath = path.join(resolvedSkillPath, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    console.error(`❌ Error: SKILL.md not found in ${resolvedSkillPath}`);
    return null;
  }

  console.log('🔍 Validating skill...');
  const [valid, message] = validateSkill(resolvedSkillPath);
  if (!valid) {
    console.error(`❌ Validation failed: ${message}`);
    console.error('   Please fix the validation errors before packaging.');
    return null;
  }
  console.log(`✅ ${message}\n`);

  const skillName = path.basename(resolvedSkillPath);
  const outputPath = outputDir ? path.resolve(outputDir) : process.cwd();

  if (outputDir && !fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const zipFilename = path.join(outputPath, `${skillName}.zip`);

  try {
    // Use system zip command (available on macOS/Linux, and Windows with Git Bash or WSL)
    // This avoids needing external npm packages
    const parentDir = path.dirname(resolvedSkillPath);
    const folderName = path.basename(resolvedSkillPath);
    
    // Remove existing zip if present
    if (fs.existsSync(zipFilename)) {
      fs.unlinkSync(zipFilename);
    }

    // Create zip using system command
    execSync(`cd "${parentDir}" && zip -r "${zipFilename}" "${folderName}"`, {
      stdio: 'pipe'
    });

    // List what was added
    const files = getAllFiles(resolvedSkillPath);
    for (const file of files) {
      console.log(`  Added: ${file.relativePath}`);
    }

    console.log(`\n✅ Successfully packaged skill to: ${zipFilename}`);
    return zipFilename;
  } catch (e) {
    console.error(`❌ Error creating zip file: ${e.message}`);
    console.error('   Note: This script requires the "zip" command to be available.');
    console.error('   On Windows, use Git Bash, WSL, or the Python version (package_skill.py).');
    return null;
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: node package_skill.js <path/to/skill-folder> [output-directory]');
    console.log('\nExample:');
    console.log('  node package_skill.js skills/public/my-skill');
    console.log('  node package_skill.js skills/public/my-skill ./dist');
    process.exit(1);
  }

  const skillPath = args[0];
  const outputDir = args[1] || null;

  console.log(`📦 Packaging skill: ${skillPath}`);
  if (outputDir) {
    console.log(`   Output directory: ${outputDir}`);
  }
  console.log();

  const result = packageSkill(skillPath, outputDir);
  process.exit(result ? 0 : 1);
}

main();
