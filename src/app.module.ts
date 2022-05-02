import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MtprotoProvider } from './mtporoto.provider';
import telegramConfig from './telegram.config';
import { TelegramService } from './telegram.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [telegramConfig],
    }),
  ],
  providers: [TelegramService, MtprotoProvider],
  exports: [TelegramService],
})
export class AppModule {}
