#!/usr/bin/env node

/**
 * Slidev-Style HTML Presentation Generator
 *
 * Generates static HTML presentations from JSON configuration.
 * Outputs a folder structure with HTML + assets (CSS, JS).
 * No build tools required - works instantly in browsers.
 *
 * Usage:
 *   node generate.js --config config.json --output output-folder/
 *   node generate.js --config config.json  # Uses config title as folder name
 *
 * Features:
 *   - 20+ professional slide layouts inspired by Slidev
 *   - Markdown content support via marked.js (CDN)
 *   - Prism.js code highlighting with line numbers
 *   - Progressive disclosure (v-click equivalent)
 *   - Visual effects (particles, glass morphism, gradient text)
 *   - Keyboard navigation (arrows, space, home, end)
 *   - Slide progress indicators
 *   - Dark mode support
 *   - Responsive design
 *   - Theme system with CSS variables
 *   - Cross-platform compatible
 *
 * @module generate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { layouts, getLayout, hasLayout } from './layouts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Default theme configuration
 */
const DEFAULT_THEME = {
  colors: {
    primary: '#7c3aed',
    accent: '#6466f1',
    background: '#0f172a',
    text: '#f9fafb',
    heading: '#ffffff',
    codeBackground: '#1e293b',
    codeBorder: '#7c3aed',
    backgroundDark: '#0a0f1a',
    textDark: '#e0e0e0',
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    code: 'Fira Code, Consolas, monospace',
  },
  fontUrls: [],
  effects: {
    particles: true,
    glassMorphism: true,
    gradientText: true,
    transitions: 'smooth',
  },
  spacing: {
    slidePadding: '4rem 6rem',
    cardPadding: '2rem',
    gap: '2rem',
  },
  logo: null,
  logoPosition: 'top-right',
  logoSize: '50px',
};

/**
 * Merge theme with defaults
 * @param {Object} theme - User theme configuration
 * @returns {Object} - Merged theme
 */
function mergeTheme(theme = {}) {
  return {
    colors: { ...DEFAULT_THEME.colors, ...theme.colors },
    fonts: { ...DEFAULT_THEME.fonts, ...theme.fonts },
    fontUrls: theme.fontUrls || DEFAULT_THEME.fontUrls,
    effects: { ...DEFAULT_THEME.effects, ...theme.effects },
    spacing: { ...DEFAULT_THEME.spacing, ...theme.spacing },
    logo: theme.logo || DEFAULT_THEME.logo,
    logoPosition: theme.logoPosition || DEFAULT_THEME.logoPosition,
    logoSize: theme.logoSize || DEFAULT_THEME.logoSize,
  };
}

/**
 * Generate CSS for theme
 * @param {Object} theme - Theme configuration
 * @returns {string} - CSS string
 */
function generateThemeCSS(theme) {
  const t = mergeTheme(theme);

  return `
/* Theme Variables */
:root {
  /* Colors */
  --primary: ${t.colors.primary};
  --accent: ${t.colors.accent};
  --background: ${t.colors.background};
  --text: ${t.colors.text};
  --heading: ${t.colors.heading};
  --code-background: ${t.colors.codeBackground};
  --code-border: ${t.colors.codeBorder};
  --background-dark: ${t.colors.backgroundDark};
  --text-dark: ${t.colors.textDark};

  /* Fonts */
  --font-heading: ${t.fonts.heading};
  --font-body: ${t.fonts.body};
  --font-code: ${t.fonts.code};

  /* Spacing */
  --slide-padding: ${t.spacing.slidePadding};
  --card-padding: ${t.spacing.cardPadding};
  --gap: ${t.spacing.gap};

  /* Transitions */
  --transition-speed: ${t.effects.transitions === 'fast' ? '0.3s' : t.effects.transitions === 'none' ? '0s' : '0.6s'};
  --transition-timing: ease-in-out;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --background: var(--background-dark);
    --text: var(--text-dark);
  }
}

[data-theme="dark"] {
  --background: var(--background-dark);
  --text: var(--text-dark);
}

/* Base Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background: #000;
  color: var(--text);
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* Presentation Container */
.presentation-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

${t.effects.particles ? `
/* Animated background particles */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 20s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  25% { transform: translate(100px, -100px) scale(1.2); opacity: 0.5; }
  50% { transform: translate(-50px, 100px) scale(0.8); opacity: 0.2; }
  75% { transform: translate(150px, 50px) scale(1.1); opacity: 0.4; }
}
` : ''}

/* Slides Container */
.slides-container {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

/* Individual Slide */
.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--background);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--slide-padding);
  opacity: 0;
  visibility: hidden;
  transform: scale(0.95);
  transition: all var(--transition-speed) var(--transition-timing);
}

.slide.active {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  z-index: 2;
}

.slide.fade-out {
  opacity: 0;
  transform: scale(1.05);
}

.slide-content {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: calc(100vh - 8rem);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

${t.effects.gradientText ? `
h1 {
  background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 50%, var(--primary) 100%);
  background-size: 200% 200%;
  animation: gradient-shift 5s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  font-size: clamp(2rem, 4vw, 4rem);
  margin-bottom: 2rem;
  line-height: 1.2;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
` : `
h1 {
  color: var(--heading);
  font-weight: 900;
  font-size: clamp(2rem, 4vw, 4rem);
  margin-bottom: 2rem;
  line-height: 1.2;
}
`}

.slide-title {
  font-size: clamp(1.8rem, 3.5vw, 3rem);
  color: var(--heading);
  margin-bottom: 2rem;
}

.slide-subtitle {
  font-size: clamp(1rem, 1.8vw, 1.5rem);
  color: var(--text);
  opacity: 0.8;
  margin-bottom: 1rem;
}

h2 {
  color: var(--primary);
  font-weight: 700;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  margin-bottom: 1.5rem;
}

h3 {
  font-size: clamp(1.1rem, 1.8vw, 1.5rem);
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--heading);
}

p {
  font-size: clamp(0.9rem, 1.3vw, 1.1rem);
  line-height: 1.6;
  margin-bottom: 1rem;
}

${t.effects.glassMorphism ? `
/* Glass morphism effect */
.glass-card {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 16px;
  padding: var(--card-padding);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
` : `
.glass-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 16px;
  padding: var(--card-padding);
}
`}

.feature-card {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(100, 102, 241, 0.08) 100%);
  border: 1px solid rgba(124, 58, 237, 0.4);
  border-radius: 16px;
  padding: var(--card-padding);
  margin: 1rem 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(124, 58, 237, 0.6);
  box-shadow: 0 12px 40px rgba(124, 58, 237, 0.2);
}

/* Cover Layout */
.slide-cover .slide-content {
  justify-content: center;
  text-align: center;
}

.slide-cover .slide-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  margin-bottom: 1rem;
}

.slide-cover .slide-subtitle {
  font-size: clamp(1.2rem, 2.5vw, 2rem);
  opacity: 0.7;
}

.slide-cover .slide-meta {
  margin-top: 4rem;
  opacity: 0.6;
}

/* Center Layout */
.slide-center .slide-content {
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* Section Layout */
.slide-section {
  background: var(--primary);
  color: white;
}

.slide-section .slide-content {
  justify-content: center;
  text-align: center;
}

.section-title {
  font-size: clamp(2rem, 4vw, 4rem);
  color: white;
}

.section-subtitle {
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  opacity: 0.9;
}

/* Two Column Layout */
.two-column-container,
.code-split-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  flex: 1;
  align-items: start;
}

.column {
  height: 100%;
}

/* Three Column Layout */
.three-column-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  flex: 1;
  align-items: start;
}

/* Image Layouts */
.slide-image-left .slide-content,
.slide-image-right .slide-content {
  flex-direction: row;
  gap: 3rem;
  align-items: center;
}

.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 80vh;
}

.slide-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.image-placeholder {
  width: 100%;
  height: 400px;
  background: var(--primary);
  opacity: 0.1;
  border-radius: 8px;
}

/* Image Background Layout */
.slide-image-background {
  background-size: cover;
  background-position: center;
  position: relative;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.slide-image-background .slide-content {
  position: relative;
  z-index: 2;
  justify-content: center;
  text-align: center;
}

.slide-image-background .slide-title {
  color: white;
  font-size: clamp(2rem, 4vw, 4rem);
}

/* Code Layouts */
.code-container {
  flex: 1;
  overflow: auto;
  background: var(--code-background);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--code-border);
}

.code-block {
  font-family: var(--font-code);
  font-size: 0.9rem;
  line-height: 1.6;
  overflow: auto;
  margin: 0;
}

.code-block code {
  font-family: inherit;
}

.code-line {
  opacity: 0.3;
  transition: opacity 0.3s ease;
  position: relative;
}

.code-line.highlight {
  opacity: 1;
  background: rgba(124, 58, 237, 0.2);
  margin: 0 -1rem;
  padding: 0 1rem;
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; background: rgba(124, 58, 237, 0.3); }
}

/* Quote Layout */
.slide-quote .slide-content {
  justify-content: center;
  text-align: center;
}

.slide-quote blockquote {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-style: italic;
  line-height: 1.4;
  margin-bottom: 2rem;
  position: relative;
  padding: 0 2rem;
}

.quote-attribution {
  opacity: 0.7;
  font-size: 1.2rem;
}

.quote-author {
  font-weight: 600;
}

/* Fact Layout */
.slide-fact .slide-content {
  justify-content: center;
  text-align: center;
}

.fact-number {
  font-size: clamp(4rem, 8vw, 8rem);
  font-weight: 900;
  color: var(--primary);
  line-height: 1;
  margin-bottom: 2rem;
}

.fact-description {
  font-size: clamp(1.2rem, 2.2vw, 2rem);
  opacity: 0.8;
}

/* Statement Layout */
.slide-statement .slide-content {
  justify-content: center;
  text-align: center;
}

.statement-text {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.statement-subtitle {
  font-size: clamp(1rem, 1.8vw, 1.5rem);
  opacity: 0.7;
}

/* List Layouts */
.bullet-list,
.numbered-list {
  list-style-position: outside;
  padding-left: 2rem;
  flex: 1;
}

.bullet-list li,
.numbered-list li {
  font-size: clamp(1.1rem, 2vw, 1.8rem);
  line-height: 1.6;
  margin-bottom: 1rem;
  opacity: 0.9;
}

/* Progressive Disclosure (v-click) */
.v-click {
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.4s ease;
}

.v-click.active {
  opacity: 1;
  transform: translateX(0);
}

/* Comparison Layout */
.comparison-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  flex: 1;
  align-items: start;
}

.comparison-divider {
  width: 2px;
  background: var(--primary);
  opacity: 0.3;
  height: 100%;
}

.comparison-title {
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  margin-bottom: 1.5rem;
  color: var(--primary);
}

/* Timeline Layout */
.timeline-container {
  flex: 1;
  position: relative;
  padding-left: 3rem;
}

.timeline-item {
  position: relative;
  padding-bottom: 3rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -3rem;
  top: 0.5rem;
  width: 1rem;
  height: 1rem;
  background: var(--primary);
  border-radius: 50%;
}

.timeline-marker::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  width: 2px;
  height: 3rem;
  background: var(--primary);
  opacity: 0.3;
  transform: translateX(-50%);
}

.timeline-item:last-child .timeline-marker::before {
  display: none;
}

.timeline-date {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.timeline-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.timeline-description {
  opacity: 0.8;
}

/* Markdown Content Styles */
.markdown-content h1 { font-size: clamp(1.5rem, 3vw, 2.5rem); margin-bottom: 1rem; }
.markdown-content h2 { font-size: clamp(1.3rem, 2.4vw, 2rem); margin-bottom: 1rem; }
.markdown-content h3 { font-size: clamp(1.1rem, 1.8vw, 1.5rem); margin-bottom: 0.75rem; }
.markdown-content p { font-size: clamp(0.9rem, 1.4vw, 1.2rem); margin-bottom: 1rem; }
.markdown-content ul, .markdown-content ol { padding-left: 2rem; margin-bottom: 1rem; }
.markdown-content li { margin-bottom: 0.5rem; font-size: clamp(0.85rem, 1.3vw, 1.1rem); }
.markdown-content code {
  font-family: var(--font-code);
  background: rgba(0, 0, 0, 0.2);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}
.markdown-content pre {
  background: var(--code-background);
  color: #abb2bf;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  margin-bottom: 1rem;
}
.markdown-content pre code {
  background: none;
  padding: 0;
  color: inherit;
}

/* Navigation Controls */
.nav-controls {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  display: flex;
  gap: 1rem;
  align-items: center;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(20px);
  padding: 0.75rem 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(124, 58, 237, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.nav-button {
  background: rgba(124, 58, 237, 0.2);
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background: rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.slide-counter {
  color: var(--text);
  font-size: 0.9rem;
  min-width: 4rem;
  text-align: center;
}

/* Progress Bar */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
  transition: width var(--transition-speed);
}

/* Slide Dots */
.slide-dots {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 100;
}

.slide-dot {
  width: 8px;
  height: 8px;
  background: rgba(124, 58, 237, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slide-dot:hover {
  background: rgba(124, 58, 237, 0.5);
  transform: scale(1.2);
}

.slide-dot.active {
  background: var(--primary);
  transform: scale(1.5);
}

/* Logo */
.presentation-logo {
  position: fixed;
  z-index: 100;
  max-height: ${t.logoSize};
  width: auto;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.presentation-logo:hover {
  opacity: 1;
}

.presentation-logo.logo-top-left {
  top: 1.5rem;
  left: 1.5rem;
}

.presentation-logo.logo-top-right {
  top: 1.5rem;
  right: 1.5rem;
}

.presentation-logo.logo-bottom-left {
  bottom: 1.5rem;
  left: 1.5rem;
}

.presentation-logo.logo-bottom-right {
  bottom: 5rem;
  right: 1.5rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  :root {
    --slide-padding: 2rem;
  }

  .slide-title { font-size: 2.5rem; }
  .slide-cover .slide-title { font-size: 3.5rem; }

  .two-column-container,
  .three-column-container,
  .code-split-container {
    grid-template-columns: 1fr;
  }

  .slide-image-left .slide-content,
  .slide-image-right .slide-content {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  :root {
    --slide-padding: 1.5rem;
  }

  .slide-title { font-size: 2rem; }
  .slide-cover .slide-title { font-size: 3rem; }
  .fact-number { font-size: 5rem; }

  .nav-controls {
    bottom: 1rem;
    padding: 0.5rem 1rem;
  }

  .slide-dots {
    right: 1rem;
  }
}

/* Video Layout */
.slide-video .slide-content {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.video-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 75vh;
  width: 100%;
}

.video-container video,
.video-container img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 12px;
  border: 1px solid rgba(124, 58, 237, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Fullscreen video/image slide */
.slide-video-fullscreen,
.slide-image-fullscreen {
  padding: 0 !important;
  background: #000;
}

.slide-video-fullscreen video,
.slide-image-fullscreen img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.slide-video-fullscreen.active ~ .presentation-logo,
.slide-image-fullscreen.active ~ .presentation-logo,
body:has(.slide-video-fullscreen.active) .presentation-logo,
body:has(.slide-image-fullscreen.active) .presentation-logo {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* Print Styles */
@media print {
  .nav-controls,
  .progress-bar,
  .slide-dots,
  .particles {
    display: none !important;
  }

  .slide {
    position: relative !important;
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    page-break-after: always;
  }
}
`;
}

/**
 * Generate JavaScript for presentation functionality
 * @param {Object} theme - Theme configuration
 * @param {number} totalSlides - Total number of slides
 * @returns {string} - JavaScript string
 */
function generatePresentationJS(theme, totalSlides) {
  const t = mergeTheme(theme);

  return `
// Presentation State
let currentSlide = 0;
let slides = [];
let clickSteps = [];
let currentClickStep = 0;

// Initialize presentation
document.addEventListener('DOMContentLoaded', () => {
  initPresentation();
  setupKeyboardNavigation();
  ${t.effects.particles ? 'createParticles();' : ''}
  createDots();
  updateProgressBar();
});

${t.effects.particles ? `
// Create particles
function createParticles() {
  const particles = document.getElementById('particles');
  if (!particles) return;
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.width = \`\${Math.random() * 100 + 50}px\`;
    particle.style.height = particle.style.width;
    particle.style.left = \`\${Math.random() * 100}%\`;
    particle.style.top = \`\${Math.random() * 100}%\`;
    particle.style.animationDelay = \`\${Math.random() * 10}s\`;
    particle.style.animationDuration = \`\${Math.random() * 20 + 15}s\`;
    particles.appendChild(particle);
  }
}
` : ''}

// Create slide dots
function createDots() {
  const slideDots = document.getElementById('slideDots');
  if (!slideDots) return;
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('div');
    dot.className = 'slide-dot';
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    slideDots.appendChild(dot);
  }
}

// Initialize presentation
function initPresentation() {
  slides = Array.from(document.querySelectorAll('.slide'));

  // Initialize click steps for each slide
  slides.forEach((slide, index) => {
    const vClicks = slide.querySelectorAll('.v-click');
    clickSteps[index] = vClicks.length;
  });

  showSlide(0);
}

// Show specific slide
function showSlide(index) {
  if (index < 0 || index >= slides.length) return;

  // Hide all slides
  slides.forEach(slide => slide.classList.remove('active', 'fade-out'));

  // Show current slide
  currentSlide = index;
  setTimeout(() => slides[currentSlide].classList.add('active'), 50);

  // Reset click steps
  currentClickStep = 0;
  resetClickSteps();

  // Update UI
  updateSlideCounter();
  updateProgressBar();
  updateSlideDots();

  // Trigger slide animations
  triggerSlideAnimations();

  // Highlight code if present
  if (window.Prism) {
    Prism.highlightAllUnder(slides[currentSlide]);
  }

  // Toggle logo visibility based on slide's data-hide-logo attribute
  const logo = document.querySelector('.presentation-logo');
  if (logo) {
    const hideLogo = slides[currentSlide].dataset.hideLogo === 'true';
    logo.style.opacity = hideLogo ? '0' : '';
    logo.style.pointerEvents = hideLogo ? 'none' : '';
  }
}

// Trigger slide-specific animations
function triggerSlideAnimations() {
  const currentSlideEl = slides[currentSlide];
  if (!currentSlideEl) return;

  // Auto-animate timeline items
  const timelineItems = currentSlideEl.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    setTimeout(() => item.classList.add('visible'), index * 200);
  });

  // Auto-animate grid cards
  const gridCards = currentSlideEl.querySelectorAll('.grid-2 > *, .grid-3 > *');
  gridCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, index * 150);
  });
}

// Next slide or click step
function nextSlide() {
  const currentSlideEl = slides[currentSlide];
  const vClicks = currentSlideEl?.querySelectorAll('.v-click');
  const codeLines = currentSlideEl?.querySelectorAll('.code-line');

  // Handle click items
  if (vClicks && currentClickStep < vClicks.length) {
    vClicks[currentClickStep].classList.add('active');
    currentClickStep++;
    return;
  }

  // Handle code highlighting steps
  if (codeLines && codeLines.length > 0 && currentClickStep < codeLines.length) {
    codeLines.forEach(line => line.classList.remove('highlight'));
    codeLines[currentClickStep]?.classList.add('highlight');
    currentClickStep++;
    return;
  }

  // Move to next slide
  if (currentSlide < slides.length - 1) {
    slides[currentSlide].classList.add('fade-out');
    currentSlide++;
    currentClickStep = 0;
    showSlide(currentSlide);
  }
}

// Previous slide or click step
function prevSlide() {
  if (currentClickStep > 0) {
    currentClickStep = 0;
    showSlide(currentSlide);
  } else if (currentSlide > 0) {
    currentSlide--;
    currentClickStep = 0;
    showSlide(currentSlide);
  }
}

// Jump directly to next/prev slide (skip click steps)
function nextSlideSkipClicks() {
  if (currentSlide < slides.length - 1) {
    showSlide(currentSlide + 1);
  }
}

function prevSlideSkipClicks() {
  if (currentSlide > 0) {
    showSlide(currentSlide - 1);
  }
}

// Reset click steps for current slide
function resetClickSteps() {
  const currentSlideEl = slides[currentSlide];
  const vClicks = currentSlideEl?.querySelectorAll('.v-click');
  if (vClicks) {
    vClicks.forEach(el => el.classList.remove('active'));
  }
}

// Go to first slide
function firstSlide() {
  showSlide(0);
}

// Go to last slide
function lastSlide() {
  showSlide(slides.length - 1);
}

// Go to specific slide
function goToSlide(index) {
  showSlide(index);
}

// Update slide counter
function updateSlideCounter() {
  const counter = document.querySelector('.slide-counter');
  if (counter) {
    counter.textContent = \`\${currentSlide + 1} / \${slides.length}\`;
  }
}

// Update progress bar
function updateProgressBar() {
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    const progress = ((currentSlide + 1) / slides.length) * 100;
    progressFill.style.width = \`\${progress}%\`;
  }
}

// Update slide dots
function updateSlideDots() {
  const dots = document.querySelectorAll('.slide-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Keyboard navigation
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevSlide();
        break;
      case 'ArrowDown':
        e.preventDefault();
        nextSlideSkipClicks();
        break;
      case 'ArrowUp':
        e.preventDefault();
        prevSlideSkipClicks();
        break;
      case 'Home':
        e.preventDefault();
        firstSlide();
        break;
      case 'End':
        e.preventDefault();
        lastSlide();
        break;
    }
  });
}

// Export for inline handlers
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
`;
}

/**
 * Generate complete HTML file
 * @param {Object} config - Presentation configuration
 * @returns {string} - Complete HTML string
 */
function generateHTML(config) {
  const theme = mergeTheme(config.theme);
  const metadata = config.metadata || {};

  // Generate slides HTML
  const slidesHTML = config.slides.map((slide, index) => {
    const layoutName = slide.layout || 'default';
    const layoutFn = getLayout(layoutName);

    if (!layoutFn) {
      console.warn(`Warning: Layout "${layoutName}" not found, using default`);
      return getLayout('default')(slide.data || {});
    }

    return layoutFn(slide.data || {});
  }).join('\n');

  // Generate slide dots
  const slideDotsHTML = config.slides.map((_, index) =>
    `<div class="slide-dot" onclick="goToSlide(${index})"></div>`
  ).join('\n');

  // Font links
  const fontLinks = theme.fontUrls.map(url =>
    `<link href="${url}" rel="stylesheet">`
  ).join('\n    ');

  // Logo HTML
  const logoPositionClass = `logo-${theme.logoPosition.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
  const logoHTML = theme.logo 
    ? `<img src="${theme.logo}" alt="Logo" class="presentation-logo ${logoPositionClass}" />`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${metadata.description || ''}">
  <meta name="author" content="${metadata.author || ''}">
  <title>${metadata.title || 'Presentation'}</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${fontLinks || '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Fira+Code&display=swap" rel="stylesheet">'}

  <!-- Prism.js for code highlighting -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet" />

  <!-- Theme CSS -->
  <link rel="stylesheet" href="css/theme.css">

  <!-- Marked.js for markdown parsing -->
  <script src="https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js"></script>
</head>
<body>
  ${theme.effects.particles ? '<div class="particles" id="particles"></div>' : ''}
  ${logoHTML}

  <div class="presentation-container">
    <!-- Progress Bar -->
    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>

    <!-- Slides -->
    <div class="slides-container">
${slidesHTML}
    </div>

    <!-- Navigation Controls -->
    <div class="nav-controls">
      <button class="nav-button" onclick="prevSlide()" title="Previous (←)">←</button>
      <span class="slide-counter">1 / ${config.slides.length}</span>
      <button class="nav-button" onclick="nextSlide()" title="Next (→)">→</button>
    </div>

    <!-- Slide Dots -->
    <div class="slide-dots" id="slideDots"></div>
  </div>

  <!-- Prism.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markdown.min.js"></script>

  <!-- Presentation JS -->
  <script src="js/presentation.js"></script>

  <!-- Parse markdown content after page load -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Parse all markdown content
      document.querySelectorAll('.markdown-content').forEach(el => {
        const markdown = el.textContent.trim();
        el.innerHTML = marked.parse(markdown);
      });

      // Re-run Prism highlighting
      if (window.Prism) {
        Prism.highlightAll();
      }
    });
  </script>
</body>
</html>`;
}

/**
 * Generate presentation folder structure
 * @param {Object} config - Presentation configuration
 * @param {string} outputDir - Output directory path
 */
function generatePresentation(config, outputDir) {
  // Create output directory structure
  const dirs = {
    root: outputDir,
    css: path.join(outputDir, 'css'),
    js: path.join(outputDir, 'js'),
    assets: path.join(outputDir, 'assets'),
  };

  Object.values(dirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  console.log('Generating presentation files...');

  // 1. Generate index.html
  const html = generateHTML(config);
  fs.writeFileSync(path.join(dirs.root, 'index.html'), html);
  console.log('  ✓ Generated index.html');

  // 2. Generate theme.css
  const css = generateThemeCSS(config.theme || {});
  fs.writeFileSync(path.join(dirs.css, 'theme.css'), css);
  console.log('  ✓ Generated css/theme.css');

  // 3. Generate presentation.js
  const js = generatePresentationJS(config.theme || {}, config.slides.length);
  fs.writeFileSync(path.join(dirs.js, 'presentation.js'), js);
  console.log('  ✓ Generated js/presentation.js');

  // 4. Assets directory ready
  console.log('  ✓ Assets directory ready');

  console.log(`\n✅ Presentation generated successfully!`);
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`📊 Total slides: ${config.slides.length}`);
  console.log(`🎨 Theme: ${config.theme?.colors?.primary || DEFAULT_THEME.colors.primary}`);
  console.log(`🌐 Open ${path.join(outputDir, 'index.html')} in your browser`);
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  let configPath = null;
  let outputDir = null;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && i + 1 < args.length) {
      configPath = args[i + 1];
      i++;
    } else if (args[i] === '--output' && i + 1 < args.length) {
      outputDir = args[i + 1];
      i++;
    }
  }

  if (!configPath) {
    console.error('Usage: node generate.js --config <config.json> --output <output-folder/>');
    console.error('Example: node generate.js --config presentation.json --output my-slides/');
    process.exit(1);
  }

  // Check if config file exists
  if (!fs.existsSync(configPath)) {
    console.error(`Error: Config file not found: ${configPath}`);
    process.exit(1);
  }

  // Read and parse config
  let config;
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(configContent);
  } catch (error) {
    console.error(`Error reading/parsing config file: ${error.message}`);
    process.exit(1);
  }

  // Determine output directory
  if (!outputDir) {
    const title = config.metadata?.title || 'presentation';
    outputDir = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  // Generate presentation
  try {
    generatePresentation(config, outputDir);
  } catch (error) {
    console.error(`Error generating presentation: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generatePresentation, generateHTML, generateThemeCSS, generatePresentationJS, mergeTheme };
