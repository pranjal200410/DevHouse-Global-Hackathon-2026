import assert from "assert/strict";
import { buildServer } from "../index";

interface Envelope<T> {
  success: boolean;
  data: T;
}

const main = async (): Promise<void> => {
  process.env.NODE_ENV = "test";
  const app = buildServer();
  const resetKey = process.env.DEMO_RESET_KEY ?? "devhouse-reset-2026";

  try {
    const health = await app.inject({ method: "GET", url: "/health" });
    assert.equal(health.statusCode, 200, "health endpoint failed");

    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/demo-login",
      payload: {
        email: "qa.pranjal@devhouse.app",
        pin: "2026",
      },
    });
    assert.equal(login.statusCode, 200, "login endpoint failed");

    const loginBody = login.json() as Envelope<{ token: string }>;
    assert.equal(loginBody.success, true, "login envelope mismatch");
    const token = loginBody.data.token;
    assert.ok(token, "missing session token");

    const authHeaders = { authorization: `Bearer ${token}` };

    const reset = await app.inject({
      method: "POST",
      url: "/v1/auth/demo-reset",
      headers: {
        ...authHeaders,
        "x-demo-reset-key": resetKey,
      },
    });
    assert.equal(reset.statusCode, 200, "demo reset endpoint failed");

    const session = await app.inject({ method: "GET", url: "/v1/auth/session", headers: authHeaders });
    assert.equal(session.statusCode, 200, "session endpoint failed");

    const dashboard = await app.inject({
      method: "GET",
      url: "/v1/dashboard/summary",
      headers: authHeaders,
    });
    assert.equal(dashboard.statusCode, 200, "dashboard endpoint failed");

    const subscriptionsList = await app.inject({
      method: "GET",
      url: "/v1/subscriptions?sort=renewal-asc",
      headers: authHeaders,
    });
    assert.equal(subscriptionsList.statusCode, 200, "subscriptions list endpoint failed");
    const listBody = subscriptionsList.json() as Envelope<Array<{ id: string }>>;
    assert.ok(Array.isArray(listBody.data), "subscriptions list shape mismatch");
    assert.ok(listBody.data.length >= 10, "expected deterministic dataset of at least 10 subscriptions");

    const targetId = listBody.data[0]?.id;
    assert.ok(targetId, "missing first subscription id");

    const detail = await app.inject({
      method: "GET",
      url: `/v1/subscriptions/${targetId}`,
      headers: authHeaders,
    });
    assert.equal(detail.statusCode, 200, "subscription detail endpoint failed");

    const cancelStart = await app.inject({
      method: "POST",
      url: `/v1/subscriptions/${targetId}/cancel`,
      headers: authHeaders,
    });
    assert.equal(cancelStart.statusCode, 200, "cancel start endpoint failed");

    const cancelDone = await app.inject({
      method: "POST",
      url: `/v1/subscriptions/${targetId}/cancel/complete`,
      headers: authHeaders,
    });
    assert.equal(cancelDone.statusCode, 200, "cancel complete endpoint failed");

    const blockToggle = await app.inject({
      method: "POST",
      url: `/v1/subscriptions/${targetId}/block`,
      headers: authHeaders,
      payload: { enabled: true },
    });
    assert.equal(blockToggle.statusCode, 200, "block toggle endpoint failed");

    const calendar = await app.inject({
      method: "GET",
      url: "/v1/renewals/calendar",
      headers: authHeaders,
    });
    assert.equal(calendar.statusCode, 200, "renewal calendar endpoint failed");
    const calendarBody = calendar.json() as Envelope<Array<{ date: string }>>;
    assert.ok(calendarBody.data.length >= 3, "expected at least 3 upcoming renewal events");

    console.log("API contract smoke checks passed.");
  } finally {
    await app.close();
  }
};

void main();
