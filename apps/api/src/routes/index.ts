import type { FastifyInstance } from "fastify";
import { registerAuthRoutes } from "./auth";
import { registerDashboardRoutes } from "./dashboard";
import { registerHealthRoute } from "./health";
import { registerIntegrationRoutes } from "./integrations";
import { registerOperationsRoutes } from "./operations";
import { registerSubscriptionRoutes } from "./subscriptions";

export const registerAppRoutes = (fastify: FastifyInstance): void => {
  registerHealthRoute(fastify);

  fastify.register(
    async (versionedFastify) => {
      registerAuthRoutes(versionedFastify);
      registerDashboardRoutes(versionedFastify);
      registerSubscriptionRoutes(versionedFastify);
      registerOperationsRoutes(versionedFastify);
      registerIntegrationRoutes(versionedFastify);
    },
    { prefix: "/v1" },
  );
};
