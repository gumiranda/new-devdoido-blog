/**
 * Structured logger (Pino-like interface, native console for zero-dependency).
 *
 * Context: workspaceId, runId, videoId — tagged on every log for tracing.
 * In production, swap this with Pino + Axiom/Datadog transport.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  workspaceId?: string;
  runId?: string;
  videoId?: string;
  articleId?: string;
  [key: string]: unknown;
}

function formatMessage(level: LogLevel, msg: string, ctx?: LogContext): string {
  const ts = new Date().toISOString();
  const ctxStr = ctx
    ? " " +
      Object.entries(ctx)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`)
        .join(" ")
    : "";
  return `[${ts}] ${level.toUpperCase()} ${msg}${ctxStr}`;
}

export const logger = {
  debug(msg: string, ctx?: LogContext) {
    console.debug(formatMessage("debug", msg, ctx));
  },
  info(msg: string, ctx?: LogContext) {
    console.info(formatMessage("info", msg, ctx));
  },
  warn(msg: string, ctx?: LogContext) {
    console.warn(formatMessage("warn", msg, ctx));
  },
  error(msg: string, ctx?: LogContext) {
    console.error(formatMessage("error", msg, ctx));
  },
};

/** Create a child logger with pre-bound context. */
export function childLogger(baseCtx: LogContext) {
  return {
    debug(msg: string, ctx?: LogContext) {
      logger.debug(msg, { ...baseCtx, ...ctx });
    },
    info(msg: string, ctx?: LogContext) {
      logger.info(msg, { ...baseCtx, ...ctx });
    },
    warn(msg: string, ctx?: LogContext) {
      logger.warn(msg, { ...baseCtx, ...ctx });
    },
    error(msg: string, ctx?: LogContext) {
      logger.error(msg, { ...baseCtx, ...ctx });
    },
  };
}
