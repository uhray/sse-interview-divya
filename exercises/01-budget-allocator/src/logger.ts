const LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type Level = (typeof LEVELS)[number];

const threshold = LEVELS.indexOf((process.env.LOG_LEVEL as Level) ?? 'info');

function log(level: Level, msg: string, meta?: unknown) {
  if (LEVELS.indexOf(level) < threshold) return;
  const line = meta === undefined ? msg : `${msg} ${JSON.stringify(meta)}`;
  console.error(`[${level}] ${line}`);
}

export const logger = {
  debug: (msg: string, meta?: unknown) => log('debug', msg, meta),
  info: (msg: string, meta?: unknown) => log('info', msg, meta),
  warn: (msg: string, meta?: unknown) => log('warn', msg, meta),
  error: (msg: string, meta?: unknown) => log('error', msg, meta),
};
