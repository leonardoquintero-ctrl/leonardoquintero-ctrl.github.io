# Handoff: AEO For LatAm (state as of 2026-11-03)

Written at the end of a very long session, then re-checked against Vercel on 2026-11-03 (see **Verified 2026-11-03** below).
Treat everything under "Unverified" as unknown, not fact. Trust the code and Vercel over this file where they differ.

## Verified 2026-11-03 (read-only Vercel checks)

- **Funnel production is on `55ee64f`** ("Redeploy to pick up the rotated CRON_SECRET"), deployment `dpl_9xwUKfdvbPYz9uqpcUWVbfKjFAcX`, state **READY**. The prior production deploy (`0ad7543`, `dpl_6xvn8mALb9QrQc6r1iR9WSTqiscP`) is also READY.
- **CRON_SECRET matches.** On the current deployment, `/api/cron/follow-ups` ran once a day (4 log lines since 2026-10-30, all `info`). Example: 2026-10-31 15:00 UTC `[cron/follow-ups] sent=0 failed=0`. No 401s or errors.
- **No scans have run on the current deployment.** The only request path in its logs is the cron. So nobody has seen a live Perplexity Sonar result yet, and `[perplexity] mechanism=...` has never been logged in production.
- **Runtime errors, last 7 days (3 groups):**
  1. **`invalid x-api-key` (401) on `/api/scan/start`, 2026-10-29 18:28 UTC** (deployment `dpl_8RaVz3Zz98Razk9hYYvVGfG5gVMy`, commit `0ad7543`). The error format (`authentication_error`, `req_011…` request id) is the Anthropic API's. Both `[buyerPrompts] Stage classification` and `Scan start failed for lead d0f0296c-…` failed. **This is the strongest lead on "/admin/test-run not working"**: it happened 20 minutes after the ADMIN_PASSWORD change (18:08 UTC), and a scan cannot start without a valid Claude key. Next step: owner checks/re-saves `ANTHROPIC_API_KEY` in Vercel production (and that the key is active in the Anthropic console), redeploys, then runs one admin test scan. Nothing has been logged since, so it may still be broken.
  2. `[report] Module failed to build … pages_missing_meta_description`: 2 hits on `/report/[token]`, last on 2026-10-29 12:56 UTC. This is the old-report page-health bug, fixed in `11-page-health.ts`. No hits after that, so the fix is not contradicted.
- Not checked: Cold Reach and mini-checkers deploys, Stripe, Resend, HubSpot, DNS.

## Business facts

- Brand: **AEO For LatAm** (DBA only). The legal entity **Adeian Digital LLC** is unchanged and must not appear in the app.
- Public domain: `aeolatam.com`. Blueprint app: `blueprint.aeolatam.com`. The old `blueprint.quintiavantage.com` is still attached on purpose so old emailed report links keep working. **Do NOT redirect it until the Stripe webhook and QStash are confirmed on the new domain.**
- Marketing site: Framer project "AEO For LaTam" (id `ZQzjTw4DwzASA20kHAsl`; "LaTam" is a typo in the project name). Its Buy Button and Pricing Card already link to `https://blueprint.aeolatam.com`. Pages `/privacy` and `/terms` exist. No `/es/...` pages appear in its page list.
- Blueprint: $500. A scan is 10 prompts x 4 engines (Claude, ChatGPT, Perplexity, Gemini) = 40 live calls. Scored engines for IVIA are ChatGPT + Perplexity; Claude and Gemini are bonus signals.

## Repos and deployments

| Repo | Vercel project id | Notes |
|---|---|---|
| quint-ia-blueprint-funnel | `prj_cfveeMeesIOQjLn7mVOqb3KHZJlh` | Next.js 15, Drizzle + Turso. Auto-deploys on push to `main`. |
| cold-reach-tool | `prj_3wCXNHcwNOMa7enGYhpOJzFjnHwx` | Standalone sales-rep tool with its own DB. |
| quint-ia-mini-checkers | `prj_Xhw1c1iF6T9Qe4QMtWI0nmVqi9fi` | Text rebrand only; no domain refs. |
| leonardoquintero-ctrl.github.io | n/a | Design sandbox and docs; old-brand HTML mockups. |

Vercel team: slug `aeoforlatam`, id `team_oTo6NhFMjSVfwsEKpozlnfD3`.

## What was done in the previous session (all on `main` unless noted)

**Funnel**
- Rebranded to AEO For LatAm: text, wordmarks, PDFs, emails, disclaimers, bot user agents.
- Site and email URLs moved to `aeolatam.com` (footer, nav, owner email default). The sender is `blueprint@aeolatam.com`, with a one-time retry from `blueprint@quintiavantage.com` if Resend says the domain is not verified (`src/lib/email/provider.ts`). Remove that fallback **only** after Resend shows `aeolatam.com` Verified and a real test email passes SPF/DKIM/DMARC.
- Cleanup commit: deleted `BUILD_PROMPT*.md`, unused exports, and the AHREFS/Cold Reach env comments; updated README/PROJECT_STATUS.
- Bug fix: the report page dropped the page-health section for old reports that lack `template_health`. Fixed with a default in `src/lib/report/modules/11-page-health.ts`.
- Added List-Unsubscribe and one-click POST headers to follow-up emails (`src/lib/followUps/run.ts`, `src/app/api/follow-ups/unsubscribe/route.ts`).
- Perplexity now uses the Sonar answer API with a Search API fallback (PR #10, squash-merged as `0ad7543`). `scripts/compare-perplexity.mjs` compares the two methods (billed calls, about $1).
- Added an `/admin/test-run` page and `/api/admin/test-run` route. It runs a real scan without Stripe, behind `ADMIN_PASSWORD`, and skips HubSpot, the prompt library and follow-ups. Its leads are tagged `utm_source=admin-test`.
- Last pushed funnel commit on `main`: `55ee64f` (empty redeploy commit). The one before it: `0ad7543`.

**Cold Reach** (`main` = `8b0e9da`): the rep Blueprint link now defaults to `https://blueprint.aeolatam.com`.

**Vercel env changes** (values hidden, set via API):
- funnel production `APP_BASE_URL` = `https://blueprint.aeolatam.com`
- funnel production `QSTASH_CALLBACK_BASE_URL` = `https://blueprint.aeolatam.com`
- cold-reach-tool production `EXCLUDED_DOMAINS` = `quintiavantage.com,aeolatam.com`

## Open items (need the owner or still undecided)

- **`/admin/test-run` "not working" is unresolved.** See the `invalid x-api-key` lead above. `ADMIN_PASSWORD` was changed on 2026-10-29 18:08 UTC (not by the agent), which could also explain a failed sign-in. It has not been tested in a browser. Ask for the exact symptom: no prompt, a 401 loop, a 404, or error text under the button.
- **Resend:** verify `aeolatam.com` in Resend (DKIM/SPF/MX at GoDaddy; DNS is external), add a DMARC TXT record at `_dmarc`, create the mailboxes `team@aeolatam.com` and `blueprint@aeolatam.com`, send a real test, then remove the fallback.
- **Stripe webhook URL:** the owner must change it to `https://blueprint.aeolatam.com/api/webhooks/stripe`.
- **Spanish legal links:** the funnel's Spanish footer links to `aeolatam.com/es/privacy` and `/es/terms`. Nobody has checked whether they open, and Framer shows no `/es/` pages.
- **Perplexity (PR #10)** is merged but unproven; no live Sonar result has been seen. Secondary sources (only) report that Sonar Chat Completions was retired on 2026-09-27 in favor of Perplexity's Agent API. Watch Vercel logs for `[perplexity] mechanism=search-fallback`. Perplexity's share of IVIA will likely drop, so do not compare new scans to old reports. Consider running `scripts/compare-perplexity.mjs` from the owner's CLI.
- **Vercel hygiene** (the agent's tools cannot do these): delete the unused `MOZ_API_KEY` (prod + preview); re-save `GEMINI_API_KEY` as Sensitive.
- **`cold_reach_lookups` table/schema** in the funnel is left over from the retired copy. Removing it from `schema.ts` would make `drizzle-kit push` offer to drop a table that holds production data. Needs an owner decision. Do not remove it casually.
- Optional: a `cold-reach.aeolatam.com` hostname. The funnel's `middleware.ts` still redirects `cold-reach.quintiavantage.com` to the Cold Reach app.
- Logo image files: there are none in the repos; the wordmark is text only ("AEO" + "For LatAm").
- `design-reference/` (about 800 KB of old-brand mockups) in the funnel repo is unused. Deleting it is the owner's call.

## Unverified / may be wrong

- ~~The last two funnel deploys were not confirmed READY.~~ **Resolved 2026-11-03:** `55ee64f` and `0ad7543` are both READY.
- ~~CRON_SECRET match not confirmed.~~ **Resolved 2026-11-03:** the daily cron logs `sent=0 failed=0` with no 401s.
- Perplexity pricing ($5 per 1,000 requests, $1 per million tokens) comes from secondary sources; docs.perplexity.ai was unreachable from the sandbox. The "~$0.06 per scan" figure is an estimate.
- No `aeolatam.com` or `quintiavantage.com` URL could be reached from the sandbox (egress blocked), so no live page was ever fetched.
- The admin gate and test-run route were only smoke-tested against a local build with an empty database (401 without the password, 200 page with it; the insert failed because the local DB had no tables).
- The Cold Reach change was pushed without a local build (that clone had no `node_modules`). Vercel's build succeeded.
- Not checked: HubSpot sequences/templates, Stripe settings, and already-sent emails.

## Working rules

- Pushing to `main` auto-deploys production. Fast-forward only; never force-push without explicit approval. After each push, check the Vercel deployment and `get_runtime_errors`.
- Shallow clones break merge-base checks: run `git fetch origin main --depth=50` before rebasing.
- Never decrypt or print Vercel env values. Sensitive values read back empty.
- The sandbox blocks many hosts (api.dataforseo.com, docs.perplexity.ai, aeolatam.com, etc.). Report the block; do not try to get around it.
- `curl` to localhost needs `--noproxy '*'` in this sandbox.
- Every commit needs the session's `Co-Authored-By` and `Claude-Session` trailers.
- Do not merge or deploy changes to payment or auth behavior without the owner's explicit yes.
- Runtime log queries over multi-day windows time out. Scope them to a `deploymentId`, or use `group_by`.
