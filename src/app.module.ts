import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import telegramConfig from './telegram.config';
import { TelegramProvider } from './telegram.provider';
import { TelegramService } from './telegram.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [telegramConfig],
    }),
  ],
  providers: [TelegramService, TelegramProvider],
  exports: [TelegramService],
})
export class AppModule {}
