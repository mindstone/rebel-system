# Provenance Schema

Schema documentation for `.skill-provenance.json` files created by the install-skill-from-marketplace skill.

## Purpose

The provenance log provides:
- **Audit trail**: Where did this skill come from?
- **Reproducibility**: Can we fetch the same version again?
- **Security forensics**: What was reviewed before installation?
- **Accountability**: Who approved the installation?

## Schema (v1.0)

```json
{
  "schema_version": "1.0",
  
  "installed_at": "2026-01-13T14:30:00.000Z",
  "installed_by": "username",
  
  "installer_context": {
    "app_version": "0.3.12",
    "skill_version": "1.0.0",
    "platform": "darwin",
    "arch": "arm64"
  },
  
  "source": {
    "type": "github",
    "repo": "owner/repo",
    "path": "skills/skill-name",
    "branch": "main",
    "commit_sha": null,
    "commit_sha_note": "unavailable - unauthenticated download",
    "download_url": "https://codeload.github.com/..."
  },
  
  "archive": {
    "sha256": "abc123def456...",
    "bytes": 12345,
    "downloaded_at": "2026-01-13T14:29:30.000Z"
  },
  
  "installer_skill": "install-skill-from-marketplace",
  
  "discovery": {
    "query": "PDF extraction skill",
    "researcher_reasoning": "Selected anthropics/skills as official...",
    "alternatives_considered": [
      {
        "repo": "community/pdf-tools",
        "reason_rejected": "Lower star count"
      }
    ]
  },
  
  "security_review": {
    "reviewer": "<reviewer-id>",
    "reviewed_at": "2026-01-13T14:29:00.000Z",
    "files_reviewed": ["SKILL.md", "scripts/extract.py"],
    "binary_files_skipped": ["assets/icon.png"],
    "binary_files_acknowledged": true,
    "security_disclaimer_acknowledged": true,
    "findings": {
      "red_flags": [],
      "yellow_flags": ["Uses subprocess.run for pdftk"],
      "summary": "Skill uses pdftk CLI tool. No network calls."
    },
    "user_approved": true,
    "user_approved_at": "2026-01-13T14:29:45.000Z"
  }
}
```

## Field Definitions

### Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `schema_version` | string | Schema version (currently "1.0") |
| `installed_at` | ISO 8601 | Timestamp when install completed |
| `installed_by` | string | Username who ran the install |

### `installer_context`

| Field | Type | Description |
|-------|------|-------------|
| `app_version` | string\|null | Rebel app version (if available) |
| `skill_version` | string | Installer skill version |
| `platform` | string | OS platform (darwin, win32, linux) |
| `arch` | string | CPU architecture (arm64, x64) |

### `source`

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Source type (currently "github") |
| `repo` | string | Repository in "owner/repo" format |
| `path` | string | Path to skill within repo |
| `branch` | string | Branch name |
| `commit_sha` | string\|null | Commit SHA (often null for codeload) |
| `commit_sha_note` | string | Explanation if SHA unavailable |
| `download_url` | string | Exact URL used for download |

### `archive`

| Field | Type | Description |
|-------|------|-------------|
| `sha256` | string | SHA256 hash of downloaded archive |
| `bytes` | number | Archive size in bytes |
| `downloaded_at` | ISO 8601 | Timestamp when archive downloaded |

### `discovery` (optional)

| Field | Type | Description |
|-------|------|-------------|
| `query` | string | User's search query |
| `researcher_reasoning` | string | Why this skill was selected |
| `alternatives_considered` | array | Other skills considered |

### `security_review`

| Field | Type | Description |
|-------|------|-------------|
| `reviewer` | string | Reviewer model/agent used |
| `reviewed_at` | ISO 8601 | Timestamp of review |
| `files_reviewed` | string[] | List of files that were reviewed |
| `binary_files_skipped` | string[] | Binary files not reviewed |
| `binary_files_acknowledged` | boolean | User acknowledged binaries |
| `security_disclaimer_acknowledged` | boolean | User acknowledged limitations |
| `findings` | object | Review findings |
| `findings.red_flags` | string[] | High-risk issues found |
| `findings.yellow_flags` | string[] | Notable issues found |
| `findings.summary` | string | Plain-language summary |
| `user_approved` | boolean | User explicitly approved |
| `user_approved_at` | ISO 8601 | Timestamp of approval |

## Known Limitations

| Issue | Impact | Notes |
|-------|--------|-------|
| `commit_sha` often null | Exact version tracking limited | GitHub codeload doesn't expose it |
| `archive.sha256` as fallback | Can verify same download | But not same commit |
| Binary files not reviewed | Security gap | User must acknowledge |

## Schema Evolution

Future versions may add:
- `v1.1`: Central install registry reference
- `v2.0`: Signature verification fields
- `v2.0`: Update history tracking
