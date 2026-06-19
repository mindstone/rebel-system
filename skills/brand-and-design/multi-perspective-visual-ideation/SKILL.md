---
name: multi-perspective-visual-ideation
description: "Generate a rich longlist of image ideas by deliberately spinning up multiple contrasting creative perspectives (comic, infographic, storybook, documentary, etc.), score into a shortlist, then optionally generate the images using Nano Banana or OpenAI image generation. Use for tutorials, decks, blog posts, landing pages — anywhere you need a cohesive-but-varied image set."
use_cases:
  - "Plan illustrations for a tutorial, deck, blog post, or landing page"
  - "Brainstorm a cohesive-but-varied image set for a long-form artifact"
  - "Avoid monotone visual output by forcing contrasting creative lenses"
  - "Go from concept to generated images using available image-gen tools"
last_updated: 2026-05-12
tools_required: []
agent_type: main_agent
---

# Multi-Perspective Visual Ideation

Most visual ideation falls into the trap of "one voice, one aesthetic, one type of image." You end up with a bunch of mildly-varied infographics, or a bunch of mildly-varied hero shots. This skill deliberately forces contrasting perspectives so the longlist covers more conceptual and stylistic ground — then scores down to a shortlist that earns its place in the final artifact, and (if image generation tools are available) renders the shortlist.


## See also

- `documentation/write-tutorial-explainer/SKILL.md` — common downstream consumer for tutorial illustrations
- `documentation/write-help-evergreen-doc/SKILL.md` — for embedding the shortlist plan into a longer doc
- `utilities/screenshot-capture/SKILL.md` — alternative when the user wants real UI screenshots rather than illustrations


## [PERSONA]

You are a creative director running a pitch room. You are deliberately pluralistic — you invite sharply different perspectives rather than converging prematurely, because the best shortlist comes from a longlist that reached further.


## [GOAL]

Produce a shortlist of ~6–20 image ideas (with prompts ready for generation) that:

- Come from **at least 3 genuinely contrasting perspectives**
- Are **scored explicitly** against criteria the user agrees with
- Are **grouped into sets** if the final artifact calls for contrasting visual styles
- Preserve **REAL vs FABRICATED** provenance for any illustrative examples

Then, if image generation tools are available and the user wants it, render the shortlist into actual image files.


## [WHEN TO USE]

Use this skill when:
- You're producing an illustrated artifact (tutorial, deck, blog post, landing page, investor narrative) and need ≥6 distinct images
- The audience is non-specialist and visuals carry real explanatory load (not just decoration)
- You want the output to feel cohesive-but-varied, not monotone

Skip it when:
- You only need 1–2 images (brief the image tool directly)
- The visual style is rigidly pre-specified (existing brand template, fixed ad unit)
- Time is very constrained and "good enough" beats "well-chosen"


## [PROCESS]

### Phase 1 — Frame the brief (1–2 clarifying questions max)

Ask only what meaningfully changes the output. Candidates (pick the most material):

1. **Audience** — who are they, what do they already understand?
2. **Final artifact** — tutorial / deck / social / hero image / video storyboard?
3. **Quantity** — roughly how many final images? (default: ~6; ask if the natural answer is >10)
4. **Style constraints** — brand palette / existing character or style to match?
5. **Cohesion vs contrast** — one unified look, or ≥2 contrasting sets?
6. **Generation tool preference** — Nano Banana, OpenAI image generation, both for comparison, or just prompts (no generation)?

**Defaults when the user doesn't specify:** 6 final images, one cohesive set, generation deferred until prompts are agreed.

### Phase 2 — Choose perspectives (pick ≥3 that genuinely contrast)

Pick from the longlist below OR invent your own. The goal is **real contrast**, not three flavours of the same thing. A good selection usually mixes at least one *narrative* perspective, one *analytical* perspective, and one *emotional/affective* perspective.

| Perspective | What it contributes | Best for |
|---|---|---|
| **Comic artist** | Punchy single-panel gags, exaggeration, clarity via caricature | Pain points, "before/after", personality moments |
| **Infographic designer** | Diagrams, flows, decision trees, comparison tables | Mechanics, taxonomies, trade-offs |
| **Storybook illustrator** | Rich painterly scenes, atmosphere, characters in a world | Narrative moments, team/role scenes, emotional beats |
| **Documentary photographer** | Grounded realism, candid, human-scale | Real examples, testimonials, credibility |
| **Architect / blueprint** | Schematic, cross-section, cutaway, annotated | System internals, assembly, "how the pieces fit" |
| **Children's picture book** | Simple shapes, warm colours, one-idea-per-page | Introducing a concept to true beginners |
| **Film director (single still)** | One cinematic moment that implies a whole story | Hero images, openers, pay-off shots |
| **Data journalist** | Chart-forward, annotated, narrative in numbers | Quantitative arguments, benchmarks |
| **UI / product mock** | Stylised screenshot of the thing in use | "What it actually looks like" |
| **Metaphor designer** | Extended visual metaphor (orchestra, kitchen, factory, garden) | Explaining an abstract mechanism |
| **Poster / propaganda** | Bold graphic, slogan, single iconic image | Rallying statement, manifesto beat |
| **Scientific illustration** | Botanical-plate style, cross-section, labelled parts | Anatomy of a thing |
| **Street photographer** | Busy, observational, real-world context | Showing the environment the tool lives in |
| **Board game illustration** | Isometric scene, multiple characters, readable at-a-glance | Multi-role workflows, "who does what" |
| **Storyboard / comic strip** | 3–6 panel micro-sequence | Before/during/after, cause-and-effect |

**Tip:** If subagents are available, spin up one per perspective in parallel. Each returns 6–10 ideas in its lens. If subagents are unavailable, do the lenses sequentially in the main thread and **section the longlist clearly by lens** so the contrast stays legible.

### Phase 3 — Generate the longlist

For each chosen perspective, produce **6–10 raw ideas**. Each idea is a one-liner — don't write full prompts yet. Aim for **25–40 ideas total**.

Encourage range within each lens: most-obvious idea, weird angle, emotional beat, didactic beat, punchline. Permit apparent duplication across lenses — the same concept rendered comic-style vs storybook-style is two different ideas.

### Phase 4 — Agree on scoring criteria

Default criteria (user can override):

1. **Explanatory value** — does this actually teach the concept? (weight: 3×)
2. **Memorability** — will someone remember it a week later? (weight: 2×)
3. **Brand / style cohesion** — does it fit the overall look? (weight: 2×)
4. **Emotional resonance** — does it land emotionally? (weight: 1×)
5. **Production feasibility** — can it be rendered well by the chosen tool? (weight: 1×)

**Score each idea 1–5 per criterion.** Total weighted score ranks the longlist.

### Phase 5 — Shortlist and balance

- Take the top N (where N = target image count + ~20% buffer)
- **Check perspective coverage** — does the shortlist still represent ≥3 perspectives? If a lens has been eliminated, re-add its best idea unless it was genuinely weak
- **Check narrative coverage** — do the images together tell the full story the artifact needs? If Act 3 has 5 images and Act 5 has none, rebalance
- **Group into sets** if the downstream artifact benefits — e.g. "Set A = comic punchlines, Set B = storybook scenes, Set C = infographics"

### Phase 6 — Write the prompts

For each shortlisted idea, write the full generation prompt. Include:

- **Lens / style tag** (so the generator knows whether it's comic, storybook, infographic)
- **Subject description** — what's literally in the frame
- **Style direction** — palette, lighting, character references if applicable
- **Aspect ratio** and **any text content** (all rendered text must be short and spelled correctly — even modern image models break on long copy)
- **REAL vs FABRICATED tag** if the image depicts an example (see Phase 7)
- **Target generator** — Nano Banana (Gemini) or OpenAI image generation — picked per [WHICH GENERATOR TO USE]

### Phase 7 — REAL vs FABRICATED annotation

If any images depict specific examples (a real customer, a real meeting, a real workflow instance), tag each prompt and each eventual caption as either:

- **REAL** — genuinely happened; redact sensitive detail (names, financials, companies) but preserve that it's real
- **FABRICATED** — invented for illustration; must be labelled prominently in the output so the distinction survives all the way to the reader

This annotation must survive end-to-end: in the longlist, in the shortlist, optionally in the image filename (e.g. `D2_use-cases-montage_FABRICATED.png`), and in the final captions. Mixing up REAL and FABRICATED is a trust-destroying error; treat this as non-negotiable.

### Phase 8 — Generate the images (optional)

Skip this phase if the user only wants the prompt plan. Otherwise:

1. **Confirm with the user** which generator to use and roughly how many to render this pass. Mention that OpenAI gpt-image-2 is billed per image (~$0.21 each at high quality); Nano Banana is free up to a daily quota on Google's free tier.
2. **Check which image tools are connected.** Look at the tools available to you in this turn for any of: `nano_banana_generate`, `nano_banana_edit`, `generate_image`, `edit_image`. If none are available, tell the user which connector to enable in **Settings → Connectors** (Nano Banana or OpenAI Image Generation) and stop.
3. **Render the shortlist** by calling the matching tool for each prompt, with the aspect ratio from Phase 6. Save under the workspace if available, otherwise `~/Pictures/RebelImages/`. Use filenames that encode set + ordinal + REAL/FABRICATED, e.g. `A1_comic-onboarding-pain_FABRICATED.png`.
4. **Iterate.** Show the user the first batch, ask which to keep, which to redo (with prompt tweaks), and which to drop. Use `nano_banana_edit` / `edit_image` for targeted edits rather than full regenerations when possible.
5. **Log the final mapping** in the plan doc: prompt → file path → status (kept / redone / dropped) → REAL/FABRICATED.


## [WHICH GENERATOR TO USE]

| Need | Pick |
|---|---|
| Rendered text inside the image (headlines, labels, multilingual copy) | **OpenAI image generation** (`generate_image`) |
| Stylistic edits to an existing image (recolor, redraw, swap elements) | **Nano Banana** (`nano_banana_edit`) — true image editing, not just inpainting |
| Large batches at flat cost | **Nano Banana** — free tier covers a lot of iteration |
| Photo-realistic faces / hands / fine detail | Try both; OpenAI gpt-image-2 currently has the edge on realism, Nano Banana Pro is close |
| Quick infographic / diagram | Either; OpenAI is sharper on labels, Nano Banana cheaper to iterate |

When in doubt, render the same prompt in both for the first 2–3 shortlist items and let the user pick the aesthetic before committing to a generator for the rest.


## [OUTPUT STRUCTURE]

Save the longlist + shortlist + prompts to a planning doc, ideally alongside the eventual images:

````markdown
# <Topic> — Visual Ideation Plan

## Brief
- Audience: ...
- Final artifact: ...
- Target image count: N
- Sets (if >1): ...
- Generator: Nano Banana / OpenAI / both

## Perspectives chosen
- [lens 1] — why
- [lens 2] — why
- [lens 3] — why

## Longlist (N ideas across M lenses)
### Lens 1: <name>
1. ...

### Lens 2: <name>
...

## Scoring criteria (agreed weights)
...

## Shortlist (sorted by score, grouped into sets)
### Set A — <name>
| # | Idea | Lens | Score | REAL/FABRICATED | Generator |

## Prompts
### A1 — <title>
- Prompt: "..."
- Aspect: ...
- REAL/FABRICATED: ...
- Generator: ...
- File: ...
- Status: kept / redone / dropped
````


## [ANTI-PATTERNS]

- **One-voice ideation.** Producing 20 ideas that are all "infographic-ish" is the failure mode this skill exists to prevent. If you notice convergence during the longlist, force yourself back into a fresh perspective.
- **Skipping the scoring step.** Without explicit criteria you'll pick on taste alone and coverage will skew.
- **Letting REAL/FABRICATED drift.** Once lost, it can't be recovered. Label at the prompt stage.
- **Premature prompt-writing.** Write one-liners during Phase 3. Full prompts are Phase 6 work, after the shortlist is locked.
- **Ignoring coverage gaps.** Top-scoring ideas might cluster on one act of the narrative, leaving later acts un-illustrated. Always do the narrative-coverage check in Phase 5.
- **Generating before agreeing.** Don't burn image-gen quota / spend on a longlist. Lock the shortlist first.
- **Silent generator fallback.** If the requested generator isn't connected, tell the user and stop. Don't silently switch.


## [IMPORTANT]

- The skill defaults to producing a plan first; image generation in Phase 8 is opt-in and gated on the user confirming generator and budget.
- Image generation tools come from Rebel's bundled connectors (Nano Banana, OpenAI Image Generation). They appear as tools (`nano_banana_generate`, `generate_image`, etc.) only when the user has configured the corresponding API key in **Settings → Connectors**.
- Rendered text inside images is brittle — keep it short, spell-checked, and confirm post-render that the text came out correctly. Re-render if not.
- Never paste real customer names, financial figures, or other sensitive content into image prompts — redact even in REAL-tagged images.
