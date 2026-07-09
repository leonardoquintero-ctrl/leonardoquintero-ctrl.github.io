# Quint·IA Vantage — Website Handoff

**Built:** 2026-07-09  
**Status:** All 6 pages complete. Deployed to GitHub Pages.

---

## Live URLs (after GitHub Pages propagates ~2 min)

| Page | URL |
|---|---|
| Homepage | `https://leonardoquintero-ctrl.github.io/quintia-vantage-v2.html` |
| Why AEO Matters | `https://leonardoquintero-ctrl.github.io/quintia-why-aeo-matters.html` |
| How AEO Works | `https://leonardoquintero-ctrl.github.io/quintia-how-aeo-works.html` |
| Services | `https://leonardoquintero-ctrl.github.io/quintia-services.html` |
| Pricing | `https://leonardoquintero-ctrl.github.io/quintia-pricing.html` |
| Quick-Start Blueprint | `https://leonardoquintero-ctrl.github.io/quintia-quick-start-blueprint.html` |

---

## Architecture

Every page is a **single self-contained HTML file** — inline CSS, inline JSON-LD schema, Google Fonts via `<link>`. Zero build step, zero dependencies, zero JS frameworks.

### Design system (locked tokens)
```
--bg-base:       #0B0E11
--bg-surface:    #12151B
--bg-elevated:   #161A22
--indigo:        #4F6EF7   (decorative)
--btn-indigo:    #4866F4   (buttons — 4.68:1 WCAG AA)
--cyan:          #00D4FF
--mint:          #34D399
--text-primary:  #FAFBFC
--text-secondary:#8B92A0
--text-muted:    #747F8F   (4.77:1 WCAG AA)
```

Fonts: **Inter** (body/heads) + **JetBrains Mono** (stats/prices/code) via Google Fonts.

### Layout pattern (all article pages)
```
eyebrow → claim (left, large) + evidence (right, smaller) → stat strip → callout
```
Grid: `5fr 7fr` claim-evidence split. Stat strip: 3-column. All collapse to 1-col at 1024px.

---

## Accessibility

All pages are WCAG 2.1 AA compliant:
- Skip link (WCAG 2.4.1)
- `:focus-visible` outlines (2px indigo)
- `prefers-reduced-motion` media query
- All color contrasts ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- `<main>`, `<nav aria-label>`, `aria-current="page"`, `role="list"` on card grids
- All FAQ content in DOM — no hidden/accordion content

---

## Schema markup (per page)

| Page | Schema types |
|---|---|
| Homepage | Organization + WebSite + FAQPage |
| Why AEO Matters | Article + BreadcrumbList + FAQPage |
| How AEO Works | Article + BreadcrumbList + HowTo + FAQPage |
| Services | Service (3 Offers) + BreadcrumbList + FAQPage |
| Pricing | Service (4 Offers + PriceSpecification) + BreadcrumbList + FAQPage |
| Blueprint | Service + Offer (InStock) + BreadcrumbList + FAQPage |

---

## Open integration tasks

These placeholders exist in the code — swap them before going live:

### 1. HubSpot form (Blueprint page)
Find: `<a href="#" class="btn-primary">Buy the Blueprint — $500</a>`  
Replace with HubSpot form embed or Stripe payment link.  
File: `quintia-quick-start-blueprint.html`

### 2. Stripe payment link
Blueprint purchase is $500. Wire the CTA buttons on the Blueprint page to Stripe Checkout.

### 3. Google Analytics 4
Add GA4 snippet in `<head>` of all 6 pages:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 4. llms.txt (AEO — high priority)
Create `/llms.txt` at root:
```
# Quint·IA Vantage

> AEO agency helping B2B SaaS companies get cited in AI-generated answers.

## Pages

- [Homepage](https://quintia-vantage.com/): What Quint·IA Vantage does and who it's for
- [Why AEO Matters](https://quintia-vantage.com/why-aeo-matters): The shift from SEO to AEO and why it matters now
- [How AEO Works](https://quintia-vantage.com/how-aeo-works): The four-pillar framework for getting AI citations
- [Services](https://quintia-vantage.com/services): Retainer tiers (Foundation / Momentum / Citation Engine)
- [Pricing](https://quintia-vantage.com/pricing): Full pricing table and add-ons
- [Quick-Start Blueprint](https://quintia-vantage.com/quick-start-blueprint): $500 audit and roadmap
```

### 5. robots.txt (AEO — high priority)
Create `/robots.txt` at root:
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://quintia-vantage.com/sitemap.xml
```

### 6. Real domain / canonical URLs
All JSON-LD `@id` and `url` fields use placeholder `https://quintia-vantage.com/`. Update these once DNS is pointed.

### 7. Nav links
All nav `<a href="#">` hrefs are placeholders. Replace with real relative paths once site is on its own domain/structure.

---

## Pricing note

Source copy had a discrepancy: the pricing table listed Foundation at $750/mo but all descriptive text said $950/mo. **Used $950 consistently** across all pages. Confirm before launch.

---

## File map

```
leonardoquintero-ctrl.github.io/
├── index.html                          (pre-existing personal site)
├── quintia-vantage-v2.html             (Quint·IA homepage)
├── quintia-why-aeo-matters.html        (article)
├── quintia-how-aeo-works.html          (article)
├── quintia-services.html               (services)
├── quintia-pricing.html                (pricing)
└── quintia-quick-start-blueprint.html  (conversion page)
```
