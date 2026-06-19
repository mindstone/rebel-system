#!/usr/bin/env python
"""
Symlink-aware duplicate file scanner for Mindstone Rebel workspace.

Features:
- Walks the entire workspace root (current directory) and follows symlinked directories
  so that linked spaces are included.
- Ignores any file that is itself a symlink (e.g. `CLAUDE.md` -> `AGENTS.md`).
- Can exclude configurable directory-name or path fragments via CLI flag or env var.
- Groups files by SHA-256 content hash to find byte-identical duplicates.
- Can optionally emit a JSON merge plan that suggests a canonical file for each group,
  using heuristics based on `file-naming-and-organisation.md`.

This script is designed to be used together with the
`duplicate-file-merge-planner` system skill:
`system/skills/system/duplicate-file-merge-planner.md`, which describes when
to run it, how to interpret the merge plan, and how to safely enact any changes.

Usage (from workspace root):

    python system/scripts/find_duplicate_files_symlink_aware.py \\
        --json-plan > duplicate-merge-plan.json

    python system/scripts/find_duplicate_files_symlink_aware.py \\
        --text-summary

This script is intentionally **read-only** – it does not rename, delete, or
modify any files. Use the `rename-or-move` skill/script to enact any changes.
"""

import argparse
import difflib
import hashlib
import json
import os
import re
import sys
from datetime import datetime
from typing import Dict, List, Tuple, TypedDict, Optional


EXCLUDED_DIR_NAMES = {
    ".git",
    ".cursor",
    ".Trash",
    ".svn",
    ".hg",
    ".idea",
    ".vscode",
    "__pycache__",
}

EXCLUDED_FILES = {
    ".DS_Store",
}

# Heuristic patterns based on `file-naming-and-organisation.md`
LOWER_HYPHEN_MD = re.compile(r"^[a-z0-9][a-z0-9-]*\\.md$")


def parse_exclude_dir_fragments(values: Optional[List[str]]) -> List[str]:
    """
    Parse comma- or path-separator-delimited directory/path fragments.

    Values are matched as simple substrings against directory names and real
    paths. This keeps the scanner configurable without baking workspace-specific
    folder names into the script.
    """
    fragments: List[str] = []
    seen = set()
    splitter = re.compile(rf"[,{re.escape(os.pathsep)}]+")
    for value in values or []:
        for fragment in splitter.split(value):
            fragment = fragment.strip()
            if not fragment or fragment in seen:
                continue
            fragments.append(fragment)
            seen.add(fragment)
    return fragments


def normalize_basename(name: str) -> str:
    """
    Normalise a filename basename for grouping and ignore pattern matching.

    - Lowercases the name
    - Treats hyphens, underscores and spaces as equivalent

    This lets us consider e.g. \"TABLE-OF-CONTENTS.md\", \"table_of_contents.md\"
    and \"Table Of Contents.md\" as the same logical basename.
    """
    name = name.lower()
    root, ext = os.path.splitext(name)
    # Collapse any run of -, _ or whitespace into a single hyphen
    root = re.sub(r"[-_\\s]+", "-", root)
    return root + ext


class MergeEntry(TypedDict):
    hash: str
    canonical: str
    reason: str
    duplicates: List[str]


class NearDuplicatePair(TypedDict):
    """
    Representation of a near-duplicate relationship between two files.

    - basename: filename shared by the pair (e.g. "README.md")
    - canonical: absolute path chosen by the same heuristics as exact duplicates
    - other: the other file in the near-duplicate pair (absolute path)
    - similarity: float in [0, 1] from difflib.SequenceMatcher
    - reason: reason string from pick_canonical_for_group
    """

    basename: str
    canonical: str
    other: str
    similarity: float
    reason: str


def collect_hashes(
    root: str, exclude_dir_fragments: Optional[List[str]] = None
) -> Dict[str, List[str]]:
    """
    Walk the tree from `root`, following symlinked directories but ignoring
    symlink *files*, and return a mapping: hash -> list of absolute paths.
    """
    hash_map: Dict[str, List[str]] = {}
    exclude_dir_fragments = exclude_dir_fragments or []
    visited_dirs = set()

    for dirpath, dirnames, filenames in os.walk(root, topdown=True, followlinks=True):
        real_dir = os.path.realpath(dirpath)
        if real_dir in visited_dirs:
            # Avoid cycles when following symlinked directories
            dirnames[:] = []
            continue
        visited_dirs.add(real_dir)

        # Prune standard exclusions plus caller-configured directory/path fragments.
        pruned_dirnames = []
        for d in dirnames:
            full = os.path.join(dirpath, d)
            real_full = os.path.realpath(full)
            if d in EXCLUDED_DIR_NAMES:
                continue
            if any(
                fragment in d or fragment in real_full
                for fragment in exclude_dir_fragments
            ):
                continue
            pruned_dirnames.append(d)
        dirnames[:] = pruned_dirnames

        for name in filenames:
            if name in EXCLUDED_FILES:
                continue

            path = os.path.join(dirpath, name)
            real_path = os.path.realpath(path)

            # Ignore files whose real path matches a caller-configured exclusion.
            if any(fragment in real_path for fragment in exclude_dir_fragments):
                continue

            # Ignore symlink *files* – these are intentional aliases
            if os.path.islink(path):
                continue

            if not os.path.isfile(path):
                continue

            try:
                h = hashlib.sha256()
                with open(path, "rb") as f:
                    for chunk in iter(lambda: f.read(1024 * 1024), b""):
                        h.update(chunk)
            except Exception:
                # Skip unreadable files
                continue

            digest = h.hexdigest()
            abs_path = os.path.abspath(path)
            hash_map.setdefault(digest, []).append(abs_path)

    return hash_map


def pick_canonical_for_group(paths: List[str]) -> Tuple[str, str]:
    """
    Given a list of absolute paths that all share the same content hash,
    choose a suggested canonical path and return (canonical, reason).

    Heuristics:
    1. Prefer system-level copies under `/system/` when exactly one exists.
    2. Prefer `background/Common/` over other `background/` copies when unique.
    3. Prefer `memory/background/` over `memory/teams/` when unique.
    4. Prefer lowercase-hyphen `.md` filenames when exactly one matches.
    5. Fallback: shortest absolute path.
    """
    candidates = list(paths)

    # 1) Prefer system-level over company copies
    system_candidates = [p for p in candidates if "/system/" in p]
    if len(system_candidates) == 1:
        return system_candidates[0], "system-preferred"

    # 2) Prefer background/Common over plain background
    common_candidates = [p for p in candidates if "/memory/background/Common/" in p]
    if len(common_candidates) == 1:
        return common_candidates[0], "background-common-preferred"

    # 3) Prefer background over teams
    background_candidates = [p for p in candidates if "/memory/background/" in p]
    team_candidates = [p for p in candidates if "/memory/teams/" in p]
    if len(background_candidates) == 1 and team_candidates:
        return background_candidates[0], "background-preferred"

    # 4) Prefer lowercase-hyphen md filenames
    lh = [p for p in candidates if LOWER_HYPHEN_MD.match(os.path.basename(p))]
    if len(lh) == 1:
        return lh[0], "lower-hyphen-md-preferred"

    # 5) Fallback: shortest path
    canonical = sorted(candidates, key=len)[0]
    return canonical, "shortest-path-fallback"


def build_merge_plan(
    hash_map: Dict[str, List[str]],
    ignore_basenames: Optional[List[str]] = None,
) -> List[MergeEntry]:
    """
    Convert hash_map into a list of merge-plan entries:
    [
      {
        \"hash\": <sha256>,
        \"canonical\": \"/abs/path/to/canonical.ext\",
        \"reason\": \"system-preferred\" | \"background-preferred\" | ...,
        \"duplicates\": [\"/abs/path/to/duplicate1\", ...]
      },
      ...
    ]

    Anthropic vendor duplicates under `/system/skills/Anthropic-official-skills/`
    are skipped entirely.
    """
    plan: List[MergeEntry] = []

    # Pre-normalise ignore basenames for efficient membership tests.
    normalized_ignored: set[str] = set()
    if ignore_basenames:
        normalized_ignored = {normalize_basename(name) for name in ignore_basenames}

    for digest, paths in hash_map.items():
        if len(paths) <= 1:
            continue

        # Skip pure Anthropic vendor duplicates
        if all("/system/skills/Anthropic-official-skills/" in p for p in paths):
            continue

        canonical, reason = pick_canonical_for_group(paths)

        # Optionally skip groups whose canonical basename is in the ignore list.
        if normalized_ignored:
            canon_base = os.path.basename(canonical)
            if normalize_basename(canon_base) in normalized_ignored:
                continue
        duplicates = sorted(p for p in paths if p != canonical)

        if not duplicates:
            # Nothing to merge
            continue

        plan.append(
            {
                "hash": digest,
                "canonical": canonical,
                "reason": reason,
                "duplicates": duplicates,
            }
        )

    # Stable order: most duplicates first, then hash
    plan.sort(key=lambda entry: (-len(entry["duplicates"]), entry["hash"]))
    return plan


def _is_text_candidate(path: str) -> bool:
    """
    Heuristic filter: only treat markdown and plain text files as candidates
    for near-duplicate detection. This keeps runtime reasonable and avoids
    trying to diff binaries like PDFs.
    """
    _, ext = os.path.splitext(path.lower())
    return ext in {".md", ".txt"}


def _build_digest_by_path(hash_map: Dict[str, List[str]]) -> Dict[str, str]:
    """
    Reverse mapping: absolute path -> content hash.
    """
    digest_by_path: Dict[str, str] = {}
    for digest, paths in hash_map.items():
        for p in paths:
            digest_by_path[p] = digest
    return digest_by_path


def find_near_duplicate_pairs(
    hash_map: Dict[str, List[str]],
    *,
    min_similarity: float = 0.9,
    ignore_basenames: Optional[List[str]] = None,
) -> List[NearDuplicatePair]:
    """
    Find near-duplicate text files that share the same basename (case-insensitive)
    but have slightly different contents (e.g. minor edits between team/background
    copies of a document, or system vs company skill variants).

    Implementation notes:
    - Only considers `.md` and `.txt` files.
    - Only compares files that share the same basename.
    - Skips pairs that are already exact duplicates (same content hash).
    - Uses difflib.SequenceMatcher ratio as a simple similarity metric.
    - Returns independent pairs; humans can then decide how to treat them.
    """
    if min_similarity <= 0.0:
        min_similarity = 0.0
    if min_similarity > 1.0:
        min_similarity = 1.0

    digest_by_path = _build_digest_by_path(hash_map)

    # Pre-normalise ignore basenames.
    normalized_ignored: set[str] = set()
    if ignore_basenames:
        normalized_ignored = {normalize_basename(name) for name in ignore_basenames}

    # Flatten all unique file paths
    all_paths: List[str] = []
    for paths in hash_map.values():
        all_paths.extend(paths)
    # Deduplicate and restrict to candidate text files, applying ignore filters.
    text_paths_set: "set[str]" = set()
    for p in all_paths:
        if not _is_text_candidate(p):
            continue
        if normalized_ignored:
            base = os.path.basename(p)
            if normalize_basename(base) in normalized_ignored:
                continue
        text_paths_set.add(p)

    text_paths = sorted(text_paths_set)

    # Group by normalised basename (case-insensitive and treating -, _ and
    # spaces as equivalent) to keep the search tractable, while still
    # detecting variants like \"write-tutorial-explainer.md\",
    # \"Write_Tutorial_Explainer.md\" and \"Write Tutorial Explainer.md\".
    by_basename: Dict[str, List[str]] = {}
    for p in text_paths:
        key = normalize_basename(os.path.basename(p))
        by_basename.setdefault(key, []).append(p)

    pairs: List[NearDuplicatePair] = []
    seen_pairs: "set[Tuple[str, str]]" = set()

    for basename_lower, paths in by_basename.items():
        if len(paths) < 2:
            continue

        # Load contents once per path
        contents: Dict[str, str] = {}
        for p in paths:
            try:
                with open(p, "r", encoding="utf-8", errors="ignore") as f:
                    contents[p] = f.read()
            except Exception:
                # Skip unreadable or non-text files
                continue

        candidate_paths = list(contents.keys())
        n = len(candidate_paths)
        if n < 2:
            continue

        for i in range(n):
            p1 = candidate_paths[i]
            for j in range(i + 1, n):
                p2 = candidate_paths[j]

                # Skip if already exact duplicates by content hash
                if digest_by_path.get(p1) == digest_by_path.get(p2):
                    continue

                # Deterministic 2-tuple key so the type checker knows the shape
                a, b = sorted((p1, p2))
                key: Tuple[str, str] = (a, b)
                if key in seen_pairs:
                    continue

                c1 = contents.get(p1, "")
                c2 = contents.get(p2, "")
                if not c1 or not c2:
                    continue

                # Guard against trivial exact equality that slipped past hashing
                if c1 == c2:
                    continue

                ratio = difflib.SequenceMatcher(None, c1, c2).ratio()
                if ratio < min_similarity:
                    continue

                canonical, reason = pick_canonical_for_group([p1, p2])
                other = p2 if canonical == p1 else p1

                # Use the lowercased basename key for grouping in the summary.
                pairs.append(
                    {
                        "basename": basename_lower,
                        "canonical": canonical,
                        "other": other,
                        "similarity": ratio,
                        "reason": reason,
                    }
                )
                seen_pairs.add(key)

    # Sort by similarity (descending), then filename, then paths for stability
    pairs.sort(
        key=lambda entry: (
            -entry["similarity"],
            entry["basename"],
            entry["canonical"],
            entry["other"],
        )
    )
    return pairs


def _basenames_differ_only_by_case(paths: List[str]) -> bool:
    """
    Return True if there are at least two distinct basenames in `paths` that
    differ only by case and/or use different combinations of hyphens,
    underscores and spaces (e.g. \"README.md\" vs \"readme.md\" or
    \"TABLE-OF-CONTENTS.md\" vs \"table_of_contents.md\").
    """
    basenames = [os.path.basename(p) for p in paths]
    norm_map: Dict[str, List[str]] = {}
    for name in basenames:
        key = normalize_basename(name)
        norm_map.setdefault(key, []).append(name)

    for variants in norm_map.values():
        # Require at least two distinct spellings (case/punctuation variants)
        if len(set(variants)) > 1:
            return True
    return False


def find_case_variant_duplicate_groups(
    plan: List[MergeEntry],
) -> List[MergeEntry]:
    """
    Filter the exact-duplicate merge plan to only those groups where at least
    two files share the same basename ignoring case but differ in casing.

    This is useful for cleaning up e.g. \"README.md\" vs \"readme.md\" where
    the file contents are identical but the filename casing is inconsistent.
    """
    case_groups: List[MergeEntry] = []

    for entry in plan:
        all_paths = [entry["canonical"]] + entry["duplicates"]
        if _basenames_differ_only_by_case(all_paths):
            case_groups.append(entry)

    # Preserve original ordering from the full plan
    return case_groups


def print_text_summary(plan: List[MergeEntry]) -> None:
    """
    Print a human-readable summary of the merge plan.
    """
    if not plan:
        print("No non-vendor duplicates found when ignoring symlink files.")
        return

    for entry in plan:
        print(
            f"=== DUPLICATE GROUP: hash={entry['hash']} "
            f"canonical={entry['canonical']} reason={entry['reason']} "
            f"duplicates={len(entry['duplicates'])}"
        )
        print("  Canonical:")
        print(f"    {entry['canonical']}")
        print("  Duplicates:")
        for p in entry["duplicates"]:
            print(f"    {p}")
        print()


def print_case_variant_duplicate_summary(
    case_plan: List[MergeEntry],
) -> None:
    """
    Print a summary of duplicate groups whose basenames differ only by case.
    """
    if not case_plan:
        print(
            "No case-variant exact-duplicate files found (basenames differ only by case)."
        )
        return

    print(
        "Case-variant exact duplicates (same content hash, basenames differ only by case):"
    )
    for entry in case_plan:
        print(
            f"=== CASE-VARIANT GROUP: hash={entry['hash']} "
            f"canonical={entry['canonical']} reason={entry['reason']} "
            f"duplicates={len(entry['duplicates'])}"
        )
        print("  Canonical:")
        print(f"    {entry['canonical']}")
        print("  Case-variant duplicates (by basename):")
        for p in entry["duplicates"]:
            print(f"    {p}")
        print()


def print_near_duplicate_summary(
    pairs: List[NearDuplicatePair],
    *,
    root: str,
    threshold: float,
) -> None:
    """
    Print a human-readable summary of near-duplicate text files.
    """
    if not pairs:
        print(f"No near-duplicate text files found at similarity >= {threshold:.2f}.")
        return

    print(
        f"Near-duplicate text files (similarity >= {threshold:.2f}, "
        "grouped by basename):"
    )

    current_basename: str | None = None
    for entry in pairs:
        if entry["basename"] != current_basename:
            current_basename = entry["basename"]
            print()
            print(f"--- basename: {current_basename} ---")

        sim_pct = entry["similarity"] * 100.0
        canonical_rel = os.path.relpath(entry["canonical"], root)
        other_rel = os.path.relpath(entry["other"], root)
        print(
            f"similarity={sim_pct:.1f}% canonical={canonical_rel} "
            f"other={other_rel} reason={entry['reason']}"
        )


def _classify_path(rel_path: str) -> List[str]:
    """
    Best-effort classification tags for a relative path, to help humans
    decide which duplicate to keep. This is *only* for display; the script
    does not rely on these tags programmatically.
    """
    tags: List[str] = []

    if rel_path.startswith("system/"):
        tags.append("system")
    if "/skills/" in rel_path:
        tags.append("skills")
    if "/memory/background/Common/" in rel_path:
        tags.append("background-common")
    elif "/memory/background/" in rel_path:
        tags.append("background")
    if "/memory/teams/" in rel_path:
        tags.append("team")
    if "/memory/knowledge-base/" in rel_path:
        tags.append("knowledge-base")
    if rel_path.endswith(".pdf"):
        tags.append("pdf")

    return tags


def write_editable_plan(plan: List[MergeEntry], root: str, out_path: str) -> None:
    """
    Write an editable merge plan file that the user can open and modify
    manually. For each duplicate group, we write:

    - A GROUP header with the hash and group index
    - Comments describing the default canonical choice and reason
    - One PATH line per file (canonical first by default)

    The user can then reorder the PATH lines within each GROUP so that the
    *first* PATH is treated as canonical by any follow-up tooling.

    IMPORTANT: This function does not read from the file or enact any changes;
    it only writes a snapshot of the current duplicate groups.
    """
    timestamp = datetime.now().isoformat(timespec="seconds")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(
            "# Editable duplicate merge plan\n"
            f"# Generated by system/scripts/find_duplicate_files_symlink_aware.py at {timestamp}\n"
            "#\n"
            "# For each GROUP below, you can reorder the PATH lines so that the\n"
            "# first PATH is your chosen canonical file. Tags, sizes, and mtimes\n"
            "# are informational only.\n"
            "#\n"
            "# This file is *not* executed directly; it is intended as a human-\n"
            "# friendly way to decide canonicals before any rename-or-move work.\n"
            "\n"
        )

        for idx, entry in enumerate(plan, start=1):
            canonical_abs = entry["canonical"]
            dup_abs_list = entry["duplicates"]

            all_paths = [canonical_abs] + dup_abs_list
            rel_canon = os.path.relpath(canonical_abs, root)

            f.write(
                f"GROUP {idx} hash={entry['hash']} count={len(all_paths)}\n"
                f"# default_canonical: {rel_canon}\n"
                f"# default_reason: {entry['reason']}\n"
            )

            for abs_path in all_paths:
                rel_path = os.path.relpath(abs_path, root)
                tags = _classify_path(rel_path)
                try:
                    st = os.stat(abs_path)
                    size = st.st_size
                    mtime = datetime.fromtimestamp(st.st_mtime).isoformat(
                        timespec="seconds"
                    )
                except OSError:
                    size = -1
                    mtime = "unknown"

                tag_str = ", ".join(tags) if tags else ""
                meta_parts = []
                if tag_str:
                    meta_parts.append(f"tags=[{tag_str}]")
                if size >= 0:
                    meta_parts.append(f"size={size}")
                if mtime != "unknown":
                    meta_parts.append(f"mtime={mtime}")
                meta = "  # " + ", ".join(meta_parts) if meta_parts else ""

                f.write(f"PATH {rel_path}{meta}\n")

            f.write("ENDGROUP\n\n")


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Symlink-aware duplicate file scanner that ignores symlink files "
            "and caller-configured directory exclusions, and proposes "
            "canonical files based on file-naming-and-organisation.md "
            "heuristics."
        )
    )
    parser.add_argument(
        "--json-plan",
        action="store_true",
        help="Print a JSON merge plan to stdout.",
    )
    parser.add_argument(
        "--text-summary",
        action="store_true",
        help="Print a human-readable text summary of the merge plan.",
    )
    parser.add_argument(
        "--near-duplicates",
        dest="near_duplicate_content",
        action="store_true",
        help=(
            "Also scan for near-duplicate text files by content (same basename, "
            "high similarity) and print a separate summary. Only affects text "
            "output; JSON merge plan remains exact-duplicates only."
        ),
    )
    parser.add_argument(
        "--near-dup-threshold",
        type=float,
        default=0.9,
        help=(
            "Similarity threshold in [0.0, 1.0] for near-duplicate detection "
            "(default: 0.9)."
        ),
    )
    parser.add_argument(
        "--case-variant-duplicates",
        action="store_true",
        help=(
            "Highlight exact-duplicate files whose basenames differ only by "
            "case (e.g. README.md vs readme.md). Only affects text output; "
            "JSON merge plan remains exact-duplicates only."
        ),
    )
    parser.add_argument(
        "--editable-plan-file",
        type=str,
        help=(
            "Write an editable merge plan file that groups duplicates and "
            "lists PATH lines you can reorder to choose canonicals."
        ),
    )
    parser.add_argument(
        "--ignore-basename",
        action="append",
        dest="ignore_basenames",
        metavar="NAME",
        help=(
            "Basename to ignore when building duplicate plans and summaries. "
            "Matching is case-insensitive and treats hyphens, underscores and "
            "spaces as equivalent. Can be passed multiple times."
        ),
    )
    parser.add_argument(
        "--exclude-dirs",
        action="append",
        dest="exclude_dirs",
        metavar="NAME[,NAME...]",
        help=(
            "Directory-name or real-path fragments to exclude while walking. "
            "Accepts comma-separated or path-separator-separated values, can be "
            "passed multiple times, and is combined with the EXCLUDE_DIRS env var."
        ),
    )
    args = parser.parse_args()

    # Default behaviour: text summary if nothing else is specified
    if (
        not args.json_plan
        and not args.text_summary
        and not args.editable_plan_file
        and not args.near_duplicate_content
        and not args.case_variant_duplicates
    ):
        args.text_summary = True

    root = os.path.abspath(".")
    exclude_dir_inputs = []
    env_exclude_dirs = os.environ.get("EXCLUDE_DIRS")
    if env_exclude_dirs:
        exclude_dir_inputs.append(env_exclude_dirs)
    if args.exclude_dirs:
        exclude_dir_inputs.extend(args.exclude_dirs)
    exclude_dir_fragments = parse_exclude_dir_fragments(exclude_dir_inputs)

    hash_map = collect_hashes(root, exclude_dir_fragments=exclude_dir_fragments)
    plan = build_merge_plan(hash_map, ignore_basenames=args.ignore_basenames)

    near_pairs: List[NearDuplicatePair] = []
    if args.near_duplicate_content:
        near_pairs = find_near_duplicate_pairs(
            hash_map,
            min_similarity=args.near_dup_threshold,
            ignore_basenames=args.ignore_basenames,
        )

    case_plan: List[MergeEntry] = []
    if args.case_variant_duplicates:
        case_plan = find_case_variant_duplicate_groups(plan)

    if args.editable_plan_file:
        write_editable_plan(plan, root=root, out_path=args.editable_plan_file)

    if args.json_plan:
        json.dump(plan, fp=sys.stdout, indent=2)
        if args.text_summary:
            print("\n\n---\n")

    if args.text_summary:
        print_text_summary(plan)
        if args.near_duplicate_content:
            print("\n\n---\n")
            print_near_duplicate_summary(
                near_pairs,
                root=root,
                threshold=args.near_dup_threshold,
            )
        if args.case_variant_duplicates:
            print("\n\n---\n")
            print_case_variant_duplicate_summary(case_plan)


if __name__ == "__main__":
    main()
