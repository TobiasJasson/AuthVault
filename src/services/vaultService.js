import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from './authService';

export const VaultService = {
  _getUserKey: () => {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('No hay usuario logueado');
    return `vault_data_${user.username}`;
  },

  getAccounts: async () => {
    try {
      const key = VaultService._getUserKey();
      const json = await AsyncStorage.getItem(key);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      return [];
    }
  },

  addAccount: async (newAccount) => {
    try {
      const accounts = await VaultService.getAccounts();
      const item = { ...newAccount, id: Date.now().toString(), createdAt: new Date() };
      const updated = [item, ...accounts];
      
      const key = VaultService._getUserKey();
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  toggleFavorite: async (id) => {
    const accounts = await VaultService.getAccounts();
    const updated = accounts.map(acc => 
      acc.id === id ? { ...acc, isFavorite: !acc.isFavorite } : acc
    );
    const key = VaultService._getUserKey();
    await AsyncStorage.setItem(key, JSON.stringify(updated));
  },

  deleteAccount: async (id) => {
    const accounts = await VaultService.getAccounts();
    const updated = accounts.filter(acc => acc.id !== id);
    const key = VaultService._getUserKey();
    await AsyncStorage.setItem(key, JSON.stringify(updated));
  },

  clearVault: async () => {
    try {
      const key = VaultService._getUserKey();
      await AsyncStorage.removeItem(key);
      await AuthService.deleteUser();
      
      return true;
    } catch (error) {
      console.error('Error borrando la bóveda:', error);
      throw error;
    }
  }
};