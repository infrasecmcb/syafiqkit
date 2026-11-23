---
name: schedule-checks
description: Run a check on a repeating schedule (watch a page, a build, a folder, a sheet) and be told only when something needs you, using Harness's built-in scheduled tasks.
---

# Schedule a repeating check

Harness has scheduled tasks built in (`schedule_create`, `schedule_list`, `schedule_view`, `schedule_edit`). A scheduled task delivers a prompt to a session at each occurrence, so a "watcher" is a prompt that says what to check and when to speak up. No extra software is needed. Use it for things like "check the CI status every 15 minutes", "see whether the report file has changed", "look at the tracker sheet each morning".

Create or change a schedule **only when the user asks for one**. Never schedule on your own initiative.

## 1. Pin down the check

Ask for anything missing, one question at a time:

- **What to look at** (a URL, a command, a file, a sheet) and **how to read it** (the exact command or page).
- **What counts as "needs you"** (a status turns red, a file changed, a new row addressed to them). Everything else stays silent.
- **How often**, and the days and hours it should run. Ask for the time zone if it is not obvious.
- **When to stop** (a date, or "when it passes").

## 2. Write a prompt that can run alone

The scheduled session has no memory of this conversation. The prompt must carry everything:

- the exact command or steps to check, and the paths involved;
- the rule for "needs attention", written as a test the agent can apply;
- what to report: if nothing needs attention, say exactly one line ("Checked 14:00: nothing new."); if it does, give the finding, the evidence and the one next action;
- where to keep state between runs (a small file such as `.watch/<name>.json` holding the last value seen), so each run reports only what is new;
- what it must never do: change anything, send messages, or fix problems unless the user told it to.

## 3. Create it

Use `schedule_create` with a clear title (action plus object). Pick the target:

- `this_session`: the user wants updates in this conversation.
- `new_once`: one dedicated session reused for every run (good for a watcher).
- `new`: a fresh session each time (good for independent reports).

Give the recurrence as `DTSTART` with the user's time zone, plus the `RRULE`. Examples:

- every 15 minutes: `FREQ=MINUTELY;INTERVAL=15`
- weekdays at 09:00: `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=9;BYMINUTE=0` (minute and hour rules need DAILY or WEEKLY)
- once: `FREQ=DAILY;COUNT=1`

## 4. Confirm and show how to stop it

After creating, call `schedule_view` and tell the user: the title, the next run time in their time zone, and how to pause or delete it (ask you, or use the Schedule page). Run the check once yourself first if it is cheap, so the first scheduled run is not the first test.

## Limits to tell the user

- A missed run is delivered once, late, after downtime; a crash can deliver a run twice. The prompt should tolerate both.
- The check runs only while Harness is running.
- A scheduled task cannot answer questions mid-run; design the prompt so it never needs to.
