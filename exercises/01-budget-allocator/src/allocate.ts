import type { Allocation, Campaign, SourceStats } from './types.js';

// Budget follows efficiency: a source that produced leads at half the cost gets twice the weight.
export function weightFor(stats: SourceStats): number {
  const costPerLead = stats.spendCents30d / stats.leads30d;
  return 1 / costPerLead;
}

export function distributeProportionally(totalCents: number, weights: number[]): number[] {
  const sum = weights.reduce((acc, w) => acc + w, 0);
  return weights.map((w) => Math.round((totalCents * w) / sum));
}

export function allocate(campaign: Campaign): Allocation[] {
  const weights = campaign.sources.map(weightFor);
  const amounts = distributeProportionally(campaign.budgetCents, weights);
  return campaign.sources.map((s, i) => ({ source: s.source, amountCents: amounts[i] }));
}
