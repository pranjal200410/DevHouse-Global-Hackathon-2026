export type RiskLevel = "low" | "medium" | "high";
export type SubscriptionStatus = "active" | "canceling" | "cancelled";
export type BillingCycle = "monthly" | "yearly";
export type RenewalStatus = "charged" | "blocked" | "disputed";
export type CancellationState = "not-started" | "in-progress" | "completed";
export type DisputeStatus = "draft" | "submitted" | "won" | "lost";
export type AlertSeverity = "low" | "medium" | "high";
export type AlertType = "renewal-risk" | "blocked-charge" | "dispute" | "cancellation-followup";
export type IntegrationEventType =
  | "inbox-sync"
  | "subscription-detected"
  | "cancellation-outreach"
  | "auto-block-update"
  | "dispute-draft-generated"
  | "error";

export type IntegrationEventStatus = "success" | "failure" | "info";

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
  cancelMethod: "automated" | "in-app" | "email" | "phone" | "chat";
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

export interface CancellationCenterItem {
  cancellationId: string;
  subscriptionId: string;
  merchant: string;
  amount: number;
  method: Subscription["cancelMethod"];
  state: CancellationState;
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
  status: DisputeStatus;
  riskLevel: RiskLevel;
  cancellationState: CancellationState | null;
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

export interface DetectedSubscriptionCandidate {
  merchant: string;
  amount: number;
  detectedAt: string;
  sourceMessageId: string;
  sourceSubject: string;
  sourceFrom: string;
  cancellationEmail: string | null;
}

export interface InboxDetection {
  merchant: string;
  amount: number;
  detectedAt: string;
  sourceMessageId: string;
  sourceSubject: string;
  sourceFrom: string;
  cancellationEmail: string | null;
}

export interface InboxSyncResult {
  source: "imap" | "seed-file";
  startedAt: string;
  finishedAt: string;
  processedMessages: number;
  importedCount: number;
  detections: InboxDetection[];
  errors: string[];
}

export interface CancellationOutreachResult {
  attemptedAt: string;
  status: "sent" | "failed" | "skipped";
  recipient: string;
  messageId: string | null;
  previewUrl: string | null;
  error: string | null;
}

export interface ProofLogEvent {
  id: string;
  timestamp: string;
  type: IntegrationEventType;
  status: IntegrationEventStatus;
  subscriptionId: string | null;
  merchant: string | null;
  details: Record<string, unknown>;
}