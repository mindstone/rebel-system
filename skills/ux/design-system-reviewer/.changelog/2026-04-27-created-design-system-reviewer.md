# Created Design System Reviewer

**Date**: 2026-04-27
**Author**: Rebel

## What Changed

Created a new `design-system-reviewer` skill for reviewing Rebel UI component changes, shared primitive migrations, Storybook coverage, and design-system contract risks.

## Why

Recent Storybook and shared-component work showed a repeated failure mode: fixing one visible mismatch while missing adjacent component contracts such as icon size, gap, density, ghost/framed role, focus ownership, or pattern semantics.

## Impact

Agents now have a focused reviewer role that should catch migration-safety issues before the user has to enumerate every adjacent detail.
