# Source of Truth — Quint·IA Vantage project

Last rebuilt: 2026-09-21, from a full audit of all 6 repos in the project plus the official confidential **Sales Guide v1.0** (dated 2026-09-19). This file is the canonical status doc. If something here conflicts with a page's or a repo's content, this file wins — update it whenever anything changes materially.

There's also a browsable copy of this same content at [`source-of-truth.html`](./source-of-truth.html) — same information, easier to skim/share as a page.

**Brand name: Quint·IA Vantage** (confirmed as current, 2026-09-21). "Vertia Labs" is a legacy internal working name still baked into the `vertia_labs` repo and this repo's `index.html` — those haven't been swept yet; see below.

**Retainer pricing: $950 / $1,750 / $2,750** (Foundation / Momentum / Citation Engine — confirmed as current, 2026-09-21, exact match to the Sales Guide). Important nuance, corrected from an earlier version of this file: **there's no self-serve checkout for retainers, but they ARE actively sold** — by reps, manually (a call, then an invoice), under a real, live commission plan. Only the $500 Quick-Start Blueprint has an online checkout, via `quint-ia-blueprint-funnel`. See **Go-to-market reality** below for the full picture, including a 6th offering (**Project Work**) this file previously missed entirely.

---

## Project map — 6 repos

| Repo | Visibility | Role | Status |
|---|---|---|---|
| `leonardoquintero-ctrl.github.io` (this repo) | public | Marketing-site prototype + internal strategy doc + design sandboxes | Static pages likely never deployed to the real domain — see below |
| **`quint-ia-blueprint-funnel`** | private | **The actual live product.** Full $500 Blueprint funnel: intake → Stripe payment → AI-visibility scan → report | **Live**, actively developed, deployed to `blueprint.quintiavantage.com` and `blueprint.aeolatam.com` |
| `quint-ia-report-generator` | public ⚠️ | Original standalone scan/report engine | **Dead.** Superseded — its pipeline was absorbed in-process into `quint-ia-blueprint-funnel`. Nothing in production routes to it. Recommend archiving/making private (see Decision log) |
| `quint-ia-mini-checkers` | private | "IVIA Lite" — free interactive checkers meant to embed on `/ivia/*` Framer pages | Partial: 2 of 6 checkers built, rate-limiting/SSRF done, no Turnstile/cooldown/consent |
| `cold-reach-tool` | private | Internal sales-rep tool: prospect lookups, AI-citation checks, 6-factor lead scoring | Newest (started 2026-09-17), **not yet deployed** — no dedicated DB, DNS still points at blueprint-funnel |
| `vertia_labs` | private | Origin strategy/brand doc, frozen since 2026-05-04 | Source of `index.html` in this repo (near-identical); holds the only formal brand guidelines and two operational SOPs not duplicated anywhere else |

---

## What this repo (`leonardoquintero-ctrl.github.io`) actually is

One GitHub Pages repo hosting **two unrelated things**, plus design tools:

1. **Vertia Labs internal strategy doc** — `index.html`, served at the site root. A near-byte-identical later revision of `vertia_labs/strategic-HTML-src-of-truth.html`. Still branded "Vertia Labs," not Quint·IA Vantage — this is the legacy-naming gap referenced above, not yet swept.
2. **Quint·IA Vantage marketing pages** — 6 standalone `quintia-*.html` files. Well-built, WCAG AA, full JSON-LD — but **likely a design prototype that was never actually deployed as the real site**. See the domain finding below.

Plus internal design tools not part of either public surface: `Typography-sandbox.html`, `gradient-mixer.html`, `namesandbox.html`, `AI-engine-simulator.html`.

No build step anywhere: every page is a single self-contained `.html` file, inline CSS, inline JSON-LD, Google Fonts via `<link>`.

### The domain finding — why the nav links are probably not "broken," they're just not live

Every nav link across the 6 marketing pages uses clean paths (`/pricing`, `/services`, etc.) with no matching filename or redirect config on this GitHub Pages host — they 404 here. Previously this read as a plain bug. But `quint-ia-blueprint-funnel` deploys to `blueprint.quintiavantage.com` — a **subdomain** — which only makes sense if the root domain `quintiavantage.com` is hosting something else, almost certainly the **Framer site** that `quint-ia-mini-checkers` expects at `/ivia/*`. 

**Working hypothesis (not confirmed — no access to the Framer project or DNS):** the real production site is on Framer at the root domain, and the 6 HTML pages in this repo are a design reference/prototype that was never wired up as the actual site. If true, the "broken nav" isn't something to fix here — it was never meant to be the live site's routing. Confirm by checking what `quintiavantage.com` actually resolves to before doing any work on this repo's nav/routing.

### Other known issues in this repo specifically

- **Citation Engine price says $2,750** here (matches confirmed-current pricing) but `index.html`'s internal figure still says $2,500 (stale — matches the old `vertia_labs` doc's earlier revision, minus the Foundation bump from $750→$950 that did make it into `index.html`).
- No `CNAME`, `robots.txt`, `llms.txt`, `sitemap.xml`, GA4, or payment wiring in this repo. (Payment now exists for real, but in `quint-ia-blueprint-funnel`, not here.)
- All "buy" CTAs in `quintia-quick-start-blueprint.html` are still `href="#"` placeholders — the real Blueprint checkout lives in `quint-ia-blueprint-funnel`, deployed separately. If this repo's pages are ever wired up as real marketing pages, these CTAs should point at `blueprint.quintiavantage.com`, not try to reimplement checkout here.
- Two brand names in use: "Vertia Labs" (`index.html`) vs "Quint·IA Vantage" (the 6 marketing pages, and every other repo). Quint·IA Vantage is confirmed current — `index.html`'s branding is stale.

---

## Product architecture — what's actually live

**The live, paid product is `quint-ia-blueprint-funnel`.** Real Stripe Checkout, real HubSpot lead capture (fails open if unconfigured — never blocks the funnel), real Turso DB via Drizzle. It generates 5 buyer-style prompts per company, checks citation across Claude/ChatGPT/Perplexity (Gemini mocked — no public API), computes a visibility score, and produces both a client-facing report (web + PDF) and an internal owner report. `BLUEPRINT_PRICE_CENTS = 50000` ($500) is hardcoded in `src/lib/payment/provider.ts`. Deployed to two live domains: `blueprint.quintiavantage.com` and `blueprint.aeolatam.com`.

Recent/active work inside it: buyer-prompt quality (industry-aware, category-diversified prompt bank — PR #7, 2026-09-18), a cold-reach admin mini-feature, a citation-intelligence subsystem, and an expanded modular report builder (16 modules covering pillars, share-of-voice, buyer journey, page health, AI access, local listings, content gaps, glossary). Its own `PROJECT_STATUS.md` is dated 2026-07-25 and is now stale relative to the actual codebase — worth a refresh.

Known gaps in the live product (per its own status doc, may be partially stale):
- Full Stripe Checkout round-trip never visually verified in a real browser
- No staging environment — deploys go straight from `main` to production
- No monitoring/alerting beyond console logs for scan/payment failures
- No refund/cancellation policy, ToS, or privacy policy written
- README's line calling payment "placeholder" is stale — payment is real; worth a quick doc fix

**`quint-ia-report-generator` is dead code, still public.** Its own sibling's status doc says explicitly: not active, nothing in production routes to it, recommended for archival. Its known bugs were never fixed:
- `isDomainCited()` still substring-matches (`citedDomain.includes(target)`) — would false-positive e.g. "notacme.com" against "acme.com"
- `/api/intake` still has no auth or rate limiting
- Off-site checks: YouTube is now real, but LinkedIn/Crunchbase/G2/Capterra are still hardcoded-false stubs

None of this blocks anything live — the funnel repo doesn't call it — but it sits public on GitHub with a real, if abandoned, scoring methodology and an open unauthenticated endpoint. See Decision log.

**`quint-ia-mini-checkers` powers "IVIA Lite" (its official name per the Sales Guide) and is a partial build.** Meant to power free interactive checkers embedded on Framer `/ivia/*` pages, stateless by design (no DB). Only 2 of 6 planned checkers exist: directory presence (LinkedIn/Crunchbase/G2/Capterra via Serper.dev) and an `llms.txt` presence/format check — both ported unchanged from `quint-ia-blueprint-funnel`. Rate limiting (10 req/min/IP, in-memory) and an SSRF guard (rejects private/reserved/metadata IP ranges, re-checked per redirect hop) are genuinely landed. No Turnstile, cooldowns, consent records, or data retention exist at all. Cold-domain prompt generation (needed since nobody supplies buyer questions for a cold domain) is fully spec'd in `docs/ivia-phase-b-scoping.md` but has zero corresponding code. Separately, the business side caps usage at 75 runs/30 days + 50 per closed Blueprint (per the Sales Guide) — a policy layer this repo's own rate limiter doesn't know about or enforce.

**`cold-reach-tool` is internal sales tooling, not yet deployed.** Given a prospect domain, reps get an AI-citation check across 4 engines, a DataForSEO backlink snapshot, a schema/content-shape check, and an `llms.txt` check, plus a generated "approach note." Has real login/admin user management. Just added (2026-09-21) the 6-factor lead-prioritization rubric: US sell-intent, B2B, company size, reachable decision-maker, AI-visibility gap (auto-suggested from its own citation data), audience geography — scored 0–2 each, total null until all six are scored, 10–12 = "Priorizar." The Sales Guide independently documents this exact same 6-factor rubric as the reps' manual qualification method — confirms it's the company-wide standard, not a one-off feature. Split out of `quint-ia-blueprint-funnel` on 2026-09-17 after a shared-DB migration incident blocked both products' deploys. **Per its own README, not yet functional**: no dedicated Turso DB provisioned, Vercel env vars not set, DNS (`cold-reach.quintiavantage.com`) still points at blueprint-funnel, no confirmed end-to-end lookup.

**`vertia_labs` is frozen (last commit 2026-05-04) but not irrelevant.** `strategic-HTML-src-of-truth.html` is the direct ancestor of this repo's `index.html` (near byte-identical — only a CSS checklist block and a minor grid tweak differ). `brand/Visual Guidelines` is the only formal brand-identity spec in the whole project (color ratios, typography, tier-color mapping) — titled "Internal Brand Reference for Vertia Labs." `core-strategy/` holds condensed strategy docs (market thesis, 3-phase review-discovery methodology, per-tier deliverables, 4-week sprint plan). `delivery-templates/ops-blueprint.md` and `content-frameworks.md` are real operational SOPs — Blueprint delivery process, editorial content standards — that aren't duplicated anywhere else in the project. Worth pulling forward rather than leaving buried in a dormant repo.

---

## Pricing across all sources found (reconciled 2026-09-21)

| Source | Foundation | Momentum | Citation Engine | Notes |
|---|---|---|---|---|
| `vertia_labs` (2026-05, oldest) | $750/mo | $1,750/mo | $2,500/mo | Origin numbers |
| `index.html` here (2026-07) | $950/mo | $1,750/mo | $2,500/mo | Foundation bumped, Citation Engine not carried forward |
| **Live marketing pages (2026-07) — current** | **$950/mo** | **$1,750/mo** | **$2,750/mo** | Confirmed current as of this rebuild |
| `quint-ia-blueprint-funnel` (self-serve checkout) | — | — | — | No retainer checkout exists in the app itself — an online-purchase gap, not evidence the retainers aren't sold (see Go-to-market below) |
| **Sales Guide v1.0 (2026-09-19) — what reps quote** | **$950/mo** | **$1,750/mo** | **$2,750/mo** | Exact match to the live marketing pages, plus a 6th offering (**Project Work**, custom quote, $1,000 min) not on the marketing pages at all |

Action implied: `index.html`'s $2,500 Citation Engine figure is stale and should be updated to $2,750 to match confirmed-current pricing, and/or "Vertia Labs" branding there should be swept to "Quint·IA Vantage" — both edits are in `leonardoquintero-ctrl.github.io` only; nothing to change in `vertia_labs` (frozen/historical).

---

## Go-to-market reality — per Sales Guide v1.0

A confidential, dated (2026-09-19) rep-facing sales guide surfaced after the rest of this audit — it's the single most authoritative and current business-facing document found in the whole project, and it corrects several things this file previously got wrong from code alone. Treat it as the source of truth for anything sales/ICP/commission-related; this section summarizes it.

**Retainers are actively sold — just not through a checkout.** Reps close Foundation/Momentum/Citation Engine by hand — a call, then an invoice — under a real, live commission plan: a flat month-one bonus ($150 / $250 / $350 by tier) plus 2% of every monthly payment for the length of the contract. Biweekly payouts started 2026-09-18. **This means the earlier "no live product sells retainers" framing in this file was wrong** — corrected throughout.

**A sixth offering this file missed: Project Work.** Custom-quoted implementation (site restructuring, page building), priced hourly after a Blueprint, $1,000 minimum, requires Leonardo's written sign-off before a rep can quote it. The guide's own anonymized case study: a B2B coffee exporter's Blueprint found real technical debt (8 broken pages post-migration, no FAQ/glossary/comparison content, missing schema) — the recommended sequence was an 8-week, $17,300 fixed-price project to fix the foundation, *then* a $1,750/mo Momentum retainer once the site was actually citable. "Fix it, then grow it" is a deliberate, documented pattern, not a one-off.

**The real ICP is narrower than earlier drafts, and conflicts with the site's own copy.**

| | Criteria |
|---|---|
| **Fits** | LatAm-founded B2B startup/SMB, 10–150 employees, selling or wanting to sell into the US. Signals: English site, USD pricing, US listed as a market, US-facing LinkedIn roles. Sectors: software/SaaS, B2B services, agribusiness/exporters. |
| **Disqualified** | Startups actually based in the US/Miami; no real intent to sell into the US even with zero AI visibility; mostly-B2C businesses (unless Leonardo flags one exploratory); no reachable decision-maker or budget clearly under $500. |
| **Geography priority** | Hypothesis, not a rule: Mexico, Colombia, Chile first; then Argentina, Peru. Brazil excluded for now (first outreach goes out in Spanish). |
| **Qualification score** | Same 6-factor, 0–2-point rubric as `cold-reach-tool`: US sell-intent, B2B, company size, reachable decision-maker, AI-visibility gap, audience geography. 10–12 = prioritize, 6–9 = light-touch, <6 = pass. |

**Unreconciled conflict:** the public marketing site's copy (`quintia-*.html` here, and presumably the real Framer site) reads as written for any US buyer, with zero LatAm framing anywhere. Actual sales targeting is LatAm-founded companies exclusively. This could be a deliberate SEO/AEO choice (site copy written to rank for how a US buyer searches) or a real inconsistency nobody's resolved — worth a direct answer from Leonardo, not an assumption either way.

**IVIA Lite — the free checkers' official name and real limits.** The guide calls the free-tool suite **IVIA Lite**: three free measurements on a domain plus six single-function checker tools (matches the 6 checkers planned in `quint-ia-mini-checkers`, 2 of which are built). It's meant for genuine prospects only — capped at **75 runs per rolling 30 days, plus 50 more per closed Blueprint** — not an open public tool. This is a business-policy cap layered on top of that repo's own technical rate limit (10 req/min/IP).

Other things worth knowing:
- AEO and GEO are stated explicitly as "the same work" — confirms the earlier reasoning in this file.
- Rep messaging rules: max 50 new contacts/day, one message + one follow-up per prospect, CAN-SPAM compliant, no result/citation guarantees ever, no claiming clients/results that don't exist yet — **the guide states plainly there are no retainer clients to reference yet**, consistent with the company being early-stage.
- Domain-registration-in-CRM-first rule (Sec. 6 of the guide) opens a 60-day exclusivity window per rep — an actual lead-deduplication mechanism, not just a scoring rubric.

---

## Decision log

Supersedes the old 5 "blocking decisions" from the 2026-08-15 pre-build handoff (`docs/ivia-handoff-local.md` on the `claude/ivia-mini-app-prebuild-review-afavy8` branch, PR #1) — most of those are now resolved:

| Old open question | Resolution |
|---|---|
| "Where is `quint-ia-blueprint-funnel`? Deleted, different org, never built?" | **Resolved.** It exists, is the live paid product, and now owns intake/payment/DB itself — no dependency on the old report-generator repo. |
| "Make `quint-ia-report-generator` private before extending it" | **Superseded.** Nobody's extending it — it's dead. New recommendation below. |
| Language handling (`?lang=` param, no detection logic) | Still open, not contradicted by anything found — no repo implements language detection or switching yet. |
| PDF renderer (headless Chromium too heavy) | **Resolved differently than proposed.** `quint-ia-blueprint-funnel` uses `@react-pdf/renderer`, not headless Chromium. |
| Directory/off-site data source for entity checks | **Partially resolved.** `quint-ia-mini-checkers`' directory-presence checker (Serper.dev-based) covers this for the free checkers. `quint-ia-report-generator`'s off-site module is still stubbed for LinkedIn/Crunchbase/G2/Capterra, but that repo is dead anyway. |

**New open items from this audit:**

- [ ] **Archive or make `quint-ia-report-generator` private.** It's dead, still public, and carries an unauthenticated `/api/intake` endpoint plus an unfixed citation-matching bug. Its own sibling repo's status doc already recommends this — just needs doing.
- [ ] **Confirm what `quintiavantage.com` (root domain) actually serves.** If it's a Framer site as hypothesized, decide what (if anything) this repo's 6 marketing pages are for going forward — reference/prototype, or retire.
- [ ] **Sweep "Vertia Labs" branding and the stale $2,500 Citation Engine figure out of `index.html`** in this repo (confirmed: current name is Quint·IA Vantage, current price is $2,750).
- [ ] **Decide whether the retainer tiers need a real self-serve checkout path** — they're already sold manually by reps, so this is an efficiency/scale question, not a "does this product exist" question.
- [ ] **Resolve the ICP conflict**: reconcile the public site's LatAm-free copy with the sales team's LatAm-only actual targeting (see Go-to-market reality above).
- [ ] **Add Project Work** as a real self-serve or at-least-documented offering wherever the marketing site ends up living — it doesn't appear anywhere in this repo's copy today.
- [ ] **Finish deploying `cold-reach-tool`** — dedicated Turso DB, Vercel env vars, DNS repoint from blueprint-funnel, one confirmed end-to-end lookup.
- [ ] **Pull `vertia_labs/delivery-templates/`** (ops-blueprint.md, content-frameworks.md) and `brand/Visual Guidelines` **into an active repo** rather than leaving them in a frozen one nobody else seems to reference.
- [ ] Everything previously listed for this repo specifically: robots.txt, llms.txt, sitemap.xml, GA4, CNAME (pending the domain question above).

---

## Design system — **current** ("Authoritative B2B Consulting meets Modern Tech")

This is the live palette, defined in `quint-ia-blueprint-funnel/src/app/globals.css` (not in this repo). Its own comment is explicit: it **replaces** the older dark indigo palette this repo's 6 marketing pages still use, and calls those pages "historical, not the source of truth."

```
--bg-base:        #F8F9FA   (Alabaster)
--bg-surface:      #FFFFFF   (white cards)
--accent:          #047857   (Deep Emerald — primary/CTA/citation-found)
--accent-hover:    #065F46
--text-primary:    #1E293B   (Charcoal Navy — 13.8:1 AAA)
--text-secondary:  #475569   (7.9:1 AAA)
--text-muted:      #64748B   (4.9:1 AA floor)
--border:          #E2E8F0
```
Fonts: **Inter** (body/heads) + **JetBrains Mono** (stats/prices/code). Squared-off 8px-radius corners everywhere — deliberately not fully-rounded, which the design comment calls "consumer," not B2B.

**This repo's 6 marketing pages (`quintia-*.html`) and `index.html` have not been updated to this palette** — they still use the old dark indigo/cyan tokens below. That's a real, live inconsistency: if these pages are ever treated as the real marketing site (see the domain question above), they need this palette applied.

Old tokens still in use on this repo's pages (superseded):
```
--bg-base:        #0B0E11
--bg-surface:      #12151B
--indigo:          #4F6EF7
--cyan:            #00D4FF
--text-primary:    #FAFBFC
```

Separately, `vertia_labs/brand/Visual Guidelines` specifies a **third**, still-different formal brand system (DM Serif Display + DM Sans, indigo/violet/fuchsia gradient, glassmorphism cards) under the "Vertia Labs v8" name — `index.html` here uses that one. None of the three palettes (Vertia Labs v8, the old dark indigo pages, and the current emerald system) have been reconciled with each other.

## Schema markup (this repo's 6 marketing pages)

| Page | JSON-LD types |
|---|---|
| Homepage | Organization + WebSite + FAQPage |
| Why AEO Matters | Article + BreadcrumbList + FAQPage |
| How AEO Works | Article + BreadcrumbList + HowTo + FAQPage |
| Services | Service (3 Offers) + BreadcrumbList + FAQPage |
| Pricing | Service (4 Offers + PriceSpecification) + BreadcrumbList + FAQPage |
| Blueprint | Service + Offer (InStock) + BreadcrumbList + FAQPage |

## Prior docs

- **Sales Guide v1.0** (dated 2026-09-19, confidential rep reference) — the most current and authoritative business-facing document found across the project. Supersedes this file's own earlier assumptions about ICP and retainer-sale status; see **Go-to-market reality** above for what it corrected.
- A companion business playbook (proposal structure, module-pricing toolkit, discovery questions, cold-email templates) exists alongside it — useful for proposal/scoping work, not repeated here since it doesn't change this file's technical or GTM facts.
- `QUINTIA-HANDOFF.md` — original 2026-07-09 build handoff for the 6 marketing pages. Historical; domain/pricing notes superseded by this file.
- PR #1 (`claude/ivia-mini-app-prebuild-review-afavy8`, still open) — the original IVIA pre-build review this rebuild supersedes. Its findings are captured/updated above; the PR itself can stay open for its commit history or be closed as superseded.
