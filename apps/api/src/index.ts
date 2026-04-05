import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { AppError, sendError } from "./lib/http";
import { registerAppRoutes } from "./routes";

const defaultOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

const readOrigins = (): string[] => {
  const fromEnv = process.env.CORS_ORIGIN?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return fromEnv && fromEnv.length > 0 ? fromEnv : defaultOrigins;
};

export const buildServer = (): FastifyInstance => {
  const app = Fastify({
    logger: process.env.NODE_ENV !== "test",
  });

  app.register(cors, {
    origin: readOrigins(),
    credentials: true,
  });

  registerAppRoutes(app);

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return sendError(reply, error.statusCode, error.code, error.message, error.details);
    }

    request.log.error(error, "Unhandled API error");
    return sendError(reply, 500, "INTERNAL_SERVER_ERROR", "Unexpected server error.");
  });

  app.setNotFoundHandler((_request, reply) =>
    sendError(reply, 404, "NOT_FOUND", "The requested endpoint does not exist."),
  );

  return app;
};

export const startServer = async (): Promise<void> => {
  const app = buildServer();
  const port = Number(process.env.PORT ?? 4000);
  const host = process.env.HOST ?? "0.0.0.0";

  try {
    await app.listen({ port, host });
    app.log.info(`API listening on http://${host}:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  void startServer();
}
