---
description: "Is Rebel open source? What licence it uses (fair source / Business Source License), exactly what you're allowed to do, how the 100-person limit is counted, when each version becomes fully open, and the licences of the open components Rebel is built from."
---

# Is Rebel Open Source? Licensing, Explained

**Short answer:** Rebel is **fair source** — its source code is published openly for anyone to read, learn from, and modify, and most people can use it freely. It isn't *quite* open source yet, but every version becomes fully open source on a fixed timer. The bundled library Rebel runs on is already fully open today.

If that's all you needed, you can stop here. The rest is detail for the curious — including exactly where the line sits between "use it freely" and "talk to us about a licence."

## Fair source, in plain terms

"Open source" has a precise meaning: anyone may use, modify, and redistribute the code — including commercially — under the licence's conditions. That's wonderful for the world and tricky for a small company trying to keep the lights on — a better-funded competitor could simply take the lot and undercut you.

**Fair source** is the middle path. The source is published openly — and you're free to read it, change it, and run it yourself. The catch is a light commercial guardrail: running Rebel *in production* is free for your organisation's own internal use **up to 100 people**, and beyond that — or if you want to run Rebel *for other people* — you'd need a commercial licence from Mindstone. And the guardrail isn't permanent: after a set period, each version sheds it and becomes plain open source.

Rebel uses the best-known fair-source licence, the **Business Source License (BSL)** — the same one MariaDB, Sentry, and others use.

## What you're allowed to do

- **Read the published source.** Learn from it, audit it, satisfy yourself about what it does.
- **Modify it and build on it.** Tinker, extend, fix, fork — as much as you like.
- **Do all of the above without limit, for anything that isn't production use.** Development, testing, evaluation, experimentation, teaching — there's no headcount cap and no licence required. The 100-person line below is about *running Rebel for real work*, not about reading or hacking on the code.
- **Run it yourself.** Self-host the open build on your own machines and accounts — see [The open build](rebel://library/rebel-system%2Fhelp-for-humans%2Ffair-source-and-open-source-build.md).
- **Use it at work.** Your organisation may run Rebel for its own internal business, free of charge, **up to 100 people** (see exactly how that's counted below).

The two lines you can't cross without a commercial licence: running Rebel in production for **more than 100 people in your organisation**, or running it **for people outside your organisation** (offering it as a service to others — paid *or* free). Inside those lines, it's yours to use.

## Where exactly is the line? (the 100-person limit, precisely)

This is the question we get asked most, so here's the exact shape of it — in plain terms, with the legally binding wording living in the LICENSE file itself.

**Who counts toward the 100?** Each distinct *person* who is authorised to use Rebel for your organisation's work. A few clarifications that usually come up:

- **People, not devices.** One person using Rebel on a laptop, a desktop, and a phone is **one** of your 100, not three.
- **Contractors count too.** Consultants, temps, and other third parties using Rebel for your business count the same as employees.
- **Automation doesn't count.** Build pipelines, test runners, and other non-interactive systems that don't serve a human aren't seats.
- **It's who's authorised, not who's logged in.** The count is everyone *authorised* to use Rebel for your organisation at a given time — not how many happen to be active at once. A 120-person company is over the limit even if only 90 are ever using it simultaneously. The flip side: it's a snapshot, not a lifetime tally — people who've left don't keep counting.

**What counts as "your organisation"?** You, plus any companies you control or that control you — broadly, where there's more than 50% common ownership. So a parent company and its subsidiaries are counted *together* toward the same 100, not as separate allowances. (If your group is genuinely separate legal entities with no controlling stake between them, they're separate organisations.)

**What counts as "production use"?** Using Rebel to actually do your organisation's work. Reading the code, forking it, testing it, evaluating it, or building on it in a non-production setting is unlimited and free regardless of headcount, as above.

If you're comfortably a small team doing your own work, you're inside the free zone and there's nothing to do. If you're nearing 100 people, or you want to put Rebel in front of people outside your own organisation, that's the point to [talk to us](#using-rebel-beyond-the-free-zone).

## When it becomes fully open source

Here's the part people find reassuring: **each version of Rebel turns into fully open source (the MIT licence) two years after it's released.** No asterisks, no take-backs.

It works version by version, on a rolling timer — so it's always the *older* releases that have gone fully open, while the newest one is still inside its two-year window. There's never a single day when "all of Rebel" flips; instead there's a steadily advancing line, with everything behind it already free and open. The version you're running today will be fully open-source MIT two years from the day Mindstone first released it. The promise is baked into the licence itself, not a pinky-swear we could quietly drop later.

## The parts that are already fully open

Rebel is built from several pieces, and some are open source *today* — including the part you interact with most:

| Part | What it is | Licence today |
|---|---|---|
| **The skills & help library** (`rebel-system`) | The skills, help docs, and instructions Rebel runs on — including this very page | **MIT (fully open now)** |
| **The connector catalogue** | The growing library of integrations (Slack, Google, Notion, and friends) | **Fair source (FSL)** → becomes fully open in 2030 |
| **The connector router** (`Super-MCP`) | The plumbing that lets Rebel talk to those connectors | **MIT (fully open now)** |
| **Rebel itself** (the app) | The desktop app and its local engine | **Fair source (BSL)** → each version becomes fully open 2 years after release |

The headline: the skills, help, and instructions Rebel runs on — the part that shapes how it behaves — are fully open and developed in the open. Anyone can read, fork, or contribute to the instructions powering their copy. Nothing up our sleeve.

**A note for the technically curious:** the connector catalogue uses a slightly different — and *more* permissive — fair-source licence than the app (the Functional Source License). You can use and modify the connectors commercially today; the only thing it holds back is offering them as a hosted service that directly competes with Mindstone. The whole catalogue converts to MIT on a single date in 2030, rather than version-by-version like the app.

<a id="using-rebel-beyond-the-free-zone"></a>

## Using Rebel beyond the free zone

If you're a larger organisation that wants Rebel across more than 100 people, or you want to build Rebel into something you offer to others, that's a commercial licence — and we'd genuinely like to talk. Working with us directly is also how organisations sort out the things that matter at scale — talk to us about central administration, a pre-configured rollout, and a Data Processing Agreement.

The honest version: we don't publish a commercial price list or a feature matrix here, because these arrangements are worth a conversation rather than a checkout button. Email **hello@mindstone.com** and we'll sort out what fits.

## Where to read the actual licence

The full, authoritative wording lives in the **LICENSE file** that ships with Rebel's source code. This page is the friendly summary; the licence text is what's legally binding. If you're weighing a commercial decision, read that — or just ask us.

Questions about licensing, using Rebel across a larger team, or anything commercial: **hello@mindstone.com**.

## See also

- [The open build](rebel://library/rebel-system%2Fhelp-for-humans%2Ffair-source-and-open-source-build.md) — running Rebel entirely on your own terms, with your own accounts and keys
- [How Rebel is built](rebel://library/rebel-system%2Fhelp-for-humans%2Fhow-rebel-is-built.md) — a friendly tour of the architecture
- [Teams and admin controls](rebel://library/rebel-system%2Fhelp-for-humans%2Fteams-and-admin-controls.md) — what changes when several people use Rebel together
- [Privacy mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fprivacy-mode.md) — keeping a conversation off the record
- [Secrets and passwords](rebel://library/rebel-system%2Fhelp-for-humans%2Fsecrets-and-passwords.md) — how Rebel stores your keys and sign-ins
