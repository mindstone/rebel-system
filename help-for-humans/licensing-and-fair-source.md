---
description: "Is Rebel open source? What licence it uses (fair source / Business Source License), what you're allowed to do with it, when each version becomes fully open, and the licences of the open components Rebel is built from."
---

# Is Rebel Open Source? Licensing, Explained

**Short answer:** Rebel is **fair source** — its source code is published openly for anyone to read, learn from, and modify, and most people can use it freely. It isn't *quite* open source yet, but every version becomes fully open source on a fixed timer. The bundled library Rebel runs on is already fully open today.

If that's all you needed, you can stop here. The rest is detail for the curious.

## Fair source, in plain terms

"Open source" has a precise meaning: anyone may use, modify, and redistribute the code — including commercially — under the licence's conditions. That's wonderful for the world and tricky for a small company trying to keep the lights on — a better-funded competitor could simply take the lot and undercut you.

**Fair source** is the middle path. The source is published openly — and you're free to read it, change it, and run it yourself. The catch is a light commercial guardrail: running Rebel in production is free for your organisation's own internal use **up to 100 people**, and beyond that — or if you wanted to offer Rebel to others as a paid service — you'd need a commercial licence from Mindstone. And the guardrail isn't permanent: after a set period, each version sheds it and becomes plain open source.

Rebel uses the best-known fair-source licence, the **Business Source License (BSL)** — the same one MariaDB and others use.

## What you're allowed to do

- **Read the published source.** Learn from it, audit it, satisfy yourself about what it does.
- **Modify it and build on it.** Tinker, extend, fix, fork.
- **Run it yourself.** Self-host the open build on your own machines and accounts — see [The open build](rebel://library/rebel-system%2Fhelp-for-humans%2Ffair-source-and-open-source-build.md).
- **Use it at work.** Your organisation may run Rebel for its own internal business, free of charge, **up to 100 people** — counted as everyone authorised to use it (including contractors), not the number of devices. Past 100, you'd need a commercial licence from Mindstone — which, if you're a company that size, is rather the point.

The lines you can't cross without a commercial licence: running Rebel in production beyond 100 people, or offering it to others as a paid service. Inside those lines, it's yours to use.

## When it becomes fully open source

Here's the part people find reassuring: **each version of Rebel turns into fully open source (the MIT licence) two years after it's released.** No asterisks, no take-backs.

It works version by version, on a rolling timer — so it's always the *older* releases that have gone fully open, while the newest one is still inside its two-year window. There's never a single day when "all of Rebel" flips; instead there's a steadily advancing line, with everything behind it already free and open. The promise is baked into the licence itself, not a pinky-swear we could quietly drop later.

## The parts that are already fully open

Rebel is built from several pieces, and some are open source *today* — including the part you interact with most:

| Part | What it is | Licence today |
|---|---|---|
| **The skills & help library** (`rebel-system`) | The skills, help docs, and instructions Rebel runs on — including this very page | **MIT (fully open now)** |
| **The connector catalogue** | The growing library of integrations (Slack, Google, Notion, and friends) | **Fair source** → becomes fully open in 2030 |
| **The connector router** (`Super-MCP`) | The plumbing that lets Rebel talk to those connectors | **MIT (fully open now)** |
| **Rebel itself** (the app) | The desktop app and its local engine | **Fair source** → each version becomes fully open 2 years after release |

The headline: the skills, help, and instructions Rebel runs on — the part that shapes how it behaves — are fully open and developed in the open. Anyone can read, fork, or contribute to the instructions powering their copy. Nothing up our sleeve.

## Where to read the actual licence

The full, authoritative wording lives in the **LICENSE file** that ships with Rebel's source code. This page is the friendly summary; the licence text is what's legally binding. If you're weighing a commercial decision, read that — or just ask us.

Questions about licensing, using Rebel across a larger team, or anything commercial: **hello@mindstone.com**.

## See also

- [The open build](rebel://library/rebel-system%2Fhelp-for-humans%2Ffair-source-and-open-source-build.md) — running Rebel entirely on your own terms, with your own accounts and keys
- [How Rebel is built](rebel://library/rebel-system%2Fhelp-for-humans%2Fhow-rebel-is-built.md) — a friendly tour of the architecture
- [Privacy mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fprivacy-mode.md) — keeping a conversation off the record
- [Secrets and passwords](rebel://library/rebel-system%2Fhelp-for-humans%2Fsecrets-and-passwords.md) — how Rebel stores your keys and sign-ins
