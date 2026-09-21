# Source of Truth — Quint·IA Vantage project

Last rebuilt: 2026-09-21, from a full audit of all 6 repos in the project (not just this one). This file is the canonical status doc. If something here conflicts with a page's or a repo's content, this file wins — update it whenever anything changes materially.

There's also a browsable copy of this same content at [`source-of-truth.html`](./source-of-truth.html) — same information, easier to skim/share as a page.

**Brand name: Quint·IA Vantage** (confirmed as current, 2026-09-21). "Vertia Labs" is a legacy internal working name still baked into the `vertia_labs` repo and this repo's `index.html` — those haven't been swept yet; see below.

**Retainer pricing: $950 / $1,750 / $2,750** (Foundation / Momentum / Citation Engine — confirmed as current, 2026-09-21). Important caveat: **no live product currently sells these.** The only thing a customer can actually buy today is the $500 Quick-Start Blueprint, via `quint-ia-blueprint-funnel`. The retainer tiers are marketing copy with no checkout path anywhere in the codebase.

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

**`quint-ia-mini-checkers` ("IVIA Lite") is a partial build.** Meant to power free interactive checkers embedded on Framer `/ivia/*` pages, stateless by design (no DB). Only 2 of 6 planned checkers exist: directory presence (LinkedIn/Crunchbase/G2/Capterra via Serper.dev) and an `llms.txt` presence/format check — both ported unchanged from `quint-ia-blueprint-funnel`. Rate limiting (10 req/min/IP, in-memory) and an SSRF guard (rejects private/reserved/metadata IP ranges, re-checked per redirect hop) are genuinely landed. No Turnstile, cooldowns, consent records, or data retention exist at all. Cold-domain prompt generation (needed since nobody supplies buyer questions for a cold domain) is fully spec'd in `docs/ivia-phase-b-scoping.md` but has zero corresponding code.

**`cold-reach-tool` is internal sales tooling, not yet deployed.** Given a prospect domain, reps get an AI-citation check across 4 engines, a DataForSEO backlink snapshot, a schema/content-shape check, and an `llms.txt` check, plus a generated "approach note." Has real login/admin user management. Just added (2026-09-21) the 6-factor lead-prioritization rubric: US sell-intent, B2B, company size, reachable decision-maker, AI-visibility gap (auto-suggested from its own citation data), audience geography — scored 0–2 each, total null until all six are scored, 10–12 = "Priorizar." Split out of `quint-ia-blueprint-funnel` on 2026-09-17 after a shared-DB migration incident blocked both products' deploys. **Per its own README, not yet functional**: no dedicated Turso DB provisioned, Vercel env vars not set, DNS (`cold-reach.quintiavantage.com`) still points at blueprint-funnel, no confirmed end-to-end lookup.

**`vertia_labs` is frozen (last commit 2026-05-04) but not irrelevant.** `strategic-HTML-src-of-truth.html` is the direct ancestor of this repo's `index.html` (near byte-identical — only a CSS checklist block and a minor grid tweak differ). `brand/Visual Guidelines` is the only formal brand-identity spec in the whole project (color ratios, typography, tier-color mapping) — titled "Internal Brand Reference for Vertia Labs." `core-strategy/` holds condensed strategy docs (market thesis, 3-phase review-discovery methodology, per-tier deliverables, 4-week sprint plan). `delivery-templates/ops-blueprint.md` and `content-frameworks.md` are real operational SOPs — Blueprint delivery process, editorial content standards — that aren't duplicated anywhere else in the project. Worth pulling forward rather than leaving buried in a dormant repo.

---

## Pricing across all sources found (reconciled 2026-09-21)

| Source | Foundation | Momentum | Citation Engine | Notes |
|---|---|---|---|---|
| `vertia_labs` (2026-05, oldest) | $750/mo | $1,750/mo | $2,500/mo | Origin numbers |
| `index.html` here (2026-07) | $950/mo | $1,750/mo | $2,500/mo | Foundation bumped, Citation Engine not carried forward |
| **Live marketing pages (2026-07) — current** | **$950/mo** | **$1,750/mo** | **$2,750/mo** | Confirmed current as of this rebuild |
| `quint-ia-blueprint-funnel` (the live paid product) | — | — | — | **No retainer tiers exist in the actual product.** Only the $500 one-time Blueprint is purchasable (`BLUEPRINT_PRICE_CENTS = 50000`) |

Action implied: `index.html`'s $2,500 Citation Engine figure is stale and should be updated to $2,750 to match confirmed-current pricing, and/or "Vertia Labs" branding there should be swept to "Quint·IA Vantage" — both edits are in `leonardoquintero-ctrl.github.io` only; nothing to change in `vertia_labs` (frozen/historical) or `quint-ia-blueprint-funnel` (doesn't sell retainers, not affected).

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
- [ ] **Decide whether the retainer tiers (Foundation/Momentum/Citation Engine) need a real checkout path**, or whether the product strategy is Blueprint-only for now with retainers as future/manual-sales copy.
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

- `QUINTIA-HANDOFF.md` — original 2026-07-09 build handoff for the 6 marketing pages. Historical; domain/pricing notes superseded by this file.
- PR #1 (`claude/ivia-mini-app-prebuild-review-afavy8`, still open) — the original IVIA pre-build review this rebuild supersedes. Its findings are captured/updated above; the PR itself can stay open for its commit history or be closed as superseded.
