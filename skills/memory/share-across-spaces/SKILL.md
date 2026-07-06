---
name: share-across-spaces
description: "Share or move memory content across space boundaries (also: move this to [space], share the bits about X, copy into [space], promote from Chief-of-Staff). Copies the least-derived safe shape — full copy, partial copy, or summary — with in-chat approval before writing."
use_cases:
  - "Move this to the Company-wide space"
  - "Share the product bits of this meeting with the team"
  - "Copy this into [space]"
  - "Make this available to [team]"
  - "Promote this from Chief-of-Staff"
  - "Share across spaces"
last_updated: 2026-07-06
tools_required: []
agent_type: main_agent
---

# Share Across Spaces

Move or copy memory content (sources, topic conclusions) from one space to another — most often from Chief-of-Staff to a shared space.

## Principle

**Raw sources are canonical — like code.** A summary is a derived artifact: it can misremember, and it goes stale. When content crosses a space boundary, prefer the least-derived shape that is safe for the destination:

1. **Full copy** — the whole source, when all of it is safe for the destination space.
2. **Partial copy** — the original words with the non-shareable sections removed and the removals shown. Only when the private and shareable parts are cleanly separable (checks below).
3. **Sanitised summary** — freshly written for the destination, when private and shareable content are woven together.
4. **Skip** — when nothing can safely cross.

**Safety decides eligibility; fidelity decides shape.** The ladder is a preference order *within* what is safe — never a reason to stretch what is safe. When in doubt, step down.

**Copy, never link.** A shared-space file must never link to, cite, or name a Chief-of-Staff (or other private-space) file — even the existence of private content is a leak. Within a space, signpost to the canonical file instead of duplicating ([signposting-to-single-source-of-truth](../../documentation/signposting-to-single-source-of-truth/SKILL.md)); across a privacy boundary, the only safe reference is a copy.

## Choosing partial copy: the separability checks

A partial copy is allowed only when ALL of these hold:

- **Contiguous blocks** — removals are whole sections or blocks, not word-level edits inside sentences.
- **Coherent standalone** — the remaining text reads naturally to someone who never saw the original; no dangling references to removed content.
- **Names and metadata stripped** — speaker names, participant lists, and identifying metadata from the private original are removed by default, unless clearly safe for the destination.
- **Stranger test** — imagine a member of the destination space who knows the people and context but never saw the original: could they plausibly guess what was removed, or about whom? If yes, use a summary instead.
- **Justified fidelity** — you can say why a summary is not enough for this case (e.g. the exact wording matters, or the user asked for the original words). If you can't, use a summary.

Flag anything borderline when presenting the candidate — never silently resolve doubt in favour of sharing.

## Approval flow (never write first)

1. Assemble the candidate in the chosen shape.
2. Run the separability checks (for partial copies).
3. **Show the candidate in chat.** For partial copies, elisions stay visible:

   > [Section removed: not for this space]

   Never join text across a removal as if nothing was cut. Mention any borderline calls and your "why not a summary" reasoning.
4. Get explicit approval (or adjustments) from the user.
5. Only then write the file to the destination space. Normal memory write approvals (the pending drawer) may still apply on top — that is a backstop, not a substitute for this flow.

## Provenance (leak-safe)

On the **shared copy** (frontmatter) — non-sensitive fields only:

- `distribution_method: full-copy | excerpt | summary`
- `distributed_at: <yyMMdd>`
- `distribution_id: <opaque id, e.g. 8 random hex chars>`
- Partial copies additionally: `source_type: <original type>-excerpt` and a `-excerpt` filename suffix.
- **Never** the private source's path, filename, participant list, or any other identifier of the original.

On the **private original** — add a `distributed_to` ledger entry: destination space, shape, date, and the same `distribution_id`. This makes re-sharing idempotent (re-invoking updates the existing copy in place — never a `-2` duplicate) and lets future corrections to the source find its derived copies.

## Sharing a conclusion from a private topic (topic stub)

When a shared space needs a conclusion whose backing lives in a private topic: write a few fresh sentences stating the conclusion in the shared space, with the same non-sensitive provenance. Never deep-link the private topic, and never copy it wholesale.

## See also

- [source-capture](../source-capture/SKILL.md) — how sources are captured (into Chief-of-Staff)
- [transcript-distribution](../../meetings/transcript-distribution/SKILL.md) — the *automated* per-space distribution of meeting transcripts; this skill is the interactive, user-requested path
- [signposting-to-single-source-of-truth](../../documentation/signposting-to-single-source-of-truth/SKILL.md) — within-space referencing
- [memory-folders-and-approvals](../../../help-for-humans/memory-folders-and-approvals.md) — user-facing explanation of sources, approvals, and partial copies
