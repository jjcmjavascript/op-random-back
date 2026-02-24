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

const extractErrorFromArgs = (args: unknown[]) => {
  return args.map((arg) => {
    if (arg instanceof Error) {
      return {
        message: arg.message,
        stack: arg.stack,
      };
    }
    return arg;
  });
};
export class Logger {
  private readonly logger: pino.Logger;

  constructor(name?: string) {
    this.logger = pino({ ...loggerOptions, name });
  }

  init(message: string, ...args: unknown[]) {
    this.logger.info(extractErrorFromArgs(args), `🚀🚀🚀 (START) ${message}`);
  }

  end(message: string, ...args: unknown[]) {
    this.logger.info(extractErrorFromArgs(args), `😍😍😍 (END) ${message}`);
  }

  error(message: string, ...args: unknown[]) {
    this.logger.error(extractErrorFromArgs(args), `😿😿😿 (ERROR) ${message}`);
  }

  process(message: string, ...args: unknown[]) {
    this.logger.info(extractErrorFromArgs(args), `❤️‍🔥❤️‍🔥❤️‍🔥 (PROCESS) ${message}`);
  }

  debug(message: string, ...args: unknown[]) {
    this.logger.debug(extractErrorFromArgs(args), ` 🐛🐛🐛 (DEBUG) ${message}`);
  }

  fromError(error: unknown) {
    const { message, stack } = error as Error;

    this.error(`${message}`, {
      stack,
      message,
    });
  }
}
