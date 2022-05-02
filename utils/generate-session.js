/* eslint-disable */
require('dotenv').config();
const input = require('input');
const { TelegramClient } = require('telegram');
const { StoreSession, StringSession } = require('telegram/sessions');

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const stringSession = new StringSession('');

(async () => {
  console.log('Loading interactive example...');
  const client = new TelegramClient(stringSession, apiId, apiHash, {});
  await client.start({
    phoneNumber: async () => await input.text('Number:'),
    password: async () => await input.text('Password:'),
    phoneCode: async () => await input.text('Code:'),
    onError: (err) => console.error(err),
  });
  console.log('You should now be connected. Session string:');
  console.log(client.session.save());
})();
