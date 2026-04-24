import assert from "node:assert/strict";
import test from "node:test";
import type { FastifyInstance } from "fastify";
import { buildServer } from "../src/index";

interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

const RESET_KEY = process.env.DEMO_RESET_KEY ?? "devhouse-reset-2026";

const uniqueEmail = (prefix: string): string =>
  `${prefix}.${Date.now()}.${Math.floor(Math.random() * 100000)}@devhouse.app`;

const login = async (app: FastifyInstance, email: string, pin = "2026"): Promise<string> => {
  const response = await app.inject({
    method: "POST",
    url: "/v1/auth/demo-login",
    payload: { email, pin },
  });

  assert.equal(response.statusCode, 200, `expected login success for ${email}`);
  const body = response.json() as SuccessEnvelope<{ token: string }>;
  return body.data.token;
};

test("demo login enforces pin validation", async () => {
  const app = buildServer();

  try {
    const missingPin = await app.inject({
      method: "POST",
      url: "/v1/auth/demo-login",
      payload: { email: uniqueEmail("missing-pin") },
    });
    assert.equal(missingPin.statusCode, 400);

    const wrongPin = await app.inject({
      method: "POST",
      url: "/v1/auth/demo-login",
      payload: { email: uniqueEmail("wrong-pin"), pin: "0000" },
    });
    assert.equal(wrongPin.statusCode, 401);

    const validLogin = await app.inject({
      method: "POST",
      url: "/v1/auth/demo-login",
      payload: { email: uniqueEmail("valid-pin"), pin: "2026" },
    });
    assert.equal(validLogin.statusCode, 200);
  } finally {
    await app.close();
  }
});

test("demo reset requires both auth and reset key", async () => {
  const app = buildServer();

  try {
    const token = await login(app, uniqueEmail("reset-protection"));

    const withoutAuth = await app.inject({
      method: "POST",
      url: "/v1/auth/demo-reset",
    });
    assert.equal(withoutAuth.statusCode, 401);

    const withoutKey = await app.inject({
      method: "POST",
      url: "/v1/auth/demo-reset",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    assert.equal(withoutKey.statusCode, 403);

    const wrongKey = await app.inject({
      method: "POST",
      url: "/v1/auth/demo-reset",
      headers: {
        authorization: `Bearer ${token}`,
        "x-demo-reset-key": "wrong-key",
      },
    });
    assert.equal(wrongKey.statusCode, 403);

    const validReset = await app.inject({
      method: "POST",
      url: "/v1/auth/demo-reset",
      headers: {
        authorization: `Bearer ${token}`,
        "x-demo-reset-key": RESET_KEY,
      },
    });
    assert.equal(validReset.statusCode, 200);
  } finally {
    await app.close();
  }
});

test("sessions are isolated across demo users", async () => {
  const app = buildServer();

  try {
    const tokenA = await login(app, uniqueEmail("isolation-a"));
    const tokenB = await login(app, uniqueEmail("isolation-b"));

    const sessionA = await app.inject({
      method: "GET",
      url: "/v1/auth/session",
      headers: { authorization: `Bearer ${tokenA}` },
    });
    const sessionB = await app.inject({
      method: "GET",
      url: "/v1/auth/session",
      headers: { authorization: `Bearer ${tokenB}` },
    });

    assert.equal(sessionA.statusCode, 200);
    assert.equal(sessionB.statusCode, 200);

    const sessionABody = sessionA.json() as SuccessEnvelope<{ user: { id: string; email: string } }>;
    const sessionBBody = sessionB.json() as SuccessEnvelope<{ user: { id: string; email: string } }>;

    assert.notEqual(sessionABody.data.user.id, sessionBBody.data.user.id);
    assert.notEqual(sessionABody.data.user.email, sessionBBody.data.user.email);

    const cancelForA = await app.inject({
      method: "POST",
      url: "/v1/subscriptions/sub_adobe/cancel",
      headers: { authorization: `Bearer ${tokenA}` },
    });
    assert.equal(cancelForA.statusCode, 200);

    const detailA = await app.inject({
      method: "GET",
      url: "/v1/subscriptions/sub_adobe",
      headers: { authorization: `Bearer ${tokenA}` },
    });
    const detailB = await app.inject({
      method: "GET",
      url: "/v1/subscriptions/sub_adobe",
      headers: { authorization: `Bearer ${tokenB}` },
    });

    assert.equal(detailA.statusCode, 200);
    assert.equal(detailB.statusCode, 200);

    const detailABody = detailA.json() as SuccessEnvelope<{ subscription: { status: string } }>;
    const detailBBody = detailB.json() as SuccessEnvelope<{ subscription: { status: string } }>;

    assert.equal(detailABody.data.subscription.status, "canceling");
    assert.equal(detailBBody.data.subscription.status, "active");
  } finally {
    await app.close();
  }
});

test("protected endpoints reject missing authorization token", async () => {
  const app = buildServer();

  try {
    const checks = await Promise.all([
      app.inject({ method: "GET", url: "/v1/auth/session" }),
      app.inject({ method: "POST", url: "/v1/auth/logout" }),
      app.inject({ method: "GET", url: "/v1/dashboard/summary" }),
      app.inject({ method: "GET", url: "/v1/dashboard/savings-opportunities" }),
      app.inject({ method: "GET", url: "/v1/subscriptions" }),
      app.inject({ method: "GET", url: "/v1/subscriptions/sub_netflix" }),
      app.inject({ method: "POST", url: "/v1/subscriptions/sub_netflix/cancel" }),
      app.inject({ method: "POST", url: "/v1/subscriptions/sub_netflix/cancel/complete" }),
      app.inject({
        method: "POST",
        url: "/v1/subscriptions/sub_netflix/block",
        payload: { enabled: true },
      }),
      app.inject({ method: "GET", url: "/v1/renewals/calendar" }),
      app.inject({ method: "GET", url: "/v1/cancellations/center" }),
      app.inject({ method: "GET", url: "/v1/protection-controls" }),
      app.inject({
        method: "POST",
        url: "/v1/protection-controls/sub_netflix",
        payload: { enabled: true },
      }),
      app.inject({ method: "GET", url: "/v1/disputes/studio" }),
      app.inject({ method: "GET", url: "/v1/alerts/feed" }),
      app.inject({ method: "POST", url: "/v1/integrations/inbox/sync", payload: { maxMessages: 10 } }),
      app.inject({ method: "GET", url: "/v1/integrations/proof-log?limit=10" }),
    ]);

    for (const response of checks) {
      assert.equal(response.statusCode, 401);
    }
  } finally {
    await app.close();
  }
});

test("dashboard savings opportunities returns ranked rows with positive savings", async () => {
  const app = buildServer();

  try {
    const token = await login(app, uniqueEmail("savings-opps"));

    const response = await app.inject({
      method: "GET",
      url: "/v1/dashboard/savings-opportunities",
      headers: { authorization: `Bearer ${token}` },
    });

    assert.equal(response.statusCode, 200);

    const body = response.json() as SuccessEnvelope<
      Array<{
        annualSavings: number;
        monthlySavings: number;
        confidenceScore: number;
        action: string;
      }>
    >;

    assert.ok(body.data.length > 0);
    assert.ok(body.data.length <= 5);

    for (const row of body.data) {
      assert.ok(row.annualSavings > 0);
      assert.ok(row.monthlySavings > 0);
      assert.ok(row.confidenceScore >= 0 && row.confidenceScore <= 100);
      assert.ok(["cancel", "downgrade", "switch"].includes(row.action));
    }
  } finally {
    await app.close();
  }
});

test("invalid subscription id returns 404 across detail and mutation endpoints", async () => {
  const app = buildServer();

  try {
    const token = await login(app, uniqueEmail("invalid-sub"));
    const headers = { authorization: `Bearer ${token}` };

    const unknownId = "sub_does_not_exist";

    const responses = await Promise.all([
      app.inject({ method: "GET", url: `/v1/subscriptions/${unknownId}`, headers }),
      app.inject({ method: "POST", url: `/v1/subscriptions/${unknownId}/cancel`, headers }),
      app.inject({ method: "POST", url: `/v1/subscriptions/${unknownId}/cancel/complete`, headers }),
      app.inject({
        method: "POST",
        url: `/v1/subscriptions/${unknownId}/block`,
        headers,
        payload: { enabled: true },
      }),
      app.inject({
        method: "POST",
        url: `/v1/protection-controls/${unknownId}`,
        headers,
        payload: { enabled: true },
      }),
    ]);

    for (const response of responses) {
      assert.equal(response.statusCode, 404);
    }
  } finally {
    await app.close();
  }
});
