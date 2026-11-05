# Handoff: AEO For LatAm (state as of 2026-11-05)

Updated at the end of the 2026-11-03 → 11-05 session; the first version was written 2026-11-03.
Treat everything under "Unverified" as unknown, not fact. Trust the code and Vercel over this file where they differ.

## Verified 2026-11-05 (read-only Vercel checks)

- **Funnel production is on `bc95eac`** (PR #16, retainer re-scans), deployment `dpl_HW8s5Nr8BuGK6p1ppVVFDPTR5sBA`, state **READY**. The two deploys before it, `7c9dab8` (#15) and `8d294af` (#14), are also READY.
- **No runtime errors since the fixes.** All 19 error groups in the last 48 hours are from 2026-11-04 before 04:40 UTC, on older deploys:
  - **Anthropic** `400 … key is not scoped to a workspace` on `/api/scan/start`. Fixed: the owner created a workspace-scoped key.
  - **OpenAI** `429 credit_balance_exhausted` on every ChatGPT call. Fixed: the owner added credits.
  - **Perplexity Sonar** `429 rate limit`, logged as `[perplexity] mechanism=search-fallback`. So Sonar is live and the fallback works. A retry was added in #11.
  - One Gemini 30s timeout.
  - One HubSpot `Update contact failed (404)` on an admin test lead.
- **Real scans have run.** The owner ran test scans on 2026-11-04, including one for AEO For LatAm itself, and got reports. The owner later confirmed "the page is working fine".
- Not checked this session: Cold Reach and mini-checkers deploys, the Stripe dashboard, Resend.

## Business facts

- Brand: **AEO For LatAm** (DBA only). The legal entity **Adeian Digital LLC** is unchanged and must not appear in the app.
- Public domain: `aeolatam.com`. Blueprint app: `blueprint.aeolatam.com`.
  - **DNS is on Cloudflare now** (moved from GoDaddy). The `blueprint` CNAME to Vercel was missing after the move and was re-added on 2026-11-04.
  - The old `blueprint.quintiavantage.com` is still attached on purpose so old emailed report links keep working. **Do NOT redirect it until the Stripe webhook and QStash are confirmed on the new domain.**
- Marketing site: Framer project "AEO For LaTam" (id `ZQzjTw4DwzASA20kHAsl`; "LaTam" is a typo in the project name).
- **Blueprint ($500, one-time):** a scan is 10 prompts × 4 engines (Claude, ChatGPT, Perplexity, Gemini) = 40 live calls. Only ChatGPT and Perplexity count toward the score; Claude and Gemini are shown but not scored. No re-scans.
- **Retainers:**

  | Tier | Price | Minimum | Re-scan cadence |
  |---|---|---|---|
  | Foundation | $950/mo | 3 months | every 30 days |
  | Momentum | $1,750/mo | 6 months | every 14 days |
  | Citation Engine | $2,750/mo | 6 months | every 14 days |

  The owner confirmed the cadence on 2026-11-05. The website does not state it yet.

## Repos and deployments

| Repo | Vercel project id | Notes |
|---|---|---|
| quint-ia-blueprint-funnel | `prj_cfveeMeesIOQjLn7mVOqb3KHZJlh` | Next.js 15, Drizzle + Turso. Auto-deploys on push to `main`. `scripts/ensure-schema.mjs` adds new DB columns at build. |
| cold-reach-tool | `prj_3wCXNHcwNOMa7enGYhpOJzFjnHwx` | Standalone sales-rep tool with its own DB. |
| quint-ia-mini-checkers | `prj_Xhw1c1iF6T9Qe4QMtWI0nmVqi9fi` | Text rebrand only; no domain refs. |
| leonardoquintero-ctrl.github.io | n/a | Docs and design sandbox. Holds this file and `IVIA-PILLARS-SPEC.md`. |

Vercel team: slug `aeoforlatam`, id `team_oTo6NhFMjSVfwsEKpozlnfD3`.

## What was done 2026-11-03 → 11-05 (funnel, all squash-merged to `main`)

| PR | Commit | What |
|---|---|---|
| #11 | `dcc1ef9` | **Scores no longer lie when an engine fails.** Errored calls are left out of the visibility score, share of voice and "named you in X of Y". Perplexity 429 retry. The admin test page shows real errors. |
| #13 | `a9e4df1` | **IVIA v2: 7-pillar score** (`src/lib/synthesis/ivia.ts`).<br>• Weights: Citations 25; Trust & Presence, Message & Language and Search Foundations 15 each; AI Bridge, FAQ and Comparison 10 each.<br>• Unmeasured checks are left out, never zeroed, and the score is marked partial.<br>• G2/Capterra count only for software companies.<br>• A blocked crawl is measured and explained (Cloudflare, JS-only, unreachable…).<br>• Google + Bing brand search via DataForSEO.<br>• Old reports still render the old 4-pillar view. |
| #14 | `8d294af` | **New checks:**<br>• domain legitimacy: HTTPS/HSTS, SPF/DMARC, domain age via RDAP;<br>• legal page links;<br>• Clutch for service firms;<br>• Claude reads the homepage + About against a fixed checklist (clarity ×5, native English, US-ready), quoting the evidence.<br>The internal report gains diagnostics and **Measurement & Martech readiness** (GA4, GTM, GSC/Bing verification, consent banner, HubSpot, Meta Pixel, LinkedIn Insight; not scored). |
| #15 | `7c9dab8` | **Fix kit** (internal report): one task per lost check, with steps, owner, effort and the index points at stake, ordered by points per effort. Ready-to-paste drafts: Organization JSON-LD, llms.txt, robots.txt rules, FAQ + FAQPage JSON-LD, comparison outline. The drafts use only the site's own text; missing facts are marked `[CONFIRM: …]`. |
| #16 | `bc95eac` | **Retainer re-scans** (details in the section below). |

Each full scan now makes 2 extra Claude calls: the message evaluation (#14) and the fix-kit drafts (#15).

**Retainer re-scans (#16) in detail:**
- **Setup:** in `/admin`, after "Retainer signed", pick the tier; the cadence comes from the tier.
- **Daily cron** `/api/cron/rescans` (13:17 UTC, same `CRON_SECRET` check as follow-ups). It re-runs the last finished scan's inputs and links them via `rescan_of`.
- **Volume:** up to 10 re-scans per day, because QStash is configured in production (owner confirmed 2026-11-05). Without QStash the cap would be 1.
- **Controls:** Pause/Resume and "Re-scan now" buttons in `/admin`.
- **Re-scans never email the client.** The owner gets a `[Re-scan]` alert with the IVIA change.
- **Progress section** on the internal report: IVIA and per-pillar before/after, checks improved or worse (only those measured in both scans), and named-or-cited share before/after.
- **New columns:** `leads.retainer_tier`, `leads.rescans_paused_at`, `visibility_reports.rescan_of` (migration `0018`; `0017` is reserved for #12).

**Fixed with the owner (outside the code):**
- the Anthropic key, now workspace-scoped;
- OpenAI credits;
- the `blueprint` CNAME on Cloudflare;
- admin access: the owner signs in to `/admin` again.

**Website spec:** `IVIA-PILLARS-SPEC.md` (this repo) is the content spec for rewriting the IVIA pages on aeolatam.com. The live pages still describe the old 5-pillar model, and the Message & Language and Search Foundations pages don't exist yet. The spec includes checks and points, copy, EN/ES FAQs and Framer instructions. The owner's CLI will implement it on a Framer branch.

## Open items (need the owner or still undecided)

- **PR #12** (`claude/funnel-review-fixes`), open and not merged:
  - holds degraded reports for review (migration `0017`, `client_held_reason`);
  - homepage offer and FAQ rewrite;
  - optional buyer questions;
  - the competitor URL becomes required;
  - a non-existent-domain check.

  It touches client delivery, so it needs the owner's explicit yes. Merging it after #16 will need the `ensure-schema` steps kept in order (0017 then 0018); no conflict is expected beyond that.
- **IVIA website pages:** implement `IVIA-PILLARS-SPEC.md`. Also add the re-scan cadence to the Framer pricing tier cards so the site, the terms and the system match. Not done; waiting for the owner.
- **Sending re-scan progress to the client** isn't built. The team reviews it and sends the update by hand. A "Send to client" button is the next step.
- **Not counted until configured:**
  - Page speed needs `PAGESPEED_API_KEY`.
  - YouTube needs `YOUTUBE_API_KEY` (not confirmed whether it's set).
  - These checks show "not checked in this scan". Adding the keys makes them count.
- **First live run of #14–#16 not yet observed:** legitimacy (DNS/RDAP), the message evaluation, the fix-kit drafts, the re-scan cron and the admin retainer buttons have only been tested on fixtures. Run one admin test scan and one "Re-scan now", then read the internal report.
- **Resend:** verify `aeolatam.com` in Resend (DNS is on **Cloudflare** now), add DMARC at `_dmarc`, create `team@` and `blueprint@aeolatam.com`, send a real test, then remove the `quintiavantage.com` sender fallback in `src/lib/email/provider.ts`.
- **Stripe webhook URL:** the owner must change it to `https://blueprint.aeolatam.com/api/webhooks/stripe`.
- **Spanish legal links:** the funnel's Spanish footer links to `aeolatam.com/es/privacy` and `/es/terms`. Nobody has checked whether they open; Framer shows no `/es/` pages.
- **Perplexity:** Sonar is live but hits rate limits under a 40-call scan. Watch for `mechanism=search-fallback` in the logs. If it shows up often, ask Perplexity for a higher limit.
- **Vercel hygiene** (the agent's tools cannot do these): delete the unused `MOZ_API_KEY` (prod + preview); re-save `GEMINI_API_KEY` as Sensitive.
- **`cold_reach_lookups` table/schema** in the funnel is left over from the retired copy. Removing it from `schema.ts` would make `drizzle-kit push` offer to drop a table that holds production data. Needs an owner decision; do not remove it casually.
- Minor:
  - `/es` renders `<html lang="en">` (the root layout owns it).
  - A `cold-reach.aeolatam.com` hostname is optional.
  - `design-reference/` (about 800 KB of old mockups) is unused; deleting it is the owner's call.

## Unverified / may be wrong

- Perplexity pricing ($5 per 1,000 requests, $1 per million tokens) comes from secondary sources; docs.perplexity.ai was unreachable from the sandbox.
- The sandbox can't reach `aeolatam.com`, DataForSEO, RDAP or public DNS, so the new checks were only tested on fixtures.
- Not checked: HubSpot sequences/templates, Stripe settings, already-sent emails.

## Working rules

- Pushing to `main` auto-deploys production. Fast-forward only; never force-push without explicit approval. After each push, check the Vercel deployment and `get_runtime_errors`.
- Shallow clones break merge-base checks: run `git fetch origin main --depth=50` before rebasing. A fresh shallow clone may also need `git config --add remote.origin.fetch "+refs/heads/<branch>:refs/remotes/origin/<branch>"` to track a branch.
- New DB columns: add them to `src/db/schema.ts`, a `drizzle/00NN_*.sql` file **and** `scripts/ensure-schema.mjs` (additive, check-then-apply). Never drop or rename.
- Don't run Prettier over whole files; the repo isn't formatted with it, and it rewrites hundreds of lines.
- Never decrypt or print Vercel env values. Sensitive values read back empty.
- The sandbox blocks many hosts (api.dataforseo.com, docs.perplexity.ai, aeolatam.com, etc.). Report the block; do not try to get around it.
- `curl` to localhost needs `--noproxy '*'` in this sandbox.
- Every commit needs the session's `Co-Authored-By` and `Claude-Session` trailers.
- Do not merge or deploy changes to payment, auth or client-delivery behavior without the owner's explicit yes.
- Runtime log queries over multi-day windows time out. Scope them to a `deploymentId`, or use `group_by`.
