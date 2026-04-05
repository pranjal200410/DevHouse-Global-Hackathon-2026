import type { FastifyInstance } from "fastify";
import { registerAuthRoutes } from "./auth";
import { registerDashboardRoutes } from "./dashboard";
import { registerHealthRoute } from "./health";
import { registerSubscriptionRoutes } from "./subscriptions";

export const registerAppRoutes = (fastify: FastifyInstance): void => {
  registerHealthRoute(fastify);

  fastify.register(
    async (versionedFastify) => {
      registerAuthRoutes(versionedFastify);
      registerDashboardRoutes(versionedFastify);
      registerSubscriptionRoutes(versionedFastify);
    },
    { prefix: "/v1" },
  );
};
