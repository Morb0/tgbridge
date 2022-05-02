import { MTProto } from '@mtproto/core';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';

import { MTProtoException } from './exceptions/mtproto.exception';
import { MTPROTO } from './telegram.constants';

@Injectable()
export class TelegramService implements OnApplicationBootstrap {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@Inject(MTPROTO) private readonly mtproto: MTProto) {
    mtproto.updates.on('updatesCombined', this.onUpdate.bind(this));
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.checkCurrentUser();
  }

  private async onUpdate(updateInfo: any): Promise<void> {
    const { updates } = updateInfo;
    for (const update of updates) {
      if (update._ === 'updateNewMessage') {
        console.log(update.message);
      }
    }
  }

  private async checkCurrentUser(): Promise<void> {
    try {
      const userFull = await this.callApi('users.getFullUser', {
        id: {
          _: 'inputUserSelf',
        },
      });
      const user = userFull.users[0];
      this.logger.log(
        `Current user ${user.first_name} ${user.last_name} (${user.phone})`,
      );
    } catch (e) {
      this.logger.error('Failed to get current user');
    }
  }

  private async callApi<T = any>(
    method: string,
    params: Record<string, any>,
    options: Record<string, any> = {},
  ): Promise<T> {
    return this.mtproto
      .call(method, params, options)
      .catch(async (err: any) => {
        this.logger.error(
          `Failed to call "${method}" method`,
          JSON.stringify(err),
        );

        if ('error_code' in err) {
          const { error_code, error_message } = err;

          if (error_code === 420) {
            const seconds = +error_message.split('FLOOD_WAIT_')[1];
            const ms = seconds * 1000;

            this.logger.warn(`Flood wait ${ms}ms`);
            await new Promise((resolve) => setTimeout(resolve, ms));

            return this.callApi(method, params, options);
          }

          if (error_code === 303) {
            const [type, dcId] = error_message.split('_MIGRATE_');

            this.logger.warn(`Wrong "${type}" DC`);

            // NOTE: If auth.sendCode call on incorrect DC need change default DC, because call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
            if (type === 'PHONE') {
              await this.mtproto.setDefaultDc(+dcId);
            } else {
              options = {
                ...options,
                dcId: +dcId,
              };
            }

            return this.callApi(method, params, options);
          }
        }

        const exception = new MTProtoException(
          err.error_code,
          err.error_message,
        );
        return Promise.reject(exception);
      });
  }
}
