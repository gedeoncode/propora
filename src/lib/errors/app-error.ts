export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "EXTERNAL_SERVICE_ERROR"
  | "INTERNAL_SERVER_ERROR";

const DEFAULT_STATUS_BY_CODE: Record<AppErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  EXTERNAL_SERVICE_ERROR: 502,
  INTERNAL_SERVER_ERROR: 500,
};

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    code: AppErrorCode,
    message: string,
    statusCode?: number,
  ) {
    super(message);

    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode ?? DEFAULT_STATUS_BY_CODE[code];
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}