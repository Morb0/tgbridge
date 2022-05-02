import { registerAs } from '@nestjs/config';
import { StringSession } from 'telegram/sessions';

export default registerAs('telegram', () => ({
  apiId: parseInt(process.env.TELEGRAM_API_ID, 10),
  apiHash: process.env.TELEGRAM_API_HASH,
  stringSession: new StringSession(process.env.TELEGRAM_SESSION),
}));
