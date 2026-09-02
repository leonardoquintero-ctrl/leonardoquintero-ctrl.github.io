# IVIA industry-aware prompt engine

Implements diversified, industry-aware prompt selection for the Blueprint /
IVIA Lite AI-visibility scan, per `ivia-prompt-bank-by-industry.md`.

## Why this exists / what it fixes

Prior prompt generation clustered around a single intent angle (e.g. three
phrasings of "sustainable coffee" counted as three data points when they're
one angle) and didn't vary by client industry. This module replaces that
with category-tagged, vertical-specific templates and explicit
diversification rules, so a scan's prompt set spans real buyer-intent
variety instead of one narrow angle.

## Files

- `prompt-bank.js` — the 9 buyer-intent categories (A–I), the 8 named
  vertical template sets, and the general fallback set, transcribed from
  the reference file. No citation-count/frequency statistics from the
  source research doc are reproduced anywhere in this code.
- `vertical-lookup.js` — maps a client's free-text industry to one of the 8
  verticals, or falls through to the general fallback set (optionally
  alongside an adjacent vertical's categories, per the reference file's
  fallback note).
- `select-prompts.js` — fills placeholders from client intake data and
  applies the selection/diversification rules (max 2 prompts/category, A+B
  capped at 3 combined, at least 1 Diagnostic Narrative (G) prompt when the
  vertical defines one, competitor placeholders filled only from
  client-confirmed names, category exclusion when genuinely inapplicable).
- `acceptance-test.js` — runs the module against two illustrative client
  profiles (Clearpath Coffee, Dapta) and checks the acceptance criteria
  from the task: ≥4 distinct categories, no category appears more than
  twice, a Diagnostic Narrative prompt when the vertical defines one, and
  no invented competitor names.

Run the acceptance check:

```
node acceptance-test.js
```

## Important — unresolved integration questions

This repository holds only the static Quint·IA Vantage marketing site
(landing pages, pricing, the Blueprint sales page). **It does not contain
the actual Blueprint/IVIA Lite scan engine** — there is no existing code
here that builds prompts, calls ChatGPT/Perplexity/Claude/Google AI
Overviews, scores citations, or captures client intake/competitors. So the
four pre-implementation questions from the task brief could not be
verified against real code and are assumed rather than confirmed:

1. **Prompt-generation file(s)** — none exist in this repo. This module is
   new and self-contained; it isn't wired into anything yet because
   there's nothing to wire it into here.
2. **Industry capture at intake** — assumed to be a free-text field (see
   `vertical-lookup.js`'s tolerant keyword matching). If the real intake
   system uses a fixed dropdown/enum, `lookupVertical` should be replaced
   with a direct enum → vertical-key mapping instead of keyword matching.
3. **Competitor capture** — assumed to be a list of client-confirmed
   strings (`confirmedCompetitors` on the client profile). The module
   never invents a competitor name: any template needing `[COMPETITOR_1]`
   or `[COMPETITOR_2]` is dropped from the candidate pool if that slot
   isn't confirmed.
4. **Prompt/engine budget cap** — assumed to be 10 total, per the task
   description (`DEFAULT_PROMPT_BUDGET` in `select-prompts.js`,
   overridable via `selectPrompts(profile, { promptBudget })`). Not
   confirmed against a real scan-config constant.

Also unresolved, per the task brief itself: **whether category-level
logging (item 4 in the task) should feed the client-facing report or stay
internal-only.** `select-prompts.js` currently returns each selected
prompt's category alongside its template/text (the data a caller would log
next to a citation result), but nothing here decides where that surfaces —
that's a product decision for whoever owns the real scan engine and
report templates, not something this module should default silently.

Before this is genuinely "done," it needs to be pointed at (or moved into)
the actual scanner codebase, and the four items above need real answers
instead of assumptions.
