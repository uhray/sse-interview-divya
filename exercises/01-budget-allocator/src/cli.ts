import { readFileSync } from 'node:fs';
import { approvePlan, draftPlan } from './plan.js';
import { PlanStore } from './store.js';
import type { Campaign } from './types.js';

const campaigns: Campaign[] = JSON.parse(
  readFileSync(new URL('../fixtures/campaigns.json', import.meta.url), 'utf8'),
);

const store = new PlanStore();
for (const campaign of campaigns) store.save(draftPlan(campaign));

const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

for (const campaign of campaigns) {
  const plan = approvePlan(store, campaign);
  console.log(`\n${campaign.name}  (${campaign.id}, budget ${dollars(campaign.budgetCents)})`);
  console.log(`  status: ${plan.status}`);
  for (const a of plan.allocations) {
    console.log(`    ${a.source.padEnd(10)} ${dollars(a.amountCents)}`);
  }
}
