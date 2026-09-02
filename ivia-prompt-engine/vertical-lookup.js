'use strict';

const { VERTICALS } = require('./prompt-bank');

/**
 * Maps free-text / dropdown industry strings captured at intake to one of
 * the 8 named verticals in the prompt bank. Intake capture format is not
 * confirmed against a real intake system (none exists in this repo), so
 * this accepts a plain string and does reasonably tolerant keyword
 * matching rather than assuming an exact enum value.
 */
const VERTICAL_KEYWORDS = {
  // nearshore_services checked ahead of / weighted above b2b_saas: a phrase
  // like "nearshore software development" is nearshore services first, not
  // generic SaaS, so its keywords must win even though "software" also
  // appears in b2b_saas-flavored text.
  nearshore_services: ['nearshore', 'staff augmentation', 'dev shop', 'outsourc', 'consulting agency', 'professional services'],
  b2b_saas: ['saas', 'enterprise software', 'b2b software', 'software platform', 'software as a service'],
  ecommerce_dtc: ['ecommerce', 'e-commerce', 'dtc', 'direct to consumer', 'online retail', 'online store'],
  manufacturing_industrial: ['manufactur', 'industrial', 'factory', 'supplier', 'export'],
  fintech_crossborder: ['fintech', 'payments', 'cross-border', 'remittance', 'banking'],
  healthtech: ['healthtech', 'health tech', 'digital health', 'telehealth', 'medical'],
  edtech: ['edtech', 'ed tech', 'online learning', 'e-learning', 'education'],
  specialty_food_agribusiness: ['coffee', 'food', 'agribusiness', 'agriculture', 'beverage', 'specialty food'],
};

/**
 * Verticals whose categories should ride along with the fallback set when
 * the client's industry is adjacent-but-not-identical to a named vertical,
 * per the reference file's fallback note (e.g. a conversational-AI SaaS
 * tool -> b2b_saas primary + fallback secondary).
 */
const ADJACENT_VERTICAL_HINTS = {
  b2b_saas: ['ai', 'conversational ai', 'developer tools', 'devtools', 'api'],
};

/**
 * @param {string} industryText - free-text industry as captured at intake.
 * @returns {{ verticalKey: string|null, mode: 'exact'|'adjacent'|'fallback', label: string }}
 */
function lookupVertical(industryText) {
  const text = (industryText || '').toLowerCase();

  for (const [key, keywords] of Object.entries(VERTICAL_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return { verticalKey: key, mode: 'exact', label: VERTICALS[key].label };
    }
  }

  for (const [key, hints] of Object.entries(ADJACENT_VERTICAL_HINTS)) {
    if (hints.some((hint) => text.includes(hint))) {
      return { verticalKey: key, mode: 'adjacent', label: VERTICALS[key].label };
    }
  }

  return { verticalKey: null, mode: 'fallback', label: 'General / Fallback' };
}

module.exports = { lookupVertical, VERTICAL_KEYWORDS };
