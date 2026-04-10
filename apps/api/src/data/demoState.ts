import { createHash } from "crypto";
import { AppError } from "../lib/http";
import type {
  AlertFeedItem,
  BlockRule,
  CancellationCenterItem,
  CancellationRecord,
  DashboardSummary,
  DisputeRecord,
  ProtectionControlsPayload,
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

const TEMPLATE_USER_ID = "user_template_001";
const TEMPLATE_CREATED_AT = "2026-01-01T00:00:00.000Z";

const DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub_netflix",
    userId: TEMPLATE_USER_ID,
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
    userId: TEMPLATE_USER_ID,
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
    id: "sub_primevideo",
    userId: TEMPLATE_USER_ID,
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
    id: "sub_adobe",
    userId: TEMPLATE_USER_ID,
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
    userId: TEMPLATE_USER_ID,
    merchant: "GymPro Annual",
    category: "Fitness",
    amount: 79.0,
    billingCycle: "monthly",
    status: "canceling",
    riskLevel: "high",
    nextRenewalDate: "2026-04-07T10:00:00.000Z",
    cancelMethod: "phone",
    cancellationUrl: "tel:+18005551234",
    startedAt: "2025-07-16T10:00:00.000Z",
  },
  {
    id: "sub_notion",
    userId: TEMPLATE_USER_ID,
    merchant: "Notion Plus",
    category: "Productivity",
    amount: 12.0,
    billingCycle: "monthly",
    status: "active",
    riskLevel: "medium",
    nextRenewalDate: "2026-04-18T10:00:00.000Z",
    cancelMethod: "email",
    cancellationUrl: "mailto:support@makenotion.com",
    startedAt: "2025-02-01T10:00:00.000Z",
  },
  {
    id: "sub_newsplus",
    userId: TEMPLATE_USER_ID,
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
    id: "sub_cloudai",
    userId: TEMPLATE_USER_ID,
    merchant: "CloudAI Starter",
    category: "SaaS",
    amount: 25.0,
    billingCycle: "monthly",
    status: "active",
    riskLevel: "medium",
    nextRenewalDate: "2026-04-20T10:00:00.000Z",
    cancelMethod: "in-app",
    cancellationUrl: "https://cloudai.example/cancel",
    startedAt: "2025-09-05T10:00:00.000Z",
  },
  {
    id: "sub_masterclass",
    userId: TEMPLATE_USER_ID,
    merchant: "MasterClass",
    category: "Learning",
    amount: 15.0,
    billingCycle: "monthly",
    status: "active",
    riskLevel: "high",
    nextRenewalDate: "2026-04-16T10:00:00.000Z",
    cancelMethod: "chat",
    cancellationUrl: "https://masterclass.com/contact",
    startedAt: "2025-10-20T10:00:00.000Z",
  },
  {
    id: "sub_foodbox",
    userId: TEMPLATE_USER_ID,
    merchant: "FoodBox Weekly",
    category: "Food",
    amount: 32.0,
    billingCycle: "monthly",
    status: "cancelled",
    riskLevel: "low",
    nextRenewalDate: null,
    cancelMethod: "in-app",
    cancellationUrl: "https://foodbox.example/account",
    startedAt: "2025-01-12T10:00:00.000Z",
  },
];

const DEMO_RENEWALS: RenewalEvent[] = [
  {
    id: "ren_001",
    userId: TEMPLATE_USER_ID,
    subscriptionId: "sub_netflix",
    date: "2026-03-08T10:00:00.000Z",
    amount: 15.99,
    status: "charged",
    note: "Processed successfully.",
  },
  {
    id: "ren_002",
    userId: TEMPLATE_USER_ID,
    subscriptionId: "sub_adobe",
    date: "2026-03-10T10:00:00.000Z",
    amount: 59.99,
    status: "charged",
    note: "High-price recurring charge.",
  },
  {
    id: "ren_003",
    userId: TEMPLATE_USER_ID,
    subscriptionId: "sub_gym",
    date: "2026-03-29T10:00:00.000Z",
    amount: 79,
    status: "disputed",
    note: "Charge happened after cancellation request.",
  },
  {
    id: "ren_004",
    userId: TEMPLATE_USER_ID,
    subscriptionId: "sub_newsplus",
    date: "2026-03-09T10:00:00.000Z",
    amount: 6.49,
    status: "charged",
    note: "Processed successfully.",
  },
  {
    id: "ren_005",
    userId: TEMPLATE_USER_ID,
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
    userId: TEMPLATE_USER_ID,
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
    userId: TEMPLATE_USER_ID,
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
    userId: TEMPLATE_USER_ID,
    subscriptionId: "sub_adobe",
    enabled: true,
    updatedAt: "2026-04-01T08:00:00.000Z",
  },
  {
    id: "blk_002",
    userId: TEMPLATE_USER_ID,
    subscriptionId: "sub_masterclass",
    enabled: true,
    updatedAt: "2026-04-01T08:30:00.000Z",
  },
];

const DEMO_DISPUTES: DisputeRecord[] = [
  {
    id: "dsp_001",
    userId: TEMPLATE_USER_ID,
    subscriptionId: "sub_gym",
    incidentDate: "2026-03-29T10:00:00.000Z",
    amount: 79,
    reason: "Merchant charged after cancellation was initiated.",
    status: "submitted",
  },
];

const userStates = new Map<string, DemoState>();

const byDateAsc = (a: string, b: string): number => Date.parse(a) - Date.parse(b);
const byDateDesc = (a: string, b: string): number => Date.parse(b) - Date.parse(a);

const riskToColor = (riskLevel: RiskLevel): RenewalCalendarItem["riskColor"] => {
  if (riskLevel === "high") {
    return "rose";
  }
  if (riskLevel === "medium") {
    return "amber";
  }
  return "emerald";
};

const getRiskBand = (highRiskCount: number): DashboardSummary["riskBand"] => {
  if (highRiskCount >= 3) {
    return "critical";
  }
  if (highRiskCount >= 1) {
    return "watch";
  }
  return "stable";
};

const cancellationProgress = (state: CancellationRecord["state"]): number => {
  if (state === "completed") {
    return 100;
  }
  if (state === "in-progress") {
    return 66;
  }
  return 0;
};

const defaultCancellationSteps: Record<Subscription["cancelMethod"], string[]> = {
  "in-app": [
    "Open merchant billing settings",
    "Select cancel plan",
    "Save confirmation receipt",
  ],
  email: [
    "Draft merchant cancellation request",
    "Include account and billing details",
    "Save merchant confirmation reply",
  ],
  phone: [
    "Call merchant support",
    "Request cancellation ticket number",
    "Collect email or SMS confirmation",
  ],
  chat: [
    "Open merchant live chat",
    "Ask for immediate cancellation",
    "Export transcript as evidence",
  ],
};

const riskSortWeight = (riskLevel: RiskLevel): number => {
  if (riskLevel === "high") {
    return 0;
  }
  if (riskLevel === "medium") {
    return 1;
  }
  return 2;
};

const cancellationStateWeight = (state: CancellationRecord["state"]): number => {
  if (state === "in-progress") {
    return 0;
  }
  if (state === "not-started") {
    return 1;
  }
  return 2;
};

const getPotentialSavings = (subscriptions: Subscription[]): number =>
  Number(
    subscriptions
      .filter((item) => item.riskLevel !== "low" && item.status !== "cancelled")
      .reduce((sum, item) => sum + item.amount, 0)
      .toFixed(2),
  );

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const nameFromEmail = (email: string): string => {
  const localPart = email.split("@")[0]?.trim() || "demo";
  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const userIdFromEmail = (email: string): string => {
  const digest = createHash("sha256").update(email).digest("hex").slice(0, 12);
  return `user_${digest}`;
};

const createInitialState = (user: User): DemoState => ({
  user: structuredClone(user),
  subscriptions: structuredClone(DEMO_SUBSCRIPTIONS).map((item) => ({
    ...item,
    userId: user.id,
  })),
  renewals: structuredClone(DEMO_RENEWALS).map((item) => ({
    ...item,
    userId: user.id,
  })),
  cancellations: structuredClone(DEMO_CANCELLATIONS).map((item) => ({
    ...item,
    userId: user.id,
  })),
  blocks: structuredClone(DEMO_BLOCKS).map((item) => ({
    ...item,
    userId: user.id,
  })),
  disputes: structuredClone(DEMO_DISPUTES).map((item) => ({
    ...item,
    userId: user.id,
  })),
});

const getStateOrThrow = (userId: string): DemoState => {
  const state = userStates.get(userId);
  if (!state) {
    throw new AppError(401, "SESSION_STATE_MISSING", "Demo workspace is missing. Please login again.");
  }
  return state;
};

const findSubscriptionOrThrow = (state: DemoState, subscriptionId: string): Subscription => {
  const target = state.subscriptions.find((item) => item.id === subscriptionId);
  if (!target) {
    throw new AppError(404, "SUBSCRIPTION_NOT_FOUND", "Subscription does not exist.");
  }
  return target;
};

export const getOrCreateDemoUser = (email: string): User => {
  const normalizedEmail = normalizeEmail(email);
  const userId = userIdFromEmail(normalizedEmail);

  const existingState = userStates.get(userId);
  if (existingState) {
    existingState.user.email = normalizedEmail;
    existingState.user.name = nameFromEmail(normalizedEmail);
    return structuredClone(existingState.user);
  }

  const user: User = {
    id: userId,
    email: normalizedEmail,
    name: nameFromEmail(normalizedEmail),
    onboardingCompleted: true,
    createdAt: TEMPLATE_CREATED_AT,
  };

  userStates.set(user.id, createInitialState(user));
  return structuredClone(user);
};

export const ensureDemoStateForUser = (user: User): void => {
  if (userStates.has(user.id)) {
    return;
  }

  userStates.set(user.id, createInitialState(user));
};

export const resetAllDemoStates = (): void => {
  userStates.clear();
};

export const resetDemoStateForUser = (userId: string): void => {
  const currentState = getStateOrThrow(userId);
  userStates.set(userId, createInitialState(currentState.user));
};

export const getDemoUser = (userId: string): User => structuredClone(getStateOrThrow(userId).user);

export const getDashboardSummary = (userId: string): DashboardSummary => {
  const state = getStateOrThrow(userId);
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

export const listSubscriptions = (
  userId: string,
  options?: {
    status?: SubscriptionStatus;
    riskLevel?: RiskLevel;
    sort?: "renewal-asc" | "amount-desc" | "amount-asc";
  },
): Subscription[] => {
  const state = getStateOrThrow(userId);
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

export const getSubscriptionDetail = (userId: string, subscriptionId: string): SubscriptionDetail => {
  const state = getStateOrThrow(userId);
  const subscription = findSubscriptionOrThrow(state, subscriptionId);

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

export const startCancellation = (userId: string, subscriptionId: string): SubscriptionDetail => {
  const state = getStateOrThrow(userId);
  const subscription = findSubscriptionOrThrow(state, subscriptionId);
  if (subscription.status === "cancelled") {
    return getSubscriptionDetail(userId, subscriptionId);
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

  return getSubscriptionDetail(userId, subscriptionId);
};

export const completeCancellation = (userId: string, subscriptionId: string): SubscriptionDetail => {
  const state = getStateOrThrow(userId);
  const subscription = findSubscriptionOrThrow(state, subscriptionId);

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

  return getSubscriptionDetail(userId, subscriptionId);
};

export const setAutoBlock = (userId: string, subscriptionId: string, enabled: boolean): SubscriptionDetail => {
  const state = getStateOrThrow(userId);
  findSubscriptionOrThrow(state, subscriptionId);

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

  return getSubscriptionDetail(userId, subscriptionId);
};

export const getRenewalCalendar = (userId: string): RenewalCalendarItem[] => {
  const state = getStateOrThrow(userId);
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

export const getCancellationCenter = (userId: string): CancellationCenterItem[] => {
  const state = getStateOrThrow(userId);
  const cancellationBySubscription = new Map(
    state.cancellations.map((record) => [record.subscriptionId, record]),
  );

  const items = state.subscriptions
    .filter((subscription) => subscription.status !== "cancelled" || cancellationBySubscription.has(subscription.id))
    .map((subscription) => {
      const record = cancellationBySubscription.get(subscription.id);
      const derivedState: CancellationRecord["state"] =
        subscription.status === "cancelled"
          ? "completed"
          : subscription.status === "canceling"
            ? "in-progress"
            : "not-started";

      const currentState = record?.state ?? derivedState;
      const nextAction =
        record?.nextAction ??
        (currentState === "completed"
          ? "Cancellation completed."
          : currentState === "in-progress"
            ? "Finish merchant confirmation and upload proof."
            : "Start guided cancellation before the next renewal.");

      return {
        cancellationId: record?.id ?? `can_${subscription.id}`,
        subscriptionId: subscription.id,
        merchant: subscription.merchant,
        amount: subscription.amount,
        method: subscription.cancelMethod,
        state: currentState,
        requestedAt: record?.requestedAt ?? subscription.startedAt,
        completedAt: record?.completedAt ?? (currentState === "completed" ? new Date().toISOString() : null),
        nextAction,
        progressPercent: cancellationProgress(currentState),
        riskLevel: subscription.riskLevel,
        steps: record?.steps ?? defaultCancellationSteps[subscription.cancelMethod],
      } satisfies CancellationCenterItem;
    })
    .sort((a, b) => {
      if (cancellationStateWeight(a.state) !== cancellationStateWeight(b.state)) {
        return cancellationStateWeight(a.state) - cancellationStateWeight(b.state);
      }
      if (riskSortWeight(a.riskLevel) !== riskSortWeight(b.riskLevel)) {
        return riskSortWeight(a.riskLevel) - riskSortWeight(b.riskLevel);
      }
      return byDateDesc(a.requestedAt, b.requestedAt);
    });

  return structuredClone(items);
};

export const getProtectionControls = (userId: string): ProtectionControlsPayload => {
  const state = getStateOrThrow(userId);
  const blockBySubscription = new Map(state.blocks.map((entry) => [entry.subscriptionId, entry]));

  const controls = state.subscriptions
    .filter((subscription) => subscription.status !== "cancelled")
    .map((subscription) => {
      const rule = blockBySubscription.get(subscription.id) ?? null;

      return {
        subscriptionId: subscription.id,
        merchant: subscription.merchant,
        amount: subscription.amount,
        riskLevel: subscription.riskLevel,
        status: subscription.status,
        nextRenewalDate: subscription.nextRenewalDate,
        autoBlockEnabled: rule?.enabled ?? false,
        updatedAt: rule?.updatedAt ?? null,
      } satisfies ProtectionControlsPayload["controls"][number];
    })
    .sort((a, b) => {
      if (riskSortWeight(a.riskLevel) !== riskSortWeight(b.riskLevel)) {
        return riskSortWeight(a.riskLevel) - riskSortWeight(b.riskLevel);
      }

      if (!a.nextRenewalDate && !b.nextRenewalDate) {
        return a.merchant.localeCompare(b.merchant);
      }
      if (!a.nextRenewalDate) {
        return 1;
      }
      if (!b.nextRenewalDate) {
        return -1;
      }
      return byDateAsc(a.nextRenewalDate, b.nextRenewalDate);
    });

  const nextProtectedRenewal = controls
    .filter((item) => item.autoBlockEnabled && Boolean(item.nextRenewalDate))
    .map((item) => item.nextRenewalDate as string)
    .sort(byDateAsc)[0] ?? null;

  return {
    summary: {
      totalTracked: controls.length,
      activeProtections: controls.filter((item) => item.autoBlockEnabled).length,
      highRiskUnprotected: controls.filter((item) => item.riskLevel === "high" && !item.autoBlockEnabled).length,
      nextProtectedRenewal,
    },
    controls: structuredClone(controls),
  };
};

export const updateProtectionControl = (
  userId: string,
  subscriptionId: string,
  enabled: boolean,
): ProtectionControlsPayload => {
  const state = getStateOrThrow(userId);
  const subscription = findSubscriptionOrThrow(state, subscriptionId);

  if (subscription.status === "cancelled") {
    throw new AppError(
      409,
      "SUBSCRIPTION_CANCELLED",
      "Cannot change protection on a cancelled subscription.",
    );
  }

  setAutoBlock(userId, subscriptionId, enabled);
  return getProtectionControls(userId);
};

export const getAlertsFeed = (userId: string): AlertFeedItem[] => {
  const state = getStateOrThrow(userId);
  const alerts: AlertFeedItem[] = [];
  const blockBySubscription = new Map(state.blocks.map((entry) => [entry.subscriptionId, entry]));
  const subscriptionById = new Map(state.subscriptions.map((subscription) => [subscription.id, subscription]));

  for (const subscription of state.subscriptions) {
    if (subscription.status === "cancelled" || !subscription.nextRenewalDate || subscription.riskLevel === "low") {
      continue;
    }

    const blockRule = blockBySubscription.get(subscription.id);
    const severity =
      subscription.riskLevel === "high" && !blockRule?.enabled ? "high" : subscription.riskLevel;

    alerts.push({
      id: `alt_renewal_${subscription.id}`,
      type: "renewal-risk",
      severity,
      title: `${subscription.merchant} renewal risk detected`,
      message: `${subscription.merchant} may renew at $${subscription.amount.toFixed(2)} on ${new Date(subscription.nextRenewalDate).toLocaleDateString()}. Auto-block is ${blockRule?.enabled ? "active" : "inactive"}.`,
      actionLabel: blockRule?.enabled ? "Review subscription" : "Enable auto-block",
      actionHref: blockRule?.enabled ? `/subscriptions/${subscription.id}` : "/protection",
      occurredAt: subscription.nextRenewalDate,
      subscriptionId: subscription.id,
      merchant: subscription.merchant,
    });
  }

  for (const cancellation of state.cancellations.filter((entry) => entry.state === "in-progress")) {
    const subscription = subscriptionById.get(cancellation.subscriptionId);
    const severity = subscription?.riskLevel === "high" ? "high" : "medium";

    alerts.push({
      id: `alt_cancel_${cancellation.id}`,
      type: "cancellation-followup",
      severity,
      title: `Cancellation follow-up: ${subscription?.merchant ?? "Subscription"}`,
      message: cancellation.nextAction,
      actionLabel: "Open cancellation center",
      actionHref: "/cancellations",
      occurredAt: cancellation.requestedAt,
      subscriptionId: cancellation.subscriptionId,
      merchant: subscription?.merchant,
    });
  }

  for (const renewal of state.renewals.filter((entry) => entry.status === "blocked" || entry.status === "disputed")) {
    const subscription = subscriptionById.get(renewal.subscriptionId);

    alerts.push({
      id: `alt_renewal_event_${renewal.id}`,
      type: renewal.status === "blocked" ? "blocked-charge" : "dispute",
      severity: renewal.status === "blocked" ? "medium" : "high",
      title:
        renewal.status === "blocked"
          ? `Blocked charge prevented for ${subscription?.merchant ?? "subscription"}`
          : `Disputed charge detected for ${subscription?.merchant ?? "subscription"}`,
      message: `${renewal.note} Amount: $${renewal.amount.toFixed(2)}.`,
      actionLabel: "View subscription detail",
      actionHref: subscription ? `/subscriptions/${subscription.id}` : "/dashboard",
      occurredAt: renewal.date,
      subscriptionId: renewal.subscriptionId,
      merchant: subscription?.merchant,
    });
  }

  for (const dispute of state.disputes) {
    const subscription = subscriptionById.get(dispute.subscriptionId);

    alerts.push({
      id: `alt_dispute_${dispute.id}`,
      type: "dispute",
      severity: dispute.status === "submitted" ? "high" : "medium",
      title: `Dispute ${dispute.status}: ${subscription?.merchant ?? "subscription"}`,
      message: `${dispute.reason} Amount in review: $${dispute.amount.toFixed(2)}.`,
      actionLabel: "Check evidence",
      actionHref: subscription ? `/subscriptions/${subscription.id}` : "/dashboard",
      occurredAt: dispute.incidentDate,
      subscriptionId: dispute.subscriptionId,
      merchant: subscription?.merchant,
    });
  }

  alerts.sort((a, b) => byDateDesc(a.occurredAt, b.occurredAt));
  return structuredClone(alerts.slice(0, 30));
};

export const getDemoStateSnapshot = (userId: string): DemoState => structuredClone(getStateOrThrow(userId));
