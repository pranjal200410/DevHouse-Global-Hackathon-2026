"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.toError = exports.toSuccess = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, code, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
const toSuccess = (data) => ({
    success: true,
    data,
});
exports.toSuccess = toSuccess;
const toError = (code, message, details) => ({
    success: false,
    error: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
    },
});
exports.toError = toError;
const sendError = (reply, statusCode, code, message, details) => reply.status(statusCode).send((0, exports.toError)(code, message, details));
exports.sendError = sendError;
