"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAppRoutes = void 0;
const auth_1 = require("./auth");
const dashboard_1 = require("./dashboard");
const health_1 = require("./health");
const operations_1 = require("./operations");
const subscriptions_1 = require("./subscriptions");
const registerAppRoutes = (fastify) => {
    (0, health_1.registerHealthRoute)(fastify);
    fastify.register(async (versionedFastify) => {
        (0, auth_1.registerAuthRoutes)(versionedFastify);
        (0, dashboard_1.registerDashboardRoutes)(versionedFastify);
        (0, subscriptions_1.registerSubscriptionRoutes)(versionedFastify);
        (0, operations_1.registerOperationsRoutes)(versionedFastify);
    }, { prefix: "/v1" });
};
exports.registerAppRoutes = registerAppRoutes;
