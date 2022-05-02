import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Api, TelegramClient } from 'telegram';

@Injectable()
export class TelegramService implements OnApplicationBootstrap {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly client: TelegramClient) {
    client.addEventHandler(this.onUpdate.bind(this));
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.checkCurrentUser();
  }

  private async onUpdate(update: Api.TypeUpdate): Promise<void> {
    console.log(update);
  }

  private async checkCurrentUser(): Promise<void> {
    try {
      const user = (await this.client.getMe()) as Api.User;
      this.logger.log(
        `Current user ${user.firstName} ${user.lastName} (Phone: ${user.phone})`,
      );
    } catch (e: any) {
      this.logger.error('Failed to get current user', e?.stack);
    }
  }
}
