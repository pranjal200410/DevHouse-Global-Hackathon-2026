import type { FastifyRequest } from "fastify";
import { getDemoUser } from "../data/demoState";
import type { Session, User } from "../types";
import { AppError } from "./http";
import { getSession } from "./sessionStore";

export interface AuthContext {
  token: string;
  session: Session;
  user: User;
}

export const getBearerToken = (request: FastifyRequest): string => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError(401, "UNAUTHORIZED", "Authorization header is missing.");
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new AppError(401, "UNAUTHORIZED", "Authorization header must use Bearer token format.");
  }
  return token;
};

export const requireAuth = (request: FastifyRequest): AuthContext => {
  const token = getBearerToken(request);
  const session = getSession(token);
  if (!session) {
    throw new AppError(401, "SESSION_EXPIRED", "Session is invalid or expired.");
  }

  const user = getDemoUser();
  if (user.id !== session.userId) {
    throw new AppError(401, "SESSION_USER_MISMATCH", "Session user does not match demo user.");
  }

  return {
    token,
    session,
    user,
  };
};
