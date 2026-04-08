"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOrThrow = void 0;
const http_1 = require("./http");
const parseOrThrow = (schema, value, contextLabel) => {
    const parsed = schema.safeParse(value);
    if (parsed.success) {
        return parsed.data;
    }
    throw new http_1.AppError(400, "VALIDATION_ERROR", `Invalid ${contextLabel}.`, {
        issues: parsed.error.issues,
    });
};
exports.parseOrThrow = parseOrThrow;
