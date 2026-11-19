---
name: meeting-check
description: "Each morning, look back at yesterday's saved meetings (and any unchecked one from the past week) and add a private How it went note to each meeting file: seven checks, each met, needs attention, unknown or doesn't apply, and one thing for next time."
last_updated: 2026-11-19
agent_type: main_agent
---

# Daily meeting check

Look back at **yesterday's** meetings, in the person's own time zone, plus any meeting that started on one of the 7 calendar days before today, has ended and hasn't been checked yet (a missed day, such as the computer being off), and save one private check into each meeting's own file with `rebel_meetings_save_meeting_check`. Rebel writes the section's wording; you supply the judgement.

This is a heuristic about the **meeting**, never a score of a person. It is private to the person: nothing is sent, shared or added to an agenda. Never send messages, never change any other section of the file, and never write anywhere else.

## Steps

1. Work out the 7 dates before today in the person's time zone (`timeZone`, an IANA name such as `Europe/London`), yesterday first.
2. Find the meeting files that started on each date with `rebel_meetings_find_prep` (`meetingDate` = that date, `timeZone` = the person's zone), all 7 calls at once. Check every file found that has no `meetingCheckedAt`; skip one that has it, as it is already checked. You only check meetings that have a file.
3. For each meeting file, read it, and read only what it links to: its transcript, decisions and actions. Optionally use `rebel_meetings_history` for transcript status.
4. Judge the seven checks below. Use only evidence you found. When the evidence is missing or unreliable, the status is `unknown`; never guess and never mark a check `needs_attention` for lack of evidence.
5. Save it with `rebel_meetings_save_meeting_check`: the file's `recordPath`, all seven checks, a short `headline`, one `suggestion`, `nextAgendaText` when the suggestion fits on an agenda, and `timeZone`.
6. Finish with a one-line summary per meeting checked (title and score, or "Not enough data"). Nothing else.

## The seven checks

Each check is `met`, `needs_attention`, `unknown` or `not_applicable`, with a short `evidence` sentence (what you saw, or why it is unknown) and a short `source` (where, e.g. `Transcript · 02:10, 08:40` or `Decisions · This meeting file`).

| Key | Met when | Unknown when |
|---|---|---|
| `agendaBeforehand` | The file records the agenda as sent (`agendaSentAt`) before the meeting's start, or other evidence shows it was shared beforehand. A drafted agenda alone is not enough. | No send receipt and no other evidence. |
| `agendaCovered` | The transcript shows the agenda's topics were discussed. Cite the times. This is your reading of the discussion. | No agenda, or no usable transcript. |
| `clearDecisions` | A decision is recorded, or the meeting's informational purpose was met. Use `not_applicable` for a purely informational meeting with nothing to decide. | No notes, decisions or transcript. |
| `ownedNextSteps` | Every next step has a named owner. `needs_attention` when a next step has none. Never invent an owner from the invite list. No next steps can be fine (`not_applicable`). | No notes, actions or transcript. |
| `everyoneGotASay` | Only when speaker labels are reliable **and** mapped to the attendees. | Almost always: speaker labels are unverified, missing or unmapped. Speaking time doesn't show whether people felt heard. |
| `onTime` | Only when a complete recording establishes when the meeting actually started and ended. | Scheduled times or a partial recording. |
| `rightPeople` | Only with clear evidence the meeting's purpose needed exactly those people. | Usually: an attendee count doesn't show who needed to be there. |

Rules that never bend:

- **No numbers about people.** Never report talk time, word counts, interruptions or any statistic per person, never name who spoke least or most, and never compare or rank colleagues.
- Unknown and doesn't-apply checks are left out of the score; never pad the score with them.
- Quote evidence briefly. Keep each evidence line under 300 characters and each source under 120.

## The suggestion

One practical thing for next time, about the meeting, aimed at a check that needs attention (or, when every judged check is met, the most useful habit to keep). One or two sentences; a little of Rebel's dry wit is welcome. If nothing could be judged, suggest the simplest way to leave evidence next time, e.g. "Write down the decision and who will take the next step. A two-line recap is plenty."

`nextAgendaText` is the suggestion as one agenda line, e.g. "Leave 2 minutes to confirm an owner for each next step." Leave it out when it doesn't fit an agenda.

`headline` is a few words on the meeting overall, e.g. "A useful meeting. One loose end." Leave it out when nothing could be judged.

## If saving is refused

The tool refuses a file that isn't a meeting file, a meeting from today or later, and any unknown check or status. Fix a wrong check or status and try once more; otherwise skip that meeting and say so in the summary.
