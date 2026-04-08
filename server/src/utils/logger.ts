type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatMessage(level: LogLevel, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  if (data !== undefined) {
    return `${base} ${JSON.stringify(data)}`;
  }
  return base;
}

export const logger = {
  info(message: string, data?: unknown) {
    console.log(formatMessage('info', message, data));
  },
  warn(message: string, data?: unknown) {
    console.warn(formatMessage('warn', message, data));
  },
  error(message: string, data?: unknown) {
    console.error(formatMessage('error', message, data));
  },
  debug(message: string, data?: unknown) {
    if (process.env['NODE_ENV'] !== 'production') {
      console.debug(formatMessage('debug', message, data));
    }
  },
};