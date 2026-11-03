# Handoff: AEO For LatAm (state as of 2026-11-03)

Written at the end of a very long session. Treat everything under "Unverified" as unknown, not fact. Trust the code and Vercel over this file where they differ.

## Business facts
- Brand: **AEO For LatAm** (DBA only). Legal entity **Adeian Digital LLC** is unchanged and must not appear in the app.
- Public domain: **aeolatam.com**. Blueprint app: **blueprint.aeolatam.com**. Old `blueprint.quintiavantage.com` is still attached on purpose (old emailed report links keep working). Do NOT redirect it until Stripe webhook and QStash are confirmed on the new domain.
- Marketing site: Framer project "AEO For LaTam" (id `ZQzjTw4DwzASA20kHAsl`, typo "LaTam" in the project name). Its Buy Button / Pricing Card already link to `https://blueprint.aeolatam.com`. Pages `/privacy` and `/terms` exist; no `/es/...` pages seen in its page list.
- Blueprint: $500, scan = 10 prompts x 4 engines (Claude, ChatGPT, Perplexity, Gemini) = 40 live calls. Scored engines for IVIA: ChatGPT + Perplexity (Claude and Gemini are bonus signals).

## Repos and where they are deployed
| Repo | Vercel project id | Notes |
|---|---|---|
| quint-ia-blueprint-funnel | `prj_cfveeMeesIOQjLn7mVOqb3KHZJlh` | Next.js 15, Drizzle + Turso, auto-deploys on push to `main`. |
| cold-reach-tool | `prj_3wCXNHcwNOMa7enGYhpOJzFjnHwx` | Standalone sales-rep tool (own DB). |
| quint-ia-mini-checkers | `prj_Xhw1c1iF6T9Qe4QMtWI0nmVqi9fi` | Rebranded text only; no domain refs. |
| leonardoquintero-ctrl.github.io | n/a | Design sandbox / docs, old-brand HTML mockups. |
Vercel team: slug `aeoforlatam`, id `team_oTo6NhFMjSVfwsEKpozlnfD3`.
Local clones in the sandbox (may be gone): `/home/user/quint-ia-blueprint-funnel` (on a scratch branch), `/home/user/cold-reach-tool`.

## What was done this session (all on `main` unless noted)
Funnel:
- Rebrand to AEO For LatAm (text, wordmarks, PDFs, emails, disclaimers, bot user agents).
- Site/email URLs moved to aeolatam.com (footer, nav, owner email default). Sender is `blueprint@aeolatam.com` with a one-time retry from `blueprint@quintiavantage.com` if Resend says the domain is not verified (`src/lib/email/provider.ts`). Remove that fallback ONLY after Resend shows aeolatam.com Verified and a real test email passes SPF/DKIM/DMARC.
- Cleanup commit: deleted BUILD_PROMPT*.md, unused exports, AHREFS/Cold Reach env comments; README/PROJECT_STATUS updated.
- Bug fix: report page dropped the page-health section for old reports (missing `template_health`); fixed with a default in `src/lib/report/modules/11-page-health.ts`.
- List-Unsubscribe + one-click POST headers on follow-up emails (`src/lib/followUps/run.ts`, `src/app/api/follow-ups/unsubscribe/route.ts`).
- Perplexity now uses the Sonar answer API with Search API fallback (PR #10, squash-merged as `0ad7543`). `scripts/compare-perplexity.mjs` exists to compare the two methods (billed calls, about $1).
- `/admin/test-run` page + `/api/admin/test-run` route: runs a real scan without Stripe, behind `ADMIN_PASSWORD`. Skips HubSpot, prompt library, follow-ups; leads tagged `utm_source=admin-test`.
- Funnel `main` last pushed commit: `55ee64f` (empty redeploy commit). Previous: `0ad7543`.
Cold Reach (`main` = `8b0e9da`): rep Blueprint link default changed to `https://blueprint.aeolatam.com`.
Vercel env changes I made (values hidden, set via API):
- funnel production `APP_BASE_URL` = `https://blueprint.aeolatam.com`
- funnel production `QSTASH_CALLBACK_BASE_URL` = `https://blueprint.aeolatam.com`
- cold-reach-tool production `EXCLUDED_DOMAINS` = `quintiavantage.com,aeolatam.com`

## Open items (need the owner or still undecided)
1. **`/admin/test-run` "not working" is UNRESOLVED.** The owner reported it and I never found the cause. `ADMIN_PASSWORD` was changed on 2026-10-29 18:08 UTC (not by me), which may be why sign-in fails. Not browser-tested by me. Ask for the exact symptom (no prompt, 401 loop, 404, or error text under the button).
2. **Resend**: verify aeolatam.com in Resend (DKIM/SPF/MX at GoDaddy, DNS is external), add DMARC TXT at `_dmarc`, create mailboxes `team@aeolatam.com` and `blueprint@aeolatam.com`, send a real test, then remove the fallback.
3. **Stripe webhook** URL must be changed by the owner to `https://blueprint.aeolatam.com/api/webhooks/stripe`.
4. **Spanish legal links**: the funnel's Spanish footer links to `aeolatam.com/es/privacy` and `/es/terms`; unverified whether they open.
5. **Perplexity PR #10 is merged but unproven.** Nobody has seen a live Sonar result. Sonar Chat Completions was reported (secondary sources only) to be retired on 2026-09-27 in favor of Perplexity's Agent API. Watch Vercel logs for `[perplexity] mechanism=search-fallback`. Perplexity share of IVIA will likely drop; do not compare to old reports. Consider running `scripts/compare-perplexity.mjs` on the owner's CLI.
6. **Vercel hygiene** (my tools cannot do these): delete unused `MOZ_API_KEY` (prod + preview); re-save `GEMINI_API_KEY` as Sensitive.
7. **`cold_reach_lookups` table/schema in the funnel** is a leftover from the retired copy. Removing it from `schema.ts` would make `drizzle-kit push` offer to drop a table with production data. Needs an owner decision. Do not remove casually.
8. Optional: `cold-reach.aeolatam.com` hostname; the funnel's `middleware.ts` still redirects `cold-reach.quintiavantage.com` to the Cold Reach app.
9. Logo image files: none in repos; wordmark is text only ("AEO" + "For LatAm").
10. `design-reference/` (about 800 KB old-brand mockups) in the funnel repo is unused; owner's call to delete.

## Unverified / things I may have gotten wrong
- Last two funnel deploys (`55ee64f`, and the CRON_SECRET one) were not confirmed READY / error-free by me after the final push; `df9c8de` and `0ad7543` were READY. Re-check runtime errors.
- CRON_SECRET was rotated by the owner at 2026-10-30 20:13 UTC; a deploy after it was READY, so it should match. Not confirmed: check Vercel logs after 15:00 UTC for `[cron/follow-ups]`; a 401 means mismatch.
- Perplexity pricing ($5/1000 requests, $1/M tokens) comes from secondary sources; docs.perplexity.ai was unreachable from the sandbox. The "~$0.06 per scan" figure is an estimate.
- I could not reach any aeolatam.com / quintiavantage.com URL from the sandbox (egress blocked), so no live page was ever fetched by me.
- The admin gate and test-run route were smoke-tested only against a local build with an empty database (401 without password, 200 page with it; insert failed because the local DB had no tables).
- The Cold Reach change was pushed without a local build (no node_modules in that clone); Vercel's build succeeded.
- HubSpot sequences/templates, Stripe settings and already-sent emails were not checked.

## Working rules that mattered
- Push to `main` auto-deploys production. Fast-forward only; never force-push without explicit approval. After each push, check the Vercel deployment and `get_runtime_errors`.
- Shallow clones break merge-base checks: `git fetch origin main --depth=50` before rebasing (this bit me on cold-reach-tool).
- Never decrypt or print Vercel env values. Sensitive values read back empty; I could set values but not read them.
- The sandbox blocks many hosts (api.dataforseo.com, docs.perplexity.ai, aeolatam.com, etc.). Report the block; do not try to bypass it.
- `curl` to localhost needs `--noproxy '*'` in this sandbox.
- Required trailers on commits: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` and `Claude-Session: <session url>`.
- Don't merge or deploy things that change payment/auth behavior without the owner's explicit yes.
