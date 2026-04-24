export type RiskLevel = "low" | "medium" | "high";
export type SubscriptionStatus = "active" | "canceling" | "cancelled";
export type AlertSeverity = "low" | "medium" | "high";
export type AlertType = "renewal-risk" | "blocked-charge" | "dispute" | "cancellation-followup";

export interface User {
  id: string;
  email: string;
  name: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface SessionResponse {
  token: string;
  expiresAt: string;
  demoMode: true;
  user: User;
}

export interface DashboardSummary {
  monthlySpend: number;
  activeSubscriptions: number;
  highRiskCount: number;
  riskBand: "stable" | "watch" | "critical";
  nextRenewalDate: string | null;
  potentialSavings: number;
}

export interface SavingsOpportunity {
  subscriptionId: string;
  merchant: string;
  amount: number;
  currentAnnualCost: number;
  projectedAnnualCost: number;
  monthlySavings: number;
  annualSavings: number;
  confidenceScore: number;
  action: "cancel" | "downgrade" | "switch";
  reason: string;
  recommendedPlan: string;
  urgency: "now" | "this-week" | "this-month";
}

export interface Subscription {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  status: SubscriptionStatus;
  riskLevel: RiskLevel;
  nextRenewalDate: string | null;
  cancelMethod: "automated" | "in-app" | "email" | "phone" | "chat";
  cancellationUrl: string;
}

export interface RenewalEvent {
  id: string;
  date: string;
  amount: number;
  status: "charged" | "blocked" | "disputed";
  note: string;
}

export interface CancellationRecord {
  id: string;
  state: "not-started" | "in-progress" | "completed";
  requestedAt: string;
  completedAt: string | null;
  method: string;
  steps: string[];
  nextAction: string;
}

export interface BlockRule {
  id: string;
  enabled: boolean;
  updatedAt: string;
}

export interface DisputeRecord {
  id: string;
  incidentDate: string;
  amount: number;
  reason: string;
  status: "draft" | "submitted" | "won" | "lost";
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

export interface RenewalCalendarItem {
  subscriptionId: string;
  merchant: string;
  date: string;
  amount: number;
  riskLevel: RiskLevel;
  riskColor: "emerald" | "amber" | "rose";
  status: SubscriptionStatus;
}

export interface CancellationCenterItem {
  cancellationId: string;
  subscriptionId: string;
  merchant: string;
  amount: number;
  method: Subscription["cancelMethod"];
  state: CancellationRecord["state"];
  requestedAt: string;
  completedAt: string | null;
  nextAction: string;
  progressPercent: number;
  riskLevel: RiskLevel;
  steps: string[];
}

export interface ProtectionControlItem {
  subscriptionId: string;
  merchant: string;
  amount: number;
  riskLevel: RiskLevel;
  status: SubscriptionStatus;
  nextRenewalDate: string | null;
  autoBlockEnabled: boolean;
  updatedAt: string | null;
}

export interface ProtectionControlsPayload {
  summary: {
    totalTracked: number;
    activeProtections: number;
    highRiskUnprotected: number;
    nextProtectedRenewal: string | null;
  };
  controls: ProtectionControlItem[];
}

export interface AlertFeedItem {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  actionLabel: string;
  actionHref: string;
  occurredAt: string;
  subscriptionId?: string;
  merchant?: string;
}

export interface DisputeStudioChecklistItem {
  label: string;
  done: boolean;
}

export interface DisputeStudioItem {
  disputeId: string;
  subscriptionId: string;
  merchant: string;
  incidentDate: string;
  amount: number;
  reason: string;
  status: "draft" | "submitted" | "won" | "lost";
  riskLevel: RiskLevel;
  cancellationState: CancellationRecord["state"] | null;
  evidenceProgressPercent: number;
  recommendedAction: string;
  checklist: DisputeStudioChecklistItem[];
}

export interface DisputeStudioPayload {
  summary: {
    openDisputes: number;
    totalDisputedAmount: number;
    highPriorityDisputes: number;
    evidenceReadyDisputes: number;
  };
  disputes: DisputeStudioItem[];
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;
