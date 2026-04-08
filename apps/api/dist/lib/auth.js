"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.getBearerToken = void 0;
const http_1 = require("./http");
const sessionStore_1 = require("./sessionStore");
const getBearerToken = (request) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new http_1.AppError(401, "UNAUTHORIZED", "Authorization header is missing.");
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        throw new http_1.AppError(401, "UNAUTHORIZED", "Authorization header must use Bearer token format.");
    }
    return token;
};
exports.getBearerToken = getBearerToken;
const requireAuth = (request) => {
    const token = (0, exports.getBearerToken)(request);
    const session = (0, sessionStore_1.getSession)(token);
    if (!session) {
        throw new http_1.AppError(401, "SESSION_EXPIRED", "Session is invalid or expired.");
    }
    const user = session.user;
    return {
        token,
        session,
        user,
    };
};
exports.requireAuth = requireAuth;
