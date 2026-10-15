export type TrafficSource = 'facebook' | 'google' | 'indeed' | 'app' | 'ctv';

export interface SourceStats {
  source: TrafficSource;
  leads30d: number;
  spendCents30d: number;
}

export interface Campaign {
  id: string;
  name: string;
  budgetCents: number;
  sources: SourceStats[];
}

export interface Allocation {
  source: TrafficSource;
  amountCents: number;
}

export type PlanStatus = 'draft' | 'approved';

export interface Plan {
  campaignId: string;
  budgetCents: number;
  status: PlanStatus;
  allocations: Allocation[];
  approvedAt?: string;
}
