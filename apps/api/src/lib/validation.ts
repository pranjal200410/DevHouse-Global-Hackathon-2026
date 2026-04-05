import { z } from "zod";
import { AppError } from "./http";

export const parseOrThrow = <T extends z.ZodTypeAny>(
  schema: T,
  value: unknown,
  contextLabel: string,
): z.infer<T> => {
  const parsed = schema.safeParse(value);
  if (parsed.success) {
    return parsed.data;
  }

  throw new AppError(400, "VALIDATION_ERROR", `Invalid ${contextLabel}.`, {
    issues: parsed.error.issues,
  });
};
