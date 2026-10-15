import type { Plan } from './types.js';

export class ValidationError extends Error {
  constructor(public readonly path: string, message: string) {
    super(`${path}: ${message}`);
    this.name = 'ValidationError';
  }
}

// In-memory stand-in for the plans collection. Validation mirrors the schema rules in prod.
export class PlanStore {
  private plans = new Map<string, Plan>();

  get(campaignId: string): Plan | undefined {
    const plan = this.plans.get(campaignId);
    return plan && structuredClone(plan);
  }

  save(plan: Plan): void {
    validate(plan);
    this.plans.set(plan.campaignId, structuredClone(plan));
  }
}

function validate(plan: Plan): void {
  plan.allocations.forEach((a, i) => {
    if (!Number.isInteger(a.amountCents) || a.amountCents < 0) {
      throw new ValidationError(`allocations.${i}.amountCents`, 'must be a non-negative integer');
    }
  });
  const total = plan.allocations.reduce((acc, a) => acc + a.amountCents, 0);
  if (total > plan.budgetCents) {
    throw new ValidationError('allocations', `total ${total} exceeds budget ${plan.budgetCents}`);
  }
}
