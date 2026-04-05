import type {
  ApiEnvelope,
  DashboardSummary,
  RenewalCalendarItem,
  SessionResponse,
  Subscription,
  SubscriptionDetail,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export class ClientError extends Error {
  constructor(public readonly statusCode: number, public readonly apiError: ApiError) {
    super(apiError.message);
    this.name = "ClientError";
  }
}

const buildHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const request = async <T>(
  path: string,
  options: Omit<RequestInit, "headers"> & { token?: string } = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options.token),
    cache: "no-store",
  });

  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !envelope.success) {
    const fallback = {
      code: "CLIENT_ERROR",
      message: "Unexpected API error.",
    };
    const apiError = envelope.success ? fallback : envelope.error;
    throw new ClientError(response.status, apiError);
  }

  return envelope.data;
};

export const demoLogin = async (payload: { email?: string; pin?: string }): Promise<SessionResponse> =>
  request<SessionResponse>("/v1/auth/demo-login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getSession = async (token: string): Promise<SessionResponse> =>
  request<SessionResponse>("/v1/auth/session", {
    method: "GET",
    token,
  });

export const logoutSession = async (token: string): Promise<{ loggedOut: boolean }> =>
  request<{ loggedOut: boolean }>("/v1/auth/logout", {
    method: "POST",
    token,
  });

export const getDashboardSummary = async (token: string): Promise<DashboardSummary> =>
  request<DashboardSummary>("/v1/dashboard/summary", {
    method: "GET",
    token,
  });

export const getSubscriptions = async (
  token: string,
  params?: {
    status?: "active" | "canceling" | "cancelled";
    riskLevel?: "low" | "medium" | "high";
    sort?: "renewal-asc" | "amount-desc" | "amount-asc";
  },
): Promise<Subscription[]> => {
  const query = new URLSearchParams();
  if (params?.status) {
    query.set("status", params.status);
  }
  if (params?.riskLevel) {
    query.set("riskLevel", params.riskLevel);
  }
  if (params?.sort) {
    query.set("sort", params.sort);
  }

  const queryString = query.toString();
  return request<Subscription[]>(`/v1/subscriptions${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    token,
  });
};

export const getSubscriptionDetail = async (token: string, subscriptionId: string): Promise<SubscriptionDetail> =>
  request<SubscriptionDetail>(`/v1/subscriptions/${subscriptionId}`, {
    method: "GET",
    token,
  });

export const startCancellation = async (token: string, subscriptionId: string): Promise<SubscriptionDetail> =>
  request<SubscriptionDetail>(`/v1/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    token,
  });

export const completeCancellation = async (token: string, subscriptionId: string): Promise<SubscriptionDetail> =>
  request<SubscriptionDetail>(`/v1/subscriptions/${subscriptionId}/cancel/complete`, {
    method: "POST",
    token,
  });

export const setAutoBlock = async (
  token: string,
  subscriptionId: string,
  enabled: boolean,
): Promise<SubscriptionDetail> =>
  request<SubscriptionDetail>(`/v1/subscriptions/${subscriptionId}/block`, {
    method: "POST",
    token,
    body: JSON.stringify({ enabled }),
  });

export const getRenewalCalendar = async (token: string): Promise<RenewalCalendarItem[]> =>
  request<RenewalCalendarItem[]>("/v1/renewals/calendar", {
    method: "GET",
    token,
  });
