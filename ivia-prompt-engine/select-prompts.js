'use strict';

const { VERTICALS, FALLBACK_TEMPLATES } = require('./prompt-bank');
const { lookupVertical } = require('./vertical-lookup');

/**
 * Scan-wide prompt/engine check budget. Not confirmed against a real scan
 * config (none exists in this repo) — 10 is carried forward from the task
 * description as the assumed existing cap. Wire this to the real config
 * constant once the scanner backend is identified.
 */
const DEFAULT_PROMPT_BUDGET = 10;

const PLACEHOLDER_KEYS = [
  'CATEGORY',
  'COMPETITOR_1',
  'COMPETITOR_2',
  'BUYER_CONTEXT',
  'BUSINESS_SIZE',
  'ORIGIN_COUNTRY',
  'MARKET',
  'CORE_PROBLEM',
];

/**
 * @typedef {Object} ClientProfile
 * @property {string} industry - free-text industry as captured at intake.
 * @property {string} category - client's product/service category in a buyer's own words.
 * @property {string[]} [confirmedCompetitors] - client-confirmed named competitors only. Never auto-filled.
 * @property {string} [buyerContext] - short buyer-situation description derived from the client's own site copy / intake answers.
 * @property {string} [coreProblem]
 * @property {string} [businessSize]
 * @property {string} [originCountry]
 * @property {string} [market]
 * @property {boolean} [sourcingEthicsRelevant] - whether Ethics/Sustainability (I) genuinely applies to this client's category.
 */

/**
 * Fills [PLACEHOLDER] tokens in a template from the client profile.
 * COMPETITOR_1/COMPETITOR_2 are filled only from confirmedCompetitors;
 * if a template needs a competitor slot the client hasn't confirmed, the
 * template is dropped rather than inventing a name (handled by the caller
 * via `requiresUnavailableCompetitor`).
 *
 * @param {string} template
 * @param {ClientProfile} profile
 */
function fillTemplate(template, profile) {
  const competitors = profile.confirmedCompetitors || [];
  const values = {
    CATEGORY: profile.category,
    COMPETITOR_1: competitors[0],
    COMPETITOR_2: competitors[1],
    BUYER_CONTEXT: profile.buyerContext,
    CORE_PROBLEM: profile.coreProblem,
    BUSINESS_SIZE: profile.businessSize,
    ORIGIN_COUNTRY: profile.originCountry,
    MARKET: profile.market,
  };

  let filled = template;
  for (const key of PLACEHOLDER_KEYS) {
    if (filled.includes(`[${key}]`)) {
      filled = filled.split(`[${key}]`).join(values[key] != null ? values[key] : `[${key}]`);
    }
  }
  return filled;
}

function templateRequiresUnavailableCompetitor(entry, profile) {
  const competitors = profile.confirmedCompetitors || [];
  if (entry.template.includes('[COMPETITOR_1]') && !competitors[0]) return true;
  if (entry.template.includes('[COMPETITOR_2]') && !competitors[1]) return true;
  return false;
}

function isConditionallyExcluded(entry, profile) {
  if (entry.conditional === 'sourcing_ethics_relevant' && !profile.sourcingEthicsRelevant) {
    return true;
  }
  return false;
}

/**
 * Builds the candidate template pool for a client: the matched vertical's
 * templates, plus (for adjacent/fallback matches) the general fallback set,
 * minus anything requiring an unconfirmed competitor or a genuinely
 * inapplicable category (rule 7).
 */
function buildCandidatePool(profile) {
  const match = lookupVertical(profile.industry);
  const pool = [];

  if (match.verticalKey) {
    const verticalTemplates = VERTICALS[match.verticalKey].templates.map((t) => ({
      ...t,
      source: match.verticalKey,
    }));
    pool.push(...verticalTemplates);
  }

  if (match.mode !== 'exact') {
    pool.push(...FALLBACK_TEMPLATES.map((t) => ({ ...t, source: 'fallback' })));
  }

  const filtered = pool.filter(
    (entry) => !templateRequiresUnavailableCompetitor(entry, profile) && !isConditionallyExcluded(entry, profile)
  );

  return { match, candidates: filtered };
}

/**
 * Applies the diversification rules from the reference file to pick the
 * final prompt set within the scan budget:
 *  - max 2 prompts per category
 *  - A + B combined capped at 3
 *  - at least 1 Diagnostic Narrative (G) prompt if the vertical defines one
 *  - never force a category that doesn't apply (handled upstream by exclusion)
 *
 * @param {ClientProfile} profile
 * @param {{ promptBudget?: number }} [options]
 */
function selectPrompts(profile, options = {}) {
  const promptBudget = options.promptBudget || DEFAULT_PROMPT_BUDGET;
  const { match, candidates } = buildCandidatePool(profile);

  const selected = [];
  const perCategoryCount = {};
  let abCount = 0;

  const countIfSelected = (entry) => {
    perCategoryCount[entry.category] = (perCategoryCount[entry.category] || 0) + 1;
    if (entry.category === 'A' || entry.category === 'B') abCount += 1;
  };

  const canTake = (entry) => {
    if (selected.length >= promptBudget) return false;
    const currentCount = perCategoryCount[entry.category] || 0;
    if (currentCount >= 2) return false;
    if ((entry.category === 'A' || entry.category === 'B') && abCount >= 3) return false;
    return true;
  };

  const take = (entry) => {
    selected.push(entry);
    countIfSelected(entry);
  };

  // Rule 3: guarantee at least one Diagnostic Narrative (G) prompt first,
  // if the vertical (or fallback pool) defines one.
  const gCandidate = candidates.find((entry) => entry.category === 'G');
  if (gCandidate && canTake(gCandidate)) {
    take(gCandidate);
  }

  // Fill the rest in bank order, respecting the per-category cap and the
  // combined A+B cap, until the budget is exhausted or candidates run out.
  for (const entry of candidates) {
    if (selected.includes(entry)) continue;
    if (!canTake(entry)) continue;
    take(entry);
  }

  const filled = selected.map((entry) => ({
    category: entry.category,
    source: entry.source,
    template: entry.template,
    prompt: fillTemplate(entry.template, profile),
  }));

  return {
    vertical: match,
    promptBudget,
    prompts: filled,
  };
}

module.exports = { selectPrompts, fillTemplate, buildCandidatePool, DEFAULT_PROMPT_BUDGET };
