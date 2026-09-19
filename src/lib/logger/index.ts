type LogContext = Record<string, unknown>;

function writeLog(
  level: "info" | "warn" | "error",
  message: string,
  context: LogContext = {},
) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  const output = JSON.stringify(entry);

  switch (level) {
    case "info":
      console.info(output);
      break;

    case "warn":
      console.warn(output);
      break;

    case "error":
      console.error(output);
      break;
  }
}

export const logger = {
  info(message: string, context?: LogContext) {
    writeLog("info", message, context);
  },

  warn(message: string, context?: LogContext) {
    writeLog("warn", message, context);
  },

  error(message: string, context?: LogContext) {
    writeLog("error", message, context);
  },
};