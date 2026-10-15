import { describe, expect, it } from 'vitest';
import { allocate, distributeProportionally, weightFor } from '../src/allocate.js';
import { approvePlan, draftPlan } from '../src/plan.js';
import { PlanStore } from '../src/store.js';
import type { Campaign } from '../src/types.js';

describe('weightFor', () => {
  it('weights cheaper leads higher', () => {
    const cheap = weightFor({ source: 'facebook', leads30d: 10, spendCents30d: 10000 });
    const pricey = weightFor({ source: 'google', leads30d: 10, spendCents30d: 20000 });
    expect(cheap).toBeCloseTo(pricey * 2);
  });
});

describe('distributeProportionally', () => {
  it('splits evenly with equal weights', () => {
    expect(distributeProportionally(1000, [1, 1])).toEqual([500, 500]);
  });

  it('follows the weights', () => {
    expect(distributeProportionally(1000, [3, 1])).toEqual([750, 250]);
  });
});

describe('allocate', () => {
  it('gives the most efficient source the largest share', () => {
    const campaign: Campaign = {
      id: 'c1',
      name: 'Test',
      budgetCents: 100000,
      sources: [
        { source: 'facebook', leads30d: 40, spendCents30d: 20000 },
        { source: 'google', leads30d: 10, spendCents30d: 20000 },
      ],
    };
    const [fb, google] = allocate(campaign);
    expect(fb.amountCents).toBeGreaterThan(google.amountCents);
    expect(fb.amountCents + google.amountCents).toBe(100000);
  });
});

describe('approvePlan', () => {
  it('approves a plan and stores the allocations', () => {
    const campaign: Campaign = {
      id: 'c1',
      name: 'Test',
      budgetCents: 100000,
      sources: [
        { source: 'facebook', leads30d: 20, spendCents30d: 20000 },
        { source: 'indeed', leads30d: 20, spendCents30d: 20000 },
      ],
    };
    const store = new PlanStore();
    store.save(draftPlan(campaign));

    const plan = approvePlan(store, campaign);

    expect(plan.status).toBe('approved');
    expect(plan.allocations).toHaveLength(2);
    expect(store.get('c1')?.status).toBe('approved');
  });
});
