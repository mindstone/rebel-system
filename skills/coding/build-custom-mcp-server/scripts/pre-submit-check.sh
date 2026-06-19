#!/usr/bin/env bash
# pre-submit-check.sh
#
# Runs the Tier-1 quality gates for a contributed MCP connector before the
# agent emits its <testing_evidence> block and reports `ready_to_submit`.
#
# What this catches (from real PRs that have shipped broken):
#   - Internal host references leaked into OSS code (e.g. "Rebel", "Mindstone")
#   - Missing LICENSE file, or LICENSE that isn't FSL-1.1-MIT (mindstone/mcp-servers#19)
#   - package.json "license" missing, or not set to "FSL-1.1-MIT"
#   - Missing README / tests
#   - Personal absolute paths (/Users/<name>/, /home/<name>/) leaked into docs
#   - dist/ build artifacts committed
#   - High/critical npm audit vulnerabilities
#   - spawn/exec calls without an explicit timeout (warn)
#   - Tests redefining Zod schemas inline instead of importing from src (warn)
#
# Environment variables:
#   FSL_LICENSE_OVERRIDE=1  — accept any LICENSE content and any
#                             package.json "license" value. Use only when
#                             the user is explicitly contributing to a
#                             repo that does not use FSL-1.1-MIT.
#
# What it does NOT catch (and the SKILL still requires separately):
#   - Correct auth header against the live API            (Phase 2.4 probe)
#   - Endpoints actually exist against the live API       (Phase 2.4 probe)
#   - Each tool returns real 2xx data                     (Phase 6 evidence)
#
# Usage:
#   bash pre-submit-check.sh [<connector-dir>]
# Default <connector-dir> = current working directory.
#
# Exit codes:
#   0 — all checks passed
#   1 — at least one check failed (see stderr for which). Environment
#       problems (missing `rg`+`grep`, failed `npm install`, unreachable
#       `npm audit`) are reported as FAIL and folded into exit 1 rather
#       than a separate code, so CI and the agent see one "not ready"
#       signal.
#   2 — script could not even start (missing target directory).

set -u
set -o pipefail

DIR="${1:-.}"
if [ ! -d "$DIR" ]; then
  echo "pre-submit-check: $DIR is not a directory" >&2
  exit 2
fi
cd "$DIR" || { echo "pre-submit-check: cannot cd to $DIR" >&2; exit 2; }

FAIL=0
PASS=0

# ANSI colour helpers (no-op if not a TTY)
if [ -t 2 ]; then
  RED=$'\033[31m'
  GREEN=$'\033[32m'
  YELLOW=$'\033[33m'
  DIM=$'\033[2m'
  RESET=$'\033[0m'
else
  RED=""; GREEN=""; YELLOW=""; DIM=""; RESET=""
fi

report_pass() { echo "${GREEN}PASS${RESET} $1";  PASS=$((PASS+1)); }
report_fail() { echo "${RED}FAIL${RESET} $1";    FAIL=$((FAIL+1)); }
report_warn() { echo "${YELLOW}WARN${RESET} $1"; }

echo ""
echo "pre-submit-check: ${DIR}"
echo "${DIM}-----------------------------------------${RESET}"

# -----------------------------------------------------------------------------
# 1) Internal host reference scan
# -----------------------------------------------------------------------------
# Connectors in the mcp-servers OSS repo must not reference the internal
# Rebel/Mindstone/nspr host infrastructure. Docs may reference the source
# org in the build-plan metadata; we scan only source and tests.
#
# Word-boundary-anchored pattern to avoid false positives on names that
# happen to contain these substrings (e.g. a product literally called
# MindstoneFoo or RebelMouse).
REF_PATTERN='(^|[^A-Za-z0-9_])(mindstone|rebel|nspr)([^A-Za-z0-9_]|$)'

# Collect the subset of scan targets that actually exist. Missing optional
# directories (e.g. no __tests__) would otherwise make grep emit noisy
# "No such file or directory" errors and the check lose fidelity.
SCAN_DIRS=()
for d in src __tests__ test tests; do
  if [ -d "$d" ]; then SCAN_DIRS+=("$d"); fi
done

if [ ${#SCAN_DIRS[@]} -eq 0 ]; then
  # Cannot scan — still FAIL so we don't silently approve a scaffold with
  # neither source nor tests (which is a separate problem the tests check
  # below catches more specifically, but we note it here too).
  report_fail "No src/, tests/, test/, or __tests__/ directory — cannot scan for internal host references"
elif command -v rg >/dev/null 2>&1; then
  # Capture output and exit code separately so we can distinguish "no
  # matches" (rg exit 1, PASS) from "command failed" (exit >1, FAIL).
  # Using `|| true` would collapse both into "empty output" and silently
  # approve scans that never ran successfully.
  set +e
  REF_HITS=$(
    rg -i -l -e "$REF_PATTERN" \
      --glob '!node_modules' \
      --glob '!package-lock.json' \
      --glob '!dist' \
      "${SCAN_DIRS[@]}" 2>&1
  )
  RG_STATUS=$?
  set -e
  if [ "$RG_STATUS" -eq 0 ]; then
    report_fail "Internal host references in source/tests:"
    echo "$REF_HITS" | sed 's/^/        /'
  elif [ "$RG_STATUS" -eq 1 ]; then
    report_pass "No internal host references (mindstone|rebel|nspr) in src/tests"
  else
    report_fail "ripgrep scan failed with exit $RG_STATUS — cannot verify internal references:"
    echo "$REF_HITS" | sed 's/^/        /'
  fi
elif command -v grep >/dev/null 2>&1; then
  # POSIX-grep fallback when ripgrep is not installed. The same word-boundary
  # ERE pattern works under grep -rEi; we prune node_modules/dist manually
  # via --exclude-dir. Same exit-code discipline as the rg branch so a
  # failed invocation cannot masquerade as "no matches".
  set +e
  REF_HITS=$(
    grep -rEil \
      --exclude-dir=node_modules \
      --exclude-dir=dist \
      --exclude=package-lock.json \
      -e "$REF_PATTERN" \
      "${SCAN_DIRS[@]}" 2>&1
  )
  GREP_STATUS=$?
  set -e
  if [ "$GREP_STATUS" -eq 0 ]; then
    report_fail "Internal host references in source/tests (grep fallback):"
    echo "$REF_HITS" | sed 's/^/        /'
  elif [ "$GREP_STATUS" -eq 1 ]; then
    report_pass "No internal host references (mindstone|rebel|nspr) in src/tests (grep fallback)"
  else
    report_fail "grep scan failed with exit $GREP_STATUS — cannot verify internal references:"
    echo "$REF_HITS" | sed 's/^/        /'
  fi
else
  # Neither rg nor grep — this should be impossible on any realistic dev
  # machine, but fail closed rather than silently approve.
  report_fail "Neither ripgrep (rg) nor grep found — internal-reference scan cannot run. Install with: brew install ripgrep (macOS) / apt install ripgrep (Debian)"
fi

# -----------------------------------------------------------------------------
# 2) LICENSE file present AND matches Fair Source (FSL-1.1-MIT)
# -----------------------------------------------------------------------------
# Connectors contributed to mindstone/mcp-servers MUST use the Functional
# Source License (FSL-1.1-MIT) that matches the upstream repo. Agents
# occasionally drift (e.g. writing a verbatim MIT LICENSE from memory
# instead of reading the starter-template/LICENSE file verbatim as the
# SKILL requires). A plain MIT LICENSE passes "file exists" but silently
# relicenses the connector — this is a legal-footprint bug, not a cosmetic
# one. See PR mindstone/mcp-servers#19 for a real instance.
#
# Override: set FSL_LICENSE_OVERRIDE=1 when the user is explicitly
# contributing to a repo that uses a different license (unusual —
# SKILL.md §4.2 says "do not swap it unless the user is explicitly
# contributing elsewhere").
LICENSE_FILE=""
for f in LICENSE LICENSE.md LICENSE.txt; do
  if [ -f "$f" ]; then LICENSE_FILE="$f"; break; fi
done
if [ -z "$LICENSE_FILE" ]; then
  report_fail "LICENSE file missing (required for OSS contribution)"
elif [ "${FSL_LICENSE_OVERRIDE:-0}" = "1" ]; then
  report_pass "LICENSE file present (FSL_LICENSE_OVERRIDE=1 — skipping content match)"
else
  # Match the FSL-1.1-MIT marker. The starter-template LICENSE begins
  # with the header "Functional Source License, Version 1.1, MIT Future
  # License" and contains the abbreviation "FSL-1.1-MIT". Either marker
  # confirms it; missing both means the agent wrote a different license.
  if grep -qE '(Functional Source License|FSL-1\.1-MIT)' "$LICENSE_FILE"; then
    report_pass "LICENSE file present and matches FSL-1.1-MIT"
  else
    report_fail "LICENSE file ($LICENSE_FILE) does NOT match FSL-1.1-MIT — the starter-template/LICENSE must be written verbatim (see build-custom-mcp-server/SKILL.md §4.2). If this is a deliberate non-FSL contribution, set FSL_LICENSE_OVERRIDE=1."
    echo "        first line found: $(head -1 "$LICENSE_FILE")" >&2
  fi
fi

# -----------------------------------------------------------------------------
# 2b) package.json declares license: "FSL-1.1-MIT"
# -----------------------------------------------------------------------------
# A LICENSE file on disk is not enough — npm, the MCP registry, and license
# scanners read the `license` field from package.json. The value must match
# the LICENSE file's SPDX identifier. Missing or drifted field causes
# downstream "UNLICENSED" warnings, GitHub license-detector mislabels, and
# reviewer pushback.
#
# Override: set FSL_LICENSE_OVERRIDE=1 to accept any non-empty value
# (same escape hatch as the LICENSE file check above).
if [ -f package.json ]; then
  if ! grep -qE '"license"[[:space:]]*:' package.json; then
    report_fail "package.json missing \"license\" field — add \"license\": \"FSL-1.1-MIT\" (required to match upstream mcp-servers repo)"
  elif [ "${FSL_LICENSE_OVERRIDE:-0}" = "1" ]; then
    report_pass "package.json declares a \"license\" field (FSL_LICENSE_OVERRIDE=1 — skipping value match)"
  elif grep -qE '"license"[[:space:]]*:[[:space:]]*"FSL-1\.1-MIT"' package.json; then
    report_pass "package.json declares \"license\": \"FSL-1.1-MIT\""
  else
    # Extract the actual value for a clear error message. Uses grep+sed
    # rather than pulling in jq (not guaranteed to be installed).
    ACTUAL_LICENSE=$(grep -oE '"license"[[:space:]]*:[[:space:]]*"[^"]*"' package.json | head -1 | sed -E 's/.*"license"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/')
    report_fail "package.json \"license\" is \"${ACTUAL_LICENSE:-<unparseable>}\" — must be \"FSL-1.1-MIT\" to match upstream mcp-servers repo. If this is a deliberate non-FSL contribution, set FSL_LICENSE_OVERRIDE=1."
  fi
fi

# -----------------------------------------------------------------------------
# 3) README.md present, non-empty, and placeholder sentinel removed
# -----------------------------------------------------------------------------
# The starter-template README ships with an HTML-comment sentinel
# `PRE_SUBMIT_PLACEHOLDER` that the agent is expected to remove after
# filling in the README. If the sentinel is still present, the README is
# still a template and must not be submitted.
if [ -f README.md ]; then
  if [ ! -s README.md ]; then
    report_fail "README.md is empty"
  elif grep -q 'PRE_SUBMIT_PLACEHOLDER' README.md 2>/dev/null; then
    report_fail "README.md still contains the PRE_SUBMIT_PLACEHOLDER sentinel — replace the templated content before submitting"
  else
    # Catch unresolved placeholders left over after the sentinel was removed.
    # The starter README uses the convention <UPPER_SNAKE> for fields the
    # agent must fill in (e.g. <CONNECTOR_NAME>, <AUTH_INSTRUCTIONS>, <TOOL_LIST>).
    # Angle-bracketed lowercase strings are left alone because they can be
    # legitimate HTML tags, URLs, or placeholder command flags.
    PLACEHOLDER_HITS=$(grep -oE '<[A-Z][A-Z0-9_]{2,}>' README.md 2>/dev/null | sort -u || true)
    if [ -n "$PLACEHOLDER_HITS" ]; then
      report_fail "README.md still contains unresolved <UPPER_SNAKE_CASE> placeholders — replace them before submitting:"
      echo "$PLACEHOLDER_HITS" | sed 's/^/        /'
    else
      report_pass "README.md present"
    fi
  fi
else
  report_fail "README.md missing (required for OSS contribution)"
fi

# -----------------------------------------------------------------------------
# 3b) No personal absolute paths leaked into README or source
# -----------------------------------------------------------------------------
# Starter docs occasionally end up with the author's home directory baked in
# (e.g. "/Users/you/mcp-servers/foo-mcp/dist/index.js"). These are
# user-hostile and immediately flag the PR as copy-pasted without review.
# Scan README + source for `/Users/<name>/` and `/home/<name>/` and fail.
PERSONAL_PATH_PATTERN='(/Users/[a-zA-Z0-9_.-]+/|/home/[a-zA-Z0-9_.-]+/)'
PERSONAL_SCAN_TARGETS=()
for p in README.md README README.markdown; do
  if [ -f "$p" ]; then PERSONAL_SCAN_TARGETS+=("$p"); fi
done
for d in src __tests__ test tests; do
  if [ -d "$d" ]; then PERSONAL_SCAN_TARGETS+=("$d"); fi
done

if [ ${#PERSONAL_SCAN_TARGETS[@]} -gt 0 ]; then
  if command -v rg >/dev/null 2>&1; then
    set +e
    PERSONAL_HITS=$(rg -n -e "$PERSONAL_PATH_PATTERN" --glob '!node_modules' --glob '!dist' "${PERSONAL_SCAN_TARGETS[@]}" 2>/dev/null)
    PP_STATUS=$?
    set -e
  else
    set +e
    PERSONAL_HITS=$(grep -rEn --exclude-dir=node_modules --exclude-dir=dist -e "$PERSONAL_PATH_PATTERN" "${PERSONAL_SCAN_TARGETS[@]}" 2>/dev/null)
    PP_STATUS=$?
    set -e
  fi
  if [ "$PP_STATUS" -eq 0 ]; then
    report_fail "Personal absolute paths (/Users/<name>/ or /home/<name>/) found — replace with generic placeholders like <absolute path to>/:"
    echo "$PERSONAL_HITS" | head -10 | sed 's/^/        /'
  elif [ "$PP_STATUS" -eq 1 ]; then
    report_pass "No personal absolute paths in README/source"
  fi
fi

# -----------------------------------------------------------------------------
# 4) Tests directory present and non-empty
# -----------------------------------------------------------------------------
TEST_FILES=0
# shellcheck disable=SC2043  # intentional single-pass loop for readability
for tdir in __tests__ test tests; do
  if [ -d "$tdir" ]; then
    # Count any .ts/.js/.mjs file under the test dir
    n=$(find "$tdir" -type f \( -name '*.ts' -o -name '*.js' -o -name '*.mjs' \) 2>/dev/null | wc -l | tr -d ' ')
    TEST_FILES=$((TEST_FILES + n))
  fi
done
if [ "$TEST_FILES" -gt 0 ]; then
  report_pass "Tests directory present ($TEST_FILES test files)"
else
  report_fail "No tests found. At minimum add schema/registration tests under __tests__/ or test/"
fi

# -----------------------------------------------------------------------------
# 5) dist/ not committed
# -----------------------------------------------------------------------------
if [ -d .git ] || git rev-parse --git-dir >/dev/null 2>&1; then
  TRACKED_DIST=$(git ls-files dist 2>/dev/null | head -5)
  if [ -n "$TRACKED_DIST" ]; then
    report_fail "dist/ build artifacts are committed — add 'dist/' to .gitignore and remove from index"
    echo "$TRACKED_DIST" | sed 's/^/        /'
  else
    report_pass "dist/ not committed"
  fi
else
  report_warn "Not a git repository — dist/ committed-check skipped"
fi

# -----------------------------------------------------------------------------
# 6) npm audit (high+)
# -----------------------------------------------------------------------------
# Uses `npm audit --json` and parses vulnerability counts from metadata.
# This avoids the prior regex-sniffing approach that silently passed on any
# unrecognised output (network errors, registry auth problems, etc.).
if [ -f package.json ]; then
  if [ ! -d node_modules ]; then
    echo "${DIM}note: node_modules/ missing — running 'npm install --ignore-scripts' before audit${RESET}"
    if ! npm install --ignore-scripts --no-audit --no-fund >/dev/null 2>&1; then
      report_fail "npm install failed — audit cannot run. Fix install errors before submitting."
    fi
  fi
  if [ -d node_modules ]; then
    AUDIT_JSON=$(npm audit --json --omit=dev 2>/dev/null || true)
    if [ -z "$AUDIT_JSON" ] || ! echo "$AUDIT_JSON" | grep -q '"vulnerabilities"'; then
      report_fail "npm audit produced no parseable output (network/auth/registry error). Audit must succeed before submitting."
      echo "$AUDIT_JSON" | tail -5 | sed 's/^/        /'
    else
      # Extract high + critical counts from the audit metadata block.
      HIGH=$(
        echo "$AUDIT_JSON" \
          | grep -o '"high":[[:space:]]*[0-9]\+' \
          | head -1 | grep -o '[0-9]\+' || echo 0
      )
      CRITICAL=$(
        echo "$AUDIT_JSON" \
          | grep -o '"critical":[[:space:]]*[0-9]\+' \
          | head -1 | grep -o '[0-9]\+' || echo 0
      )
      HIGH=${HIGH:-0}
      CRITICAL=${CRITICAL:-0}
      if [ "$HIGH" -eq 0 ] && [ "$CRITICAL" -eq 0 ]; then
        report_pass "npm audit clean (0 high, 0 critical)"
      else
        report_fail "npm audit: $HIGH high + $CRITICAL critical vulnerabilities"
        npm audit --audit-level=high --omit=dev 2>&1 | tail -10 | sed 's/^/        /'
      fi
    fi
  fi
else
  report_warn "No package.json — npm audit skipped"
fi

# -----------------------------------------------------------------------------
# 7) spawn()/exec() calls without explicit timeout (warn)
# -----------------------------------------------------------------------------
# Subprocess-based tools that omit a timeout can hang the MCP server when
# the child process stalls. This is a WARN (not FAIL) because some spawns
# are short-lived by construction, but reviewers will ask about it.
if [ -d src ]; then
  if command -v rg >/dev/null 2>&1; then
    set +e
    SPAWN_HITS=$(rg -n -e '\b(spawn|spawnSync|exec|execSync|execFile)\s*\(' src --glob '!*.test.*' --glob '!*.spec.*' 2>/dev/null)
    set -e
    if [ -n "$SPAWN_HITS" ]; then
      # Check whether any of the spawn sites mention `timeout`
      if ! echo "$SPAWN_HITS" | head -1 >/dev/null || ! rg -q 'timeout' src --glob '!*.test.*' --glob '!*.spec.*' 2>/dev/null; then
        report_warn "spawn/exec calls found but no 'timeout' reference in src/ — confirm subprocess timeouts are configured:"
        echo "$SPAWN_HITS" | head -5 | sed 's/^/        /'
      fi
    fi
  fi
fi

# -----------------------------------------------------------------------------
# 8) Tests re-define Zod schemas instead of importing from src (warn)
# -----------------------------------------------------------------------------
# Tests should import the real input/output schemas from the source so that
# a schema drift in src/ actually breaks the tests. Inline `z.object(...)`
# in test files is a red flag that tests are validating a parallel copy.
TEST_DIRS_FOR_SCHEMA=()
for d in __tests__ test tests; do
  if [ -d "$d" ]; then TEST_DIRS_FOR_SCHEMA+=("$d"); fi
done
if [ ${#TEST_DIRS_FOR_SCHEMA[@]} -gt 0 ]; then
  if command -v rg >/dev/null 2>&1; then
    set +e
    SCHEMA_HITS=$(rg -n -e 'z\.object\s*\(' "${TEST_DIRS_FOR_SCHEMA[@]}" 2>/dev/null)
    set -e
    if [ -n "$SCHEMA_HITS" ]; then
      report_warn "Tests appear to redefine Zod schemas via z.object(...) — prefer importing schemas from src/ so tests track real drift:"
      echo "$SCHEMA_HITS" | head -5 | sed 's/^/        /'
    fi
  fi
fi

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
echo "${DIM}-----------------------------------------${RESET}"
echo "passed: $PASS   failed: $FAIL"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "Fix the FAIL items above before reporting status=ready_to_submit." >&2
  exit 1
fi
exit 0
