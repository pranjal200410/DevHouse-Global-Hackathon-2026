import { AppError } from "../lib/http";
import type {
  BlockRule,
  CancellationRecord,
  DashboardSummary,
  DisputeRecord,
  RenewalCalendarItem,
  RenewalEvent,
  RiskLevel,
  Subscription,
  SubscriptionDetail,
  SubscriptionStatus,
  User,
} from "../types";

interface DemoState {
  user: User;
  subscriptions: Subscription[];
  renewals: RenewalEvent[];
  cancellations: CancellationRecord[];
  blocks: BlockRule[];
  disputes: DisputeRecord[];
}

const DEMO_USER: User = {
  id: "user_demo_001",
  email: "demo@devhouse.app",
  name: "Pranjal Demo",
  onboardingCompleted: true,
  createdAt: "2026-01-01T00:00:00.000Z",
};

const DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub_netflix",
    userId: DEMO_USER.id,
    merchant: "Netflix",
    category: "Streaming",
    amount: 15.99,
    billingCycle: "monthly",
    status: "active",
    riskLevel: "low",
    nextRenewalDate: "2026-04-08T10:00:00.000Z",
    cancelMethod: "in-app",
    cancellationUrl: "https://www.netflix.com/cancelplan",
    startedAt: "2025-05-02T10:00:00.000Z",
  },
  {
    id: "sub_spotify",
    userId: DEMO_USER.id,
    merchant: "Spotify Premium",
    category: "Music",
    amount: 11.99,
    billingCycle: "monthly",
    status: "active",
    riskLevel: "low",
    nextRenewalDate: "2026-04-12T10:00:00.000Z",
    cancelMethod: "in-app",
    cancellationUrl: "https://www.spotify.com/account/subscription/",
    startedAt: "2024-11-22T10:00:00.000Z",
  },
  {
    id: "sub_notion",
    userId: DEMO_USER.id,
    merchant: "Notion Plus",
    category: "Productivity",
    amount: 12,
    billingCycle: "monthly",
    status: "active",
    riskLevel: "medium",
    nextRenewalDate: "2026-04-18T10:00:00.000Z",
    cancelMethod: "email",
    cancellationUrl: "mailto:team@makenotion.com",
    startedAt: "2025-02-01T10:00:00.000Z",
  },
  {
    id: "sub_adobe",
    userId: DEMO_USER.id,
    merchant: "Adobe Creative Cloud",
    category: "Design",
    amount: 59.99,
    billingCycle: "monthly",
    status: "active",
    riskLevel: "high",
    nextRenewalDate: "2026-04-10T10:00:00.000Z",
    cancelMethod: "chat",
    cancellationUrl: "https://helpx.adobe.com/contact.html",
    startedAt: "2024-04-01T10:00:00.000Z",
  },
  {
    id: "sub_gym",
    userId: DEMO_USER.id,
    merchant: "GymPro Annual",
    category: "Fitness",
    amount: 79,
    billingCycle: "monthly",
    status: "canceling",
    riskLevel: "high",
    nextRenewalDate: "2026-04-07T10:00:00.000Z",
    cancelMethod: "phone",
    cancellationUrl: "tel:+18005551234",
    startedAt: "2025-07-16T10:00:00.000Z",
  },
  {
    id: "sub_cloudai",
    userId: DEMO_USER.id,
    merchant: "CloudAI Starter",
    category: "SaaS",
    amount: 25,
    billingCycle: "monthly",
    status: "active",
    riskLevel: "medium",
    nextRenewalDate: "2026-04-20T10:00:00.000Z",
    cancelMethod: "in-app",
    cancellationUrl: "https://cloudai.example/cancel",
    startedAt: "2025-09-05T10:00:00.000Z",
  },
  {
    id: "sub_primevideo",
    userId: DEMO_USER.id,
    merchant: "Prime Video",
    category: "Streaming",
    amount: 8.99,
    billingCycle: "monthly",
    status: "active",
    riskLevel: "low",
    nextRenewalDate: "2026-04-14T10:00:00.000Z",
    cancelMethod: "in-app",
    cancellationUrl: "https://www.amazon.com/yourmembershipsandsubscriptions",
    startedAt: "2025-03-30T10:00:00.000Z",
  },
  {
    id: "sub_foodbox",
    userId: DEMO_USER.id,
    merchant: "FoodBox Weekly",
    category: "Food",
    amount: 32,
    billingCycle: "monthly",
    status: "cancelled",
    riskLevel: "low",
    nextRenewalDate: null,
    cancelMethod: "in-app",
    cancellationUrl: "https://foodbox.example/account",
    startedAt: "2025-01-12T10:00:00.000Z",
  },
  {
    id: "sub_newsplus",
    userId: DEMO_USER.id,
    merchant: "NewsPlus",
    category: "News",
    amount: 6.49,
    billingCycle: "monthly",
    status: "active",
    riskLevel: "medium",
    nextRenewalDate: "2026-04-09T10:00:00.000Z",
    cancelMethod: "email",
    cancellationUrl: "mailto:support@newsplus.example",
    startedAt: "2024-12-10T10:00:00.000Z",
  },
  {
    id: "sub_masterclass",
    userId: DEMO_USER.id,
    merchant: "MasterClass",
    category: "Learning",
    amount: 15,
    billingCycle: "monthly",
    status: "active",
    riskLevel: "high",
    nextRenewalDate: "2026-04-16T10:00:00.000Z",
    cancelMethod: "chat",
    cancellationUrl: "https://masterclass.com/contact",
    startedAt: "2025-10-20T10:00:00.000Z",
  },
];

const DEMO_RENEWALS: RenewalEvent[] = [
  {
    id: "ren_001",
    userId: DEMO_USER.id,
    subscriptionId: "sub_netflix",
    date: "2026-03-08T10:00:00.000Z",
    amount: 15.99,
    status: "charged",
    note: "Processed successfully.",
  },
  {
    id: "ren_002",
    userId: DEMO_USER.id,
    subscriptionId: "sub_adobe",
    date: "2026-03-10T10:00:00.000Z",
    amount: 59.99,
    status: "charged",
    note: "High-price recurring charge.",
  },
  {
    id: "ren_003",
    userId: DEMO_USER.id,
    subscriptionId: "sub_gym",
    date: "2026-03-29T10:00:00.000Z",
    amount: 79,
    status: "disputed",
    note: "Charge happened after cancellation request.",
  },
  {
    id: "ren_004",
    userId: DEMO_USER.id,
    subscriptionId: "sub_newsplus",
    date: "2026-03-09T10:00:00.000Z",
    amount: 6.49,
    status: "charged",
    note: "Processed successfully.",
  },
  {
    id: "ren_005",
    userId: DEMO_USER.id,
    subscriptionId: "sub_masterclass",
    date: "2026-03-16T10:00:00.000Z",
    amount: 15,
    status: "blocked",
    note: "Auto-block prevented renewal.",
  },
];

const DEMO_CANCELLATIONS: CancellationRecord[] = [
  {
    id: "can_001",
    userId: DEMO_USER.id,
    subscriptionId: "sub_gym",
    state: "in-progress",
    requestedAt: "2026-03-28T11:00:00.000Z",
    completedAt: null,
    method: "phone",
    steps: [
      "Open merchant support",
      "Verify account owner",
      "Request cancellation confirmation",
      "Save ticket reference",
    ],
    nextAction: "Upload written confirmation after support call.",
  },
  {
    id: "can_002",
    userId: DEMO_USER.id,
    subscriptionId: "sub_foodbox",
    state: "completed",
    requestedAt: "2026-02-16T10:00:00.000Z",
    completedAt: "2026-02-18T10:00:00.000Z",
    method: "in-app",
    steps: ["Open billing settings", "Click cancel plan", "Save cancellation receipt"],
    nextAction: "Completed",
  },
];

const DEMO_BLOCKS: BlockRule[] = [
  {
    id: "blk_001",
    userId: DEMO_USER.id,
    subscriptionId: "sub_adobe",
    enabled: true,
    updatedAt: "2026-04-01T08:00:00.000Z",
  },
  {
    id: "blk_002",
    userId: DEMO_USER.id,
    subscriptionId: "sub_masterclass",
    enabled: true,
    updatedAt: "2026-04-01T08:30:00.000Z",
  },
];

const DEMO_DISPUTES: DisputeRecord[] = [
  {
    id: "dsp_001",
    userId: DEMO_USER.id,
    subscriptionId: "sub_gym",
    incidentDate: "2026-03-29T10:00:00.000Z",
    amount: 79,
    reason: "Merchant charged after cancellation was initiated.",
    status: "submitted",
  },
];

const riskToColor = (riskLevel: RiskLevel): RenewalCalendarItem["riskColor"] => {
  if (riskLevel === "high") {
    return "rose";
  }
  if (riskLevel === "medium") {
    return "amber";
  }
  return "emerald";
};

const createInitialState = (): DemoState => ({
  user: structuredClone(DEMO_USER),
  subscriptions: structuredClone(DEMO_SUBSCRIPTIONS),
  renewals: structuredClone(DEMO_RENEWALS),
  cancellations: structuredClone(DEMO_CANCELLATIONS),
  blocks: structuredClone(DEMO_BLOCKS),
  disputes: structuredClone(DEMO_DISPUTES),
});

let state = createInitialState();

const byDateAsc = (a: string, b: string): number => Date.parse(a) - Date.parse(b);
const byDateDesc = (a: string, b: string): number => Date.parse(b) - Date.parse(a);

const getRiskBand = (highRiskCount: number): DashboardSummary["riskBand"] => {
  if (highRiskCount >= 3) {
    return "critical";
  }
  if (highRiskCount >= 1) {
    return "watch";
  }
  return "stable";
};

const getPotentialSavings = (subscriptions: Subscription[]): number =>
  Number(
    subscriptions
      .filter((item) => item.riskLevel !== "low" && item.status !== "cancelled")
      .reduce((sum, item) => sum + item.amount, 0)
      .toFixed(2),
  );

const findSubscriptionOrThrow = (subscriptionId: string): Subscription => {
  const target = state.subscriptions.find((item) => item.id === subscriptionId);
  if (!target) {
    throw new AppError(404, "SUBSCRIPTION_NOT_FOUND", "Subscription does not exist.");
  }
  return target;
};

export const resetDemoState = (): void => {
  state = createInitialState();
};

export const getDemoUser = (): User => structuredClone(state.user);

export const updateDemoUserEmail = (email: string): User => {
  state.user.email = email.toLowerCase();
  state.user.name = email.split("@")[0]?.replace(/\./g, " ") || "Pranjal Demo";
  return getDemoUser();
};

export const getDashboardSummary = (): DashboardSummary => {
  const liveSubscriptions = state.subscriptions.filter((item) => item.status !== "cancelled");
  const monthlySpend = Number(liveSubscriptions.reduce((sum, item) => sum + item.amount, 0).toFixed(2));

  const nextRenewalDate = liveSubscriptions
    .map((item) => item.nextRenewalDate)
    .filter((date): date is string => Boolean(date))
    .sort(byDateAsc)[0] ?? null;

  const highRiskCount = liveSubscriptions.filter((item) => item.riskLevel === "high").length;

  return {
    monthlySpend,
    activeSubscriptions: liveSubscriptions.length,
    highRiskCount,
    riskBand: getRiskBand(highRiskCount),
    nextRenewalDate,
    potentialSavings: getPotentialSavings(liveSubscriptions),
  };
};

export const listSubscriptions = (options?: {
  status?: SubscriptionStatus;
  riskLevel?: RiskLevel;
  sort?: "renewal-asc" | "amount-desc" | "amount-asc";
}): Subscription[] => {
  const status = options?.status;
  const riskLevel = options?.riskLevel;
  const sort = options?.sort ?? "renewal-asc";

  let output = [...state.subscriptions];

  if (status) {
    output = output.filter((item) => item.status === status);
  }
  if (riskLevel) {
    output = output.filter((item) => item.riskLevel === riskLevel);
  }

  if (sort === "amount-desc") {
    output.sort((a, b) => b.amount - a.amount);
  } else if (sort === "amount-asc") {
    output.sort((a, b) => a.amount - b.amount);
  } else {
    output.sort((a, b) => {
      if (!a.nextRenewalDate && !b.nextRenewalDate) {
        return 0;
      }
      if (!a.nextRenewalDate) {
        return 1;
      }
      if (!b.nextRenewalDate) {
        return -1;
      }
      return byDateAsc(a.nextRenewalDate, b.nextRenewalDate);
    });
  }

  return structuredClone(output);
};

export const getSubscriptionDetail = (subscriptionId: string): SubscriptionDetail => {
  const subscription = findSubscriptionOrThrow(subscriptionId);

  const history = state.renewals
    .filter((entry) => entry.subscriptionId === subscription.id)
    .sort((a, b) => byDateDesc(a.date, b.date));

  const cancellation = state.cancellations.find((entry) => entry.subscriptionId === subscription.id) ?? null;
  const blockRule = state.blocks.find((entry) => entry.subscriptionId === subscription.id) ?? null;
  const disputes = state.disputes
    .filter((entry) => entry.subscriptionId === subscription.id)
    .sort((a, b) => byDateDesc(a.incidentDate, b.incidentDate));

  return {
    subscription: structuredClone(subscription),
    history: structuredClone(history),
    cancellation: structuredClone(cancellation),
    blockRule: structuredClone(blockRule),
    disputes: structuredClone(disputes),
    actions: {
      canCancel: subscription.status !== "cancelled",
      canBlock: subscription.status !== "cancelled",
    },
  };
};

export const startCancellation = (subscriptionId: string): SubscriptionDetail => {
  const subscription = findSubscriptionOrThrow(subscriptionId);
  if (subscription.status === "cancelled") {
    return getSubscriptionDetail(subscriptionId);
  }

  subscription.status = "canceling";
  if (subscription.riskLevel === "low") {
    subscription.riskLevel = "medium";
  }

  let cancellation = state.cancellations.find((entry) => entry.subscriptionId === subscriptionId);
  if (!cancellation) {
    cancellation = {
      id: `can_${subscriptionId}`,
      userId: state.user.id,
      subscriptionId,
      state: "in-progress",
      requestedAt: new Date().toISOString(),
      completedAt: null,
      method: subscription.cancelMethod,
      steps: [
        "Open merchant cancellation flow",
        "Complete identity verification",
        "Capture confirmation receipt",
      ],
      nextAction: "Upload confirmation receipt to lock protection.",
    };
    state.cancellations.push(cancellation);
  } else if (cancellation.state !== "completed") {
    cancellation.state = "in-progress";
    cancellation.nextAction = "Complete final confirmation in merchant account.";
  }

  return getSubscriptionDetail(subscriptionId);
};

export const completeCancellation = (subscriptionId: string): SubscriptionDetail => {
  const subscription = findSubscriptionOrThrow(subscriptionId);

  let cancellation = state.cancellations.find((entry) => entry.subscriptionId === subscriptionId);
  if (!cancellation) {
    cancellation = {
      id: `can_${subscriptionId}`,
      userId: state.user.id,
      subscriptionId,
      state: "completed",
      requestedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      method: subscription.cancelMethod,
      steps: ["Cancellation completed directly"],
      nextAction: "Completed",
    };
    state.cancellations.push(cancellation);
  } else {
    cancellation.state = "completed";
    cancellation.completedAt = new Date().toISOString();
    cancellation.nextAction = "Completed";
  }

  subscription.status = "cancelled";
  subscription.nextRenewalDate = null;
  subscription.riskLevel = "low";

  return getSubscriptionDetail(subscriptionId);
};

export const setAutoBlock = (subscriptionId: string, enabled: boolean): SubscriptionDetail => {
  findSubscriptionOrThrow(subscriptionId);

  let rule = state.blocks.find((entry) => entry.subscriptionId === subscriptionId);
  if (!rule) {
    rule = {
      id: `blk_${subscriptionId}`,
      userId: state.user.id,
      subscriptionId,
      enabled,
      updatedAt: new Date().toISOString(),
    };
    state.blocks.push(rule);
  } else {
    rule.enabled = enabled;
    rule.updatedAt = new Date().toISOString();
  }

  return getSubscriptionDetail(subscriptionId);
};

export const getRenewalCalendar = (): RenewalCalendarItem[] => {
  const activeRows = state.subscriptions
    .filter((subscription) => subscription.status !== "cancelled" && Boolean(subscription.nextRenewalDate))
    .map((subscription) => ({
      subscriptionId: subscription.id,
      merchant: subscription.merchant,
      date: subscription.nextRenewalDate as string,
      amount: subscription.amount,
      riskLevel: subscription.riskLevel,
      riskColor: riskToColor(subscription.riskLevel),
      status: subscription.status,
    }))
    .sort((a, b) => byDateAsc(a.date, b.date));

  return structuredClone(activeRows);
};

export const getDemoStateSnapshot = (): DemoState => structuredClone(state);
