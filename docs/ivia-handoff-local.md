# IVIA Build — Handoff to Local Claude Code

**From:** remote web session, 2026-08-15
**State:** Part 0 (pre-build review) complete. Parts 1–4 not started.
**Why this handoff exists:** the remote session's GitHub credential is read-only, so
the Part 0 commit could not be pushed. Continue locally.

---

## 1. First: recover the unpushed work

The remote session produced one commit, `b70a549`, on branch
`claude/ivia-mini-app-prebuild-review-afavy8`, containing
`docs/ivia-part0-prebuild-findings.md` (the full Part 0 review). It exists only as
a patch file that was sent to you — the container it was built in is gone.

```bash
git clone https://github.com/leonardoquintero-ctrl/leonardoquintero-ctrl.github.io
cd leonardoquintero-ctrl.github.io
git checkout -b claude/ivia-mini-app-prebuild-review-afavy8
git am /path/to/ivia-part0-findings.patch
git push -u origin claude/ivia-mini-app-prebuild-review-afavy8
```

If the patch is lost, the findings are reproducible — but it's a couple of hours of
reading. Prefer the patch.

**Why the push failed:** the Claude GitHub App installation is missing
`contents: write` on the repo. `git push` returned `403` from GitHub directly, and
the Contents API returned `403 Resource not accessible by integration`. Locally this
won't apply — you'll be using your own credentials. If you want remote sessions to
work later, fix the grant at https://claude.ai/admin-settings/claude-in-slack.

---

## 2. Repos you need locally

| Repo | What it is | Visibility |
|---|---|---|
| `leonardoquintero-ctrl/quint-ia-report-generator` | **The scan/report engine.** Next.js 15 + Drizzle/Turso. This is what the mini app extends or imports from. | public ⚠️ |
| `leonardoquintero-ctrl/leonardoquintero-ctrl.github.io` | The live marketing site — 6 static HTML files on GitHub Pages. | public (fine) |
| `leonardoquintero-ctrl/quint-ia-blueprint-funnel` | **Does not exist / not accessible.** See §4. | — |

```bash
git clone https://github.com/leonardoquintero-ctrl/quint-ia-report-generator
cd quint-ia-report-generator && npm install
cp .env.example .env
```

**Local dev runs with zero credentials.** `TURSO_DATABASE_URL="file:./local.db"`
works without a Turso account, and every external provider falls back to a mock when
its key is absent (engines → `MockEngineAdapter`, Moz → `MockDomainAuthorityProvider`,
Resend → console log, QStash → in-process `after()`). The full pipeline runs end to
end offline. Useful, but see the mock trap in §6.

```bash
npm run db:migrate   # applies the 3 migrations to local.db
npm run dev
```

There is no landing page — the app is entered at `/report/[token]`. To exercise it,
POST the `intakeWebhookSchema` shape (`src/lib/validation.ts`) to `/api/intake`.

---

## 3. What Part 0 established

Full detail in `docs/ivia-part0-prebuild-findings.md`. The short version:

### Confirmed as the brief assumed
- **Scan logic is reusable.** `runPromptVisibilityChecks()` behind an `EngineAdapter`
  interface; `runSiteChecks()`, `checkLlmsTxt()`, robots parsing all cheap and
  LLM-free. Checkers 1, 2, 4 map onto existing functions directly.
- **No HubSpot auto-integration** for lead creation — correct. (An *inbound* webhook
  contract exists at `/api/intake`; no outbound calls anywhere.)
- **No rate limiting, captcha, or cooldown** anywhere. All four Part 2 layers are new.
- **Competitor naming in the paid Blueprint is direct and untouched** —
  `/report/[token]` renders a share-of-voice bar chart labeled with raw competitor
  domains, and the owner-report prompt *requires* naming them. Nothing in Parts 1–4
  touches this.

### Contradicted the brief
- **No Framer site exists.** The live site is 6 static HTML files, all
  `<html lang="en">`, no toggle, no i18n, no `hreflang`. There is no locale state to
  inherit.
- **No PDF pipeline exists.** Zero hits for any renderer. All email is plain text —
  `EmailMessage` is `{to, subject, text}`.
- **Both repos are public.** No credentials committed (verified clean), but the
  scoring formula, all check thresholds, and the owner-report system prompt are
  public — which undercuts Part 4's decision to withhold reasoning.

### Not anticipated by the brief — these change scope
1. **No prompt generation exists.** Buyer questions are client-supplied at intake,
   deliberately (`validation.ts:27`). IVIA Lite scans cold domains with nobody to
   supply them → needs a new generation step. **A second piece of new methodology
   beyond Checker 6.**
2. **`runOffsiteChecks` is a hardcoded stub** (`offsite.ts:49-51`) returning
   all-false unconditionally. Checker 3 (Directorios) and the mid-tier report's
   off-site pillar have **no data source** — they'd report "not found" for every
   company on earth.

---

## 4. Blocking decisions — get these answered before building

1. **Where is `quint-ia-blueprint-funnel`?** It's referenced throughout the engine's
   comments as the sibling that owns HubSpot intake, payment, and its own Turso DB
   (`schema.ts:8,14`, `email/provider.ts:3`, `.env.example:2`). It owns lead intake —
   exactly what Part 2 rebuilds. Deleted, different org, or never built? If it exists,
   review it before Part 2 or you'll duplicate it.
2. **Language.** Nothing to inherit. Recommend the mini app accept `?lang=es|en` and
   let the future Framer build pass it in — no detection logic in the mini app, which
   matches the brief's intent.
3. **Repo visibility.** Make `quint-ia-report-generator` private before extending it.
   (`.github.io` must stay public for Pages on a free plan — that's fine, no logic
   in it.)
4. **PDF renderer.** Headless Chromium on Vercel is heavy (bundle + cold starts + the
   same timeout risk QStash exists to solve). A hosted HTML→PDF API is likely cheaper.
5. **Directory data source** for entity/off-site checks. Blocks Checker 3 and half
   the mid-tier report.

### Still open from the brief's Appendix B (not resolved — do not assume)
- Consent checkbox 3 (one-time contact) default state
- Mid-tier "opportunity framing" wording
- Per-checker rate limits for the 6 mini checkers

---

## 5. Suggested build order

**Phase A — foundation work.** Do these first; everything else depends on them.

⚠️ **Read this before starting.** Phase A touches nothing in
`quint-ia-blueprint-funnel` (inaccessible anyway) — but it *does* modify
`quint-ia-report-generator`, which is **the paid Blueprint's live engine**. "No
decisions needed" is not the same as "no effect on the paid product." Split
accordingly:

### A1 — purely additive, zero paid-product impact. Do freely.

1. **Shared `normalizeRootDomain()`** with a public-suffix list. Must collapse
   `company.com/page`, `sales@company.com`, `blog.company.com` → `company.com`.
   *Critical:* LatAm means `.com.mx`, `.com.co`, `.com.ar`, `.com.br` — naive
   last-two-labels collapses every Mexican company to `com.mx` and locks out the
   country after one scan.
   *Additive:* new module. Leave the existing `extractDomain()`
   (`engines/citation.ts:3`) and `normalizeUrl()` (`siteChecks.ts:14`,
   `fastpass/checks.ts:8`) untouched — do **not** rewire existing callers in A1.
2. **Engine filter on `getEngineAdapters()`** (`visibility.ts:19-25`) — it constructs
   `ClaudeEngineAdapter` unconditionally with no key check, so 5 prompts fires **15**
   calls, not 10. IVIA Lite needs scored-engines-only (`chatgpt` + `perplexity` =
   5 prompts × 2 = exactly 10).
   *Additive:* `getEngineAdapters()` is module-private (never exported), so an
   optional parameter defaulting to today's 3-adapter list is invisible to the paid
   path.
3. **HTML + attachment support** on `EmailProvider`.
   *Additive:* optional fields; keep `text` required. Both existing callers
   (`fastpass/email.ts:79`, `runFullPass.ts:73`) pass text only.

### A2 — changes paid-product output. Separate, reviewed change.

4. **Fix `isDomainCited`** (`engines/citation.ts:20`) — it uses
   `citedDomain.includes(target)`, so `notacme.com` matches `acme.com`. Tolerable for
   citation matching, a security bug as a cooldown key. Make it exact-or-subdomain.

   **Blast radius (verified):** `isDomainCited` has exactly one consumer —
   `visibility.ts:51` → `runPromptVisibilityChecks` → `runFullPass.ts:43`, the paid
   full pass. It computes `visibility_score` and `competitor_share_of_voice`, both
   rendered on the client's `/report/[token]` page. Fixing it **changes real
   client-facing numbers**, downward (today's substring test counts false citations).

   **Do not fold this into A1.** Run before/after on real client domains first and
   know which reports move, and by how much, before shipping.

   IVIA is not blocked by this: the mini app uses `normalizeRootDomain()` for
   cooldowns regardless, and can use a corrected matcher locally while the paid path
   keeps current behavior pending review.

**Phase B — scope the new methodology.** Prompt generation for cold domains, and the
directory data source. Both block downstream work; neither is a small task.

**Phase C — ship in this order:**

1. **Part 1 (IVIA Lite)** — cheapest, no public surface, immediate outreach value.
2. **Part 4 checkers 1, 2, 4, 5** — pure reuse of existing rule-based checks.
3. **Part 2 (mini app)** — the big new surface: form, Turnstile, cooldowns, consent
   records, retention job, PDF.
4. **Checker 6 (LatAm dialect)** — new methodology, scope separately as the brief says.
5. **Part 3 (aggregate content)** — **gated on data volume.** The 50-company
   threshold means this literally cannot run until Part 2 has been live a while.
   Build the anonymized schema early so data accumulates; build the workflow last.

**Also worth doing, unprompted by the brief:** `/api/intake` is unauthenticated and
unthrottled, and each full pass is ~60 live LLM calls. Anyone with the URL can burn
your API budget. Harden it in the same pass as the new rate limiting.

---

## 6. Gotchas found in the code

- **Mock data can reach clients.** `getDomainAuthorityProvider()` silently falls back
  to a mock that fabricates `hash(domain) % 500` referring domains. Anything
  client-facing **must** check `result.source !== "mock"` before displaying the
  number. Same shape of risk for the engine mocks.
- **Perplexity is the Search API, not Sonar.** "Citation" there means a domain in the
  top ranked results, not a domain cited inside a generated answer. A real, disclosed
  semantic difference between engines — don't "fix" it.
- **Claude is excluded from the score by design** (`SCORED_ENGINES = [chatgpt,
  perplexity]`); it runs as `claude_bonus_signal`. Don't fold it into the score.
- **`MOZ_API_KEY` is already base64-encoded** `access_id:secret_key`. Paste as-is,
  don't decode, don't re-encode.
- **QStash is inactive** — `DirectCallQueueProvider` (Next `after()`) is the default
  and does **not** solve Vercel's function timeout. The README is explicit about this.
  Relevant the moment scans run longer.
- **`buildClientReport()` is deliberately not an LLM call** — a pure data transform,
  so output structurally cannot drift into recommendation-shaped language. Copy this
  pattern for the mid-tier report; don't "improve" it into a synthesis step.
- **Design tokens are locked** in `QUINTIA-HANDOFF.md` (`--bg-base #0B0E11`,
  `--indigo #4F6EF7`, Inter + JetBrains Mono, WCAG AA verified). Reuse for the PDF
  template rather than re-deriving.

---

## 7. Key file map (engine repo)

```
src/lib/engines/
  types.ts              EngineAdapter interface
  citation.ts           isDomainCited() — has the substring bug
  {claude,chatgpt,perplexity,mock}-adapter.ts
src/lib/fullpass/
  visibility.ts         runPromptVisibilityChecks() + scoring + engine list
  siteChecks.ts         runSiteChecks() — the rule-based sweep
  offsite.ts            runOffsiteChecks() — STUB, returns all false
  domainAuthority.ts    Moz + mock fallback
  teasers.ts            counts-only, never content
  runFullPass.ts        orchestrator
src/lib/fastpass/
  checks.ts             runFastPassChecks(), checkLlmsTxt()
  robots.ts             parseRobotsGroups(), isBotBlocked()
  email.ts              LLM-drafted fast-pass email (Haiku)
src/lib/synthesis/
  clientReport.ts       pure transform, no LLM — copy this pattern
  ownerReport.ts        internal report, Claude-synthesized
  topFindings.ts        deterministic finding ranking
src/lib/email/provider.ts   text-only; needs HTML + attachments
src/db/schema.ts        ONE table: reports
src/app/api/intake/route.ts unauthenticated, unthrottled
src/app/report/[token]/page.tsx  the client report page / PDF template source
```

**Schema note:** `reports` is the only table. Nothing exists for leads, scans,
cooldowns, daily caps, consent records, or unsubscribes — all of Part 2's persistence
is new. Per `.env.example:2` the mini app is expected to use its own Turso DB.

---

## 8. Prompt to start the local session

> Read `docs/ivia-part0-prebuild-findings.md` and `docs/ivia-handoff-local.md` in
> this repo, plus the `quint-ia-report-generator` repo cloned alongside it. Part 0 of
> the IVIA build is done; I want to start Phase A (the four safe refactors in §5).
> Begin with the shared `normalizeRootDomain()` including public-suffix handling for
> LatAm TLDs, with tests covering the `company.com/page` / `sales@company.com` /
> `blog.company.com` / `.com.mx` cases.

Adjust depending on which blocking decisions from §4 you've resolved.
