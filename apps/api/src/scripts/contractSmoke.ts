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

    const cancellationCenter = await app.inject({
      method: "GET",
      url: "/v1/cancellations/center",
      headers: authHeaders,
    });
    assert.equal(cancellationCenter.statusCode, 200, "cancellation center endpoint failed");
    const cancellationCenterBody = cancellationCenter.json() as Envelope<Array<{ progressPercent: number }>>;
    assert.ok(cancellationCenterBody.data.length >= 1, "expected cancellation center rows");
    assert.ok(
      cancellationCenterBody.data.every((row) => row.progressPercent >= 0 && row.progressPercent <= 100),
      "invalid cancellation progress values",
    );

    const protectionControls = await app.inject({
      method: "GET",
      url: "/v1/protection-controls",
      headers: authHeaders,
    });
    assert.equal(protectionControls.statusCode, 200, "protection controls endpoint failed");
    const protectionBody = protectionControls.json() as Envelope<{
      controls: Array<{ subscriptionId: string; autoBlockEnabled: boolean }>;
    }>;
    assert.ok(protectionBody.data.controls.length >= 1, "expected protection controls");

    const controlTarget = protectionBody.data.controls[0];
    assert.ok(controlTarget?.subscriptionId, "missing protection control target id");

    const protectionUpdate = await app.inject({
      method: "POST",
      url: `/v1/protection-controls/${controlTarget.subscriptionId}`,
      headers: authHeaders,
      payload: {
        enabled: !controlTarget.autoBlockEnabled,
      },
    });
    assert.equal(protectionUpdate.statusCode, 200, "protection update endpoint failed");

    const disputeStudio = await app.inject({
      method: "GET",
      url: "/v1/disputes/studio",
      headers: authHeaders,
    });
    assert.equal(disputeStudio.statusCode, 200, "dispute studio endpoint failed");
    const disputeStudioBody = disputeStudio.json() as Envelope<{
      summary: {
        openDisputes: number;
      };
      disputes: Array<{ evidenceProgressPercent: number }>;
    }>;
    assert.ok(Array.isArray(disputeStudioBody.data.disputes), "dispute studio disputes shape mismatch");
    assert.ok(
      disputeStudioBody.data.disputes.every(
        (dispute) => dispute.evidenceProgressPercent >= 0 && dispute.evidenceProgressPercent <= 100,
      ),
      "dispute studio evidence progress values are invalid",
    );

    const alertsFeed = await app.inject({
      method: "GET",
      url: "/v1/alerts/feed",
      headers: authHeaders,
    });
    assert.equal(alertsFeed.statusCode, 200, "alerts feed endpoint failed");
    const alertsBody = alertsFeed.json() as Envelope<Array<{ severity: string; occurredAt: string }>>;
    assert.ok(alertsBody.data.length >= 1, "expected at least one alert");
    assert.ok(
      alertsBody.data.every((alert) => ["low", "medium", "high"].includes(alert.severity)),
      "alerts feed returned invalid severity",
    );

    console.log("API contract smoke checks passed.");
  } finally {
    await app.close();
  }
};

void main();
