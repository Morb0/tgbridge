import { Logger as NestJSLogger } from '@nestjs/common';
import { Logger as GramLogger } from 'telegram';
import { LogLevel } from 'telegram/extensions/Logger';

export class TelegramLogger extends GramLogger {
  private readonly logger = new NestJSLogger(this.constructor.name);

  log(level: LogLevel, message: string, color: string) {
    switch (level) {
      case LogLevel.ERROR:
        this.logger.error(message);
        break;
      case LogLevel.WARN:
        this.logger.warn(message);
        break;
      case LogLevel.INFO:
        this.logger.log(message);
        break;
      case LogLevel.DEBUG:
        this.logger.debug(message);
        break;
      default:
        this.logger.verbose(message);
    }
  }
}
