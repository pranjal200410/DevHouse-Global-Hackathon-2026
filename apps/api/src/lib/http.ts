import type { FastifyReply } from "fastify";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

export interface ErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const toSuccess = <T>(data: T): SuccessEnvelope<T> => ({
  success: true,
  data,
});

export const toError = (
  code: string,
  message: string,
  details?: unknown,
): ErrorEnvelope => ({
  success: false,
  error: {
    code,
    message,
    ...(details === undefined ? {} : { details }),
  },
});

export const sendError = (
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
) => reply.status(statusCode).send(toError(code, message, details));
