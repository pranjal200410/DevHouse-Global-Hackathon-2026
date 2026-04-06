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
      url: "/v1/subscriptions/sub_netflix/cancel",
      headers: { authorization: `Bearer ${tokenA}` },
    });
    assert.equal(cancelForA.statusCode, 200);

    const detailA = await app.inject({
      method: "GET",
      url: "/v1/subscriptions/sub_netflix",
      headers: { authorization: `Bearer ${tokenA}` },
    });
    const detailB = await app.inject({
      method: "GET",
      url: "/v1/subscriptions/sub_netflix",
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
