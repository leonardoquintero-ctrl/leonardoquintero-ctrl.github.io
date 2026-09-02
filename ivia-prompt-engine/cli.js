#!/usr/bin/env node
'use strict';

/**
 * Blueprint-audit CLI: given a client intake profile (JSON), prints the
 * diversified, industry-selected prompt set for that scan, plus a blank
 * findings worksheet (one row per prompt x engine) for the Blueprint
 * executor to fill in while manually checking ChatGPT / Perplexity /
 * Claude / Google AI Overviews.
 *
 * Usage:
 *   node cli.js path/to/client-profile.json
 *   node cli.js path/to/client-profile.json --budget 8
 */

const fs = require('fs');
const path = require('path');
const { selectPrompts } = require('./select-prompts');

const ENGINES = ['ChatGPT', 'Perplexity', 'Claude', 'Google AI Overviews'];

function parseArgs(argv) {
  const [profilePath, ...rest] = argv;
  if (!profilePath) {
    console.error('Usage: node cli.js <client-profile.json> [--budget N]');
    process.exit(1);
  }
  let promptBudget;
  const budgetFlagIndex = rest.indexOf('--budget');
  if (budgetFlagIndex !== -1) {
    promptBudget = parseInt(rest[budgetFlagIndex + 1], 10);
  }
  return { profilePath, promptBudget };
}

function loadProfile(profilePath) {
  const resolved = path.resolve(profilePath);
  const raw = fs.readFileSync(resolved, 'utf8');
  return JSON.parse(raw);
}

function main() {
  const { profilePath, promptBudget } = parseArgs(process.argv.slice(2));
  const profile = loadProfile(profilePath);
  const result = selectPrompts(profile, promptBudget ? { promptBudget } : {});

  console.log('='.repeat(72));
  console.log(`Blueprint AI-visibility audit — prompt set`);
  console.log('='.repeat(72));
  console.log(`Matched vertical : ${result.vertical.label} (${result.vertical.mode} match)`);
  console.log(`Prompt budget    : ${result.promptBudget}`);
  console.log(`Prompts selected : ${result.prompts.length}`);
  console.log('');

  result.prompts.forEach((p, i) => {
    console.log(`${i + 1}. [${p.category}] ${p.prompt}`);
  });

  console.log('');
  console.log('-'.repeat(72));
  console.log('Findings worksheet — fill in while checking each engine manually');
  console.log('-'.repeat(72));
  console.log('| # | Category | Engine | Cited (Y/N) | Notes |');
  console.log('|---|----------|--------|-------------|-------|');
  result.prompts.forEach((p, i) => {
    ENGINES.forEach((engine) => {
      console.log(`| ${i + 1} | ${p.category} | ${engine} |  |  |`);
    });
  });

  console.log('');
  console.log('Reminder: log category alongside each result so findings can be');
  console.log('rolled up by intent category (e.g. "cited for Direct Comparison but');
  console.log('not for Diagnostic Narrative"), not just a flat citation rate.');
}

main();
