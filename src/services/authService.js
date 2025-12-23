import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'auth_users_list';
let currentUserSession = null;
export const AuthService = {
  getAllUsers: async () => {
    const json = await AsyncStorage.getItem(USERS_KEY);
    return json ? JSON.parse(json) : [];
  },
  register: async (username, pin) => {
    const users = await AuthService.getAllUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('El usuario ya existe');
    }
    const newUser = { username, pin };
    users.push(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    currentUserSession = newUser;
    return true;
  },

  login: async (username, pin) => {
    const users = await AuthService.getAllUsers();
    const user = users.find(u => u.username === username && u.pin === pin);
    
    if (user) {
      currentUserSession = user;
      return true;
    }
    return false;
  },

  getCurrentUser: () => {
    return currentUserSession;
  },

  logout: async () => {
    currentUserSession = null;
  },

  updatePin: async (newPin) => {
    if (!currentUserSession) return false;
    
    const users = await AuthService.getAllUsers();
    const userIndex = users.findIndex(u => u.username === currentUserSession.username);
    
    if (userIndex >= 0) {
      users[userIndex].pin = newPin;
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      currentUserSession.pin = newPin;
      return true;
    }
    return false;
  },

  deleteUser: async () => {
    if (!currentUserSession) return;
    
    let users = await AuthService.getAllUsers();
    users = users.filter(u => u.username !== currentUserSession.username);
    
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    currentUserSession = null;
  }
};