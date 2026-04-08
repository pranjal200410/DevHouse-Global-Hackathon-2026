"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSessions = exports.revokeSession = exports.getSession = exports.createSession = void 0;
const crypto_1 = require("crypto");
const SESSION_TTL_HOURS = 12;
const sessions = new Map();
const nowIso = () => new Date().toISOString();
const cloneSession = (session) => ({
    ...session,
    user: structuredClone(session.user),
});
const createSession = (user) => {
    const createdAt = nowIso();
    const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();
    const session = {
        token: (0, crypto_1.randomUUID)(),
        userId: user.id,
        user: structuredClone(user),
        demoMode: true,
        createdAt,
        expiresAt,
    };
    sessions.set(session.token, session);
    return cloneSession(session);
};
exports.createSession = createSession;
const getSession = (token) => {
    const session = sessions.get(token);
    if (!session) {
        return null;
    }
    if (Date.parse(session.expiresAt) <= Date.now()) {
        sessions.delete(token);
        return null;
    }
    return cloneSession(session);
};
exports.getSession = getSession;
const revokeSession = (token) => sessions.delete(token);
exports.revokeSession = revokeSession;
const clearSessions = () => {
    sessions.clear();
};
exports.clearSessions = clearSessions;
