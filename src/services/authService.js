import { secureGet, secureSave } from '../data/secureStorage';

const AUTH_KEY = 'authvault_user_credentials';

export const AuthService = {
  isRegistered: async () => {
    const data = await secureGet(AUTH_KEY);
    return !!data;
  },

  register: async (username, pin) => {
    const userData = { username, pin };
    await secureSave(AUTH_KEY, JSON.stringify(userData));
    return true;
  },

  login: async (inputPin) => {
    const json = await secureGet(AUTH_KEY);
    if (!json) return false;
    const user = JSON.parse(json);
    return user.pin === inputPin;
  },

  getUser: async () => {
    const json = await secureGet(AUTH_KEY);
    return json ? JSON.parse(json) : null;
  },
  
  updatePin: async (newPin) => {
    const json = await secureGet(AUTH_KEY);
    if (!json) return false;
    const user = JSON.parse(json);
    user.pin = newPin;
    await secureSave(AUTH_KEY, JSON.stringify(user));
    return true;
  }
};