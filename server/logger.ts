type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;
  private minLevel: LogLevel;
  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  private constructor() {
    this.minLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.minLevel];
  }

  private formatEntry(entry: LogEntry): string {
    const time = new Date().toLocaleTimeString('en-US', { hour12: true });
    const dataStr = entry.data ? ` ${JSON.stringify(entry.data)}` : '';
    return `${time} [${entry.module}] ${entry.level.toUpperCase()}: ${entry.message}${dataStr}`;
  }

  private log(level: LogLevel, module: string, message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data
    };

    const formatted = this.formatEntry(entry);

    switch (level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      default:
        console.log(formatted);
    }
  }

  public debug(module: string, message: string, data?: Record<string, unknown>): void {
    this.log('debug', module, message, data);
  }

  public info(module: string, message: string, data?: Record<string, unknown>): void {
    this.log('info', module, message, data);
  }

  public warn(module: string, message: string, data?: Record<string, unknown>): void {
    this.log('warn', module, message, data);
  }

  public error(module: string, message: string, data?: Record<string, unknown>): void {
    this.log('error', module, message, data);
  }

  public child(module: string): ModuleLogger {
    return new ModuleLogger(this, module);
  }
}

class ModuleLogger {
  constructor(private parent: Logger, private module: string) {}

  debug(message: string, data?: Record<string, unknown>): void {
    this.parent.debug(this.module, message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.parent.info(this.module, message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.parent.warn(this.module, message, data);
  }

  error(message: string, data?: Record<string, unknown>): void {
    this.parent.error(this.module, message, data);
  }
}

export const logger = Logger.getInstance();
export type { LogLevel, LogEntry, ModuleLogger };
