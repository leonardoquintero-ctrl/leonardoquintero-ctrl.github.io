# IVIA Mini App — Part 0 Pre-Build Findings

**Date:** 2026-08-15
**Scope:** Read-only review of existing code before building the IVIA mini app + mini checker suite.
**Repos reviewed:**
- `leonardoquintero-ctrl/quint-ia-report-generator` (public) — the scan/report engine
- `leonardoquintero-ctrl/leonardoquintero-ctrl.github.io` (public) — the live marketing site

**Status:** No code written. Three findings below block or materially change Parts 1–4 and need a decision.

---

## 0. Repo discovery — `quint-ia-blueprint-funnel` does not exist

The brief names `quint-ia-blueprint-funnel` as the app to review. It is not
reachable: `list_repos` returns exactly two repos on the account
(`quint-ia-report-generator`, `leonardoquintero-ctrl.github.io`) and an explicit
`add_repo` for the funnel returns *"you don't have access."*

It is, however, referenced repeatedly in `quint-ia-report-generator`'s own code
comments as a **sibling app** that owns the parts this repo doesn't:

| Reference | What it says the funnel owns |
|---|---|
| `src/db/schema.ts:8` | the `id`-as-report-token pattern (shared convention) |
| `src/db/schema.ts:14` | the HubSpot intake/payment flow |
| `src/lib/email/provider.ts:3` | a `PaymentProvider` swap-pattern interface |
| `.env.example:2` | a separate Turso database |
| `README.md` "Assumptions made" | *"New repo, separate from `quint-ia-blueprint-funnel`"* |

**So the review below covers the scan/report engine only.** Payment, the HubSpot
intake form itself, and any funnel-side rate limiting are unverified — they live in
an app nobody in this session can see. Everything in this document about "no X
exists" means *no X exists in the report generator*.

**Decision needed:** was the funnel repo deleted, is it under a different
account/org, or was it never built? If it exists somewhere, it should be reviewed
before Part 2 — it is the app that already owns lead intake, which is exactly what
Part 2 duplicates.

---

## 1. Reusable scan logic — exists, and is genuinely reusable

All of it is cleanly separated behind interfaces. The mini app should import these,
not reimplement.

### Citation testing (for IVIA Lite + Checker 5)

| Piece | Location | Signature / note |
|---|---|---|
| Orchestrator | `src/lib/fullpass/visibility.ts` | `runPromptVisibilityChecks(prompts, domain, competitors)` |
| Engine interface | `src/lib/engines/types.ts` | `EngineAdapter { engineName, runQuery(prompt, ctx) }` |
| Claude | `src/lib/engines/claude-adapter.ts` | `web_search` tool |
| ChatGPT | `src/lib/engines/chatgpt-adapter.ts` | Responses API `web_search` tool |
| Perplexity | `src/lib/engines/perplexity-adapter.ts` | **Search API, not Sonar** — "citation" = domain in top ranked results, not cited inside a generated answer |
| Mock | `src/lib/engines/mock-adapter.ts` | auto-substituted when a key is missing |
| Citation match | `src/lib/engines/citation.ts` | `isDomainCited(citations, domain)` |

Scoring lives inline in `runPromptVisibilityChecks`:
`visibility_score = round(cited / (prompts × 2) × 100)`.

**Engine mix matters for the "10 checks" budget.** `SCORED_ENGINES = ["chatgpt",
"perplexity"]` — Claude runs for real but is excluded from the score
(`claude_bonus_signal`). So:

- **5 prompts × 2 scored engines = exactly 10.** Clean fit for IVIA Lite.
- **But** `getEngineAdapters()` (`visibility.ts:19-25`) always constructs
  `ClaudeEngineAdapter` unconditionally, with no key check. Calling
  `runPromptVisibilityChecks` as-is with 5 prompts fires **15** calls, not 10 — 5 of
  them billable and thrown away. IVIA Lite must pass a scored-engines-only adapter
  list. That is a small, non-breaking refactor: make `getEngineAdapters()` accept an
  optional engine filter.

### Rule-based crawl checks (for Checkers 1–4 + mid-tier report + internal cheat sheet)

| Check | Location | Feeds which checker |
|---|---|---|
| `runSiteChecks(domain)` | `src/lib/fullpass/siteChecks.ts` | the full rule-based sweep |
| `checkLlmsTxt(content)` | `src/lib/fastpass/checks.ts:27` | **Checker 1** (Puente IA) |
| `analyzeContentShape(html)` | `siteChecks.ts:162` — `faq_blocks_found` | **Checker 2** (Preguntas Frecuentes) |
| `analyzeContentShape(html)` | `siteChecks.ts:162` — `comparison_tables_found` | **Checker 4** (Comparación) |
| `runOffsiteChecks(companyName)` | `src/lib/fullpass/offsite.ts` | **Checker 3** (Directorios) |
| `parseRobotsGroups` / `isBotBlocked` | `src/lib/fastpass/robots.ts` | bot-block detection |

All are plain `fetch` + `cheerio`. No LLM calls. Cheap, as the brief assumes. ✅

### ⚠️ Two gaps the brief did not anticipate

**(a) There is no prompt generation. Anywhere.**
`target_questions` are **client-supplied at intake** (`validation.ts:27`,
`z.array(...).min(1).max(20)`), and the README states this was deliberate:

> *"this app keeps client-supplied buyer questions (more precise than generating ~20
> prompts from a market string)"*

IVIA Lite scans a **cold domain with no client input** — there is nobody to supply
questions. So IVIA Lite needs a **new prompt-generation step** (derive ~5 category
buyer questions from the domain/industry). This is a second piece of new
methodology, alongside Checker 6, which the brief flagged as the only one. It
should be scoped explicitly.

**(b) `runOffsiteChecks` is a hardcoded stub, not a real check.**
`offsite.ts:49-51` returns `{ linkedin: false, crunchbase: false, g2: false,
capterra: false }` unconditionally, with a comment saying real checks were deferred
as ToS-risky. **Checker 3 (Directorios) and the mid-tier report's "Off-site
Citations / Entity Consistency" pillar therefore have no working data source
today.** Both would currently report "not found" for every company on earth. This
needs a real provider decision before either ships.

---

## 2. Tech stack confirmation

**Runtime:** Next.js 15.5.20 (App Router), React 19, TypeScript, Vercel-shaped.
Deps: `@anthropic-ai/sdk`, `openai`, `cheerio`, `zod`, `p-limit`, `resend`,
`drizzle-orm`, `@libsql/client`, `@upstash/qstash`.

**Turso (libSQL) — one table, that's all.**
`src/db/schema.ts` defines exactly one table, `reports`, with 3 migrations applied
(`0000` create, `0001` add `target_market`, `0002` add `client_context`).
Columns: `id` (PK, uuid, doubles as the public report token), `hubspot_contact_id`,
`hubspot_deal_id`, `company_name`, `domain`, `target_market`, `competitors` (JSON
text), `target_questions` (JSON text), `locale`, `email`, `contact_name`,
`client_context`, `status`, `fast_pass_json`, `fast_pass_email_sent_at`,
`full_pass_json`, `full_pass_error`, `full_pass_completed_at`,
`client_report_json`, `owner_report_json`, `created_at`, `updated_at`.

**No table exists for:** leads, scans, domain cooldowns, daily caps, consent
records, or unsubscribes. All of Part 2's persistence is new. Per `.env.example:2`
the mini app is also expected to use its **own** Turso DB, separate again.

**Moz — real, wired, with a mock fallback.**
`src/lib/fullpass/domainAuthority.ts`. Moz Links API v2,
`POST https://lsapi.seomoz.com/v2/url_metrics`, reads
`root_domains_to_root_domain` as the referring-domain count. `MOZ_API_KEY` is the
**already-base64-encoded** `access_id:secret_key` pair, passed straight into
`Authorization: Basic`. Without the key it silently falls back to
`MockDomainAuthorityProvider`, which fabricates a deterministic
`hash(domain) % 500`. **Anything consuming this must check `result.source !==
"mock"` before showing the number to a client** — the mid-tier report especially.

**HubSpot — the brief's premise is correct, with one clarification.**
- ❌ No outbound HubSpot integration. No API key, no create-contact call, nothing.
  Lead creation is manual, exactly as the brief says.
- ⚠️ But an **inbound** HubSpot contract does exist: `POST /api/intake`
  (`src/app/api/intake/route.ts`) is built as a HubSpot workflow webhook target and
  persists `hubspot_contact_id` / `hubspot_deal_id`. `validation.ts:7` notes it
  *"needs verification against the real workflow once it's built"* — so it may never
  have been connected.

So "no auto-integration" is accurate **for lead creation**, which is what Part 2
depends on. Manual HubSpot entry per lead is consistent with the code.

**Google tools already wired:**
- ✅ **PageSpeed Insights** — `siteChecks.ts:188`, works unauthenticated at low
  quota, `PAGESPEED_API_KEY` optional for higher quota.
- ✅ **YouTube Data API v3** — `offsite.ts:3`, skipped without `YOUTUBE_API_KEY`.
- ❌ **GA4 — not installed.** Still an open task in `QUINTIA-HANDOFF.md` ("Add GA4
  snippet in `<head>` of all 6 pages", placeholder `G-XXXXXXXXXX`). No analytics on
  the live site at all.
- ❌ Search Console: not wired.
- ❌ Google AI Overviews: explicitly *out of scope* and disclosed as such to clients
  (`visibility.ts:89-91`) — no official API; would need SerpAPI or DataForSEO.

**Other infra:** Resend for email (text-only, see §6); Upstash QStash for the
long-running full pass, currently inactive — `getQueueProvider()` falls back to
`DirectCallQueueProvider` (Next `after()`) until both `QSTASH_TOKEN` and
`QSTASH_CALLBACK_BASE_URL` exist. The README is explicit that this fallback **does
not** solve Vercel's function timeout.

---

## 3. Domain / email data model — thinner than the brief assumes

**Domains are stored raw and unnormalized.** `reports.domain` is
`text().notNull()`; validation is only `z.string().trim().min(1)`
(`validation.ts:12`). Nothing canonicalizes before the insert.

Normalization exists in two places, and they do **different** things:

| Helper | Location | Behavior |
|---|---|---|
| `extractDomain()` | `engines/citation.ts:3` | adds protocol → `new URL().hostname` → strips `www.` → lowercase |
| `normalizeUrl()` | `siteChecks.ts:14`, `fastpass/checks.ts:8` | *only* prepends `https://` |

**Consequence for the 14-day cooldown:** there is no reusable root-domain
canonicalizer to key it on. `extractDomain()` is the closest, but it is a *hostname*
extractor — it does not collapse `blog.company.com` → `company.com`, and it takes a
URL, not an email.

Worse, the matcher built on it uses a **substring** test —
`citedDomain.includes(target)` (`citation.ts:20`) — so `notacme.com` "matches"
`acme.com`. That is tolerable for citation matching; it would be a **security bug**
as a cooldown key.

The brief's requirement — collapse `company.com/anypage`, `sales@company.com`, and
`personX@company.com` to one root — needs a **new shared `normalizeRootDomain()`**
handling URLs, bare hostnames, subdomains, and email local-parts. It also needs a
**public-suffix list**, because LatAm targets mean `.com.mx`, `.com.co`, `.com.ar`,
`.com.br` — naive "last two labels" would collapse every Mexican company to
`com.mx` and lock out the entire country after one scan. Recommend extracting it to
a shared module both apps use, and fixing `isDomainCited` to compare exact-or-
subdomain rather than substring while we're there.

**Emails:** `z.string().trim().email()` (`validation.ts:29`), stored raw, no
lowercasing, no uniqueness constraint, **no free-provider blocklist anywhere**.
Part 2's Gmail/Outlook/Yahoo gate is entirely new.

**Competitors:** JSON text blob `[{name?, domain}]`, `.max(5)`
(`validation.ts:18-26`). Part 2 caps at 3 — compatible, just a tighter limit. They
are stored inside the parent row, so a *separate, longer* competitor cooldown needs
its own table regardless.

---

## 4. Rate limiting / bot protection — none. Zero. All four layers are new.

A full-text search for `ratelimit|rate.limit|turnstile|captcha|recaptcha|hcaptcha|
cooldown|throttle` across the codebase returns **three hits, all of them comments**
— two in the README about upstream API quota behavior, one in `visibility.ts:27`.

The only concurrency control is `p-limit` `CONCURRENCY = 5` (`visibility.ts:29`),
which throttles *our* calls to the engine APIs to avoid tripping their limits. It is
politeness toward upstream vendors, not abuse protection.

**Pre-existing exposure worth flagging on its own merits:** `POST /api/intake` is
unauthenticated and unthrottled. Anyone who learns the URL can insert unlimited
report rows and trigger unlimited full passes — and per README each full pass is
*~60 live LLM calls*. There is no shared secret, no signature check, no origin
check. (`/api/fullpass/run` does verify QStash signatures — but only when
`QSTASH_CURRENT_SIGNING_KEY`/`QSTASH_NEXT_SIGNING_KEY` are set, and they currently
are not, so that verification is skipped too.)

This is not caused by the new work, but the new work adds a second public entry
point. Recommend hardening `/api/intake` in the same pass.

So: Turnstile, per-domain cooldown, sitewide daily cap, competitor cooldown — four
new layers, no existing scaffolding to build on.

---

## 5. Language handling — ⚠️ the premise does not hold. There is no Framer site.

The brief asks how the mini app can read the Framer site's ES/EN toggle. Findings:

1. **No Framer site exists in any accessible repo.** The live site is six
   self-contained static HTML files on GitHub Pages
   (`quintia-vantage-v2.html`, `-why-aeo-matters`, `-how-aeo-works`, `-services`,
   `-pricing`, `-quick-start-blueprint`). `QUINTIA-HANDOFF.md` describes Framer as
   *future*: "All sections extractable for **Framer build**."
2. **There is no ES/EN toggle to inherit.** Every page is `<html lang="en">`. A
   search for a language switcher, `data-lang`, `localStorage` locale, i18n, or
   `hreflang` tags returns **nothing** — the only `hreflang` hits are *prose about
   selling hreflang audits to clients*. The site is English-only.
3. **The app's locale is per-report, not per-site.** `reports.locale` is `"EN" |
   "ES"`, default `"EN"` (`schema.ts:22`), supplied in the webhook payload
   (`validation.ts:28`). It drives the fast-pass email language
   (`fastpass/email.ts:20`), report disclaimers (`clientReport.ts:10-18`), and the
   client message. It is never read from any browser or site state.

**Decision needed.** "Inherit the toggle" has nothing to inherit. Options:
(a) build the Framer site first and define the contract (e.g. the toggle writes
`localStorage.quintia_locale`, the mini app reads it via query param on the embed
URL); (b) ship the mini app with its own `?lang=es|en` param that Framer will later
pass in — cheapest, keeps detection logic out of the mini app, matches the brief's
"don't build independent detection"; (c) ES-only for launch, given LatAm targeting.

Recommend **(b)** — one query param, no detection logic, forward-compatible with
whatever Framer does later.

---

## 6. Report generation — ⚠️ no PDF pipeline exists. This is new work.

A search for `puppeteer|playwright|pdfkit|react-pdf|wkhtmltopdf|weasyprint|jspdf|
chromium|pdf` across the codebase returns **zero hits**. There is no report
*generation* pipeline in the PDF sense at all.

What actually exists:

- **The client report is a web page**, not a document: `/report/[token]`
  (`src/app/report/[token]/page.tsx`), a server-rendered React page with inline
  styles reading `clientReportJson` from the DB.
- **`buildClientReport()`** (`src/lib/synthesis/clientReport.ts`) is a **pure data
  transform, deliberately not an LLM call** — the comment explains this
  structurally prevents drift into recommendation-shaped language. Good pattern;
  the mid-tier report should copy it.
- **All email is plain text.** `EmailMessage` is `{ to, subject, text }`
  (`email/provider.ts:6-10`) and `ResendEmailProvider` sends only Resend's `text:`
  field. **No HTML email, no attachments, no templating.**
- Two emails go out per full pass (`runFullPass.ts:91-101`): the client assessment
  message and the owner report — both `.join("\n\n")` string concatenation.

**So Part 2's "HTML-to-PDF emailed report" needs, from scratch:** an HTML template,
a PDF renderer, and HTML/attachment support added to `EmailProvider`. Flagging the
renderer as an architecture decision — headless Chromium is the natural choice but
is heavy for Vercel serverless (bundle size + cold starts + the same timeout risk
QStash was introduced to solve). A hosted HTML→PDF API may be the cheaper answer.

**What IS reusable:** the `buildClientReport()` no-LLM pattern; the `/report/[token]`
visual design as the HTML template source; and the locked design tokens in
`QUINTIA-HANDOFF.md` (`--bg-base #0B0E11`, `--indigo #4F6EF7`, Inter + JetBrains
Mono, all WCAG AA verified) so the PDF matches the brand without re-deriving it.

---

## 7. Competitor naming in the paid Blueprint — confirmed untouched, and confirmed direct

The existing Blueprint **does** name competitors with performance data, in three
places:

1. **Data:** `competitor_share_of_voice: Record<string, number>` — keyed by raw
   domain, 0–100, and it includes the client's own domain for comparison
   (`types.ts:119`, computed at `visibility.ts:76-80`).
2. **Client-facing render:** `/report/[token]` draws a labeled "Share of voice" bar
   chart (`page.tsx:105-134`) with each competitor's **raw domain string** as the
   visible label and its percentage beside it. The client's own bar is highlighted
   in indigo. This is as direct as naming gets.
3. **Owner report:** the system prompt *requires* it —
   *"must compare the client's visibility_score/share-of-voice/citation data against
   each supplied competitor **by name** — never null when competitors exist"*
   (`ownerReport.ts`, constraint 3).

**Nothing in Parts 1–4 touches any of this.** The new work adds a separate public
mini app with its own report path. Confirmed: the anonymization in the new public
IVIA content is a deliberate tier difference, not a bug, and the paid Blueprint's
behavior stays exactly as-is.

---

## 8. Env vars / secrets — ⚠️ both repos are PUBLIC

**The brief asks to "confirm the repo is private." It is not.** `list_repos`
reports `"visibility": "public"` for **both** `quint-ia-report-generator` and
`leonardoquintero-ctrl.github.io`.

**The good news — no credentials are leaked.** Verified clean:

| Check | Result |
|---|---|
| `.env*` gitignored | ✅ yes (twice — `.gitignore:13-15` and `:29`) |
| `.env` files tracked | ✅ none — only `.env.example` |
| `.env` in git history | ✅ none — only `.env.example` |
| Hardcoded key patterns (`sk-`, `pplx-`, `re_`, `AIza`, JWTs) | ✅ zero matches |
| `.env.example` values | ✅ all blank |
| `NEXT_PUBLIC_*` vars | ✅ none — no key can reach the browser bundle |

All 18 secrets are read via `process.env` server-side only: `ANTHROPIC_API_KEY`,
`OPENAI_API_KEY`, `PERPLEXITY_API_KEY`, `MOZ_API_KEY`, `AHREFS_API_KEY` (reserved,
unread), `RESEND_API_KEY`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`,
`YOUTUBE_API_KEY`, `PAGESPEED_API_KEY`, `QSTASH_*` (×5), `OWNER_REPORT_EMAIL`,
`APP_BASE_URL`, `BLUEPRINT_TURNAROUND_BUSINESS_DAYS`, `NODE_ENV`.

**The real exposure is methodology, not credentials.** Public today:

- `siteChecks.ts` — every rule-based check, thresholds included (the 50-word
  JS-shell heuristic, the KG page candidate lists, the FAQ/comparison detection)
- `visibility.ts` — the exact scoring formula and engine weighting
- `ownerReport.ts` — the full internal owner-report system prompt
- `topFindings.ts` — the finding-ranking heuristic
- a 16 KB README documenting the whole architecture

This **directly undercuts Part 4**, which deliberately withholds "why it matters"
from the public checker pages because that reasoning is the paid Blueprint's value.
That reasoning is currently in a public repo.

**Recommendation:** flip `quint-ia-report-generator` to **private** before
extending it. Note `leonardoquintero-ctrl.github.io` must stay public to serve
GitHub Pages on a free plan (private-repo Pages needs Pro/Team) — that's fine, it's
a marketing site with no logic in it.

---

## Summary — what's reusable vs. new

### ✅ Reusable as-is
- Citation testing across ChatGPT / Perplexity / Claude (`EngineAdapter` + `runPromptVisibilityChecks`)
- llms.txt check → Checker 1
- FAQ + comparison-table detection → Checkers 2 & 4
- robots.txt bot-block parsing
- Moz referring domains (guard against `source === "mock"`)
- PageSpeed + YouTube
- Turso + Drizzle patterns; the swappable-provider pattern (email / queue / DA)
- `buildClientReport()`'s no-LLM pure-transform discipline
- Locked design tokens for the PDF template

### 🔧 Small refactors needed
- Engine filter on `getEngineAdapters()` so IVIA Lite fires 10 calls, not 15
- Shared `normalizeRootDomain()` with public-suffix handling (extract to shared lib)
- Fix `isDomainCited`'s substring match to exact-or-subdomain
- HTML + attachment support on `EmailProvider`

### 🆕 Genuinely new
- **Prompt generation for cold domains** — *not previously flagged; scope this*
- **Real directory/entity checks** — `runOffsiteChecks` is a hardcoded stub, so
  Checker 3 and one of the two mid-tier pillars have no data source
- All four bot/abuse layers (Turnstile, domain cooldown, daily cap, competitor cooldown)
- Free-email-provider blocklist + routing branch
- Lead capture, consent records, unsubscribe, 90-day retention job
- HTML→PDF pipeline
- Checker 6 (LatAm-Spanish dialect) — as the brief already anticipated
- Anonymized aggregate dataset + the 50-company threshold gate

### 🚧 Blocking decisions
1. **Where is `quint-ia-blueprint-funnel`?** It owns lead intake — the thing Part 2 rebuilds.
2. **Language:** no Framer site and no toggle exist. Recommend a `?lang=` param.
3. **Repo visibility:** make the engine repo private before extending it.
4. **PDF renderer:** headless Chromium on Vercel, or a hosted HTML→PDF service?
5. **Directory data source:** needed before Checker 3 / the off-site pillar can be truthful.

### 📌 Open items from Appendix B — still open, not resolved here
- Checkbox 3 (one-time contact consent) default state
- Mid-tier "opportunity framing" wording
- Per-checker rate limits for the 6 mini checkers
