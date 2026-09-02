/**
 * IVIA prompt bank data: intent categories + 8 named verticals + general fallback.
 * Transcribed verbatim (templates and rules only — no citation-count/frequency
 * statistics from the source research doc are reproduced here) from
 * ivia-prompt-bank-by-industry.md.
 */

'use strict';

const CATEGORIES = Object.freeze({
  A: 'Category Discovery',
  B: 'Direct Comparison',
  C: 'Vetting & Trust',
  D: 'Pricing & Terms',
  E: 'Sourcing & Geography',
  F: 'Prerequisites & Compliance',
  G: 'Diagnostic Narrative',
  H: 'Location/Provider Discovery',
  I: 'Ethics/Sustainability',
});

/**
 * Each vertical is a list of { category, template } entries, in the same
 * order and wording as the reference file.
 */
const VERTICALS = {
  b2b_saas: {
    label: 'B2B SaaS & Enterprise Software',
    templates: [
      { category: 'A', template: 'What are the best [CATEGORY] tools for [BUSINESS_SIZE] companies?' },
      { category: 'A', template: 'What [CATEGORY] platforms do B2B companies rely on right now?' },
      { category: 'B', template: "What's a good alternative to [COMPETITOR_1] for [CATEGORY]?" },
      { category: 'C', template: 'Which [CATEGORY] vendors have strong security or compliance credentials for enterprise buyers?' },
      { category: 'D', template: "What's the typical pricing model for [CATEGORY] software for a [BUSINESS_SIZE]-person team?" },
      { category: 'F', template: 'What should a company outside the US check before buying [CATEGORY] software from an international vendor?' },
      { category: 'G', template: 'My company is [BUYER_CONTEXT] and we\'re struggling with [CORE_PROBLEM]. What tools or vendors should we look at?' },
    ],
  },
  nearshore_services: {
    label: 'Professional Services & Nearshore Tech',
    templates: [
      { category: 'A', template: 'What are the best nearshore [CATEGORY] agencies for US companies?' },
      { category: 'C', template: 'How should a US company vet a nearshore [CATEGORY] provider from Latin America?' },
      { category: 'D', template: 'What\'s the average rate for nearshore [CATEGORY] services from Latin America?' },
      { category: 'E', template: 'Which countries in Latin America are strongest for outsourcing [CATEGORY] work?' },
      { category: 'F', template: 'What should a US company know before contracting a nearshore [CATEGORY] team (IP, contracts, taxes)?' },
      { category: 'G', template: "I run a US company and I'm having trouble finding a reliable [CATEGORY] partner. What are my options?" },
    ],
  },
  ecommerce_dtc: {
    label: 'E-commerce & DTC',
    templates: [
      { category: 'A', template: 'What are the best [CATEGORY] brands to buy online?' },
      { category: 'B', template: 'Is [COMPETITOR_1] a good [CATEGORY] brand, or are there better options?' },
      { category: 'E', template: 'Where does [CATEGORY] typically come from, and which brands source it well?' },
      { category: 'C', template: 'Which [CATEGORY] sellers on Amazon US are legitimate and well-reviewed?' },
      { category: 'I', template: 'Which [CATEGORY] brands are sustainably or ethically sourced?', conditional: 'sourcing_ethics_relevant' },
      { category: 'D', template: "What's a fair price range for [CATEGORY] sold online in the US?" },
    ],
  },
  manufacturing_industrial: {
    label: 'Manufacturing & Industrial Goods',
    templates: [
      { category: 'A', template: 'Who are the top suppliers of [CATEGORY] for US manufacturers?' },
      { category: 'C', template: 'How does a US buyer vet a [CATEGORY] supplier from Latin America for quality and compliance?' },
      { category: 'F', template: 'What certifications does a [CATEGORY] exporter need to sell into the US?' },
      { category: 'D', template: 'What\'s the typical cost structure for importing [CATEGORY] from Latin America?' },
      { category: 'G', template: 'We manufacture [CATEGORY] in [ORIGIN_COUNTRY] and want to sell to US buyers. What do we need to do first?' },
    ],
  },
  fintech_crossborder: {
    label: 'Fintech & Cross-Border Financial Services',
    templates: [
      { category: 'A', template: 'What are the best [CATEGORY] platforms for cross-border payments?' },
      { category: 'F', template: 'What licenses does a [CATEGORY] provider need to operate legally in the US?' },
      { category: 'C', template: 'Which [CATEGORY] providers are compliant with US financial regulations?' },
      { category: 'G', template: 'My company needs to move money between Latin America and the US. What [CATEGORY] options are safe and compliant?' },
    ],
  },
  healthtech: {
    label: 'Healthtech & Digital Health',
    templates: [
      { category: 'A', template: 'What are the best [CATEGORY] platforms for US healthcare providers?' },
      { category: 'F', template: 'What does a [CATEGORY] vendor need for HIPAA compliance?' },
      { category: 'C', template: 'Which [CATEGORY] vendors have verified HIPAA or FDA compliance?' },
      { category: 'G', template: 'We built a [CATEGORY] product outside the US and want to sell to US hospitals or clinics. What do we need first?' },
    ],
  },
  edtech: {
    label: 'EdTech & Digital Learning',
    templates: [
      { category: 'A', template: 'What are the best [CATEGORY] platforms for US learners?' },
      { category: 'D', template: "What's a typical subscription price for [CATEGORY] platforms in the US?" },
      { category: 'C', template: 'Which [CATEGORY] platforms are trusted by US schools or professionals?' },
      { category: 'G', template: 'I run an online [CATEGORY] platform outside the US and want to reach US students. What should I focus on?' },
    ],
  },
  specialty_food_agribusiness: {
    label: 'Specialty Food & Agribusiness',
    templates: [
      { category: 'A', template: 'What are the best sources for [CATEGORY] in the US?' },
      { category: 'E', template: 'Where is the best [CATEGORY] sourced from, and which importers carry it?' },
      { category: 'I', template: 'Which [CATEGORY] brands are sustainably or ethically sourced?' },
      { category: 'F', template: 'What FDA or USDA requirements apply to importing [CATEGORY] into the US?' },
      { category: 'C', template: 'Which [CATEGORY] distributors in the US are reliable for quality and consistency?' },
    ],
  },
};

const FALLBACK_TEMPLATES = [
  { category: 'A', template: 'What are the best options for [CATEGORY] for [BUSINESS_SIZE] businesses?' },
  { category: 'B', template: "What's a good alternative to [COMPETITOR_1] for [CATEGORY]?" },
  { category: 'G', template: "My business needs [CATEGORY] and I'm not sure which provider to choose. What should I consider?" },
  { category: 'H', template: 'Where can I find a reliable [CATEGORY] provider that serves [MARKET]?' },
];

module.exports = { CATEGORIES, VERTICALS, FALLBACK_TEMPLATES };
