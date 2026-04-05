import { randomUUID } from "crypto";
import type { Session } from "../types";

const SESSION_TTL_HOURS = 12;
const sessions = new Map<string, Session>();

const nowIso = () => new Date().toISOString();

export const createSession = (userId: string): Session => {
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();

  const session: Session = {
    token: randomUUID(),
    userId,
    demoMode: true,
    createdAt,
    expiresAt,
  };

  sessions.set(session.token, session);
  return session;
};

export const getSession = (token: string): Session | null => {
  const session = sessions.get(token);
  if (!session) {
    return null;
  }

  if (Date.parse(session.expiresAt) <= Date.now()) {
    sessions.delete(token);
    return null;
  }

  return session;
};

export const revokeSession = (token: string): boolean => sessions.delete(token);

export const clearSessions = (): void => {
  sessions.clear();
};
