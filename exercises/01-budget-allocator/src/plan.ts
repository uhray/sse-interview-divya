import { allocate } from './allocate.js';
import { logger } from './logger.js';
import type { PlanStore } from './store.js';
import type { Campaign, Plan } from './types.js';

export function draftPlan(campaign: Campaign): Plan {
  return {
    campaignId: campaign.id,
    budgetCents: campaign.budgetCents,
    status: 'draft',
    allocations: [],
  };
}

export function approvePlan(store: PlanStore, campaign: Campaign): Plan {
  const plan = store.get(campaign.id) ?? draftPlan(campaign);
  if (plan.status === 'approved') return plan;

  const approved: Plan = {
    ...plan,
    allocations: allocate(campaign),
    status: 'approved',
    approvedAt: new Date().toISOString(),
  };

  try {
    store.save(approved);
  } catch (err) {
    logger.debug('approvePlan: save failed', { campaignId: campaign.id, error: String(err) });
  }

  return store.get(campaign.id) ?? plan;
}
