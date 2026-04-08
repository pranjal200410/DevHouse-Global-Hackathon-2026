"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.buildServer = void 0;
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_1 = __importDefault(require("fastify"));
const http_1 = require("./lib/http");
const routes_1 = require("./routes");
const defaultOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const readOrigins = () => {
    const fromEnv = process.env.CORS_ORIGIN?.split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    return fromEnv && fromEnv.length > 0 ? fromEnv : defaultOrigins;
};
const buildServer = () => {
    const app = (0, fastify_1.default)({
        logger: process.env.NODE_ENV !== "test",
    });
    app.register(cors_1.default, {
        origin: readOrigins(),
        credentials: true,
    });
    (0, routes_1.registerAppRoutes)(app);
    app.setErrorHandler((error, request, reply) => {
        if (error instanceof http_1.AppError) {
            return (0, http_1.sendError)(reply, error.statusCode, error.code, error.message, error.details);
        }
        request.log.error(error, "Unhandled API error");
        return (0, http_1.sendError)(reply, 500, "INTERNAL_SERVER_ERROR", "Unexpected server error.");
    });
    app.setNotFoundHandler((_request, reply) => (0, http_1.sendError)(reply, 404, "NOT_FOUND", "The requested endpoint does not exist."));
    return app;
};
exports.buildServer = buildServer;
const startServer = async () => {
    const app = (0, exports.buildServer)();
    const port = Number(process.env.PORT ?? 4000);
    const host = process.env.HOST ?? "0.0.0.0";
    try {
        await app.listen({ port, host });
        app.log.info(`API listening on http://${host}:${port}`);
    }
    catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};
exports.startServer = startServer;
if (require.main === module) {
    void (0, exports.startServer)();
}
