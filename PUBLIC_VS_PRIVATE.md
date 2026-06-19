# Public vs private taxonomy

## Purpose

This file explains what in `rebel-system/` is intended to ship publicly, what is scrubbed before publishing, and what stays out of the public mirror. It is the quick map; the policy details live in [`../docs/project/PUBLIC_MIRROR_EXCLUSION_LIST.md`](../docs/project/PUBLIC_MIRROR_EXCLUSION_LIST.md), and the launch-blocker decision record is [`../docs/plans/260520_oss_release_strategy.md` §5 M10](../docs/plans/260520_oss_release_strategy.md#5-open-questions-and-todos-m1m11).

Classification labels mean:

- **publish** — public as-is after normal review.
- **scrub-then-publish** — public after removing private examples, internal infrastructure, customer facts, employee attribution, or stale private links.
- **mirror-exclude** — present in the internal source of truth, but omitted from public mirror output.

Git metadata is not content. The table below classifies the user-visible top-level files and directories in this folder.

Use this taxonomy when you are:

- adding a new skill,
- changing bundled help docs,
- bringing in third-party skill packs,
- deciding whether an example should be fictionalized,
- reviewing a contribution that mentions a real organisation, or
- wondering whether "it's only an example" is doing too much work.

The answer is usually simple: publish the useful method, remove the private breadcrumb.

## Top-level directory classification

| Directory / file | Classification | Notes | Status after M10 |
|---|---|---|---|
| `.github/` | **mirror-exclude** | Superproject §4a policy parallel. | Kept in the canonical repo, but `rebel-system/.github/workflows/**` is excluded from the public mirror because it is internal CI. |
| `cli/` | **publish** | Clean. | Published as-is. |
| `help-for-humans/` | **scrub-then-publish** | End-user help docs; scrubbed for internal support routes, tenant examples, ticket IDs, and internal workflow comments. | Scrubbed and public-facing; public support inbox references remain allowlisted. |
| `operators/` | **publish** | Clean across all operator definitions. | Published as-is. |
| `plugins/` | **publish** | Clean. | Published as-is. |
| `prompts/` | **scrub-then-publish** | Minor prompt examples needed genericization. | Scrubbed and published, with the onboarding-coach product identity disclosure intentionally preserved. |
| `scripts/` | **scrub-then-publish** | One internal migration script removed; remaining scripts genericized. | Published after scrub; helper scripts must keep configuration user-controlled rather than company-specific. |
| `skills/` | **scrub-then-publish** | Bulk of the content; most skills publish after removing employee, customer, internal-infra, and private-repo references. | Scrubbed and published, with the narrow exceptions below. |
| `templates/` | **publish** | Clean. | Published as-is. |
| `AGENTS.md` | **scrub-then-publish** | Bundled agent instructions; scrubbed stale private examples and internal tool identifiers. | Scrubbed and published. |
| `CLAUDE.md` | **publish** | Symlink to `AGENTS.md`; disposition follows the target. | Published as the same public-facing instruction surface. |
| `README.md` | **scrub-then-publish** | Background/history text needed genericization. | Scrubbed and published. |
| `PUBLIC_VS_PRIVATE.md` | **publish** | Self-documenting taxonomy for OSS bundle. | Published as-is. |
| `package.json`, `package-lock.json`, `.gitignore` | **publish** | Small dependency/config surface; clean. | `package.json` and `.gitignore` publish as-is; no `package-lock.json` is present in the current tree. |

Reading the status column:

- "Published as-is" means the directory had no M10-specific content changes.
- "Scrubbed and published" means the current public copy is the scrubbed form; do not restore old examples from git history.
- "Mirror-excluded" means the canonical repo still has the path, but public mirror output should not.

## Per-skill / per-file exceptions

These are intentionally narrow. If a path is not listed here, use the top-level classification above and the checker rules below.

Two principles keep the exceptions small:

- Public methodology and reusable skills are usually fine.
- Private operational history, real people, real customers, and internal infrastructure are not seasoning. They do not make the soup better.

| Path | Decision | Rationale |
|---|---|---|
| `skills/Anthropic-official-skills/` | Publish as third-party material. | These skills publish under Anthropic's own license files and notices. Do not rewrite them as Rebel-owned content. |
| `skills/external-IDE-OBSOLETE/` | Publish as-is. | The name says "obsolete", not "private". It remains useful for people using external IDEs, even if Rebel is the happier path. |
| `skills/sales/sales-proposal-drafting/examples/` | Publish as fictional examples. | Kept per the M10 decision: fictional content — illustrative only, not real customers. |
| `skills/meetings/meeting-prep/examples/` | Publish as fictional examples. | Kept per the M10 decision: fictional content — illustrative only, not real customers. |
| `skills/coding/build-custom-mcp-server/` | Publish with public OSS references preserved. | Public references to the `mindstone-engineering` OSS org and package names are intentional; private Rebel app repo references were scrubbed. |
| `skills/coding/extend-mcp-server/` | Publish with public OSS references preserved. | Same rule: public `mindstone-engineering` references stay, private app-repo and internal reviewer-doc references do not. |
| `skills/thinking/prioritise-by-ease-value/SKILL.md` | Publish with one file-scoped citation allowlist. | The named Greg&nbsp;Detre public-blog citation is intentionally preserved in that file only. |
| `prompts/utility/onboarding-coach.md` | Publish with product identity disclosure preserved. | The Mindstone identity disclosure is an intentional product fact, not a leak. |

## Ongoing scrubbing rules

The canonical guard (`runRebelSystemStrictScan()`, part of the internal mirror leak-gate tooling) scans the canonical `rebel-system/` tree directly, not the mirror-transformed output. In plain English, it blocks:

| Pattern | High-level rule |
|---|---|
| P1 | No legacy shared-drive folder names. |
| P2 | No internal workspace path stems. |
| P3 | No internal ticket identifiers. |
| P4 | No internal connector-workspace URLs. |
| P5 | No internal automation-tenant URLs. |
| P6 | No internal Slack channel names. |
| P7 | No internal hiring-memory paths. |
| P8 | No stale links to removed private or commercial skill areas. |
| P9 | No internal Slack workspace tool IDs. |
| P10 | No Linear workspace URLs. |
| P11 | No real Notion page IDs hidden behind placeholder company names. |
| P12 | No internal workflow names. |
| P13 | No internal droid identifiers. |
| P14 | No employee-name email stems. |
| P15 | No private Rebel app superproject references. |

Allowlists are allowed, but only when they are boring in the useful way:

- Public corporate inboxes are allowlisted in the mirror leak-gate's allowlist (internal mirror tooling) with exact matches and reasons.
- File-scoped exceptions must stay file-scoped. A citation in one skill is not permission for the whole tree to start naming people.
- Mirror-only exclusions and substitutions belong in [`../mirror/substitutions.yaml`](../mirror/substitutions.yaml). If something should never ship, exclude it there and document the rationale.
- New `SKILL.md` contributions should use `Team Member` for author/contributor attribution unless there is an explicit, public, licensed reason to name someone.

Contributor checklist:

1. Prefer fictional examples.
2. Prefer generic company names and generic folder names.
3. Prefer public product URLs over internal workspace URLs.
4. Prefer public support routes over team chat channels.
5. Do not copy incident notes, postmortems, sales details, or private planning fragments into skills.
6. If a public citation needs a real person or project name, scope the allowlist to the single file and explain why.
7. Run the OSS surface checker before handing off.

The checker is intentionally conservative. A false positive is a small paperwork problem; a real leak in public git history is a much less charming afternoon.

### What to fictionalize

Fictionalize examples that include:

- names of employees, customers, candidates, suppliers, or investors,
- project names that identify a real commercial situation,
- deal size, pricing, procurement, hiring, or renewal details,
- workspace paths that reveal how the internal team stores files,
- Slack, Notion, Linear, automation, or connector workspace URLs,
- screenshots, transcripts, or excerpts from real conversations, and
- any prose whose usefulness depends on a private situation being recognizable.

Good fictional examples are specific enough to teach the workflow and fake enough that nobody has to check whether they signed an NDA. Use ordinary names, ordinary companies, and ordinary messes.

### What can stay public

Keep content public when it is:

- reusable methodology,
- product behavior that users need to understand,
- setup guidance for public tools,
- public OSS repository or package references,
- licensed third-party material with its own notices,
- fictional examples labelled clearly enough to avoid confusion, or
- public corporate contact information already covered by the allowlist.

When the answer is mixed, split it: publish the reusable method, remove the private fact, and add a narrow exception only if the fact is truly necessary.

## Removed content (audit trail)

Stage 1 of M10 deliberately removed or excluded the following internal-only surfaces:

| Path | What happened | Why |
|---|---|---|
| `skills/system/archive/klavis-mcp-check-connectivity-auth-archived-260107/` | Removed. | Archived SSO setup notes were internal operational history, not reusable public guidance. |
| `scripts/port_v1_to_v3_bulk_copy.py` | Removed. | One-off migration helper for a Mindstone-specific v1-to-v3 workspace move. Useful once; public forever would be a bit much. |
| `.github/workflows/` | Mirror-excluded. | Internal CI workflow context and the `SLACK_WEBHOOK` secret name do not help OSS users. |

For the machine-enforced mirror rule and rationale, see [`../docs/project/PUBLIC_MIRROR_EXCLUSION_LIST.md` §4a](../docs/project/PUBLIC_MIRROR_EXCLUSION_LIST.md#4a-internal-ci--release-workflows).
