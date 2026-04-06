import { randomUUID } from "crypto";
import type { Session, User } from "../types";

const SESSION_TTL_HOURS = 12;
const sessions = new Map<string, Session>();

const nowIso = () => new Date().toISOString();

const cloneSession = (session: Session): Session => ({
  ...session,
  user: structuredClone(session.user),
});

export const createSession = (user: User): Session => {
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();

  const session: Session = {
    token: randomUUID(),
    userId: user.id,
    user: structuredClone(user),
    demoMode: true,
    createdAt,
    expiresAt,
  };

  sessions.set(session.token, session);
  return cloneSession(session);
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

  return cloneSession(session);
};

export const revokeSession = (token: string): boolean => sessions.delete(token);

export const clearSessions = (): void => {
  sessions.clear();
};
