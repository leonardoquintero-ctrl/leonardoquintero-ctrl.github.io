# IVIA Build Spec — Parts 1–4

**Source:** Leonardo's build brief, 2026-08. Transcribed into the repo so local
sessions have the spec as ground truth. Part 0 (pre-build review) is complete and
written up in `ivia-part0-prebuild-findings.md`; Parts 1–4 below are **not started**.

**Read alongside:** `ivia-handoff-local.md` (build order, blocking decisions,
gotchas) and `ivia-part0-prebuild-findings.md` (what exists and is reusable).

---

## Part 1 — IVIA Lite (cold outreach hook)

**Purpose:** cheap, fast citation check used to personalize cold outreach
(LinkedIn, email, Apollo). **No public page, no report** — this tier only ever
appears inside an outreach message.

- **10 total prompt/engine checks per domain.** Not 15, not 20 — chosen to minimize
  API cost per unclosed lead. (5 prompts × 2 scored engines = exactly 10. See the
  engine-filter item in the handoff: the code currently fires 15.)
- **Outputs exactly 3 measurements:**
  1. **Citation rate** — "X de 10 búsquedas te mencionan"
  2. **Category-level framing**, phrased as opportunity, never deficit — e.g. "Tu
     categoría todavía no tiene un líder claro en visibilidad ante IA." Never a
     direct negative comparison to the prospect.
  3. **Binary bridge-file flag** — phrased to the user as "No se encontró archivo de
     puente de comunicación con motores de búsqueda de IA". **Never expose the raw
     term "llms.txt" in user-facing copy.**

⚠️ **Open discrepancy:** Part 1 specifies 3 measurements, but the locked template in
Appendix A carries only 2 bullets (citation rate + bridge file). Measurement 2
(category framing) is generated but has nowhere to go in the locked copy. Confirm
whether it becomes a third bullet or informs the surrounding prose.

⚠️ **New work:** no prompt generation exists — buyer questions are client-supplied
at intake today. Cold domains have nobody to supply them, so IVIA Lite needs a new
prompt-generation step. This is a second piece of new methodology beyond Checker 6.

---

## Part 2 — IVIA Mid-Tier Report (public/free scan via mini app)

**Purpose:** a more substantial free report that creates urgency without
cannibalizing the paid $500 Blueprint.

### Form flow (single unified form, in this order)

1. Domain/website to scan
2. Name
3. Phone (**optional** — explicitly so, to avoid reading as a cold-call setup)
4. Business/industry name (if available, not required)
5. Email → **branch point**:
   - **Corporate/domain email** → proceed to Turnstile + scan
   - **Free provider** (Gmail, Outlook, Yahoo, iCloud, ProtonMail, etc. via a
     maintained blocklist) **or no domain email** → route to a "book a call"
     confirmation using data already collected in steps 2–4 (no additional form).
     **Do not block the person outright.**

### Bot / abuse protection — all four layers, stacked (not either/or)

- **Cloudflare Turnstile** — triggered after email entry, before the scan runs.
- **Per-domain cooldown: 14 days**, keyed to the normalized root domain. Must
  collapse `company.com/anypage`, `sales@company.com`, and `personX@company.com` to
  the same root so none bypasses the cooldown independently.
- **Sitewide daily cap: 50 scans/day**, independent of the per-domain rule (guards
  against many-unique-domains abuse).
- **Competitor domains:** up to 3 per scan, optional, on their own **longer**
  cooldown, separate from the primary domain's.

### Report content (client-facing)

- **Headline: AI Visibility Index** — the composite score — shown alongside a
  category average, framed as opportunity, not deficit.
- **Exactly 2 of the 4 pillars**, as qualitative text with **no hard
  percentage/number**:
  - **Content Shape** — plain-language description of FAQ/comparison content gaps.
  - **Off-site Citations / Entity Consistency** — plain-language description of
    directory presence (Crunchbase/G2/LinkedIn) gaps, phrased comparatively where
    relevant.
- **Do NOT show** Technical Readability or Owned Knowledge Graph — reserved for the
  paid Blueprint.
- **No prioritized action plan** in this tier.
- **Delivered as an HTML-to-PDF emailed report**, not a live dashboard page. This is
  deliberate: harder to casually re-request, reads as a designed deliverable rather
  than a cheap webpage.
- **Reuse the citation data already generated** — no duplicate LLM calls between
  IVIA Lite logic and this tier.

⚠️ The off-site/directory pillar has **no working data source** — `runOffsiteChecks`
is a hardcoded stub. Blocks half this report.

### Internal-only cheat sheet (NOT client-facing)

On scan completion, auto-generate an internal summary covering **all 4 pillars**
(not just the 2 shown), from the same rule-based crawl checks — cheap, no LLM
needed. Delivered to Leonardo for sales-call prep, emailed alongside the lead data.

### Consent — 3 checkboxes at submission, each with a short explanation + link to full policy

1. Privacy policy consent
2. Report-generation consent (data used to generate the report)
3. One-time contact consent — ⚠️ **default-checked vs. default-unchecked is NOT
   finalized. Confirm before shipping; do not assume.**

### Contact policy

One initial reach-out + one follow-up 10–14 days later. No ongoing marketing emails.
**Every email must include a working unsubscribe link regardless of opt-in state**
(CAN-SPAM baseline).

### Data retention

- Raw lead data (email, name, phone, domain): **90 days**, then deleted or folded
  into the anonymized aggregate dataset.
- Anonymized data (no company-identifying info): may be retained indefinitely for
  the aggregate content workflow.

### Lead handling (current, manual stage)

No HubSpot auto-integration. On each new lead (either branch), email a notification
to Leonardo with the lead's details. He creates the HubSpot contact manually until
volume justifies the paid tier.

### Language

Inherit the ES/EN toggle/locale from the main site — do not build independent
language detection. ⚠️ **No Framer site and no toggle exist yet.** Recommended: accept
`?lang=es|en` and let the future Framer build pass it in.

### Privacy policy baseline

US privacy law as the compliance floor (CCPA/CPRA-style disclosure + consent +
opt-out), applied **uniformly** rather than country-specific geofencing.

---

## Part 3 — Anonymized Aggregate Content Workflow

- Individual scan results/scores are **never published publicly** — neither the
  prospect's own score nor named competitor data.
- Once **~50+ companies** exist within the same field/category in the anonymized
  dataset, that segment becomes eligible for aggregate statistical claims (e.g.
  "más de 50 startups B2B analizadas").
- **Below that threshold, no aggregate/statistical claims** for that segment. Do not
  fabricate or round up sample sizes.
- **Weekly workflow** (may be semi-manual / Claude-assisted, not necessarily fully
  automated in this build): pull 2–3 interesting anonymized data points, research
  surrounding trends, produce content drafts for LinkedIn, the website blog, X, and
  Reddit.

**Sequencing:** this is gated on data volume and cannot run until Part 2 has been
live a while. Build the anonymized schema early so data accumulates; build the
workflow last.

---

## Part 4 — IVIA Page + Mini Checker Suite

Build a dedicated `/ivia` page that introduces IVIA with a **neutral,
methodology-first tone** (dated, factual, third-person — no heavy self-promotional
language), and hosts 6 mini checkers, each as its own tool/landing page.

**Each checker gets ONLY a one-line "what it checks" statement. Explicitly NO "why it
matters" or explanatory reasoning** — this is deliberate: the reasoning is part of
the paid Blueprint's value and must not be given away here.

| # | Checker | One-line (client-facing, ES) | Reuses | Status |
|---|---|---|---|---|
| 1 | Verificador de Puente IA | revisa si tu sitio tiene un archivo que guíe a los motores de IA | `checkLlmsTxt()` — `fastpass/checks.ts:27` | ✅ ready |
| 2 | Verificador de Preguntas Frecuentes IA | revisa si tu contenido responde directamente las preguntas de tus compradores | `analyzeContentShape()` → `faq_blocks_found` — `siteChecks.ts:162` | ✅ ready |
| 3 | Verificador de Presencia en Directorios | revisa tu presencia en plataformas como Crunchbase, G2 y LinkedIn | `runOffsiteChecks()` — `offsite.ts:53` | ⛔ **stub, all-false** |
| 4 | Verificador de Comparación | revisa si tu sitio ayuda a un comprador a compararte con otras opciones | `analyzeContentShape()` → `comparison_tables_found` | ✅ ready |
| 5 | ¿Apareces en ChatGPT / Claude / Perplexity? | prueba si tu marca aparece al preguntar por tu categoría | `runPromptVisibilityChecks()` at 1 prompt × 1 engine | ✅ ready |
| 6 | Verificador de Dialecto en IA | revisa si tu copy en inglés suena nativo o si tiene señales de traducción/no-nativo que reducen la confianza de la IA | nothing | 🆕 **new methodology (corrected direction — see note below)** |

- **Checkers 1–4** reuse existing rule-based crawl logic — cheap, no LLM calls.
- **Checker 5** reuses citation testing at minimal scale: **1 prompt × 1 engine per
  run** — the cheapest possible version of the citation test.
- **Checker 6 is new.** ⚠️ **Corrected 2026-08-18** — the original brief's wording
  ("revisa si tu español suena auténticamente latinoamericano ante la IA", ES-dialect
  authenticity) was a misstatement of intent. The actual product angle, confirmed by
  Leonardo: this checks whether a LatAm company's **English-language copy** reads as
  native/natural English versus carrying non-native-speaker signals (translation
  artifacts, calques, unnatural phrasing) — the theory being that AI engines trust
  and cite copy that reads as fluent, native English less readily when it doesn't.
  The sellable hook: findings here become the entry point for Quint·IA's own
  copywriters to fix the client's English copy, which the site's existing content
  already frames as a known LatAm-expanding-to-US pain point (see
  `index.html`: "English copy by non-native speaker" listed as a gap alongside
  missing hreflang and entity inconsistency).

  Not a repackaging of existing pillar data — needs its own lightweight analysis
  (native-vs-non-native English signal detection, not ES dialect classification).
  **Scope and estimate separately before building** — same caution as before, just
  pointed at the right target.
- **Rate limiting:** each checker respects the same principles as the main IVIA scan
  (reasonable per-domain cooldowns) to control cost. Exact limits may be lighter than
  the main scan given narrower scope. ⚠️ **Numbers not yet specified — confirm
  sensible defaults during build rather than leaving uncapped.**
- Page **closes with a soft link to the Blueprint** as the next step — informational,
  not a hard sell.

---

## Appendix A — Locked IVIA Lite outreach message (Spanish)

**Locked copy. Do not rewrite.**

```
Hola [nombre],

Soy Leonardo, de Quint·IA Vantage. Ayudamos a startups de LatAm a ser
la respuesta cuando compradores en EE. UU. buscan en IA.

Te contacto porque notamos tu índice de visibilidad IA (IVIA) en
Estados Unidos y queremos contarte cómo optimizar tu posicionamiento.

• 0 de 10 búsquedas te mencionan
• Falta un archivo de puente de comunicación con estos motores de IA

¿Hablamos 15 minutos sobre cómo podemos mejorar tu IVIA en EE. UU.?
```

---

## Appendix B — Open items to confirm before/during build

1. **Consent checkbox 3 default state** (checked vs. unchecked) — not finalized.
2. **Mid-tier report's category-average "opportunity" framing wording** — several
   candidate phrasings were discussed; pick one during copywriting, not hard-coded
   in the spec.
3. **Rate-limit specifics for the 6 mini checkers** — lighter than the main scan, but
   not numerically specified.

### Added during Part 0 (see findings doc §4)

4. **Where is `quint-ia-blueprint-funnel`?** Not accessible; it owns lead intake,
   which Part 2 rebuilds.
5. **Language:** no Framer site/toggle exists to inherit from.
6. **Repo visibility:** `quint-ia-report-generator` is public; methodology is exposed.
7. **PDF renderer choice:** headless Chromium on Vercel vs. a hosted HTML→PDF API.
8. **Directory data source:** blocks Checker 3 and half the mid-tier report.

---

## Cross-tier rules (easy to lose track of)

- **Paid Blueprint names competitors directly** with performance data. **Public IVIA
  content anonymizes.** This is a deliberate tier difference, not a bug — do not
  "fix" either side to match the other.
- **Never expose "llms.txt"** in user-facing copy. Always "archivo de puente de
  comunicación con motores de búsqueda de IA".
- **Mid-tier shows 2 pillars, qualitative, no numbers.** The paid Blueprint shows all
  4 with numbers.
- **Never publish individual scores** — the prospect's own or any named competitor's.
- **The 50-company threshold is a hard gate** on aggregate claims. No rounding up.
