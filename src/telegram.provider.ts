import { Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TelegramClient } from 'telegram';
import { LogLevel } from 'telegram/extensions/Logger';

import telegramConfig from './telegram.config';
import { TelegramLogger } from './telegram.logger';

export const TelegramProvider: Provider = {
  provide: TelegramClient,
  useFactory: async (config: ConfigType<typeof telegramConfig>) => {
    const logger = new TelegramLogger(LogLevel.INFO);
    const client = new TelegramClient(
      config.stringSession,
      config.apiId,
      config.apiHash,
      {
        baseLogger: logger,
      },
    );
    await client.connect();
    return client;
  },
  inject: [telegramConfig.KEY],
};
