import pino, { LoggerOptions } from 'pino';

const prettyFormat: LoggerOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      singleLine: false,
      colorize: true,
    },
  },
  level: 'debug',
};

const defaultFormat: LoggerOptions = {
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label) {
      return { level: label };
    },
    bindings() {
      return {};
    },
  },
};

const loggerOptions = pino(
  process.env.NODE_ENV === 'production' ? defaultFormat : prettyFormat,
);

export class Logger {
  private readonly logger: pino.Logger;

  constructor(name?: string) {
    this.logger = pino({ ...loggerOptions, name });
  }

  init(message: string, objects?: Record<string, unknown>) {
    this.logger.info({ objects }, `🚀🚀🚀 (START) ${message}`);
  }

  end(message: string, objects?: Record<string, unknown>) {
    this.logger.info({ objects }, `😍😍😍 (END) ${message}`);
  }

  error(message: string, objects?: Record<string, unknown>) {
    this.logger.error({ objects }, `😿😿😿 (ERROR) ${message}`);
  }

  process(message: string, objects?: Record<string, unknown>) {
    this.logger.info({ objects }, `❤️‍🔥❤️‍🔥❤️‍🔥 (PROCESS) ${message}`);
  }

  debug(message: string, objects?: Record<string, unknown>) {
    this.logger.debug({ objects }, ` 🐛🐛🐛 (DEBUG) ${message}`);
  }

  fromError(error: unknown) {
    const { message, stack } = error as Error;

    this.error(`${message}`, {
      stack,
      message,
    });
  }
}
