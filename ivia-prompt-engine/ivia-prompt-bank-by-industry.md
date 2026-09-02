# AI-Visibility Prompt Bank — by Industry Vertical

Source basis: the buyer-intent categories below are adapted from the interrogative-root
taxonomy and vertical failure-mode table in the LatAm/US AEO research doc (the one
credible, structurally useful part of that document). The specific percentage/frequency
claims in that doc are **not** used here — only the category structure and vertical
groupings are.

Purpose: replace single-angle or random prompt generation with a deliberately
diversified set of buyer-intent categories per scan, selected by the client's industry,
so a scan result reflects real citation behavior rather than one narrow query angle.

## Intent categories (used across all verticals, not every category applies to every vertical)

- **A — Category Discovery**: broad "what's the best X" / "what are my options for X" queries.
- **B — Direct Comparison**: "alternative to [named competitor]" / "X vs [named competitor]" queries.
- **C — Vetting & Trust**: credibility, quality, compliance-reputation queries a buyer asks before committing.
- **D — Pricing & Terms**: cost structure, typical pricing model queries.
- **E — Sourcing & Geography**: origin, supply chain, "which country/region for X" queries (mainly physical goods and nearshore services).
- **F — Prerequisites & Compliance**: "what do I need before I can buy/use X" regulatory or procedural queries.
- **G — Diagnostic Narrative**: the buyer describes their own situation/problem and asks for a recommendation, rather than asking a bare category question. Most under-represented category in generic prompt sets; the one real buyers use most on conversational AI systems.
- **H — Location/Provider Discovery**: "where can I find a provider of X that serves [market]."
- **I — Ethics/Sustainability**: only used where genuinely relevant to the category (food, apparel, sourcing-sensitive goods). Never force this into a vertical where it isn't a real buyer concern.

Placeholders: `[CATEGORY]` = the client's product/service category in a buyer's own words
(not the company name). `[COMPETITOR_1]`, `[COMPETITOR_2]` = client-confirmed named
competitors only, never invented. `[BUYER_CONTEXT]` = a short buyer situation
description, generated from the client's own stated ICP/site copy, not a generic
fabricated persona. `[BUSINESS_SIZE]`, `[ORIGIN_COUNTRY]`, `[MARKET]` fill from client
intake data.

## 1. B2B SaaS & Enterprise Software

- A: "What are the best [CATEGORY] tools for [BUSINESS_SIZE] companies?"
- A: "What [CATEGORY] platforms do B2B companies rely on right now?"
- B: "What's a good alternative to [COMPETITOR_1] for [CATEGORY]?"
- C: "Which [CATEGORY] vendors have strong security or compliance credentials for enterprise buyers?"
- D: "What's the typical pricing model for [CATEGORY] software for a [BUSINESS_SIZE]-person team?"
- F: "What should a company outside the US check before buying [CATEGORY] software from an international vendor?"
- G: "My company is [BUYER_CONTEXT] and we're struggling with [CORE_PROBLEM]. What tools or vendors should we look at?"

## 2. Professional Services & Nearshore Tech

- A: "What are the best nearshore [CATEGORY] agencies for US companies?"
- C: "How should a US company vet a nearshore [CATEGORY] provider from Latin America?"
- D: "What's the average rate for nearshore [CATEGORY] services from Latin America?"
- E: "Which countries in Latin America are strongest for outsourcing [CATEGORY] work?"
- F: "What should a US company know before contracting a nearshore [CATEGORY] team (IP, contracts, taxes)?"
- G: "I run a US company and I'm having trouble finding a reliable [CATEGORY] partner. What are my options?"

## 3. E-commerce & DTC

- A: "What are the best [CATEGORY] brands to buy online?"
- B: "Is [COMPETITOR_1] a good [CATEGORY] brand, or are there better options?"
- E: "Where does [CATEGORY] typically come from, and which brands source it well?"
- C: "Which [CATEGORY] sellers on Amazon US are legitimate and well-reviewed?"
- I: "Which [CATEGORY] brands are sustainably or ethically sourced?" (only if sourcing ethics is a real buyer concern for this category)
- D: "What's a fair price range for [CATEGORY] sold online in the US?"

## 4. Manufacturing & Industrial Goods

- A: "Who are the top suppliers of [CATEGORY] for US manufacturers?"
- C: "How does a US buyer vet a [CATEGORY] supplier from Latin America for quality and compliance?"
- F: "What certifications does a [CATEGORY] exporter need to sell into the US?"
- D: "What's the typical cost structure for importing [CATEGORY] from Latin America?"
- G: "We manufacture [CATEGORY] in [ORIGIN_COUNTRY] and want to sell to US buyers. What do we need to do first?"

## 5. Fintech & Cross-Border Financial Services

- A: "What are the best [CATEGORY] platforms for cross-border payments?"
- F: "What licenses does a [CATEGORY] provider need to operate legally in the US?"
- C: "Which [CATEGORY] providers are compliant with US financial regulations?"
- G: "My company needs to move money between Latin America and the US. What [CATEGORY] options are safe and compliant?"

## 6. Healthtech & Digital Health

- A: "What are the best [CATEGORY] platforms for US healthcare providers?"
- F: "What does a [CATEGORY] vendor need for HIPAA compliance?"
- C: "Which [CATEGORY] vendors have verified HIPAA or FDA compliance?"
- G: "We built a [CATEGORY] product outside the US and want to sell to US hospitals or clinics. What do we need first?"

## 7. EdTech & Digital Learning

- A: "What are the best [CATEGORY] platforms for US learners?"
- D: "What's a typical subscription price for [CATEGORY] platforms in the US?"
- C: "Which [CATEGORY] platforms are trusted by US schools or professionals?"
- G: "I run an online [CATEGORY] platform outside the US and want to reach US students. What should I focus on?"

## 8. Specialty Food & Agribusiness

- A: "What are the best sources for [CATEGORY] in the US?"
- E: "Where is the best [CATEGORY] sourced from, and which importers carry it?"
- I: "Which [CATEGORY] brands are sustainably or ethically sourced?"
- F: "What FDA or USDA requirements apply to importing [CATEGORY] into the US?"
- C: "Which [CATEGORY] distributors in the US are reliable for quality and consistency?"

## General / Fallback (industry doesn't match any of the 8 above)

- A: "What are the best options for [CATEGORY] for [BUSINESS_SIZE] businesses?"
- B: "What's a good alternative to [COMPETITOR_1] for [CATEGORY]?"
- G: "My business needs [CATEGORY] and I'm not sure which provider to choose. What should I consider?"
- H: "Where can I find a reliable [CATEGORY] provider that serves [MARKET]?"

Use the closest-matching vertical's categories alongside the fallback set when a
client's industry is adjacent to but not identical to one of the 8 (e.g. a
conversational-AI SaaS tool uses vertical 1 primarily, fallback secondarily), rather
than relying on fallback alone.

## Selection and diversification rules

1. No more than 2 prompts from the same intent category per scan. This is the direct
   fix for the clustering bug (three "sustainable coffee" variants counted as three
   data points when they were really one angle).
2. Category Discovery (A) + Direct Comparison (B) combined must not exceed 3 of the
   total prompts in a scan. These are the two categories current generic prompt sets
   over-rely on.
3. Always include at least 1 Diagnostic Narrative (G) prompt when the vertical has one
   defined. It's the category real buyers use most on conversational AI systems and the
   one most under-represented in generic prompt generation.
4. `[COMPETITOR_1]` / `[COMPETITOR_2]` fill only from client-confirmed named
   competitors. Never invent a competitor name to fill a template.
5. `[BUYER_CONTEXT]` is generated from the client's own site copy or intake answers,
   not a generic fabricated persona — an unrealistic buyer description produces an
   unrealistic query, which produces a misleading result.
6. All prompts run in English for a US-market scan, regardless of the client's
   home-market language (already-established rule, carried forward here).
7. If a category doesn't genuinely apply to the client (e.g. Ethics/Sustainability for
   a B2B SaaS tool), skip it rather than forcing a template to fit — a forced-fit
   prompt produces a low-signal result.
