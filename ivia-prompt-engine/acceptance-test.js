'use strict';

const { selectPrompts } = require('./select-prompts');

const clearpathCoffee = {
  industry: 'specialty food',
  category: 'single-origin specialty coffee',
  confirmedCompetitors: ['Counter Culture Coffee', 'Stumptown Coffee'],
  buyerContext: 'a specialty coffee roaster/retailer sourcing traceable, direct-trade beans for a US audience that cares about origin and quality',
  businessSize: 'small',
  originCountry: 'Colombia',
  market: 'US',
  sourcingEthicsRelevant: true,
};

const dapta = {
  industry: 'nearshore software development / staff augmentation',
  category: 'software engineering',
  confirmedCompetitors: ['BairesDev'],
  buyerContext: 'a US-based product team that needs to extend engineering capacity without the overhead of direct hiring',
  businessSize: 'mid-market',
  originCountry: 'Colombia',
  market: 'US',
};

function runCheck(name, profile) {
  const result = selectPrompts(profile);
  const categories = result.prompts.map((p) => p.category);
  const distinctCategories = new Set(categories);
  const counts = {};
  categories.forEach((c) => (counts[c] = (counts[c] || 0) + 1));
  const maxCount = Math.max(0, ...Object.values(counts));
  const hasG = categories.includes('G');
  const verticalDefinesG =
    result.vertical.verticalKey &&
    require('./prompt-bank').VERTICALS[result.vertical.verticalKey].templates.some((t) => t.category === 'G');
  const inventedCompetitor = result.prompts.some((p) => {
    const confirmed = profile.confirmedCompetitors || [];
    return (
      (p.template.includes('[COMPETITOR_1]') && !confirmed[0]) ||
      (p.template.includes('[COMPETITOR_2]') && !confirmed[1])
    );
  });

  console.log(`\n=== ${name} ===`);
  console.log('Matched vertical:', result.vertical.label, `(${result.vertical.mode})`);
  console.log('Prompt budget:', result.promptBudget, '| selected:', result.prompts.length);
  result.prompts.forEach((p) => console.log(`  [${p.category}] (${p.source}) ${p.prompt}`));

  console.log('-- Acceptance checks --');
  console.log('>= 4 distinct categories:', distinctCategories.size >= 4, `(${distinctCategories.size})`);
  console.log('no category appears more than twice:', maxCount <= 2, `(max=${maxCount})`);
  console.log(
    'Diagnostic Narrative (G) present if vertical defines one:',
    !verticalDefinesG || hasG,
    `(defines G=${verticalDefinesG}, has G=${hasG})`
  );
  console.log('no invented competitor names:', !inventedCompetitor);
}

runCheck('Clearpath Coffee', clearpathCoffee);
runCheck('Dapta', dapta);
