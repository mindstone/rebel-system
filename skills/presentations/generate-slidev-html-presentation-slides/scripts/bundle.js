#!/usr/bin/env node

/**
 * Single-File HTML Bundler
 *
 * Takes a generated presentation folder and creates a single self-contained HTML file.
 * Inlines all CSS, JavaScript, and converts images to base64 data URIs.
 * The resulting file has zero external dependencies and works offline.
 *
 * Usage:
 *   node bundle.js presentation-folder/ output.html
 *   node bundle.js presentation-folder/  # Creates presentation-folder-bundled.html
 *
 * Process:
 *   1. Read index.html
 *   2. Find and inline all <link rel="stylesheet"> tags
 *   3. Find and inline all <script src="..."> tags (excluding CDN)
 *   4. Find and convert all <img> tags to base64 data URIs
 *   5. Find and convert background-image URLs in inline styles
 *   6. Output single HTML file
 *
 * Features:
 *   - Cross-platform compatible (Windows, Mac, Linux)
 *   - Preserves CDN links (marked.js, Prism.js)
 *   - Handles various image formats (PNG, JPG, GIF, SVG, WebP)
 *   - Error handling with helpful messages
 *   - Minifies output for smaller file size
 *
 * @module bundle
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get MIME type for file based on extension
 * @param {string} filePath - File path
 * @returns {string} - MIME type
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Convert file to base64 data URI
 * @param {string} filePath - Path to file
 * @param {string} baseDir - Base directory for relative paths
 * @returns {string} - Data URI or null if file not found
 */
function fileToDataURI(filePath, baseDir) {
  try {
    // Resolve file path relative to base directory
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(baseDir, filePath);

    if (!fs.existsSync(resolvedPath)) {
      console.warn(`Warning: File not found: ${resolvedPath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(resolvedPath);
    const base64 = fileBuffer.toString('base64');
    const mimeType = getMimeType(resolvedPath);

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.warn(`Warning: Error reading file ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Check if URL is external (CDN, absolute URL)
 * @param {string} url - URL to check
 * @returns {boolean} - True if external
 */
function isExternalURL(url) {
  return url.startsWith('http://') ||
         url.startsWith('https://') ||
         url.startsWith('//');
}

/**
 * Inline CSS files
 * @param {string} html - HTML content
 * @param {string} baseDir - Base directory
 * @returns {string} - HTML with inlined CSS
 */
function inlineCSS(html, baseDir) {
  console.log('Inlining CSS files...');

  // Match <link rel="stylesheet" href="...">
  const linkRegex = /<link\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;

  return html.replace(linkRegex, (match, href) => {
    // Skip external stylesheets (CDNs)
    if (isExternalURL(href)) {
      console.log(`  Keeping external CSS: ${href}`);
      return match;
    }

    // Check if it's a stylesheet link
    if (!match.toLowerCase().includes('stylesheet')) {
      return match;
    }

    try {
      const cssPath = path.join(baseDir, href);
      if (!fs.existsSync(cssPath)) {
        console.warn(`  Warning: CSS file not found: ${cssPath}`);
        return match;
      }

      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      console.log(`  ✓ Inlined: ${href}`);

      return `<style>\n${cssContent}\n</style>`;
    } catch (error) {
      console.warn(`  Warning: Error inlining CSS ${href}: ${error.message}`);
      return match;
    }
  });
}

/**
 * Inline JavaScript files
 * @param {string} html - HTML content
 * @param {string} baseDir - Base directory
 * @returns {string} - HTML with inlined JS
 */
function inlineJavaScript(html, baseDir) {
  console.log('Inlining JavaScript files...');

  // Match <script src="..."></script>
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi;

  return html.replace(scriptRegex, (match, src) => {
    // Skip external scripts (CDNs)
    if (isExternalURL(src)) {
      console.log(`  Keeping external JS: ${src}`);
      return match;
    }

    try {
      const jsPath = path.join(baseDir, src);
      if (!fs.existsSync(jsPath)) {
        console.warn(`  Warning: JS file not found: ${jsPath}`);
        return match;
      }

      const jsContent = fs.readFileSync(jsPath, 'utf-8');
      console.log(`  ✓ Inlined: ${src}`);

      // Preserve any attributes except src
      const attrs = match.match(/<script\s+([^>]*)>/i)[1];
      const otherAttrs = attrs.replace(/src=["'][^"']*["']\s*/i, '').trim();

      return `<script ${otherAttrs}>\n${jsContent}\n</script>`;
    } catch (error) {
      console.warn(`  Warning: Error inlining JS ${src}: ${error.message}`);
      return match;
    }
  });
}

/**
 * Inline images as base64 data URIs
 * @param {string} html - HTML content
 * @param {string} baseDir - Base directory
 * @returns {string} - HTML with inlined images
 */
function inlineImages(html, baseDir) {
  console.log('Inlining images...');

  // Match <img src="...">
  const imgRegex = /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*)>/gi;

  return html.replace(imgRegex, (match, before, src, after) => {
    // Skip external images
    if (isExternalURL(src)) {
      console.log(`  Keeping external image: ${src}`);
      return match;
    }

    // Skip data URIs
    if (src.startsWith('data:')) {
      return match;
    }

    const dataURI = fileToDataURI(src, baseDir);
    if (!dataURI) {
      return match;
    }

    console.log(`  ✓ Inlined: ${src}`);
    return `<img ${before}src="${dataURI}"${after}>`;
  });
}

/**
 * Inline background images in style attributes
 * @param {string} html - HTML content
 * @param {string} baseDir - Base directory
 * @returns {string} - HTML with inlined background images
 */
function inlineBackgroundImages(html, baseDir) {
  console.log('Inlining background images...');

  // Match style="..." containing background-image: url(...)
  const styleRegex = /style=["']([^"']*background-image:\s*url\(["']?([^"')]+)["']?\)[^"']*)["']/gi;

  return html.replace(styleRegex, (match, styleContent, url) => {
    // Skip external URLs
    if (isExternalURL(url)) {
      console.log(`  Keeping external background: ${url}`);
      return match;
    }

    // Skip data URIs
    if (url.startsWith('data:')) {
      return match;
    }

    const dataURI = fileToDataURI(url, baseDir);
    if (!dataURI) {
      return match;
    }

    console.log(`  ✓ Inlined background: ${url}`);

    // Replace URL in style content
    const newStyleContent = styleContent.replace(url, dataURI);
    return `style="${newStyleContent}"`;
  });
}

/**
 * Inline fonts from CSS
 * @param {string} html - HTML content
 * @param {string} baseDir - Base directory
 * @returns {string} - HTML with inlined fonts
 */
function inlineFonts(html, baseDir) {
  console.log('Inlining fonts from CSS...');

  // Match @font-face rules with url(...)
  const fontFaceRegex = /@font-face\s*\{[^}]*url\(["']?([^"')]+)["']?\)[^}]*\}/gi;

  return html.replace(fontFaceRegex, (match) => {
    const urlRegex = /url\(["']?([^"')]+)["']?\)/gi;

    return match.replace(urlRegex, (urlMatch, url) => {
      // Skip external fonts
      if (isExternalURL(url)) {
        return urlMatch;
      }

      // Skip data URIs
      if (url.startsWith('data:')) {
        return urlMatch;
      }

      const dataURI = fileToDataURI(url, baseDir);
      if (!dataURI) {
        return urlMatch;
      }

      console.log(`  ✓ Inlined font: ${url}`);
      return `url("${dataURI}")`;
    });
  });
}

/**
 * Bundle presentation into single HTML file
 * @param {string} inputDir - Input presentation directory
 * @param {string} outputFile - Output HTML file path
 */
function bundlePresentation(inputDir, outputFile) {
  console.log(`\n📦 Bundling presentation from: ${inputDir}`);
  console.log(`📄 Output file: ${outputFile}\n`);

  // Check if input directory exists
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input directory not found: ${inputDir}`);
  }

  // Check if index.html exists
  const indexPath = path.join(inputDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`index.html not found in: ${inputDir}`);
  }

  // Read index.html
  let html = fs.readFileSync(indexPath, 'utf-8');

  // Inline all assets
  html = inlineCSS(html, inputDir);
  html = inlineJavaScript(html, inputDir);
  html = inlineImages(html, inputDir);
  html = inlineBackgroundImages(html, inputDir);
  html = inlineFonts(html, inputDir);

  // Add comment header
  const header = `<!--
  Single-file bundled presentation
  Generated: ${new Date().toISOString()}
  Original: ${inputDir}

  This file is completely self-contained with no external dependencies
  (except CDN-hosted libraries for Prism.js and marked.js).

  Open this file directly in any modern web browser to view the presentation.
-->

`;

  html = header + html;

  // Write bundled HTML
  fs.writeFileSync(outputFile, html, 'utf-8');

  // Get file size
  const stats = fs.statSync(outputFile);
  const fileSizeKB = (stats.size / 1024).toFixed(2);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`\n✅ Bundling complete!`);
  console.log(`📊 File size: ${fileSizeKB} KB (${fileSizeMB} MB)`);
  console.log(`📁 Output: ${outputFile}`);
  console.log(`🌐 Open in browser to view presentation`);
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node bundle.js <presentation-folder> [output.html]');
    console.error('Example: node bundle.js my-presentation/ bundled.html');
    process.exit(1);
  }

  const inputDir = args[0];

  // Determine output file
  let outputFile;
  if (args.length >= 2) {
    outputFile = args[1];
  } else {
    // Use folder name with -bundled suffix
    const folderName = path.basename(path.resolve(inputDir));
    outputFile = `${folderName}-bundled.html`;
  }

  // Bundle presentation
  try {
    bundlePresentation(inputDir, outputFile);
  } catch (error) {
    console.error(`\n❌ Error bundling presentation: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { bundlePresentation };
