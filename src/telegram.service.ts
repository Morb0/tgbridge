import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api, TelegramClient } from 'telegram';
import { NewMessage, NewMessageEvent } from 'telegram/events';

@Injectable()
export class TelegramService implements OnApplicationBootstrap {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly client: TelegramClient,
    private readonly configService: ConfigService,
  ) {
    client.addEventHandler(this.onNewMessage.bind(this), new NewMessage({}));
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.checkCurrentUser();
  }

  private async onNewMessage(event: NewMessageEvent): Promise<void> {
    this.logger.verbose(
      `New message from "${event.message.fromId}" - "${event.message.text}"`,
    );

    if (!event.isPrivate) {
      return;
    }

    const isAllowedPeer = this.configService
      .get('ALLOWED_PEER_IDS', '')
      .split(',')
      .includes(event.chatId.toString());
    if (!isAllowedPeer) {
      return;
    }

    const { message } = event;
    const [payload, peerId] = message.text.match(/\|(.+?)\|/) ?? [];
    if (!peerId) {
      await message.respond({
        message: 'Payload not found',
      });
      return;
    }

    try {
      const newPeer = await this.resolvePeer(peerId);
      const messageCopy = new Api.Message({
        ...message,
        message: message.text.replace(payload, ''),
      });
      await this.client.sendMessage(newPeer, {
        message: messageCopy,
      });
      this.logger.log(`Successfully resend message to "${peerId}" peer`);
    } catch (e: any) {
      this.logger.error(`Failed to send message to "${peerId}" peer`, e?.stack);
      await message.respond({
        message: 'Failed to resend message',
      });
    }
  }

  private async resolvePeer(peerId: string): Promise<Api.TypePeer> {
    try {
      const { peer } = await this.client.invoke(
        new Api.contacts.ResolveUsername({
          username: peerId,
        }),
      );
      return peer;
    } catch {
      const { peer } = await this.client.invoke(
        new Api.contacts.ResolvePhone({
          phone: peerId,
        }),
      );
      return peer;
    }
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
