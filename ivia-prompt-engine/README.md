# IVIA industry-aware prompt engine

Implements diversified, industry-aware prompt selection for the Blueprint /
IVIA Lite AI-visibility audit, per `ivia-prompt-bank-by-industry.md`.

**How this gets used:** the Blueprint audit is executed manually (by
Claude, running the scan for a client who purchased the Blueprint), not by
an automated backend that calls the ChatGPT/Perplexity/Claude/Google AI
Overviews APIs. This module is the executor's tool for picking *which*
prompts to run against those engines for a given client, so the prompt set
is deliberately diversified by industry and buyer intent instead of ad hoc
or clustered around one angle. The workflow:

1. Fill in a client intake profile (see `example-profile.json`) from the
   client's Blueprint intake answers/site copy.
2. Run `node cli.js <profile.json>` to get the selected prompt set for
   their industry, plus a blank findings worksheet.
3. Manually run each prompt against ChatGPT, Perplexity, Claude, and
   Google AI Overviews, and fill in the worksheet (cited Y/N + notes) per
   engine.
4. Roll findings up by category (e.g. "cited for Direct Comparison but not
   for Diagnostic Narrative") for the audit report, not just a flat
   citation-rate number.

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

## Client intake profile fields

| Field | Source | Notes |
|---|---|---|
| `industry` | Blueprint intake | free text; matched against the 8 verticals, falls back to General/Fallback (optionally alongside an adjacent vertical) if no clean match |
| `category` | Blueprint intake | client's product/service in a buyer's own words, not their company name |
| `confirmedCompetitors` | Blueprint intake, **client-confirmed only** | never auto-filled or invented; templates needing an unconfirmed competitor slot are dropped rather than guessing |
| `buyerContext` | client's own site copy / intake answers | short, real buyer-situation description — not a generic persona |
| `businessSize`, `originCountry`, `market`, `coreProblem` | Blueprint intake | fill remaining placeholders where the vertical's templates use them |
| `sourcingEthicsRelevant` | executor judgment | only set `true` if Ethics/Sustainability (category I) is a genuine buyer concern for this client's category (e.g. specialty food, apparel) — never force it onto e.g. a B2B SaaS client just to hit a prompt count |

## Open question for you

Per the task brief: should the category-level findings (which intent
category each prompt belongs to, alongside its citation result) feed the
**client-facing report**, or stay in an **internal-only findings sheet**
for now? `cli.js`'s worksheet currently logs category next to every
result either way — that's just data capture. Where it's allowed to
surface (client deliverable vs. internal only) is your call before it
goes external.
