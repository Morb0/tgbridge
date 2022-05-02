import * as MTProto from '@mtproto/core';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MTPROTO } from './telegram.constants';

export const MtprotoProvider: Provider = {
  provide: MTPROTO,
  useFactory: (config: ConfigService) => {
    return new MTProto(config.get('telegram'));
  },
  inject: [ConfigService],
};
