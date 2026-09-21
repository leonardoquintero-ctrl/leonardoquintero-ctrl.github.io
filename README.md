# Source of Truth — leonardoquintero-ctrl.github.io

Last rebuilt: 2026-09-21. This file is the canonical status doc for this repo. If something here conflicts with a page's content, this file wins — update it whenever the site changes materially.

There's also a browsable copy of this same content at [`source-of-truth.html`](./source-of-truth.html) (marked `noindex, nofollow`, not linked from any public nav) — same information, easier to skim/share as a page instead of a markdown file. Keep both in sync when either changes.

## What this repo actually is

One GitHub Pages repo currently hosting **two unrelated things**:

1. **Vertia Labs internal strategy doc** — `index.html`, served at the site root. A private-feeling business plan (market analysis, pricing logic, unit economics, a 30-day founder launch sprint checklist) for a two-person venture (Leonardo + a co-founder referred to as "Nora"). Branded **Vertia Labs**, not Quint·IA Vantage. This is almost certainly not meant to be public at the root of a live domain — see Known Issues.
2. **Quint·IA Vantage marketing site** — 6 standalone pages (`quintia-*.html`) for an AEO (Answer Engine Optimization) agency targeting LatAm→US B2B companies. This is the product described inside the Vertia Labs strategy doc, already built out as a shippable site.

Plus a handful of internal design tools that aren't part of either public surface: `Typography-sandbox.html`, `gradient-mixer.html`, `namesandbox.html`, `AI-engine-simulator.html`.

There is no build step anywhere in this repo. Every page is a single self-contained `.html` file: inline CSS, inline JSON-LD, Google Fonts via `<link>`, no JS framework, no bundler, no `package.json`.

## Known Issues (read this before touching the site)

These are real, currently-live problems, not hypothetical risks:

1. **The site root doesn't serve the marketing site.** GitHub Pages serves `index.html` at `/`, which is the internal Vertia Labs strategy doc — not `quintia-vantage-v2.html` (the actual Quint·IA homepage). Anyone hitting `leonardoquintero-ctrl.github.io` today sees founder-facing business planning, not the product.
2. **All internal nav links across the 6 Quint·IA pages are broken on this host.** Every nav/footer/CTA link uses clean paths (`/why-aeo-matters`, `/services`, `/pricing`, `/quick-start-blueprint`, `/`) with no `.html` extension. GitHub Pages does no rewriting, there's no `CNAME` file, no custom domain, and no redirect config (no `_redirects`, no `vercel.json`, no `netlify.toml`). Every nav click 404s except within a platform that does clean-URL rewriting. The actual filenames are `quintia-vantage-v2.html`, `quintia-why-aeo-matters.html`, `quintia-how-aeo-works.html`, `quintia-services.html`, `quintia-pricing.html`, `quintia-quick-start-blueprint.html`.
3. **Citation Engine price is inconsistent between the two projects.** The Quint·IA pages (`quintia-pricing.html`, `quintia-services.html`, `quintia-vantage-v2.html`) all say **$2,750/mo**. The internal strategy doc (`index.html`) says **$2,500/mo**. Foundation ($950) and Momentum ($1,750) agree everywhere. Pick one number and propagate it before this goes live — see `QUINTIA-HANDOFF.md` for the older $750-vs-$950 version of this same class of bug, which was fixed.
4. **Domain used in JSON-LD/canonical is `quintiavantage.com`** (no hyphen) — confirm this is the actual purchased domain; the original handoff doc referenced `quintia-vantage.com` (with hyphen), which is wrong/stale.
5. **No `CNAME` file** — GitHub Pages is serving off the default `github.io` subdomain, not a custom domain, regardless of what the canonical URLs claim.
6. **All "buy" and payment CTAs are placeholders.** `quintia-quick-start-blueprint.html` and `index.html` both have `<a href="#" class="btn-primary">` where a Stripe Checkout link or HubSpot embed should be.
7. **No `robots.txt`, no `llms.txt`, no `sitemap.xml`** exist anywhere in the repo. For an AEO/AI-citation-focused product this is a notable gap — these are called out as "high priority" in `QUINTIA-HANDOFF.md` and still haven't been created.
8. **No GA4 or any analytics** wired into any page.

None of the above have been fixed in this pass — this document's job is to make the state legible, not to unilaterally rewrite live pages. Flag before fixing #1 and #2 in particular, since they imply a real decision (which page is the actual homepage, and whether this repo gets a custom domain).

## File map

| File | Role | Status |
|---|---|---|
| `index.html` | Vertia Labs internal strategy/planning doc. Served at site root. | Mismatched with intended public site — see Known Issues #1 |
| `quintia-vantage-v2.html` | Quint·IA Vantage homepage | Complete |
| `quintia-why-aeo-matters.html` | Article: SEO→AEO shift | Complete |
| `quintia-how-aeo-works.html` | Article: 4-pillar AEO framework | Complete |
| `quintia-services.html` | Retainer tiers (Foundation / Momentum / Citation Engine) | Complete |
| `quintia-pricing.html` | Full pricing table + Blueprint credit mechanic | Complete, but see price discrepancy above |
| `quintia-quick-start-blueprint.html` | $500 diagnostic conversion page | Complete except payment CTA |
| `QUINTIA-HANDOFF.md` | Original build handoff notes (2026-07-09) for the 6 Quint·IA pages | Partially stale — domain and pricing notes superseded by this file |
| `Typography-sandbox.html` | Internal font-pairing sandbox | Design tool, not public-facing |
| `gradient-mixer.html` | Internal gradient/color tool | Design tool, not public-facing |
| `namesandbox.html` | AEO agency name-generation tool | Design tool, not public-facing |
| `AI-engine-simulator.html` | "Vertia Labs \| AI Citation Strategy" simulator | Internal tool, branding still says Vertia Labs |

## Brand state

Two names are in active use and not yet reconciled:
- **Vertia Labs** — used in `index.html` (root strategy doc) and `AI-engine-simulator.html` / `Typography-sandbox.html` titles.
- **Quint·IA Vantage** — used across all 6 public marketing pages and in the JSON-LD organization schema.

Quint·IA Vantage reads as the settled external brand (it's what all customer-facing copy uses); Vertia Labs looks like an earlier/internal-only name that didn't get fully swept out of the planning doc and sandbox tools.

## Product & business model (as currently specified)

Answer Engine Optimization (AEO) agency helping LatAm-to-US and US B2B/SaaS companies get cited by AI answer engines (ChatGPT, Claude, Perplexity, Gemini/AI Overviews), positioned as a **productized middle tier** between $30–500/mo self-serve monitoring tools (Profound, Peec AI, Scrunch, Otterly) and $5K–20K+/mo full-service PR-led agencies (NP Digital, Single Grain, Siege Media).

**Three stated differentiators:**
1. PR-free citation strategy (own Reddit/G2/YouTube/Wikidata/first-party structured content instead of press/backlinks)
2. Problem-specific review discovery — proprietary/unvalidated hypothesis that reviews framed around specific customer problems get cited 3–4x more than generic testimonials
3. Cross-lingual (ES↔EN) entity management for LatAm companies expanding into the US

**Offers:**

| Offer | Price | Commitment | Notes |
|---|---|---|---|
| Quick-Start Blueprint | $500 one-time (launch promo: $250 for first 5, with case-study rights) | 5–10 business days | Front door for every engagement; credits toward month 1 if a retainer is signed within 30 days of the readout call |
| Foundation | $950/mo | 3-month minimum | Audit, schema specs, owned knowledge graph seed, 2 content pieces/mo |
| Momentum | $1,750/mo | 6-month minimum | 4–5 pieces/mo, glossary, Reddit/Quora work, weekly tracking. "Most Popular" tier |
| Citation Engine | **$2,750/mo per Quint·IA pages / $2,500/mo per internal strategy doc — reconcile before launch** | 6-month minimum | 8–10 pieces, FAQ deep program, 4-engine weekly tracking, quarterly exec review |

**Year-1 targets (from internal strategy doc, unvalidated):** $15–20K MRR by month 6, 65%+ gross margin at scale, CAC <$2K (LatAm) / <$3K (US), Blueprint→retainer conversion target 30–40% within 60 days.

## Launch sprint status

`index.html` contains a 30-day, ~176-hour founder launch sprint (two tracks: "Partner"/Leonardo and "Nora") with a definition-of-done of: public site live, Blueprint purchasable, HubSpot delivery-ready, first outbound motion in market. As of this doc: **6 of 79 checklist items are marked done**, all of them Week 1 kickoff items (read strategy doc together, agree on day-30 done state, pick brand name/domain, lock launch pricing). Everything after that — legal entity setup, HubSpot provisioning, domain DNS, MSA/SOW templates, content production, outbound — is still unchecked in the doc, even though the 6 marketing pages themselves are already built. In other words: **the site is further along than the ops/business-setup track.**

## Design system (Quint·IA Vantage pages)

```
--bg-base:        #0B0E11
--bg-surface:      #12151B
--bg-elevated:     #161A22
--indigo:          #4F6EF7   (decorative)
--btn-indigo:      #4866F4   (buttons — 4.68:1 WCAG AA)
--cyan:            #00D4FF
--mint:            #34D399
--text-primary:    #FAFBFC
--text-secondary:  #8B92A0
--text-muted:      #747F8F   (4.77:1 WCAG AA)
```
Fonts: **Inter** (body/heads) + **JetBrains Mono** (stats/prices/code), loaded via Google Fonts `<link>`.

Layout pattern (article pages): eyebrow → claim (left) + evidence (right) in a `5fr 7fr` grid → 3-column stat strip → callout. Collapses to 1 column at 1024px.

Accessibility: WCAG 2.1 AA across all 6 pages — skip link, `:focus-visible` outlines, `prefers-reduced-motion`, ≥4.5:1 contrast on body text, semantic landmarks, all FAQ content live in the DOM (no accordion-hidden content).

The `index.html` / Vertia Labs doc uses a **different, unrelated design system** (DM Sans + DM Serif Display, light background `#f4f5fa`, navy/indigo/violet/fuchsia gradient brand) — it was never meant to share a visual identity with the Quint·IA pages.

## Schema markup

| Page | JSON-LD types |
|---|---|
| Homepage | Organization + WebSite + FAQPage |
| Why AEO Matters | Article + BreadcrumbList + FAQPage |
| How AEO Works | Article + BreadcrumbList + HowTo + FAQPage |
| Services | Service (3 Offers) + BreadcrumbList + FAQPage |
| Pricing | Service (4 Offers + PriceSpecification) + BreadcrumbList + FAQPage |
| Blueprint | Service + Offer (InStock) + BreadcrumbList + FAQPage |

## Open integration tasks (still open as of this rebuild)

- [ ] Decide what serves at `/` — the marketing homepage or the internal doc — and fix routing accordingly (custom domain + clean-URL support, or rename files to match the `/path` links already in the nav, or point the nav at real `.html` filenames)
- [ ] Reconcile Citation Engine price ($2,750 vs $2,500) across `index.html` and the Quint·IA pages
- [ ] Reconcile/confirm real domain (`quintiavantage.com` vs `quintia-vantage.com`) and add a `CNAME` file if a custom domain is owned
- [ ] Wire Stripe Checkout (or HubSpot Payments, per the internal doc's ops plan) to the Blueprint `$500` CTA in `quintia-quick-start-blueprint.html` and `index.html`
- [ ] Add `robots.txt` (allow GPTBot, ClaudeBot, PerplexityBot, Google-Extended explicitly) and `llms.txt` — both called out as high priority for an AEO product specifically, and both are currently missing
- [ ] Add `sitemap.xml`
- [ ] Add GA4 (or equivalent) to all public pages
- [ ] Sweep remaining "Vertia Labs" branding out of `AI-engine-simulator.html` and `Typography-sandbox.html` titles if Quint·IA Vantage is the final name
- [ ] Move the internal strategy doc (`index.html`) off the public root, or gate it, since it currently exposes founder-facing pricing logic, margin targets, and an unvalidated competitive-moat hypothesis to anyone who visits the bare domain

## Prior handoff doc

`QUINTIA-HANDOFF.md` is the original 2026-07-09 build handoff for the 6 Quint·IA pages. It's kept for build-detail history (file map at build time, original schema notes) but its domain reference and "open tasks" list are superseded by this file — treat this README as current, `QUINTIA-HANDOFF.md` as historical.
