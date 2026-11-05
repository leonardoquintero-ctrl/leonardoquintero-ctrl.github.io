# IVIA v2: the 7 pillars (website content spec)

**Purpose:** source of truth for rewriting the IVIA pages on aeolatam.com (Framer project `ZQzjTw4DwzASA20kHAsl`). Every fact below matches the scoring code in `quint-ia-blueprint-funnel` (`src/lib/synthesis/ivia.ts`, merged 2026-11-04). If the site and this file disagree, this file wins. If this file and the code disagree, the code wins: fix this file.

**Status as of 2026-11-05:**
- The live IVIA pages still describe the old 5-pillar model.
- Two pillar pages are missing: Message & Language and Search Foundations.
- Several statements on the existing pages are now wrong. See "What's wrong today" under each pillar.

---

## 0. Instructions for the CLI doing the work

1. **Work on a Framer branch.** Do not publish. The owner reviews the branch preview and publishes.
2. **Use the existing page structure.** Every pillar page uses layout template `kCY5aR407` ("Main Layout"), with this section order:
   - hero (H1 + lede)
   - eyebrow + "What the Check Actually Does"
   - body
   - contact form
   - FAQ block (filtered from the **FAQs** CMS collection)
   Reuse the existing components, fonts (Inter, JetBrains Mono) and spacing. Don't redesign.
3. **Pages to edit:**

   | Page | Path | Page id |
   |---|---|---|
   | What Is IVIA | `/what-is-ivia` | `BFE8cB_H9` |
   | Citations | `/ivia-pillar-citations` | `btQ7EgF8d` |
   | AI Bridge | `/ivia-pillar-bridge-file` | `WfdSKC_Sa` |
   | FAQ | `/ivia-pillar-faq` | `wdE2XoU8n` |
   | Trust & Presence | `/ivia-pillar-directories` | `Fyb0ZBHdD` |
   | Comparison | `/ivia-pillar-comparison` | `PVBsg9uFj` |

4. **New pages:** duplicate an existing pillar page (e.g. `/ivia-pillar-faq`) to create:
   - `/ivia-pillar-message-language`
   - `/ivia-pillar-search-foundations`
5. **Renamed pillars:** keep the old URLs working with 308 redirects.
   - `/ivia-pillar-directories` → `/ivia-pillar-trust-presence`
   - `/ivia-pillar-bridge-file` → `/ivia-pillar-ai-bridge`

   Update every internal link: the "What Is IVIA" pillar list, the nav and footer if they list pillars, and the blog.
6. **FAQs live in the `FAQs` collection** (`VAcqUIH92`), filtered by its `Page` enum. Edit the enum options:
   - Rename `IVIA Directories` → `IVIA Trust & Presence`.
   - Rename `IVIA Bridge File` → `IVIA AI Bridge`.
   - Add `IVIA Message & Language` and `IVIA Search Foundations`.

   Replace each pillar's FAQ items with the ones below. Set `Language` correctly: English items on these EN pages; keep the ES items for when ES pages exist. Keep `Order` 1–5.
7. **Each pillar page needs:**
   - the H1 and meta title/description below;
   - the "What it checks" table, rendered as a real table, not an image;
   - "How to improve";
   - the FAQ block;
   - a link back to `/what-is-ivia` and to the free checker (see the IVIA Tools note at the end);
   - a CTA to the $500 Blueprint.
8. **Schema on every pillar page:**
   - `BreadcrumbList`: Home → What Is IVIA → pillar.
   - `FAQPage`: must match the visible FAQ text exactly.
   - `WebPage` with `about` = "IVIA (AI Visibility Index)".
9. **Rules for copy:**
   - Native US English.
   - No guarantees of citations, rankings or traffic. The terms (13.9) say "no guarantee" and the pages must match.
   - No statistics unless they already appear, sourced, on the Knowledge Base page.
   - Never say a check "proves" anything; say "checks" or "looks for".
   - Points describe the score, not results.
10. **Don't touch** pricing, legal pages, or anything mentioning Adeian Digital LLC.

---

## 1. The model (for `/what-is-ivia`)

**One-line definition (EN):** IVIA, the AI Visibility Index (Índice de Visibilidad en IA), is a 0–100 score across seven pillars. It measures whether AI answer engines like ChatGPT and Perplexity name your business when buyers ask, and whether the conditions that lead to that are in place.

**ES:** IVIA (Índice de Visibilidad en IA) es un puntaje de 0 a 100 en siete pilares que mide si los motores de respuesta con IA como ChatGPT y Perplexity nombran tu negocio cuando los compradores preguntan, y si existen las condiciones que lo hacen posible.

### Pillars and weights

| # | Pillar (EN) | Pilar (ES) | Weight | The question it answers |
|---|---|---|---|---|
| 1 | AI Citations | Citas en IA | 25% | Do AI tools name you when buyers ask? |
| 2 | Trust & Presence | Confianza y Presencia | 15% | Can AI confirm you're real without taking your word for it? |
| 3 | Message & Language | Mensaje e Idioma | 15% | Does your website say clearly who you are and what you do? |
| 4 | Search Foundations | Bases de Búsqueda | 15% | Can search engines find you? |
| 5 | AI Bridge | Puente con la IA | 10% | Can AI tools reach and read your website? |
| 6 | FAQ Content | Contenido FAQ | 10% | Do you answer buyer questions directly? |
| 7 | Comparison Content | Contenido Comparativo | 10% | Do you show up when buyers compare options? |

**Outcome vs drivers:** pillar 1 is the outcome. Pillars 2–7 are what drives it.

### How the score is calculated (copy for the "How IVIA Is Calculated" section)

1. Each pillar is a set of yes/no or graded checks worth fixed points. The pillar score = points earned ÷ points possible, on 0–100.
2. **A check that can't be measured is left out, never counted as zero.** Examples:
   - G2 for a company that isn't software;
   - page structure on a site that blocked our crawler;
   - a lookup that failed this time.

   The report labels each one "not counted" with the reason.
3. The IVIA score is the weighted average of the pillars that could be measured. If a pillar couldn't be measured at all, it's left out, and the report says "based on N of 7 pillars".
4. Same inputs, same score. Every check is a fixed rule, with one exception: the Message & Language reading, which uses a fixed checklist and quotes the text behind each answer.

### Claims to remove from the current `/what-is-ivia`

- "five measurable signals", "The Five Pillars", "five independent checks": change all to seven.
- **Meta description,** currently "five testable pillars - crawlability, FAQ content, directories, comparisons, and citations". Replace with: *"IVIA scores your AI visibility from 0 to 100 across seven pillars: AI citations, trust, message, search, AI access, FAQ and comparison content."*
- **Meta title:** keep "What Is IVIA? The AI Visibility Index Explained".

### FAQ for `/what-is-ivia` (`Page = What Is IVIA`)

1. **What does IVIA actually measure?** Seven pillars:
   - whether AI tools name you when buyers ask (AI Citations);
   - whether AI can verify you're real (Trust & Presence);
   - whether your site says clearly what you do (Message & Language);
   - whether Google and Bing find you (Search Foundations);
   - whether AI crawlers can read your site (AI Bridge);
   - whether you answer buyer questions directly (FAQ);
   - whether you publish comparisons (Comparison).

   *ES:* Siete pilares: si las herramientas de IA te nombran (Citas en IA), si la IA puede verificar que existes (Confianza y Presencia), si tu sitio dice claramente qué haces (Mensaje e Idioma), si Google y Bing te encuentran (Bases de Búsqueda), si los rastreadores de IA pueden leer tu sitio (Puente con la IA), si respondes preguntas de compradores (FAQ) y si publicas comparaciones (Comparativo).
2. **How is my IVIA score calculated?** Each pillar is scored 0–100 from fixed checks, then the seven are combined with weights: AI Citations 25%, Trust & Presence, Message & Language and Search Foundations 15% each, and AI Bridge, FAQ and Comparison 10% each. Checks that couldn't be measured are left out rather than counted as zero.
   *ES:* Cada pilar se califica de 0 a 100 con verificaciones fijas y luego se combinan con pesos: Citas en IA 25%; Confianza y Presencia, Mensaje e Idioma y Bases de Búsqueda 15% cada uno; Puente con la IA, FAQ y Comparativo 10% cada uno. Lo que no se pudo medir se excluye en lugar de contarse como cero.
3. **Why does IVIA check more than AI citations?** AI answers change from week to week. Citations tell you where you stand today. The other six pillars tell you why, and what to fix so citations become more likely and more stable.
   *ES:* Las respuestas de la IA cambian cada semana. Las citas muestran dónde estás hoy; los otros seis pilares explican por qué y qué corregir para que las citas sean más probables y estables.
4. **What does "not counted" mean in my report?** That check didn't apply to you or couldn't run this time, so it was left out of the math instead of scored as a fail. G2 for a non-software company is an example.
   *ES:* Esa verificación no aplica a tu caso o no se pudo ejecutar esta vez, así que se excluyó del cálculo en lugar de contarse como fallo (por ejemplo, G2 para una empresa que no es de software).
5. **Does a higher IVIA score guarantee AI citations?** No. IVIA measures the conditions AI engines rely on, and whether you're named today. No one controls what an AI engine answers, so we don't guarantee citations.
   *ES:* No. IVIA mide las condiciones en las que se apoyan los motores de IA y si te nombran hoy. Nadie controla lo que responde un motor de IA, así que no garantizamos citas.

---

## 2. Pillar pages

Each pillar below gives:
- H1 and lede;
- what it checks (with points);
- when a check is not counted;
- how to improve;
- what's wrong on the current page;
- meta title and description;
- FAQs in EN and ES.

The points are the exact values in the code.

### 2.1 AI Citations: `/ivia-pillar-citations` (25%)

**H1:** How the AI Citations Pillar Works

**Lede:** This is the only pillar that measures the outcome itself. We ask AI engines the questions your buyers ask and count how often they name you or cite your website. The other six pillars measure what drives it.

**What it checks**

| Check | Points | How it's measured |
|---|---|---|
| Tests where AI named you or cited your site | 100 | 10 buyer-intent questions (your own plus ones from our prompt library) run live. The score is the % of answered tests in **ChatGPT and Perplexity** where your company name appears in the answer or your site is among the cited sources. |

**Notes for the page:**
- **Engines.** Claude and Gemini also run, and their answers appear in the full report, but they don't count toward the score. The scored engines are the two whose answers can be checked against cited sources consistently.
- **Failed tests.** A test where the engine errored or returned nothing is left out of the denominator, not counted as "not named".
- **Not counted:** if no scored test returned an answer at all, the pillar is left out and the report says so.
- **Natural variation:** AI answers vary run to run. Treat one scan as a snapshot and the trend across scans as the signal.

**How to improve:** this pillar moves when the other six do. There is no direct fix: improve Trust & Presence, Message & Language, Search Foundations and AI Bridge first.

**What's wrong today:**
- Says it "records whether your domain appears". It now counts **name or citation**.
- Says "the other four pillars". Change to six.

**Meta title:** How the AI Citations Pillar Works | IVIA
**Meta description:** This IVIA pillar asks ChatGPT and Perplexity your buyers' real questions and measures how often they name you or cite your site.

**FAQ (`Page = IVIA Citations`)**

1. **Why might I appear in one engine and not another?** Each engine searches and weighs sources differently. ChatGPT's search leans on Bing's index, and Perplexity runs its own retrieval. A gap between engines usually points to an indexing or trust issue on one side.
   *ES:* Cada motor busca y pondera fuentes de forma distinta: la búsqueda de ChatGPT se apoya en el índice de Bing y Perplexity usa su propia recuperación. Una diferencia entre motores suele indicar un problema de indexación o de confianza en uno de ellos.
2. **How many questions are tested?** 10 buyer-intent questions, each run on four engines: ChatGPT, Perplexity, Claude and Gemini. ChatGPT and Perplexity are the two that count toward the score.
   *ES:* 10 preguntas de intención de compra, cada una en cuatro motores (ChatGPT, Perplexity, Claude y Gemini). ChatGPT y Perplexity son los que cuentan para el puntaje.
3. **What counts as "named or cited"?** Your company name appears in the answer text, or your website is one of the sources the engine cites. Either one counts.
   *ES:* Que el nombre de tu empresa aparezca en la respuesta o que tu sitio sea una de las fuentes citadas. Cualquiera de las dos cuenta.
4. **What if an engine fails during the test?** That test is left out of the calculation, so a technical error is never scored as "not named".
   *ES:* Esa prueba se excluye del cálculo, así que un error técnico nunca se cuenta como "no te nombró".
5. **How often do these results change?** AI engines update constantly, so a single scan is a snapshot. Retainer clients get repeat scans: monthly on Foundation, every two weeks on Momentum and Citation Engine. Those show the trend.
   *ES:* Los motores de IA se actualizan constantemente, así que un escaneo es una foto del momento. Los clientes con retainer reciben escaneos repetidos (mensual en Foundation, cada dos semanas en Momentum y Citation Engine) que muestran la tendencia.

### 2.2 Trust & Presence: `/ivia-pillar-trust-presence` (15%; was "Directory Presence")

**H1:** How the Trust & Presence Pillar Works

**Lede:** AI trusts a business more when it can verify it somewhere other than its own website. This pillar checks the profiles that fit your type of business, and the public signals a US buyer's vendor review would check before trusting your domain.

**What it checks**

| Check | Points | Applies to | How it's measured |
|---|---|---|---|
| LinkedIn company page | 20 | everyone | web search for a matching company page |
| Crunchbase profile | 20 | everyone | web search for a matching profile |
| G2 listing | 20 | **software companies only** | web search |
| Capterra listing | 20 | **software companies only** | web search |
| Clutch profile | 20 | **agencies and service firms** (not software) | web search |
| YouTube channel | 20 | everyone | YouTube API (not counted when unavailable) |
| Google Business Profile | 20 | **businesses with a storefront or local service area** | Google listing lookup; review count shown |
| Secure site (HTTPS, enforced) | 10 | everyone | HTTPS 6 + HSTS header 4 |
| Email protected against spoofing | 10 | everyone | SPF record 4 + DMARC 6 (DMARC set to `p=none` gets 3) |
| Established domain | 10 | everyone | registration date (RDAP): 3+ years 10, 1–3 years 5, under 1 year 0 |
| Privacy, terms and contact pages linked | 10 | everyone | from the homepage: privacy 4, terms 3, contact 3 |

**Not counted:**
- **"Doesn't apply to you":** a directory that doesn't fit your business type.
- **"Not checked in this scan":** the search or API isn't available.
- **"Couldn't complete":** a DNS or registry lookup failed.
- **Legal pages:** skipped when the homepage couldn't be read.

**How to improve:**
- Claim LinkedIn and Crunchbase. Use the same name, website and one-line description everywhere.
- Ask 3–5 clients for reviews on the platform that fits your business: G2/Capterra for software, Clutch for services, Google for local.
- Redirect http to https and turn on HSTS. In Cloudflare: SSL/TLS → Edge Certificates.
- Publish SPF and a DMARC record. Start at `p=none` and move to `p=quarantine` once reports are clean.
- Link privacy, terms and contact pages from the footer.

**What's wrong today:**
- Says G2 and Capterra are checked for every business. They're now software-only.
- No mention of Clutch, YouTube, Google Business Profile or domain legitimacy.
- The name "Directory Presence" is too narrow.

**Meta title:** How the Trust & Presence Pillar Works | IVIA
**Meta description:** This IVIA pillar checks whether AI can verify your business outside your own site: the right directories for your industry, reviews, and domain trust signals.

**FAQ (`Page = IVIA Trust & Presence`)**

1. **Why would an AI engine care about Crunchbase, Clutch or G2?** They're independent sources that confirm you exist, what you do and who you serve. AI engines weigh what other sites say about you, not just what you say about yourself.
   *ES:* Son fuentes independientes que confirman que existes, qué haces y a quién sirves. Los motores de IA valoran lo que otros sitios dicen de ti, no solo lo que tú dices.
2. **Do I need to be on every platform?** No. We only score the platforms that fit your business: G2 and Capterra for software, Clutch for agencies and service firms, Google Business Profile for local businesses. The rest are left out of your score.
   *ES:* No. Solo puntuamos las plataformas que corresponden a tu negocio: G2 y Capterra para software, Clutch para agencias y firmas de servicios, Perfil de Empresa en Google para negocios locales. Las demás no cuentan.
3. **What do HTTPS, SPF and DMARC have to do with AI?** They're the public signals a buyer's IT team, an email provider or a search engine checks before trusting a domain. A business that skips them looks less established, to people and to machines.
   *ES:* Son las señales públicas que revisan el equipo de TI de un comprador, un proveedor de correo o un buscador antes de confiar en un dominio. Un negocio que no las tiene parece menos establecido, para personas y para máquinas.
4. **My domain is new. Am I penalized forever?** Domain age is 10 points out of this pillar's total, and it improves on its own. You can make up for it with profiles, reviews and links from established sites.
   *ES:* La antigüedad del dominio vale 10 puntos de este pilar y mejora sola con el tiempo. Puedes compensarlo con perfiles, reseñas y enlaces desde sitios establecidos.
5. **Does this replace a good website?** No. It complements it. A strong site with no outside confirmation still has a credibility gap for AI.
   *ES:* No, lo complementa. Un buen sitio sin confirmación externa sigue teniendo una brecha de credibilidad ante la IA.

### 2.3 Message & Language: `/ivia-pillar-message-language` (15%, NEW)

**H1:** How the Message & Language Pillar Works

**Lede:** AI repeats what it can understand. This pillar checks whether your homepage and About page say clearly who you serve, what problem you solve, how, why you, and what proves it. It also checks whether the English reads as written for a US buyer.

**What it checks**

| Check | Points | How it's measured |
|---|---|---|
| Says who it's for, the problem, the solution, why you, and proof | 30 | Claude reads your homepage and About text against a fixed checklist: audience, problem, solution, differentiator, proof. Each is worth 6 points and passes only when the text itself clearly says it. The quote behind each answer is recorded. |
| English reads as native, not translated | 20 | native US English 20; English that reads as translated 8; no English version 0. Up to 5 flagged sentences come with suggested rewrites. |
| Ready for US buyers | 10 | USD pricing (or "pricing on request"), contact reachable from the US, US date/number formats |
| Homepage gets to the point in the first sentence | 10 | the first text block answers "what is this?" directly |
| About page | 10 | page found on the site |
| Team page | 10 | page found on the site |
| Named authors on content | 10 | author bylines found |

**Not counted:**
- "Site unreadable" when we couldn't read the homepage.
- "Couldn't complete" when the reading itself failed. It's never scored as a fail.

**How to improve:**
- Rewrite the first screen as five plain sentences: who it's for and their problem, what you do, how, why you, and one proof point. The proof point can be a named client, a number or years in business.
- Have a native US English editor review the homepage, About and service pages.
- Show prices in USD and add a US-reachable phone or WhatsApp number.
- Publish About and Team pages with real names and roles, and put author names on articles.

**Meta title:** How the Message & Language Pillar Works | IVIA
**Meta description:** This IVIA pillar checks whether your site says clearly who you serve, what you solve and why you, in English that reads as native to US buyers.

**FAQ (`Page = IVIA Message & Language`)**

1. **Why does the wording on my homepage affect AI answers?** AI engines describe you using your own words. If the homepage doesn't say who you serve and what you solve, the AI has nothing specific to repeat, so it recommends someone whose site does.
   *ES:* Los motores de IA te describen con tus propias palabras. Si tu página principal no dice a quién sirves y qué resuelves, la IA no tiene nada concreto que repetir y recomienda a quien sí lo dice.
2. **How do you judge "clear" without it being subjective?** Every site is graded against the same five-item checklist, and an item passes only when the text says it outright. Each pass or fail comes with the exact quote from your site, so you can check our reading.
   *ES:* Con la misma lista de cinco puntos para todos los sitios; un punto pasa solo si el texto lo dice explícitamente. Cada resultado incluye la cita exacta de tu sitio para que puedas verificar nuestra lectura.
3. **My site is in Spanish. Is that a problem?** For US buyers, yes: with no English version, the native-English check scores 0. Keep your Spanish site for LatAm and add English pages written for US buyers, not translated.
   *ES:* Para compradores de EE. UU., sí: sin versión en inglés, la verificación de inglés nativo vale 0. Mantén tu sitio en español para LatAm y agrega páginas en inglés escritas para compradores de EE. UU., no traducidas.
4. **What makes English sound "translated"?** Spanish word order, literal translations, false friends ("actually" used for "actualmente") and stray Spanish fragments. The report flags up to five sentences and suggests natural rewrites.
   *ES:* Orden de palabras del español, traducciones literales, falsos amigos ("actually" por "actualmente") y fragmentos en español. El reporte señala hasta cinco frases y sugiere reescrituras naturales.
5. **Which pages do you read?** Your homepage and your About page. Those are the pages AI engines lean on most to describe a company.
   *ES:* Tu página principal y tu página de Nosotros, las que más usan los motores de IA para describir una empresa.

### 2.4 Search Foundations: `/ivia-pillar-search-foundations` (15%, NEW)

**H1:** How the Search Foundations Pillar Works

**Lede:** AI search tools look things up in Google's and Bing's indexes. If a search for your own company name doesn't bring up your site, AI starts behind before anything else is considered.

**What it checks**

| Check | Points | How it's measured |
|---|---|---|
| Found on Google for your name | 20 | live Google search for your company name (US, English, top 20 results) |
| Found on Bing for your name | 20 | same, on Bing. ChatGPT's search leans heavily on Bing. |
| Pages with a title, description and main heading | 15 | share of checked pages that have all three |
| No broken pages | 15 | 15 minus 3 per broken page (404/5xx) among the pages checked |
| Page speed | 15 | Google PageSpeed score (not counted when not configured) |
| Other sites linking to you | 15 | referring domains: 100+ 15, 30+ 10, 10+ 5, fewer 0 |

**Not counted:**
- **"Not checked in this scan":** the search data or PageSpeed isn't configured.
- **"Site unreadable":** page basics and broken pages, when the site couldn't be read.

**How to improve:**
- Verify the site in Google Search Console and Bing Webmaster Tools. Bing can import from Search Console. Submit the sitemap to both.
- Turn on IndexNow. In Cloudflare: Caching → Crawler Hints.
- Make the company name the homepage title and H1.
- Fix or 301-redirect broken URLs.
- Compress hero images and defer third-party scripts.
- Earn links from partners, clients, associations and trade media.

**Meta title:** How the Search Foundations Pillar Works | IVIA
**Meta description:** This IVIA pillar checks whether Google and Bing return your site for your own name, plus page basics, broken pages, speed and links from other sites.

**FAQ (`Page = IVIA Search Foundations`)**

1. **Why does Bing matter if my buyers use Google?** Because AI does. ChatGPT's web search leans heavily on Bing's index, so a site Bing can't find is harder for ChatGPT to cite.
   *ES:* Porque la IA sí lo usa. La búsqueda web de ChatGPT se apoya mucho en el índice de Bing, así que un sitio que Bing no encuentra es más difícil de citar para ChatGPT.
2. **Isn't this just SEO?** Partly, and that's the point: AI search sits on top of search indexes. We only score the basics that decide whether AI can retrieve you at all, not keyword rankings.
   *ES:* En parte, y es intencional: la búsqueda con IA se apoya en los índices de búsqueda. Solo puntuamos lo básico que decide si la IA puede encontrarte, no rankings de palabras clave.
3. **How do I get found for my own name?** Verify the site in Google Search Console and Bing Webmaster Tools, submit your sitemap, and make your company name the homepage title and main heading. A profile on LinkedIn and the right directories also helps.
   *ES:* Verifica el sitio en Google Search Console y Bing Webmaster Tools, envía tu mapa del sitio y usa el nombre de tu empresa como título y encabezado principal de la página de inicio. Tener perfiles en LinkedIn y en los directorios adecuados también ayuda.
4. **What counts as a broken page?** A page on your site that returns "not found" or a server error.
   *ES:* Una página de tu sitio que responde "no encontrada" o un error del servidor.
5. **How many links do I need?** There's no magic number. The score steps up at 10, 30 and 100 referring domains. Quality and relevance matter more than volume.
   *ES:* No hay un número mágico; el puntaje sube en 10, 30 y 100 dominios de referencia. Importan más la calidad y la relevancia que el volumen.

### 2.5 AI Bridge: `/ivia-pillar-ai-bridge` (10%; was "AI Bridge File")

**H1:** How the AI Bridge Pillar Works

**Lede:** Before an AI can recommend you, it has to get in and read your pages. This pillar checks that:
- AI crawlers aren't blocked;
- your text is readable without JavaScript;
- the site identifies your company in a way machines understand.

**What it checks**

| Check | Points | How it's measured |
|---|---|---|
| AI search crawlers allowed | 25 | robots.txt checked for the bots that fetch pages for live AI answers: OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Bingbot. Points are proportional to how many are allowed. No robots.txt = nothing blocked = full points. |
| Site opens for automated visitors | 15 | our crawler gets the homepage. If a normal browser gets in but our crawler doesn't, bot protection is likely blocking AI crawlers too. |
| Text readable without JavaScript | 15 | at least 50 words of homepage text in the raw HTML |
| Company identified in structured data, linked to its profiles | 15 | Organization schema present 10, plus `sameAs` links to profiles 5 |
| llms.txt file | 10 | a valid `/llms.txt` |
| Sitemap | 10 | a sitemap was found |
| Page language declared | 10 | `<html lang>` set (hreflang shown as detail) |

**Training crawlers:** GPTBot, ClaudeBot and Google-Extended collect training data, which is a separate business decision. They're shown in the report but **don't affect the score**.

**A blocked site is measured, with an explanation.** The report says why the crawl failed: blocked for everyone, blocks automated visitors, JavaScript-only, unreachable, or HTTP error. Checks that depend on reading the site are "not counted", not zero.

**How to improve:**
- Allow the AI search crawlers in robots.txt.
- Make sure Cloudflare "Block AI bots" / Bot Fight Mode isn't overriding robots.txt.
- Server-render the main pages.
- Add Organization JSON-LD with `sameAs` links to LinkedIn, Crunchbase and your directory profiles.
- Publish `/llms.txt` and a sitemap.
- Set `<html lang="en">` (and `es` on Spanish pages, with hreflang between them).

**What's wrong today:**
- The page treats the "bridge file" as one file that "tells AI crawlers what they're allowed to read". That conflates llms.txt (a site map for AI) with robots.txt (access rules).
- Says "a missing file and a fetch failure are treated the same way". Now a failed read is "not counted" and the crawl failure is explained.
- Only covers one of the seven checks.

**Meta title:** How the AI Bridge Pillar Works | IVIA
**Meta description:** This IVIA pillar checks whether AI crawlers can reach and read your site: robots.txt access, bot protection, JavaScript, structured data, llms.txt and sitemap.

**FAQ (`Page = IVIA AI Bridge`)**

1. **What's the difference between robots.txt and llms.txt?** robots.txt tells crawlers what they may access. llms.txt is a plain-text map of your most important pages for AI tools. We check both, but blocked crawlers matter far more: a blocked crawler can't read anything.
   *ES:* robots.txt indica a los rastreadores a qué pueden acceder; llms.txt es un mapa en texto plano de tus páginas más importantes para herramientas de IA. Revisamos ambos, pero un rastreador bloqueado importa mucho más: no puede leer nada.
2. **Should I block GPTBot or ClaudeBot?** That's a business decision about training data, and it doesn't affect your score. What matters for appearing in answers is not blocking the search crawlers: OAI-SearchBot, Claude-SearchBot, PerplexityBot, Bingbot and the user-triggered bots.
   *ES:* Es una decisión de negocio sobre datos de entrenamiento y no afecta tu puntaje. Para aparecer en respuestas, lo importante es no bloquear a los rastreadores de búsqueda (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Bingbot y los bots activados por usuarios).
3. **My site works in a browser. Why does the report say it blocks automated visitors?** Bot protection, such as a Cloudflare setting or a firewall, can let people in and turn crawlers away. AI crawlers are usually turned away too, so the AI can't read what your visitors see.
   *ES:* La protección contra bots (una configuración de Cloudflare o un firewall) puede dejar entrar a personas y rechazar rastreadores. Los rastreadores de IA suelen ser rechazados también, así que la IA no puede leer lo que ven tus visitantes.
4. **Why does JavaScript matter?** Many AI crawlers read the raw HTML and don't run JavaScript. If your text only appears after scripts run, they see an almost empty page.
   *ES:* Muchos rastreadores de IA leen el HTML sin ejecutar JavaScript. Si tu texto solo aparece después de que corren los scripts, ven una página casi vacía.
5. **Does the checker fix this automatically?** No. It shows what's blocked or missing. The Blueprint includes ready-to-paste robots.txt rules, Organization schema and an llms.txt draft for your site.
   *ES:* No. Muestra qué está bloqueado o falta. El Blueprint incluye reglas de robots.txt, esquema de Organización y un borrador de llms.txt listos para tu sitio.

### 2.6 FAQ Content: `/ivia-pillar-faq` (10%)

**H1:** How the FAQ Content Pillar Works

**Lede:** AI answers quote clear question-and-answer content far more readily than long paragraphs. This pillar checks for question-and-answer blocks, an FAQ page, and FAQ markup machines can read.

**What it checks**

| Check | Points | How it's measured |
|---|---|---|
| Question-and-answer blocks | 40 | Q&A-shaped blocks found on the pages checked |
| FAQ page | 40 | a dedicated FAQ page found |
| FAQ page marked up for machines | 20 | FAQPage structured data on the FAQ page (only checked when an FAQ page exists) |

**Not counted:**
- **"Doesn't apply":** FAQ markup when there's no FAQ page yet.
- **"Site unreadable":** Q&A blocks and the FAQ page, when the site couldn't be read.

**How to improve:**
- Answer the questions buyers ask before they decide: price, fit, timelines, location and time zone, how to start. Use their wording, not yours.
- Put 3–5 Q&As on the homepage and each service page, and the full set on `/faq`.
- Lead each answer with a direct one-sentence answer.
- Add FAQPage markup that matches the visible text exactly.

**What's wrong today:**
- Mostly accurate.
- Add the three-check table and the "not counted" rule.
- Update the FAQ answer "Does this checker tell me which questions to prioritize?": the Blueprint now includes a drafted FAQ built from the buyer questions we tested.

**Meta title:** How the FAQ Content Pillar Works | IVIA
**Meta description:** This IVIA pillar checks whether your site answers buyer questions in clear question-and-answer form, on an FAQ page with markup AI engines can read.

**FAQ (`Page = IVIA FAQ Content`)**

1. **Why does question-and-answer format matter so much for AI?** AI engines look for a clear question with a direct answer they can quote. A long paragraph that eventually gets to the point is harder to extract and less likely to be cited.
   *ES:* Los motores de IA buscan una pregunta clara con una respuesta directa que puedan citar. Un párrafo largo que llega al punto al final es más difícil de extraer y menos probable de citar.
2. **Do I need an FAQ page, or are FAQ blocks enough?** Both count: 40 points each. Blocks on service pages answer questions in context; a dedicated page gives engines one place with all of them.
   *ES:* Ambos cuentan, 40 puntos cada uno. Los bloques en páginas de servicio responden en contexto; una página dedicada le da a los motores un solo lugar con todas las respuestas.
3. **What kinds of questions should I answer?** The ones buyers ask before deciding: price, fit, timelines, where you're based and which time zones you cover, and how to get started. Use their wording, not internal jargon.
   *ES:* Las que hacen los compradores antes de decidir: precio, encaje, plazos, dónde estás y qué zonas horarias cubres, y cómo empezar. Usa sus palabras, no jerga interna.
4. **What is FAQ markup?** A small block of structured data (FAQPage schema) that tells machines which text is a question and which is its answer. It must match the visible text word for word.
   *ES:* Un bloque de datos estructurados (esquema FAQPage) que indica a las máquinas qué texto es la pregunta y cuál la respuesta. Debe coincidir palabra por palabra con el texto visible.
5. **Does the Blueprint tell me which questions to write?** Yes. It includes a drafted FAQ built from the buyer questions we tested with AI engines and from your own site's text. Anything we can't confirm is marked for you to fill in.
   *ES:* Sí. Incluye un borrador de preguntas frecuentes basado en las preguntas de compradores que probamos con motores de IA y en el texto de tu sitio; lo que no podemos confirmar queda marcado para que lo completes.

### 2.7 Comparison Content: `/ivia-pillar-comparison` (10%)

**H1:** How the Comparison Content Pillar Works

**Lede:** "X vs Y" and "best option for Z" are among the most common buyer questions, and AI leans on comparison tables to answer them. This pillar checks whether you publish that kind of content.

**What it checks**

| Check | Points | How it's measured |
|---|---|---|
| Comparison tables | 50 | side-by-side comparison tables found on the site |
| Comparison or alternatives page | 50 | a page comparing you with alternatives (e.g. `/compare`, `/alternatives`, "X vs Y") |

**Not counted:** "site unreadable", when the site couldn't be read.

**How to improve:**
- Publish one fair "you vs alternatives" page. Alternatives can be competitors, an in-house team, or a US agency.
- Use a table of real criteria: who it's for, approach, pricing model, location and time zone, languages, support.
- Add short sections: "When we're the right fit", "When another option fits better", "How to decide".
- Balanced pages get quoted. Pure sales pages rarely do.

**What's wrong today:**
- Mostly accurate.
- Add the two-check table.
- Update "Does this checker evaluate the quality…?": it still checks presence, not quality. The Blueprint now includes a comparison page outline against the competitors you named.

**Meta title:** How the Comparison Content Pillar Works | IVIA
**Meta description:** This IVIA pillar checks whether you publish comparison tables and an alternatives page, the content AI engines use for "X vs Y" questions.

**FAQ (`Page = IVIA Comparison`)**

1. **Why does comparison content matter?** Comparison questions carry high buying intent: the person asking is already choosing. If you don't publish a comparison, the AI uses someone else's.
   *ES:* Las preguntas comparativas tienen alta intención de compra: quien pregunta ya está eligiendo. Si no publicas una comparación, la IA usa la de otro.
2. **Do I have to name competitors?** No. You can compare approaches (in-house team vs agency, local vs US provider) or criteria. Naming real alternatives, fairly, tends to be the most useful to buyers.
   *ES:* No. Puedes comparar enfoques (equipo interno vs agencia, proveedor local vs de EE. UU.) o criterios. Nombrar alternativas reales de forma justa suele ser lo más útil para el comprador.
3. **What format works best?** A table with clear criteria in rows and the options in columns, followed by short sections on when each option fits. Tables are easy for AI engines to extract.
   *ES:* Una tabla con criterios claros en filas y las opciones en columnas, seguida de secciones breves sobre cuándo conviene cada opción. Las tablas son fáciles de extraer para los motores de IA.
4. **Won't a comparison page help my competitors?** A fair page that says when another option fits better earns trust from buyers and from AI. A one-sided page reads as an ad and is rarely quoted.
   *ES:* Una página justa que dice cuándo conviene otra opción genera confianza en compradores y en la IA. Una página parcial se lee como anuncio y rara vez se cita.
5. **Does this checker judge the quality of my comparisons?** No. It checks whether comparison tables and an alternatives page exist. The Blueprint includes an outline for one built around the competitors you named.
   *ES:* No. Verifica si existen tablas comparativas y una página de alternativas. El Blueprint incluye un esquema para una, basado en los competidores que nombraste.

---

## 3. IVIA Tools collection (free checkers)

The `IVIA Tools` collection (`ZR0nUa3h8`) has EN and ES checkers named after the old pillars. Update the copy only. Don't change behavior; the tools are separate from the paid scan.

| Old tool | Change |
|---|---|
| AI Bridge File Checker | Rename to "AI Bridge Checker". Description: "Checks whether AI crawlers can reach and read your site." ES: "Verificador de Puente con la IA". |
| Directory Presence Checker | Rename to "Trust & Presence Checker". Description: "Checks the profiles and trust signals AI uses to verify your business." ES: "Verificador de Confianza y Presencia". Its "Crunchbase, G2, and LinkedIn" wording: say G2 applies to software companies. |
| AI Dialect Checker | Stays `noIndex`. It's the Spanish-language counterpart of Message & Language. No change. |
| Message & Language, Search Foundations | No checker yet. Link those pillar pages to the $500 Blueprint instead of a tool. |

---

## 4. Done checklist (for the CLI's final report)

- [ ] `/what-is-ivia` says seven pillars, with the weight table, the "not counted" rule and the new meta description.
- [ ] 7 pillar pages exist, each with H1, lede, check table, not-counted note, how to improve, 5 FAQs, meta title and description.
- [ ] 308 redirects: `/ivia-pillar-directories` → `/ivia-pillar-trust-presence` and `/ivia-pillar-bridge-file` → `/ivia-pillar-ai-bridge`. All internal links updated.
- [ ] `FAQs` collection Page enum updated, and each pillar's EN FAQs replaced.
- [ ] `FAQPage` and `BreadcrumbList` schema on each pillar page; FAQ schema text matches the visible text.
- [ ] No "five pillars", no G2/Capterra-for-everyone, no "guarantee", no new unsourced statistics.
- [ ] Desktop, tablet and phone screenshots of every changed page shared with the owner. Nothing published.
