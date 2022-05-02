import { MTProto } from '@mtproto/core';
import dotenv from 'dotenv';
dotenv.config();

const PHONE = '';
const CODE = '';

const store = {};
const api = new MTProto({
  api_id: parseInt(process.env.TELEGRAM_API_ID, 10),
  api_hash: process.env.TELEGRAM_API_HASH,
  customLocalStorage: {
    getItem: async (key) => store[key],
    setItem: async (key, value) => {
      store[key] = value;
    },
  },
});

(async () => {
  const user = await getUser();
  console.log('currentUser', user);

  if (!user) {
    try {
      const { phone_code_hash } = await sendCode(PHONE);

      const signInResult = await signIn({
        code: CODE,
        phone: PHONE,
        phone_code_hash,
      });

      console.log('result', signInResult);
      console.log('session', JSON.stringify(store));
    } catch (error: any) {
      if (error.error_message !== 'SESSION_PASSWORD_NEEDED') {
        console.log(`error:`, error);

        return;
      }

      console.error('2FA is set');
    }
  }
})();

async function getUser() {
  try {
    const user = await api.call('users.getFullUser', {
      id: {
        _: 'inputUserSelf',
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

function sendCode(phone) {
  return api.call('auth.sendCode', {
    phone_number: phone,
    settings: {
      _: 'codeSettings',
    },
  }) as Promise<{ phone_code_hash: string }>;
}

function signIn({ code, phone, phone_code_hash }) {
  return api.call('auth.signIn', {
    phone_code: code,
    phone_number: phone,
    phone_code_hash: phone_code_hash,
  });
}
