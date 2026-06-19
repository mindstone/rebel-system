#!/usr/bin/env -S npx -y -p tsx@^4 tsx

/**
 * cleanup-conflict-copies — standalone cloud-sync conflict-copy tidier (zero-install, tsx)
 * ============================================================================================
 *
 * ## The bug this cleans up
 *
 * When two machines write the SAME file on a shared cloud drive (Google Drive,
 * Dropbox, OneDrive, etc.) the sync client cannot reconcile the two versions, so
 * instead of overwriting it MINTS A CONFLICT COPY beside the original:
 *
 *     notes.md                                 (the real file)
 *     notes (1).md                             ← Google Drive numbered copy
 *     report (conflicted copy 2026-06-01).md   ← Dropbox conflicted copy
 *     state-conflict-202606010001.json         ← generic sync-conflict marker
 *
 * Most of the time the conflict copy is BYTE-FOR-BYTE IDENTICAL to the original
 * (the "conflict" was a false alarm — both machines wrote the same bytes). Rebel's
 * older sync amplified this: a single shared memory/space folder could accumulate
 * THOUSANDS of `(1)`, `(1) (1)`, `(1) (1) (1)`… duplicates of the same handful of files.
 *
 * The in-app auto-cleanup release fixes this going forward, but until it reaches a
 * given user this script lets them (or their Rebel agent) clean up the EXISTING
 * mess immediately.
 *
 * ## What this script does
 *
 * 1. Walks <target-dir> and builds a snapshot of {relPath, sha256, size} for every
 *    regular file (skipping dot-dirs, node_modules, the quarantine dir, and never
 *    following symlinks out of the tree).
 * 2. Runs a PURE planner (a faithful port of the app's already-vetted
 *    `planConflictCopyCleanup` engine — see KEEP-IN-SYNC notes below) that, for each
 *    conflict-copy file, looks up its IMMEDIATE parent (one conflict-suffix peeled)
 *    in the snapshot and decides:
 *       - byte-identical to its immediate parent  AND  a machine-generated label
 *         (numbered-copy / dropbox-conflict / sync-conflict)  → toQuarantine
 *       - anything else (differing, empty, parent missing, human "Copy of"/"… copy"
 *         labels) → needsReview  (NEVER auto-moved)
 * 3. By DEFAULT it only PREVIEWS (dry run). With `--apply` it MOVES each
 *    toQuarantine file into `<target-dir>/.rebel/conflicts-cleanup/<YYYY-MM-DD>/<relPath>`,
 *    preserving structure, never overwriting (adds ` (n)` on collision), never
 *    deleting, never OS-trashing — so the worst case is fully recoverable.
 *
 * ## Safety guarantees (mirrors docs/plans/260601_rebel62a-conflict-cleanup-migration/PLAN.md §"Safety Contract")
 *   - DRY RUN IS THE DEFAULT. `--apply` is required to touch the filesystem.
 *   - BYTE-IDENTICAL ONLY. A file is moved only if sha256 == its immediate parent's,
 *     and both are non-empty. Differing copies are NEVER moved.
 *   - IMMEDIATE-PARENT COMPARE ONLY. We peel exactly ONE conflict suffix and compare
 *     to that parent — no recursive cross-label collapse (a `budget copy (1).md`
 *     is compared to `budget copy.md`, never jumped to `budget.md`). Chains still
 *     resolve level-by-level because comparison is against the snapshot.
 *   - MACHINE LABELS ONLY are auto-eligible. `Copy of …` and `… copy.ext` (deliberate
 *     human names) are DETECT-ONLY → always needs-review.
 *   - MOVE, NEVER DELETE. We move into an in-tree quarantine; we never call unlink
 *     on a user file, never OS-trash, never overwrite.
 *   - ATOMIC NO-OVERWRITE. Each destination is claimed with an exclusive create
 *     (`openSync(dest, 'wx')`) before the move, so a file racing into that path
 *     gets EEXIST and we bump the ` (n)` suffix — no existsSync→rename TOCTOU.
 *   - REFUSES A NON-WRITABLE TARGET. `--apply` preflights write access and fails
 *     clearly upfront rather than partway through a storm.
 *   - REHASH-RACE GUARD. Each file is re-hashed immediately before moving; if it
 *     changed since the snapshot it is skipped and reported.
 *   - NO NETWORK. NO SYMLINK ESCAPE. Refuses to run on `/` or a home root.
 *   - AUDITABLE. A per-run JSONL manifest is written next to the quarantine.
 *
 * ## Usage
 *
 *     cleanup-conflict-copies <target-dir> [--apply] [--json]
 *
 *     # Preview only (safe, default):
 *     ./rebel-system/scripts/cleanup-conflict-copies.ts ~/MyDrive/CompanyDrive/memory
 *
 *     # Actually move the byte-identical duplicates to quarantine:
 *     ./rebel-system/scripts/cleanup-conflict-copies.ts ~/MyDrive/CompanyDrive/memory --apply
 *
 *     # Machine-readable output:
 *     ./rebel-system/scripts/cleanup-conflict-copies.ts ~/MyDrive/CompanyDrive/memory --json
 *
 * To recover anything: the quarantine folder is a plain directory tree under
 * `<target-dir>/.rebel/conflicts-cleanup/<date>/` — move files back manually, and
 * consult `_cleanup-manifest.jsonl` for the original relative paths and hashes.
 */

import { createHash } from 'node:crypto';
import {
  accessSync,
  closeSync,
  constants as fsConstants,
  existsSync,
  lstatSync,
  mkdirSync,
  openSync,
  readSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeSync,
} from 'node:fs';
import { homedir, hostname } from 'node:os';
import path from 'node:path';

// ============================================================================
// VENDORED CONFLICT PATTERNS
// KEEP IN SYNC WITH src/shared/conflictPatterns.ts
// ----------------------------------------------------------------------------
// This script ships inside the `rebel-system` submodule and runs standalone via
// tsx, so it CANNOT import the superproject `src/`. The constants/functions
// below are copied VERBATIM from src/shared/conflictPatterns.ts. The superproject
// parity test (scripts/__tests__/cleanup-conflict-copies.test.ts) imports BOTH
// the canonical module and this vendored copy and asserts the pattern
// sources/labels/providers match, so any drift fails CI.
// ============================================================================

/**
 * Marker suffix produced by `cloudWorkspaceSync` when local and cloud edits
 * diverge. Kept in lock-step with the `rebel-cloud-conflict` entry of
 * `CONFLICT_PATTERNS`.
 */
export const WORKSPACE_CONFLICT_MARKER = '.conflict-cloud';

export type ConflictProvider = 'rebel' | 'dropbox' | 'google-drive' | 'generic';

export type ConflictLabel =
  | 'rebel-cloud-conflict'
  | 'dropbox-conflict'
  | 'numbered-copy'
  | 'copy-of-duplicate'
  | 'copy-suffix-duplicate'
  | 'sync-conflict';

export interface ConflictPattern {
  regex: RegExp;
  label: ConflictLabel;
  provider: ConflictProvider;
}

/**
 * Conflict filename patterns, evaluated in order. First match wins.
 */
export const CONFLICT_PATTERNS: readonly ConflictPattern[] = [
  { regex: /\.conflict-cloud(\.\w+)?$/,  label: 'rebel-cloud-conflict',   provider: 'rebel' },
  { regex: /\(conflicted copy[^)]*\)/i,  label: 'dropbox-conflict',       provider: 'dropbox' },
  { regex: /\(\d+\)\.\w+$/,              label: 'numbered-copy',          provider: 'google-drive' },
  { regex: /^Copy of /i,                 label: 'copy-of-duplicate',      provider: 'generic' },
  { regex: / copy\.\w+$/i,               label: 'copy-suffix-duplicate',  provider: 'generic' },
  { regex: /-conflict-\d{4,}/i,          label: 'sync-conflict',          provider: 'generic' },
] as const;

/**
 * Match a filename against the known conflict patterns.
 * Returns the first matching pattern, or `null` if none match.
 * Pass the BASENAME — not the full path.
 */
export function matchConflictPattern(fileName: string): ConflictPattern | null {
  for (const pattern of CONFLICT_PATTERNS) {
    if (pattern.regex.test(fileName)) {
      return pattern;
    }
  }
  return null;
}

/**
 * Given a path to a conflict file and the label of the pattern it matched,
 * return the path to the probable original file. Returns `null` when ambiguous.
 */
export function deriveOriginalPath(conflictPath: string, label: ConflictLabel): string | null {
  const dir = path.dirname(conflictPath);
  const name = path.basename(conflictPath);

  const baseName = deriveOriginalBaseName(name, label);
  if (!baseName) return null;

  if (dir === '.' || dir === '') return baseName;
  return path.join(dir, baseName);
}

function deriveOriginalBaseName(fileName: string, label: ConflictLabel): string | null {
  switch (label) {
    case 'rebel-cloud-conflict': {
      if (fileName.endsWith(WORKSPACE_CONFLICT_MARKER)) {
        const base = fileName.slice(0, -WORKSPACE_CONFLICT_MARKER.length);
        return base.length > 0 ? base : null;
      }
      const markerWithDelimiter = `${WORKSPACE_CONFLICT_MARKER}.`;
      const markerIdx = fileName.lastIndexOf(markerWithDelimiter);
      if (markerIdx <= 0) return null;
      const base = fileName.slice(0, markerIdx);
      const ext = fileName.slice(markerIdx + markerWithDelimiter.length);
      if (!base || !ext) return null;
      return `${base}.${ext}`;
    }

    case 'dropbox-conflict': {
      const stripped = fileName.replace(/\s*\(conflicted copy[^)]*\)/i, '');
      return stripped && stripped !== fileName ? stripped : null;
    }

    case 'numbered-copy': {
      const stripped = fileName.replace(/\s*\(\d+\)(\.\w+)$/, '$1');
      return stripped && stripped !== fileName ? stripped : null;
    }

    case 'copy-of-duplicate': {
      const stripped = fileName.replace(/^Copy of /i, '');
      return stripped && stripped !== fileName ? stripped : null;
    }

    case 'copy-suffix-duplicate': {
      const stripped = fileName.replace(/ copy(\.\w+)$/i, '$1');
      return stripped && stripped !== fileName ? stripped : null;
    }

    case 'sync-conflict': {
      const stripped = fileName.replace(/-conflict-\d{4,}/i, '');
      return stripped && stripped !== fileName ? stripped : null;
    }

    default:
      return null;
  }
}

// ============================================================================
// VENDORED PLANNER
// KEEP IN SYNC WITH src/core/services/conflictCopyCleanup.ts
// ----------------------------------------------------------------------------
// Faithful port of the reviewed pure planner: immediate-parent compare only (NO
// cross-label collapse), machine labels only, identical-to-immediate-parent →
// quarantine, everything else → review. Pure + order-independent.
// ============================================================================

export interface ConflictSnapshotEntry {
  relPath: string;
  hash: string | null;
  size: number;
}

export const AUTO_ELIGIBLE_LABELS: ReadonlySet<ConflictLabel> = new Set<ConflictLabel>([
  'numbered-copy',
  'dropbox-conflict',
  'sync-conflict',
]);

export interface QuarantineCandidate {
  relPath: string;
  immediateParentRelPath: string;
  label: ConflictLabel;
  provider: ConflictProvider;
  hash: string;
}

export type ReviewReason =
  | 'differing-from-parent'
  | 'parent-missing'
  | 'empty-or-placeholder'
  | 'parent-empty-or-unreadable'
  | 'detect-only-label';

export interface ReviewItem {
  relPath: string;
  label: ConflictLabel;
  provider: ConflictProvider;
  immediateParentRelPath: string | null;
  reason: ReviewReason;
}

export interface CleanupPlan {
  toQuarantine: QuarantineCandidate[];
  needsReview: ReviewItem[];
}

/**
 * Same-directory immediate parent (ONE suffix peeled).
 * Returns null if relPath is not a conflict copy or if it is Rebel's own conflict marker.
 *
 * Uses path.posix because snapshot relPaths are normalized to forward slashes.
 */
export function deriveImmediateParentRelPath(
  relPath: string,
): { parentRelPath: string; label: ConflictLabel; provider: ConflictProvider } | null {
  const basename = path.posix.basename(relPath);
  const match = matchConflictPattern(basename);
  if (!match || match.label === 'rebel-cloud-conflict') {
    return null;
  }

  // deriveOriginalPath uses platform `path`; on a bare basename with no
  // separators it behaves identically to posix, so derive on the basename only.
  const parentBasename = deriveOriginalPath(basename, match.label);
  if (!parentBasename || parentBasename === basename) {
    return null;
  }

  const dirname = path.posix.dirname(relPath);
  const parentRelPath =
    dirname === '.' || dirname === ''
      ? parentBasename
      : path.posix.join(dirname, parentBasename);

  return {
    parentRelPath,
    label: match.label,
    provider: match.provider,
  };
}

/** Pure, order-independent. Builds the plan from a snapshot. */
export function planConflictCopyCleanup(snapshot: readonly ConflictSnapshotEntry[]): CleanupPlan {
  const byRelPath = new Map<string, ConflictSnapshotEntry>();
  for (const entry of snapshot) {
    byRelPath.set(entry.relPath, entry);
  }

  const toQuarantine: QuarantineCandidate[] = [];
  const needsReview: ReviewItem[] = [];

  for (const entry of snapshot) {
    const parent = deriveImmediateParentRelPath(entry.relPath);
    if (!parent) {
      continue;
    }

    if (!AUTO_ELIGIBLE_LABELS.has(parent.label)) {
      needsReview.push({
        relPath: entry.relPath,
        label: parent.label,
        provider: parent.provider,
        immediateParentRelPath: parent.parentRelPath,
        reason: 'detect-only-label',
      });
      continue;
    }

    if (entry.size === 0 || entry.hash == null) {
      needsReview.push({
        relPath: entry.relPath,
        label: parent.label,
        provider: parent.provider,
        immediateParentRelPath: parent.parentRelPath,
        reason: 'empty-or-placeholder',
      });
      continue;
    }

    const parentEntry = byRelPath.get(parent.parentRelPath);
    if (!parentEntry) {
      needsReview.push({
        relPath: entry.relPath,
        label: parent.label,
        provider: parent.provider,
        immediateParentRelPath: parent.parentRelPath,
        reason: 'parent-missing',
      });
      continue;
    }

    if (parentEntry.size === 0 || parentEntry.hash == null) {
      needsReview.push({
        relPath: entry.relPath,
        label: parent.label,
        provider: parent.provider,
        immediateParentRelPath: parent.parentRelPath,
        reason: 'parent-empty-or-unreadable',
      });
      continue;
    }

    if (parentEntry.hash === entry.hash) {
      toQuarantine.push({
        relPath: entry.relPath,
        immediateParentRelPath: parent.parentRelPath,
        label: parent.label,
        provider: parent.provider,
        hash: entry.hash,
      });
      continue;
    }

    needsReview.push({
      relPath: entry.relPath,
      label: parent.label,
      provider: parent.provider,
      immediateParentRelPath: parent.parentRelPath,
      reason: 'differing-from-parent',
    });
  }

  return {
    toQuarantine: toQuarantine.sort(compareByRelPath),
    needsReview: needsReview.sort(compareByRelPath),
  };
}

function compareByRelPath<T extends { relPath: string }>(a: T, b: T): number {
  if (a.relPath < b.relPath) return -1;
  if (a.relPath > b.relPath) return 1;
  return 0;
}

// ============================================================================
// FILESYSTEM LAYER (script-specific — not in the engine)
// ============================================================================

/** Name of the in-tree quarantine directory. Mirrors the app's `conflicts-cleanup`. */
export const QUARANTINE_DIR_NAME = 'conflicts-cleanup';
/** Parent dir for the quarantine (`.rebel/conflicts-cleanup/<date>`). */
export const REBEL_DIR_NAME = '.rebel';
/** Manifest filename written per run inside the dated quarantine dir. */
export const MANIFEST_FILENAME = '_cleanup-manifest.jsonl';

/**
 * Directory names we never descend into while walking. Dot-dirs (incl. `.rebel`)
 * are skipped by the leading-dot rule; these are extra heavy/irrelevant trees.
 */
const ALWAYS_SKIP_DIRS = new Set<string>(['node_modules']);

/** SHA-256 of a file's bytes. Returns null if unreadable. */
export function hashFile(absPath: string): string | null {
  try {
    const hash = createHash('sha256');
    const fd = openSync(absPath, 'r');
    try {
      const buf = Buffer.allocUnsafe(64 * 1024);
      let bytesRead = readSync(fd, buf, 0, buf.length, null);
      while (bytesRead > 0) {
        hash.update(buf.subarray(0, bytesRead));
        bytesRead = readSync(fd, buf, 0, buf.length, null);
      }
    } finally {
      closeSync(fd);
    }
    return hash.digest('hex');
  } catch {
    return null;
  }
}

/**
 * Walk `targetDirAbs` and build a snapshot of every regular file.
 *
 * Safety:
 *   - skips dot-dirs (incl. `.rebel`, which contains the quarantine)
 *   - skips ALWAYS_SKIP_DIRS (node_modules)
 *   - NEVER follows directory symlinks (uses lstat; symlinked dirs are skipped)
 *   - skips symlinked files (only regular files are hashed)
 *
 * relPaths are normalized to forward slashes so the posix-based planner is
 * platform-independent.
 */
export function buildSnapshot(targetDirAbs: string): ConflictSnapshotEntry[] {
  const snapshot: ConflictSnapshotEntry[] = [];

  function walk(dirAbs: string): void {
    let entries: import('node:fs').Dirent[];
    try {
      entries = readdirSync(dirAbs, { withFileTypes: true });
    } catch {
      return;
    }

    for (const dirent of entries) {
      const name = dirent.name;
      const childAbs = path.join(dirAbs, name);

      if (dirent.isSymbolicLink()) {
        // Never follow symlinks (no escape out of the tree); never hash them.
        continue;
      }

      if (dirent.isDirectory()) {
        if (name.startsWith('.') || ALWAYS_SKIP_DIRS.has(name)) {
          // Dot-dirs (incl. `.rebel`/quarantine) and heavy trees are skipped.
          continue;
        }
        walk(childAbs);
        continue;
      }

      if (dirent.isFile()) {
        let size: number;
        try {
          size = statSync(childAbs).size;
        } catch {
          continue;
        }
        const relPath = path
          .relative(targetDirAbs, childAbs)
          .split(path.sep)
          .join('/');
        // 0-byte / placeholder files get hash=null so the planner reviews (never moves) them.
        const hash = size === 0 ? null : hashFile(childAbs);
        snapshot.push({ relPath, hash, size });
      }
    }
  }

  walk(targetDirAbs);
  return snapshot;
}

/** Local-time YYYY-MM-DD for the dated quarantine folder. */
export function dateStamp(now: Date = new Date()): string {
  const y = now.getFullYear().toString();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Atomically RESERVE a non-colliding destination path. Tries `destAbs` first,
 * then inserts ` (n)` before the extension: `foo.md` → `foo (1).md`,
 * `foo (1).md` → `foo (2).md`, …
 *
 * Each candidate is claimed with an EXCLUSIVE create (`openSync(dest, 'wx')`),
 * which fails with EEXIST if the path already exists OR if a racing creator
 * wins between candidates — closing the classic existsSync→rename TOCTOU. On
 * EEXIST we advance to the next suffix. The caller then `renameSync()`s the
 * source over our own 0-byte reservation (so it only ever replaces a file WE
 * just created, NEVER a pre-existing user file).
 *
 * Returns the reserved absolute path. The reservation directory must already
 * exist (the caller mkdirs it).
 */
export function reserveNonCollidingDest(destAbs: string): string {
  const dir = path.dirname(destAbs);
  const ext = path.extname(destAbs);
  const stem = path.basename(destAbs, ext);

  const tryReserve = (candidate: string): boolean => {
    try {
      // 'wx' = exclusive create: fails with EEXIST if the path exists already
      // OR if a racing process creates it first. This is the atomic claim.
      const fd = openSync(candidate, 'wx');
      closeSync(fd);
      return true;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
        return false;
      }
      throw err;
    }
  };

  if (tryReserve(destAbs)) return destAbs;
  for (let n = 1; n < 100000; n++) {
    const candidate = path.join(dir, `${stem} (${n})${ext}`);
    if (tryReserve(candidate)) return candidate;
  }
  // Astronomically unlikely; fall back to a timestamped name rather than overwrite.
  // Still reserved exclusively — if even this races, openSync throws (no overwrite).
  const fallback = path.join(dir, `${stem} (${Date.now()})${ext}`);
  const fd = openSync(fallback, 'wx');
  closeSync(fd);
  return fallback;
}

export interface ManifestRecord {
  runId: string;
  timestamp: string;
  host: string;
  relPath: string;
  immediateParentRelPath: string;
  label: ConflictLabel;
  provider: ConflictProvider;
  snapshotHash: string;
  rehash: string | null;
  action: 'moved' | 'skipped-rehash-changed' | 'skipped-error';
  destRelPath: string | null;
  note?: string;
}

export interface ApplyResult {
  moved: number;
  skipped: number;
  manifestPath: string | null;
  records: ManifestRecord[];
}

/**
 * Execute the moves for a plan's `toQuarantine` list. Move-not-delete, no-overwrite,
 * rehash-guarded. Writes a JSONL manifest. Pure of any planning logic.
 */
export function applyQuarantine(
  targetDirAbs: string,
  candidates: readonly QuarantineCandidate[],
  now: Date = new Date(),
): ApplyResult {
  const records: ManifestRecord[] = [];
  if (candidates.length === 0) {
    return { moved: 0, skipped: 0, manifestPath: null, records };
  }

  const stamp = dateStamp(now);
  const quarantineRoot = path.join(targetDirAbs, REBEL_DIR_NAME, QUARANTINE_DIR_NAME, stamp);
  mkdirSync(quarantineRoot, { recursive: true });

  const runId = `${stamp}T${now.toTimeString().slice(0, 8).replace(/:/g, '')}-${process.pid}`;
  const host = safeHostname();

  let moved = 0;
  let skipped = 0;

  for (const candidate of candidates) {
    const srcAbs = path.join(targetDirAbs, ...candidate.relPath.split('/'));
    const baseRecord = {
      runId,
      timestamp: new Date().toISOString(),
      host,
      relPath: candidate.relPath,
      immediateParentRelPath: candidate.immediateParentRelPath,
      label: candidate.label,
      provider: candidate.provider,
      snapshotHash: candidate.hash,
    } as const;

    // Rehash-race guard: the file may have changed since the snapshot.
    let currentSize: number;
    try {
      currentSize = lstatSync(srcAbs).size;
    } catch {
      skipped++;
      records.push({
        ...baseRecord,
        rehash: null,
        action: 'skipped-error',
        destRelPath: null,
        note: 'source missing at apply time',
      });
      continue;
    }

    const rehash = currentSize === 0 ? null : hashFile(srcAbs);
    if (rehash == null || rehash !== candidate.hash) {
      skipped++;
      records.push({
        ...baseRecord,
        rehash,
        action: 'skipped-rehash-changed',
        destRelPath: null,
        note: 'file changed since snapshot — left in place',
      });
      continue;
    }

    const intendedDest = path.join(quarantineRoot, ...candidate.relPath.split('/'));
    let destAbs: string;
    try {
      // Create the dest dir first so the exclusive reservation can land in it,
      // then atomically RESERVE a non-colliding name (closes the TOCTOU: the
      // rename below only ever replaces our own 0-byte reservation).
      mkdirSync(path.dirname(intendedDest), { recursive: true });
      destAbs = reserveNonCollidingDest(intendedDest);
    } catch (err) {
      skipped++;
      records.push({
        ...baseRecord,
        rehash,
        action: 'skipped-error',
        destRelPath: null,
        note: `could not reserve destination: ${err instanceof Error ? err.message : String(err)}`,
      });
      continue;
    }
    try {
      renameSync(srcAbs, destAbs); // MOVE over our own reservation — never copy+delete, never unlink, never trash, never a pre-existing user file.
    } catch (err) {
      // Move failed (e.g. EXDEV cross-device). Leave the SOURCE in place (never
      // copy+unlink a user file) and clean up only OUR own 0-byte reservation
      // so the rename failure doesn't litter the quarantine with empty files.
      cleanupReservation(destAbs);
      skipped++;
      records.push({
        ...baseRecord,
        rehash,
        action: 'skipped-error',
        destRelPath: null,
        note: `move failed: ${err instanceof Error ? err.message : String(err)}`,
      });
      continue;
    }

    moved++;
    records.push({
      ...baseRecord,
      rehash,
      action: 'moved',
      destRelPath: path
        .relative(targetDirAbs, destAbs)
        .split(path.sep)
        .join('/'),
    });
  }

  // Write the manifest (JSONL) for auditability/reversibility.
  const manifestPath = path.join(quarantineRoot, MANIFEST_FILENAME);
  const fd = openSync(manifestPath, 'a');
  try {
    for (const record of records) {
      writeSync(fd, JSON.stringify(record) + '\n');
    }
  } finally {
    closeSync(fd);
  }

  return { moved, skipped, manifestPath, records };
}

/**
 * Remove OUR OWN exclusive 0-byte reservation after a failed rename. Guarded to
 * only delete a file that is still empty (i.e. the placeholder we created and
 * never wrote to), so it can never remove a user file. Best-effort.
 */
function cleanupReservation(reservedAbs: string): void {
  try {
    if (lstatSync(reservedAbs).size === 0) {
      rmSync(reservedAbs, { force: true });
    }
  } catch {
    // Best-effort: a leftover 0-byte placeholder is harmless.
  }
}

function safeHostname(): string {
  try {
    return hostname();
  } catch {
    return 'unknown-host';
  }
}

// ============================================================================
// CLI
// ============================================================================

export interface ParsedArgs {
  targetDir?: string;
  apply: boolean;
  json: boolean;
}

export function parseArgs(argv: readonly string[]): ParsedArgs {
  const parsed: ParsedArgs = { apply: false, json: false };
  for (const token of argv) {
    if (token === '--apply') {
      parsed.apply = true;
    } else if (token === '--json') {
      parsed.json = true;
    } else if (token.startsWith('-')) {
      throw new Error(
        `Unknown option: ${token}\n\n` +
          'Usage: cleanup-conflict-copies <target-dir> [--apply] [--json]',
      );
    } else if (!parsed.targetDir) {
      parsed.targetDir = token;
    }
    // extra positionals ignored
  }
  return parsed;
}

/**
 * Reject obviously dangerous targets (filesystem root, a home root). We only
 * ever MOVE within `<target>/.rebel/...`, but refuse these as a belt-and-braces
 * guard against a mistyped argument.
 */
export function assertSafeTarget(targetDirAbs: string): void {
  const resolved = (() => {
    try {
      return realpathSync(targetDirAbs);
    } catch {
      return targetDirAbs;
    }
  })();
  if (resolved === path.parse(resolved).root) {
    throw new Error(`Refusing to run on filesystem root: ${resolved}`);
  }
  const home = (() => {
    try {
      return realpathSync(homedir());
    } catch {
      return homedir();
    }
  })();
  if (resolved === home) {
    throw new Error(
      `Refusing to run on the home directory itself: ${resolved}\n` +
        'Point this at a specific memory/space folder instead.',
    );
  }
}

/**
 * Refuse `--apply` on a non-writable target. We will create
 * `<target>/.rebel/...` and move files into it, so the target dir must be
 * writable. Checked upfront so we fail clearly BEFORE any apply work rather
 * than partway through a storm via a late mkdirSync/manifest write.
 */
export function assertWritableTarget(targetDirAbs: string): void {
  try {
    accessSync(targetDirAbs, fsConstants.W_OK);
  } catch {
    throw new Error(
      `Target directory is not writable: ${targetDirAbs}\n` +
        '--apply needs to create <target>/.rebel/conflicts-cleanup/ and move files into it.\n' +
        'Fix the permissions, or re-run without --apply for a read-only preview.',
    );
  }
}

export interface RunResult {
  plan: CleanupPlan;
  apply?: ApplyResult;
}

/** Core run: validate, snapshot, plan, optionally apply. No I/O of report text. */
export function run(targetDirRaw: string, opts: { apply: boolean }): RunResult {
  const targetDirAbs = path.resolve(targetDirRaw);

  if (!existsSync(targetDirAbs)) {
    throw new Error(`Target directory does not exist: ${targetDirAbs}`);
  }
  const st = statSync(targetDirAbs);
  if (!st.isDirectory()) {
    throw new Error(`Target is not a directory: ${targetDirAbs}`);
  }
  assertSafeTarget(targetDirAbs);

  // Writability preflight (--apply only): fail fast with a clear error rather
  // than discovering non-writability late via mkdirSync/manifest writes (and
  // mid-storm). Dry-run is read-only and never requires write access.
  if (opts.apply) {
    assertWritableTarget(targetDirAbs);
  }

  const snapshot = buildSnapshot(targetDirAbs);
  const plan = planConflictCopyCleanup(snapshot);

  if (!opts.apply) {
    return { plan };
  }

  const applyResult = applyQuarantine(targetDirAbs, plan.toQuarantine);
  return { plan, apply: applyResult };
}

function formatHumanReport(
  targetDirAbs: string,
  result: RunResult,
  apply: boolean,
): string {
  const { plan } = result;
  const lines: string[] = [];
  lines.push(`Conflict-copy cleanup — ${targetDirAbs}`);
  lines.push('='.repeat(60));
  lines.push('');
  lines.push(`Byte-identical copies safe to tidy : ${plan.toQuarantine.length}`);
  lines.push(`Differing / needs-review copies     : ${plan.needsReview.length}`);
  lines.push('');

  const sample = (xs: { relPath: string }[], n = 10) =>
    xs.slice(0, n).map((x) => `  - ${x.relPath}`).join('\n') +
    (xs.length > n ? `\n  … and ${xs.length - n} more` : '');

  if (plan.toQuarantine.length > 0) {
    lines.push('Byte-identical (machine-generated) conflict copies:');
    lines.push(sample(plan.toQuarantine));
    lines.push('');
  }
  if (plan.needsReview.length > 0) {
    lines.push('Needs review (NEVER auto-moved):');
    lines.push(
      plan.needsReview
        .slice(0, 10)
        .map((r) => `  - ${r.relPath}  [${r.reason}]`)
        .join('\n') +
        (plan.needsReview.length > 10
          ? `\n  … and ${plan.needsReview.length - 10} more`
          : ''),
    );
    lines.push('');
  }

  if (!apply) {
    lines.push('DRY RUN — nothing moved; re-run with --apply to move the byte-identical copies.');
  } else {
    const a = result.apply!;
    lines.push(
      `Moved ${a.moved} to ${a.manifestPath ? path.dirname(a.manifestPath) : '(quarantine)'}; ` +
        `${plan.needsReview.length} still need review.`,
    );
    if (a.skipped > 0) {
      lines.push(`Skipped ${a.skipped} (changed since scan or move failed — left in place; see manifest).`);
    }
    if (a.manifestPath) {
      lines.push(`Manifest: ${a.manifestPath}`);
    }
  }
  return lines.join('\n');
}

function main(): void {
  let parsed: ParsedArgs;
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(`\nError: ${err instanceof Error ? err.message : String(err)}\n\n`);
    process.exitCode = 1;
    return;
  }

  if (!parsed.targetDir) {
    process.stderr.write(
      '\ncleanup-conflict-copies — tidy cloud-sync conflict copies (dry-run by default)\n' +
        '==============================================================================\n\n' +
        'Usage:\n' +
        '  cleanup-conflict-copies <target-dir> [--apply] [--json]\n\n' +
        'Options:\n' +
        '  --apply   Actually MOVE byte-identical copies to .rebel/conflicts-cleanup/<date>/\n' +
        '            (default is a safe DRY RUN that only previews)\n' +
        '  --json    Emit machine-readable JSON instead of the human report\n\n' +
        'Only byte-identical, machine-generated conflict copies (numbered-copy,\n' +
        'dropbox-conflict, sync-conflict) are moved. Files are MOVED (never deleted),\n' +
        'never overwritten, and a JSONL manifest is written for full recoverability.\n',
    );
    process.exitCode = 1;
    return;
  }

  try {
    const targetDirAbs = path.resolve(parsed.targetDir);
    const result = run(parsed.targetDir, { apply: parsed.apply });

    if (parsed.json) {
      process.stdout.write(
        JSON.stringify(
          {
            targetDir: targetDirAbs,
            applied: parsed.apply,
            toQuarantine: result.plan.toQuarantine,
            needsReview: result.plan.needsReview,
            apply: result.apply
              ? {
                  moved: result.apply.moved,
                  skipped: result.apply.skipped,
                  manifestPath: result.apply.manifestPath,
                }
              : null,
          },
          null,
          2,
        ) + '\n',
      );
    } else {
      process.stdout.write(formatHumanReport(targetDirAbs, result, parsed.apply) + '\n');
    }
  } catch (err) {
    process.stderr.write(`\nError: ${err instanceof Error ? err.message : String(err)}\n\n`);
    process.exitCode = 1;
  }
}

// Only run the CLI when invoked directly (not when imported by tests).
// Compare realpaths so a symlinked entrypoint still matches.
const invokedDirectly = (() => {
  const argv1 = process.argv[1];
  if (!argv1) return false;
  try {
    return realpathSync(argv1) === realpathSync(new URL(import.meta.url).pathname);
  } catch {
    return argv1 === new URL(import.meta.url).pathname;
  }
})();

if (invokedDirectly) {
  main();
}
