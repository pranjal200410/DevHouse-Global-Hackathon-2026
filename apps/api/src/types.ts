export type RiskLevel = "low" | "medium" | "high";
export type SubscriptionStatus = "active" | "canceling" | "cancelled";
export type BillingCycle = "monthly" | "yearly";
export type RenewalStatus = "charged" | "blocked" | "disputed";
export type CancellationState = "not-started" | "in-progress" | "completed";
export type DisputeStatus = "draft" | "submitted" | "won" | "lost";

export interface User {
  id: string;
  email: string;
  name: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  user: User;
  demoMode: true;
  createdAt: string;
  expiresAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  merchant: string;
  category: string;
  amount: number;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  riskLevel: RiskLevel;
  nextRenewalDate: string | null;
  cancelMethod: "in-app" | "email" | "phone" | "chat";
  cancellationUrl: string;
  startedAt: string;
}

export interface RenewalEvent {
  id: string;
  userId: string;
  subscriptionId: string;
  date: string;
  amount: number;
  status: RenewalStatus;
  note: string;
}

export interface CancellationRecord {
  id: string;
  userId: string;
  subscriptionId: string;
  state: CancellationState;
  requestedAt: string;
  completedAt: string | null;
  method: string;
  steps: string[];
  nextAction: string;
}

export interface BlockRule {
  id: string;
  userId: string;
  subscriptionId: string;
  enabled: boolean;
  updatedAt: string;
}

export interface DisputeRecord {
  id: string;
  userId: string;
  subscriptionId: string;
  incidentDate: string;
  amount: number;
  reason: string;
  status: DisputeStatus;
}

export interface DashboardSummary {
  monthlySpend: number;
  activeSubscriptions: number;
  highRiskCount: number;
  riskBand: "stable" | "watch" | "critical";
  nextRenewalDate: string | null;
  potentialSavings: number;
}

export interface RenewalCalendarItem {
  subscriptionId: string;
  merchant: string;
  date: string;
  amount: number;
  riskLevel: RiskLevel;
  riskColor: "emerald" | "amber" | "rose";
  status: SubscriptionStatus;
}

export interface SubscriptionDetail {
  subscription: Subscription;
  history: RenewalEvent[];
  cancellation: CancellationRecord | null;
  blockRule: BlockRule | null;
  disputes: DisputeRecord[];
  actions: {
    canCancel: boolean;
    canBlock: boolean;
  };
}