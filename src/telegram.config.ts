import { MTProto } from '@mtproto/core';
import { registerAs } from '@nestjs/config';

type MTProtoOptions = ConstructorParameters<typeof MTProto>[0];

export default registerAs('telegram', (): MTProtoOptions => {
  const store = JSON.parse(process.env.TELEGRAM_SESSION);
  return {
    api_id: parseInt(process.env.TELEGRAM_API_ID, 10),
    api_hash: process.env.TELEGRAM_API_HASH,
    storageOptions: {
      instance: {
        get: async (key) => store[key],
        set: async (key, value) => {
          store[key] = value;
        },
      },
    },
  };
});
