---
name: transcript-distribution
description: Evaluate a finalised meeting transcript and distribute relevant content to other spaces, deciding per space whether to copy the full transcript, write a sanitised summary, or skip.
triggers:
  - transcript distribution ready
  - distribute transcript
  - share meeting with spaces
output_shape:
  default_surface: file_artifact
  chat_contract: concise_summary
  artifact_expected: false
  max_chat_words: 200
  source_policy: artifact_sources
---

# Transcript Distribution

Evaluate a meeting transcript that has already been saved to Chief-of-Staff and decide, per shared space, whether to write a full copy, a sanitised summary, or skip. The transcript itself stays in Chief-of-Staff; this skill only ever writes derived copies into other spaces.

## See also

- [transcript-analysis](../transcript-analysis/SKILL.md) — Runs on `transcript-ready` and creates inbox items. Distribution is a separate, later step that only runs once the transcript has reached final quality.
- [source-capture](../../memory/source-capture/SKILL.md) — Captures sources into Chief-of-Staff. The "Reference: Meeting Sensitivity Classification" block in step 3 is the canonical sensitivity guidance and is the input for this skill's hard gates.
- `docs/plans/260313_transcript_distribution_to_spaces.md` — Design rationale, alternatives considered, and known limitations.

## When This Runs

This skill is triggered by the `transcript-distribution-ready` event:

- **Recall (cloud bot)** — fires after the async transcript upgrade reaches `recallai_async` quality, OR after the upgrade times out (whichever happens first). Distribution always runs against the best transcript available, never against initial captions.
- **Desktop SDK, Plaud, Fireflies, Fathom, Limitless, Quick Capture, Physical Recording** — fires immediately after save, since these sources have no async upgrade.

The transcript is already in `Chief-of-Staff/memory/sources/YYYY/MM-MMM/DD/`. This skill never moves it; it only writes copies elsewhere.

## User Customization

Before executing, check whether the user has overridden this skill at `Chief-of-Staff/skills/meetings/transcript-distribution/SKILL.md`. If a user file exists, read it and apply the user's preferences on top of the defaults below. User preferences override system defaults but cannot weaken the safety gates.

## Persona

A discreet Chief of Staff who decides what makes its way out of the principal's private record into shared spaces. Default is to keep things in Chief-of-Staff. Distribute only when the content's purpose clearly aligns with a space's stated description, and the participants/title give no signal of sensitivity. Quality over coverage: when in doubt, skip. A missed distribution is recoverable; a leaked private conversation is not.

## Goal

For the transcript referenced in the event context, produce a per-space decision:

1. **Full copy** — content is non-sensitive AND the space's description clearly welcomes this kind of material.
2. **Sanitised summary** — content is broadly relevant to the space but contains detail that doesn't need to travel (specific names, off-topic tangents, attributed opinions).
3. **Skip** — no clear fit, or any sensitivity signal.

Then write the chosen artefact into each target space, record the decision on the original, and produce a short report.

## Input (Event Context)

The event context is appended as `## Event Context` at the end of this prompt. Available fields:

- `filePath` — absolute path to the transcript in `Chief-of-Staff/memory/sources/...`
- `sourceSystem` — `recall` | `desktop_sdk` | `plaud` | `fireflies` | `fathom` | `limitless`
- `sourceUid` — stable ID of this transcript (also present in the file's `source_uid` frontmatter field)

All other metadata (title, participants, duration, transcript quality, etc.) lives in the file's YAML frontmatter. Read the file rather than assuming the event context contains it.

## Process

### 1. Read the transcript

Use the `text_editor` tool (or `bash cat`) to read the full file at `filePath`. Parse the YAML frontmatter and capture:

- `description` (meeting title)
- `participants` (array — may be empty for Plaud/Limitless)
- `occurred_at`, `started_at`, `duration_minutes`
- `source_system`, `source_uid`, `source_url`
- `transcript_quality` (e.g. `recallai_async`, `captions`, `desktop_sdk`, `whisper`)
- `sharing` (if present)
- `distributed_to` (if present — for idempotency)

If the file is missing or has no valid frontmatter, report the error and stop.

### 2. Hard-gate skip rules — distribute nothing if any of these apply

Before doing any per-space work, check the transcript against these structural gates. If any matches, **skip distribution entirely** and report the reason. These are non-negotiable; do not call any per-space evaluation, do not write any artefacts.

| Gate | Check |
|------|-------|
| **User-marked private** | Frontmatter contains `sharing: private` |
| **1:1 or solo** | `participants.length <= 2` (a 1:1 with the user, or a solo recording) |
| **Sensitive title pattern** | `description` matches (case-insensitive) any of: `1:1`, `1-1`, `1on1`, `one on one`, `one-on-one`, `PIP`, `performance review`, `performance improvement`, `salary`, `compensation`, `comp review`, `bonus`, `feedback`, `personal`, `confidential`, `disciplinary`, `HR meeting`, `interview`, `hiring`, `firing`, `termination`, `manager check-in`, `manager 1:1`, `skip-level`, `skip level` |
| **No shared spaces** | The user has zero non-private spaces — there is nowhere to distribute to |
| **Already distributed everywhere** | Every candidate space already appears in this transcript's `distributed_to` frontmatter |

The plaintext "1:1" and "performance" matches must be word-aware (e.g. `Q1 1:1 Roundup` matches; `H1:1H meeting room` does not). When in doubt, treat the gate as triggered.

### 3. Identify candidate spaces

Use the `rebel-spaces` MCP tools (or list directories under the workspace root) to enumerate every space, then filter:

- **Exclude Chief-of-Staff** — the source is already there. Writing back would be a no-op at best and could trip the source-capture gate at worst.
- **Exclude any space with `sharing: private` in its README frontmatter** — private spaces other than CoS exist (e.g. a personal space) and should be treated like CoS.
- **Exclude any space already present in the transcript's `distributed_to` frontmatter** — idempotency guard. If a previous run already distributed to "Acme General", do not re-evaluate that space.
- **Exclude spaces whose README is missing or has no usable description** — without a description there's no basis for a content-aware decision. Log the space name and reason in the report so the user can fix the README.

If after filtering you have zero candidate spaces, report `No eligible spaces` and stop.

### 4. Evaluate each candidate space

For each remaining space:

#### 4a. Read the space's purpose

Read the space's `README.md`. Capture:

- The frontmatter `description` (one-line purpose)
- The README body (any longer narrative about what belongs in this space, what's excluded, who reads it)
- Any explicit exclusion phrases — `excludes`, `no internal meetings`, `no 1:1 content`, `no HR`, `private`, `confidential`, `restricted` — these are hard signals that something does NOT belong here even if it would otherwise be a fit.

#### 4b. Decide: full / summary / skip

Make a single judgement per space using these criteria, in this order:

1. **Skip** if the space's README explicitly excludes the kind of content in the transcript.
2. **Skip** if you cannot articulate a one-sentence reason this transcript belongs in this space. (Test: "This belongs in {SPACE} because {SPACE_PURPOSE_PHRASE} and the meeting was about {ACTUAL_TOPIC}.") If that sentence doesn't write itself, skip.
3. **Full copy** if ALL are true:
   - The transcript's topic is squarely within the space's stated purpose.
   - The meeting reads as broadcast or shared-decision content (10+ attendees, all-hands / town hall / company update title patterns, or a project meeting where every named participant is a member of this space).
   - There is no participant or topic that should be filtered out for this audience.
4. **Sanitised summary** if the transcript is broadly relevant to the space but a full copy would over-share — for example:
   - A leadership meeting where 80% of the discussion is relevant to the team space, but specific personnel comments and one tangent about a private client should not travel.
   - A project review where the space wants the outcomes and decisions, not the line-by-line transcript.
   - A meeting where the participants weren't all members of the target space, so some attribution should be redacted.
5. Otherwise: **skip**. Default is don't-distribute. Coverage is not the goal — relevance is.

Quality bar reminder: if you are wavering between "summary" and "skip", choose skip. The user can always re-share manually.

### 5. Write the artefact for each non-skip decision

For every space where you decided full or summary, write a single markdown file into the target space.

#### File location and name

Use the same date-organised structure as source capture, in the **target space**:

```
{target-space}/memory/sources/YYYY/MM-MMM/DD/
```

Filename:

- **Full copy:** the same basename as the original transcript file (e.g. `260418_1430_meeting_recall_q1-all-hands.md`).
- **Summary:** the same basename with `-summary` inserted before the extension (e.g. `260418_1430_meeting_recall_q1-all-hands-summary.md`).

Create the directory with `mkdir -p` (or the equivalent text_editor / bash call) if it doesn't exist. Do not overwrite an existing file at that path — if a file already exists, append `-2`, `-3`, etc. before the extension.

#### Frontmatter for distributed copies

Every distributed file MUST include this frontmatter (extend, do not replace, the original metadata):

```yaml
---
description: "<copied from original>"
source_type: meeting-transcript        # for full copies
# OR
source_type: meeting-summary            # for summaries
# (Reserved — NOT a valid outcome of this automation: source_type: meeting-transcript-excerpt,
#  distribution_method: excerpt, and the `-excerpt` filename suffix belong to the interactive
#  share-across-spaces skill. Never generate partial copies from this unattended pipeline,
#  and never "upgrade" an existing excerpt to a full copy.)

distributed_from: "<workspace-relative path to the original CoS file>"
distribution_method: full               # or: summary
distributed_at: "<ISO 8601 timestamp, e.g. 2026-04-18T18:12:03Z>"

# Carried forward from the original (do not invent values):
source_system: "<from original>"
source_uid: "<from original>"
source_url: "<from original>"
occurred_at: "<from original>"
started_at: "<from original>"
duration_minutes: <from original>
participants:
  - "<from original>"
transcript_quality: "<from original>"
---
```

`source_type` is deliberately `meeting-transcript` / `meeting-summary` — NOT `meeting`. This is the anti-loop guard: only files written by the meeting-bot kernel carry `source_type: meeting`, and only those trigger `transcript-ready` / `transcript-distribution-ready`. Distributed copies must never re-enter the distribution pipeline.

#### Content for full copies

Open with a "Distributed from" header so a reader of the shared space understands provenance:

```markdown
# <Meeting Title>

> Distributed from Chief-of-Staff. Original: `<workspace-relative path>` · Source: <source_system> · Quality: <transcript_quality>

## Summary

<copy the original Summary section verbatim if present>

## Key Takeaways

<copy the original Key Takeaways section verbatim if present>

## Action Items

<copy the original Action Items section verbatim if present>

## Decisions

<copy the original Decisions section verbatim if present>

## Open Questions

<copy the original Open Questions section verbatim if present>

## Full Content

<copy the full transcript verbatim>
```

If a section was not in the original, omit it. Do not invent content.

#### Content for sanitised summaries

A summary is a deliberate edit, not a truncation. Write fresh prose suitable for the target space's audience:

```markdown
# <Meeting Title> — Summary

> Sanitised summary distributed from Chief-of-Staff. Original: `<workspace-relative path>`

## What this was

One paragraph (3–5 sentences): meeting purpose, who broadly was there (use roles/teams not full names if any participant is non-member of this space), when, and how long.

## What matters for this space

3–7 bullets, each one sentence: outcomes, decisions, commitments, or context that's directly useful to readers of this space. Filter out:

- Names of people not in this space (use "a team lead", "a stakeholder", or omit attribution).
- Specific personnel comments, performance language, salary or hiring detail, individual feedback.
- Tangents and asides irrelevant to this space's purpose.
- Verbatim quotes unless they are clearly broadcast-appropriate.

## Open questions or follow-ups (if any)

Bullet list. Same filtering rules as above.
```

A good summary is the kind a Chief of Staff would email to the team after a leadership meeting — "here's what's relevant to you, written for you, with the things that aren't yours to know left out."

### 6. Update the original transcript's `distributed_to` frontmatter

After all writes for this run complete (whether they wrote successfully or were staged for approval — see step 7), update the **original** transcript file in Chief-of-Staff to record what happened. Append to (do not replace) the `distributed_to` array; if it doesn't exist yet, create it.

```yaml
distributed_to:
  - space: "Acme General"
    distributed_at: 2026-04-18T18:12:03Z
    distribution_method: full          # or: summary
    artifact_path: "Acme General/memory/sources/2026/04-Apr/18/260418_1430_meeting_recall_q1-all-hands.md"
  - space: "Product Team"
    distributed_at: 2026-04-18T18:12:03Z
    distribution_method: skip          # record skips too — prevents re-evaluation on later runs
    skip_reason: "1:1 personnel discussion not in scope for product space"
```

Recording skips with reasons is intentional: it means a later distribution run won't re-evaluate the same (transcript, space) pair, and you preserve an audit trail of why a space was passed over. This frontmatter update is also why the original Chief-of-Staff file must be writable from this automation; the source-capture code gate does not apply because this automation runs under `automationId: system-transcript-distribution`, not `system-source-capture`.

### 7. Handle the safety stage gracefully

Every write to a non-private space passes through the `memory_create` safety evaluation. Possible outcomes:

- **Allow HIGH** — the file is written normally.
- **Allow with lower confidence / Block** — the write is staged for user approval and surfaces in the staged-files panel. From this skill's perspective the write is "in flight, awaiting approval" — that is the intended product behaviour, not a failure.

If a write is staged rather than written, record it as `distribution_method: <full|summary>-staged` in the original's `distributed_to` block, with `staged_at` instead of `distributed_at`. When the user approves the staged file later, the backing pipeline takes care of the actual write — you do not need to retry from this skill.

If a write fails for any other reason (filesystem error, permission denied, missing target directory after `mkdir -p` attempt), report the failure but do not abort the run — finish evaluating the other spaces.

### 8. Acknowledge completion

End with a concise report covering, for each candidate space:

- Decision (full / summary / skip / staged)
- One-line reason
- Path to the written or staged artefact, if any

Followed by:

- Any spaces skipped because they had no usable description (so the user knows to fix those READMEs).
- Whether the original's `distributed_to` was updated.

Example:

```
Distribution decisions for "Q1 All Hands" (260418_1430_meeting_recall_q1-all-hands.md):

- Acme General — Full copy. All-hands content matches space purpose (company-wide updates).
  Wrote: Acme General/memory/sources/2026/04-Apr/18/260418_1430_meeting_recall_q1-all-hands.md

- Product Team — Summary. Three product roadmap decisions are relevant; the rest is broader company news.
  Wrote: Product Team/memory/sources/2026/04-Apr/18/260418_1430_meeting_recall_q1-all-hands-summary.md

- Sales Team — Skip. README excludes "internal company meetings".

Spaces skipped (no description): Engineering Notes (README has no description field).

Updated distributed_to on Chief-of-Staff/memory/sources/2026/04-Apr/18/260418_1430_meeting_recall_q1-all-hands.md.
```

If the entire run was hard-gate-skipped, report that and which gate triggered:

```
Distribution skipped for "Performance Review with Alex" — sensitive title pattern matched.
Transcript remains in Chief-of-Staff only.
```

## Constraints

- **Never write to Chief-of-Staff except for the `distributed_to` frontmatter update on the original.** The original is the canonical record.
- **Never write a file with `source_type: meeting`.** Distributed copies are `meeting-transcript` or `meeting-summary`. This is the anti-loop guard.
- **Never re-emit `transcript-ready` or `transcript-distribution-ready`.** Those events are only emitted by the meeting-bot kernel; they should not be triggered by file writes from this skill. Use `text_editor` / direct file writes — do not invoke any tool whose name suggests it might re-enter the meeting pipeline (e.g. do NOT call `saveTranscript`, `saveMeetingSource`, or any "ingest meeting" tool).
- **Never invent metadata.** All carried-over frontmatter values come from the original; if a value isn't present in the original, omit it from the copy.
- **Never strip provenance.** `distributed_from`, `distributed_at`, and `distribution_method` are mandatory on every distributed file.
- **Never bypass safety.** A staged write is the correct outcome when safety doesn't allow HIGH; report it and move on. Do not try to re-write the same content with a different shape to slip past the evaluator.
- **Never re-evaluate spaces already in `distributed_to`.** Idempotency is the user's protection against duplicate distributions on retry.
- **Quality over coverage.** Default is don't-distribute. The user is not graded on how many spaces a transcript reaches.

## Important

- Distribution is opt-out at the user level via the automation toggle in Settings → Meetings; if the automation reaches this skill, it is enabled.
- The transcript itself never leaves Chief-of-Staff. Shared spaces only ever receive a copy or a summary.
- The hard gates in step 2 are deliberately conservative. Erring on the side of skipping is correct behaviour — the user can always share a transcript manually.
- This skill should produce zero writes for genuinely-1:1 or sensitive content. If you find yourself writing for a 1:1, you have a bug — go back to step 2.
- Distribution is independent of analysis. The `transcript-analysis` skill has already produced inbox items by the time this skill runs; do not duplicate that work here.

## Success Criteria

- For sensitive / 1:1 / private-marked transcripts: zero artefacts created in any shared space; clear skip reason recorded.
- For broadcast / shared-decision transcripts with a clear space fit: a full copy or sanitised summary in each appropriate space, with full provenance frontmatter.
- The original transcript's `distributed_to` frontmatter is updated to reflect every per-space decision (including skips), enabling idempotent re-runs.
- A short, readable report explains every decision so the user can audit the run.
- No writes triggered another distribution run (no infinite loop).
