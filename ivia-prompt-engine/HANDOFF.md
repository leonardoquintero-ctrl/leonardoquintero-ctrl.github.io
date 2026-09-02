# Handoff: IVIA industry-aware prompt engine

## What was asked

Fix prompt-generation for the Blueprint / IVIA Lite AI-visibility audit,
which was clustering around single intent angles (e.g. three phrasings of
"sustainable coffee" counted as three data points when they're one angle)
instead of varying systematically by client industry.

## Where this actually got built (and why that's wrong)

Everything below lives in **`leonardoquintero-ctrl/leonardoquintero-ctrl.github.io`**,
branch `claude/ivia-industry-prompt-selection-af3kyb`, folder `ivia-prompt-engine/`.

That repo is confirmed (per its own `QUINTIA-HANDOFF.md`) to be a **static
GitHub Pages marketing site only** — plain HTML files, no backend, no
database, no build step. It is almost certainly **not** where the real
Blueprint app lives. During this session we found a second, more likely
candidate — **`leonardoquintero-ctrl/quint-ia-blueprint-funnel`** (private,
pushed 2026-08-31) — which was never opened or inspected. If that repo is
the real Vercel/Turso-backed Blueprint app, this work needs to be
re-examined against its actual intake schema, competitor fields, and
scan-execution logic, and probably moved/ported there rather than left in
the marketing-site repo.

**Do not treat this as integrated into any live app or purchase flow.** It
isn't. Nothing here is wired into a website, form, or database.

## What was actually built

A standalone Node module + CLI, runnable manually from a terminal, meant
to be used by whoever (human or Claude) executes a purchased Blueprint
audit — picking which prompts to run against ChatGPT/Perplexity/Claude/
Google AI Overviews for a given client, instead of ad hoc or clustered
prompts.

Files in `ivia-prompt-engine/`:

- `ivia-prompt-bank-by-industry.md` — the source reference file (9
  buyer-intent categories A–I, 8 named verticals + general fallback,
  selection/diversification rules), copied in verbatim except that no
  citation-count/frequency statistics from the original research doc are
  reproduced anywhere.
- `prompt-bank.js` — that data as a JS module (categories, per-vertical
  templates tagged by category, fallback templates).
- `vertical-lookup.js` — maps a free-text `industry` string to one of the
  8 verticals via keyword matching, or falls back to the general set
  (optionally alongside an adjacent vertical's templates, per the
  reference file's fallback note). **Assumption, unconfirmed:** intake
  captures industry as free text. If the real system uses a fixed
  dropdown/enum, replace the keyword matching with a direct mapping.
- `select-prompts.js` — fills `[CATEGORY]`, `[COMPETITOR_1/2]`,
  `[BUYER_CONTEXT]`, `[BUSINESS_SIZE]`, `[ORIGIN_COUNTRY]`, `[MARKET]`,
  `[CORE_PROBLEM]` from a client profile object, then selects the final
  prompt set enforcing: max 2 prompts/category, Category Discovery (A) +
  Direct Comparison (B) capped at 3 combined, at least 1 Diagnostic
  Narrative (G) prompt when the vertical defines one, and drops any
  template needing an unconfirmed competitor slot rather than inventing a
  name. Budget defaults to 10 total prompts (`DEFAULT_PROMPT_BUDGET`) —
  **assumption, unconfirmed** against any real scan-config constant, since
  none was found.
- `cli.js` + `example-profile.json` — `node cli.js <profile.json>` prints
  the selected prompt set and a blank per-engine findings worksheet
  (prompt × category × engine × cited Y/N × notes) for manual use while
  checking each AI engine.
- `acceptance-test.js` — validates two illustrative client profiles
  (Clearpath Coffee → Specialty Food & Agribusiness vertical, Dapta →
  Professional Services & Nearshore Tech vertical) against the task's
  acceptance criteria: ≥4 distinct categories, no category >2, a
  Diagnostic Narrative prompt present when the vertical defines one, no
  invented competitor names. Both pass (`node acceptance-test.js`).
- `README.md` — usage workflow, intake-field mapping, and the open
  question below.

## Open questions — need real answers, not assumptions

These were never confirmed against real code/systems because no scanner
backend was found in the repo this was built in:

1. Does intake capture industry as free text, a dropdown, or something
   else? (`vertical-lookup.js` assumes free text.)
2. How are client-confirmed competitors actually captured/stored?
   (`select-prompts.js` assumes a plain array of confirmed name strings.)
3. Is 10 really the current hard cap on prompt/engine checks per scan, and
   where is that defined in the real system?
4. Should category-level findings (which intent category each prompt
   belongs to, next to its citation result) go into the **client-facing
   report**, or stay in an **internal-only findings sheet**? Not decided.

## Recommended next step

1. Attach `leonardoquintero-ctrl/quint-ia-blueprint-funnel` (or whichever
   repo is confirmed as the real Blueprint app) to the session.
2. Re-run the same discovery steps against it: find the real
   prompt-generation code, intake schema, competitor-capture mechanism,
   and prompt-budget constant.
3. Port/adapt `prompt-bank.js`, `vertical-lookup.js`, and
   `select-prompts.js` into that codebase's actual data shapes (they're
   plain CommonJS with no external dependencies, so porting is mostly
   copy + adjust the profile-field mapping), rather than leaving this as
   a disconnected module in the marketing-site repo.
4. Get the item-4 answer (client-facing vs. internal-only) before any
   category-level output ships externally.

## Current git state

- Repo: `leonardoquintero-ctrl/leonardoquintero-ctrl.github.io`
- Branch: `claude/ivia-industry-prompt-selection-af3kyb` (pushed, no PR
  opened — none was requested)
- Commits: prompt-bank + selection engine, then the CLI + worksheet +
  README follow-up.
