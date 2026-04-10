"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("assert/strict"));
const index_1 = require("../index");
const main = async () => {
    process.env.NODE_ENV = "test";
    const app = (0, index_1.buildServer)();
    const resetKey = process.env.DEMO_RESET_KEY ?? "devhouse-reset-2026";
    try {
        const health = await app.inject({ method: "GET", url: "/health" });
        strict_1.default.equal(health.statusCode, 200, "health endpoint failed");
        const login = await app.inject({
            method: "POST",
            url: "/v1/auth/demo-login",
            payload: {
                email: "qa.pranjal@devhouse.app",
                pin: "2026",
            },
        });
        strict_1.default.equal(login.statusCode, 200, "login endpoint failed");
        const loginBody = login.json();
        strict_1.default.equal(loginBody.success, true, "login envelope mismatch");
        const token = loginBody.data.token;
        strict_1.default.ok(token, "missing session token");
        const authHeaders = { authorization: `Bearer ${token}` };
        const reset = await app.inject({
            method: "POST",
            url: "/v1/auth/demo-reset",
            headers: {
                ...authHeaders,
                "x-demo-reset-key": resetKey,
            },
        });
        strict_1.default.equal(reset.statusCode, 200, "demo reset endpoint failed");
        const session = await app.inject({ method: "GET", url: "/v1/auth/session", headers: authHeaders });
        strict_1.default.equal(session.statusCode, 200, "session endpoint failed");
        const dashboard = await app.inject({
            method: "GET",
            url: "/v1/dashboard/summary",
            headers: authHeaders,
        });
        strict_1.default.equal(dashboard.statusCode, 200, "dashboard endpoint failed");
        const subscriptionsList = await app.inject({
            method: "GET",
            url: "/v1/subscriptions?sort=renewal-asc",
            headers: authHeaders,
        });
        strict_1.default.equal(subscriptionsList.statusCode, 200, "subscriptions list endpoint failed");
        const listBody = subscriptionsList.json();
        strict_1.default.ok(Array.isArray(listBody.data), "subscriptions list shape mismatch");
        strict_1.default.ok(listBody.data.length >= 10, "expected deterministic dataset of at least 10 subscriptions");
        const targetId = listBody.data[0]?.id;
        strict_1.default.ok(targetId, "missing first subscription id");
        const detail = await app.inject({
            method: "GET",
            url: `/v1/subscriptions/${targetId}`,
            headers: authHeaders,
        });
        strict_1.default.equal(detail.statusCode, 200, "subscription detail endpoint failed");
        const cancelStart = await app.inject({
            method: "POST",
            url: `/v1/subscriptions/${targetId}/cancel`,
            headers: authHeaders,
        });
        strict_1.default.equal(cancelStart.statusCode, 200, "cancel start endpoint failed");
        const cancelDone = await app.inject({
            method: "POST",
            url: `/v1/subscriptions/${targetId}/cancel/complete`,
            headers: authHeaders,
        });
        strict_1.default.equal(cancelDone.statusCode, 200, "cancel complete endpoint failed");
        const blockToggle = await app.inject({
            method: "POST",
            url: `/v1/subscriptions/${targetId}/block`,
            headers: authHeaders,
            payload: { enabled: true },
        });
        strict_1.default.equal(blockToggle.statusCode, 200, "block toggle endpoint failed");
        const calendar = await app.inject({
            method: "GET",
            url: "/v1/renewals/calendar",
            headers: authHeaders,
        });
        strict_1.default.equal(calendar.statusCode, 200, "renewal calendar endpoint failed");
        const calendarBody = calendar.json();
        strict_1.default.ok(calendarBody.data.length >= 3, "expected at least 3 upcoming renewal events");
        const cancellationCenter = await app.inject({
            method: "GET",
            url: "/v1/cancellations/center",
            headers: authHeaders,
        });
        strict_1.default.equal(cancellationCenter.statusCode, 200, "cancellation center endpoint failed");
        const cancellationCenterBody = cancellationCenter.json();
        strict_1.default.ok(cancellationCenterBody.data.length >= 1, "expected cancellation center rows");
        strict_1.default.ok(cancellationCenterBody.data.every((row) => row.progressPercent >= 0 && row.progressPercent <= 100), "invalid cancellation progress values");
        const protectionControls = await app.inject({
            method: "GET",
            url: "/v1/protection-controls",
            headers: authHeaders,
        });
        strict_1.default.equal(protectionControls.statusCode, 200, "protection controls endpoint failed");
        const protectionBody = protectionControls.json();
        strict_1.default.ok(protectionBody.data.controls.length >= 1, "expected protection controls");
        const controlTarget = protectionBody.data.controls[0];
        strict_1.default.ok(controlTarget?.subscriptionId, "missing protection control target id");
        const protectionUpdate = await app.inject({
            method: "POST",
            url: `/v1/protection-controls/${controlTarget.subscriptionId}`,
            headers: authHeaders,
            payload: {
                enabled: !controlTarget.autoBlockEnabled,
            },
        });
        strict_1.default.equal(protectionUpdate.statusCode, 200, "protection update endpoint failed");
        const alertsFeed = await app.inject({
            method: "GET",
            url: "/v1/alerts/feed",
            headers: authHeaders,
        });
        strict_1.default.equal(alertsFeed.statusCode, 200, "alerts feed endpoint failed");
        const alertsBody = alertsFeed.json();
        strict_1.default.ok(alertsBody.data.length >= 1, "expected at least one alert");
        strict_1.default.ok(alertsBody.data.every((alert) => ["low", "medium", "high"].includes(alert.severity)), "alerts feed returned invalid severity");
        console.log("API contract smoke checks passed.");
    }
    finally {
        await app.close();
    }
};
void main();
