---
name: actions-review
description: "Go through the person's Actions with them: clear done or stale items after one approval, ask what unblocks the most, then work through drafts one at a time."
---

# Go through my Actions

Be brief and decisive. Desk Clearer advises on judgments; you run the steps. People make that advisor their own in Operators.

## 1. Load

Read `Chief-of-Staff/README.md` and `rebel-system/operators/desk-clearer/OPERATOR.md` for verdict definitions. Query active Actions with `rebel_inbox_query`: named filter or `sortBy: 'dueBy'` (most urgent). Reads cap at 500. Apply unsupported scope (tags, time lists, source, search) from Action fields: Someday is `someday: yes` plus undated Actions outside Today/This week; Today includes overdue and fresh drafts. State scope and gaps in the receipt. **Remove future-snoozed items from the batch entirely**: no numbered row, consult, verdict, count or draft. You may say an item was skipped because it's snoozed; never number or judge it.

Take at most 40 Actions. Say what you are doing: “Looking through your Actions; your summary comes in a minute or two.”

## 2. Judge once per batch

Gather evidence using [morning triage, step 4](../morning-triage/AUTOMATION.md#4-check-for-completions-bounded-targeted-searches-only), the single home of the evidence rules. Apply those definitions, including in fallback. Evidence must close the exact requested outcome.

If an Operator id ending `::desk-clearer` is in `<operators_available>`, prefer the Chief-of-Staff space's copy and consult only it, once per batch. **The batch goes in the `sourceMaterial` argument, never in `focus`** (which is truncated). Keep `focus` to the task: verdict and reason per number, up to four unblocking questions, voice note; preserve the Operator's reply format inside `perspective`. Map numbers 1..N back to Action ids locally. `sourceMaterial` contains only whole rows like `1 | Review proposal | Acme Corp | 2026-11-16 | automation | Approved; review recorded`. No header, database ids or evidence-file paths, including for excluded items. Measure UTF-8 bytes: at most 7.5 KiB and 40 rows, title about 60 characters; never cut a row. Actions that do not fit wait for the next batch. Keep `callerContext` under 1 KiB and name the filter.

Any missing, duplicated or unrecognised number stays unchanged; never infer its verdict. **If no advertised id ends `::desk-clearer`, do not call any Operator or invent an id**: use morning triage step 4 yourself and include exactly “Sorted with Rebel's standard rules.” in the receipt. Do the same if the consult fails. Honour any consult degradation warning.

## 3. One receipt, then approval

**Fallback receipt first line:** start the approval card's `context` with “Sorted with Rebel's standard rules. Press the button on desktop to add Desk Clearer and teach it your own rules.” when Desk Clearer was absent or failed. Saying it only in the closing reply is too late.

Put the receipt in the approval question's `context`: coverage (“40 of your 300 Actions, most urgent first”), judged count, `Done: N; Stale: N; Needs you: N; Left as is: N` (including zeros), then **every full Action title in the batch**, verdict and reason, even for unchanged items. Copy the consult's verdicts without relabelling or merging titles; count rows, not questions. Missing verdicts are `leave`. Include connector work and unavailable evidence, “Ask me to put any back” and where restored items live.

Use one `AskUserQuestion` with **only the receipt decision**: **Apply all / Let me choose / Not now**. Keep step 4's questions for a separate card after this answer. Archive nothing before the answer. “Apply all” approves only the receipt's done/stale set. “Let me choose” needs their specific selection before changing anything, then continue to step 4; “Not now” applies nothing and stops the review. Archive exactly the approved set with `rebel_inbox_update`: `archived: true`, `resolution: 'completed'` for done or `'stale'`, exact `expectedTitle`, `evidenceNote`, and `expectedThreadId` when referenced. On an identity conflict, re-read and show the change rather than applying old approval. If a snoozed item returns 409, leave it alone and say “Archive it yourself or unsnooze first.”

## 4. Up to four questions

After receipt approval (including a subset), continue now: ask the questions that unblock the most remaining Actions in one `AskUserQuestion` card, at most four questions, two to four options each. Use Desk Clearer's choices, or pick them yourself in fallback. Keep draft review for step 5; don't ask whether to show a draft. In **each question's `context`**, list every full title it helps decide, or say how many Actions it helps decide and name an unambiguous group. Skip this card only if there is nothing useful to ask.

An answer approves completion of **exactly those named Actions** only when the answer is itself what the Action asked for (choose, decide, pick). When the decision still has to be carried out (approve or pay in a system, book, reply, send), keep the Action open: carry out the decision in step 5 with normal approvals where tools can, or hand it back with the decision and missing next step. Archive those completions with `resolution: 'completed'`, exact `expectedTitle`, and **quote their entire answer verbatim** in `evidenceNote`: `You answered: "<their exact answer>"`. An unanswered/deferred choice approves nothing. Other Actions still need the receipt; an answer never authorises sending a message.

After the updates, reply with **one bullet per cleared Action, using its full, unchanged title**. Do not compress their titles into a group. Then go straight to step 5 and show the next pending draft, without another invitation.

## 5. Work through the rest

On each new turn, re-read the affected Actions. Use the visible receipt for earlier judgments rather than consulting again; if an Action changed, re-check it before acting.

For a reply or message, write in the person's voice using the consult's voice note. Show **one draft per turn** with `rebel_canvas_view` as a `draft` section with recipient and fields, even when an address is unknown: leave that field empty for the person to fill. Never write draft text in your reply; **end the turn** after the card. Follow the draft-card rule in `rebel-system/AGENTS.md`. Never call a send tool before the card's **Send**. Feedback means revise and show the card again. After Send, use the connected tool with the **edited card content**, including its recipients and subject, then mark the Action completed only after confirmed success. Receipt approval is not draft-send approval.

Do other Actions with normal approvals, snooze with `snoozedUntil` when asked, or hand them back with the missing next step. Do not work on snoozed Actions.

## 6. Close

Say what was cleared, what remains and why. Offer the next batch by querying again; never skip by position, since archives shrink the list.
