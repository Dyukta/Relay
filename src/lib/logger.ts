type LogLevel = "info" | "success" | "error" | "warn"

interface LogEntry {
  level: LogLevel
  message: string
  meta?: Record<string, unknown>
  timestamp: string
}

const formatEntry = (entry: LogEntry): string => {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`
  if (entry.meta && Object.keys(entry.meta).length > 0) {
    return `${base} ${JSON.stringify(entry.meta)}`
  }
  return base
}

const createEntry = (
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
): LogEntry => ({
  level,
  message,
  meta,
  timestamp: new Date().toISOString()
})

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    const entry = createEntry("info", message, meta)
    console.log(formatEntry(entry))
  },

  success: (message: string, meta?: Record<string, unknown>) => {
    const entry = createEntry("success", message, meta)
    console.log(formatEntry(entry))
  },

  error: (message: string, meta?: Record<string, unknown>) => {
    const entry = createEntry("error", message, meta)
    console.error(formatEntry(entry))
  },

  warn: (message: string, meta?: Record<string, unknown>) => {
    const entry = createEntry("warn", message, meta)
    console.warn(formatEntry(entry))
  },
}