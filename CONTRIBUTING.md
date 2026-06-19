# Contributing to Rebel System

Thanks for your interest in contributing. `rebel-system` is the public,
MIT-licensed library of skills, prompts, templates, and help docs that the
Rebel app works from. It is published in the open and bundled to everyone who
runs Rebel — **treat all of it as public.**

> **`AGENTS.md` / `CLAUDE.md` are not contributor guidance.** They are the
> runtime product system prompt loaded into the Rebel app, not development or
> process notes — anything added there is injected into every user's agent.
> Contributor rules live in this file.

## No secrets, no credentials, no internal data

This is a hard rule. **Do not include in any contribution:**

- API keys, OAuth client secrets, tokens, passwords, or other credentials —
  yours, ours, or anyone else's. Rebel injects credentials at runtime from
  user-provided configuration; secrets do not belong in source.
- Internal endpoint URLs, hostnames, ticket references, account identifiers, or
  other infrastructure details.
- Personal data of users, customers, or employees — including email addresses,
  names, conversation excerpts, log fragments, or screenshots containing
  identifying information.
- Real company names in examples, fixtures, prompts, or test data. Illustrative
  content must use fictional placeholders (e.g. `Acme Corp`, `TechCorp`,
  `jane@example.com`) — never a real customer, design-partner, or prospect
  name. Known names are checked before each release, but that only catches
  names already known — so don't introduce new ones.
- Material covered by a non-disclosure agreement with any third party.

If you accidentally include any of the above, let us know immediately at
**hello@mindstone.com** (subject line prefixed `[SECURITY]`) so we can rotate
credentials and rewrite history if needed. We treat accidental inclusion as a
security incident, not a discipline issue.
