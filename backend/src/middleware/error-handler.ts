import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";

/**
 * Application-level error class with HTTP status and error code.
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Shorthand constructors for common errors.
 */
export const Errors = {
  notFound: (resource: string) =>
    new AppError(404, "NOT_FOUND", `${resource} not found`),

  unauthorized: (message = "Authentication required") =>
    new AppError(401, "UNAUTHORIZED", message),

  forbidden: (message = "Insufficient permissions") =>
    new AppError(403, "FORBIDDEN", message),

  badRequest: (message: string, details?: unknown) =>
    new AppError(400, "BAD_REQUEST", message, details),

  conflict: (message: string) =>
    new AppError(409, "CONFLICT", message),

  invalidTransition: (from: string, to: string) =>
    new AppError(
      422,
      "INVALID_TRANSITION",
      `Cannot transition from ${from} to ${to}`
    ),

  deadlineBreached: (deadline: string) =>
    new AppError(422, "DEADLINE_BREACHED", `Deadline breached: ${deadline}`),

  workflowViolation: (message: string) =>
    new AppError(422, "WORKFLOW_VIOLATION", message),

  internal: (message = "Internal server error") =>
    new AppError(500, "INTERNAL_ERROR", message),
};

/**
 * Global error handler. Must be registered last in the middleware chain.
 */
export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  // Unexpected errors — log full stack, return generic message
  logger.error(
    {
      err,
      method: req.method,
      url: req.url,
      userId: req.userId,
    },
    "Unhandled error"
  );

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
}

/**
 * 404 handler for unmatched routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}
