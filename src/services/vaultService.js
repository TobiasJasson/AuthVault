import { secureGet, secureSave } from '../data/secureStorage';

const STORAGE_KEY = 'authvault_accounts_v2';

export const VaultService = {
  getAccounts: async () => {
    try {
      const json = await secureGet(STORAGE_KEY);
      if (!json) return [];
      const items = JSON.parse(json);
      return items.sort((a, b) => (b.isFavorite === true) - (a.isFavorite === true));
    } catch (e) {
      return [];
    }
  },

  addAccount: async (newItem) => {
    try {
      const items = await VaultService.getAccounts();
      const updatedItems = [
        ...items, 
        { 
          ...newItem, 
          id: Date.now().toString(), 
          isFavorite: false,
          type: newItem.type || 'totp'
        }
      ];
      await secureSave(STORAGE_KEY, JSON.stringify(updatedItems));
      return true;
    } catch (e) {
      return false;
    }
  },

  toggleFavorite: async (id) => {
    const items = await VaultService.getAccounts();
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });
    updatedItems.sort((a, b) => (b.isFavorite === true) - (a.isFavorite === true));
    await secureSave(STORAGE_KEY, JSON.stringify(updatedItems));
    return updatedItems;
  },

  deleteAccount: async (id) => {
    const items = await VaultService.getAccounts();
    const filtered = items.filter(a => a.id !== id);
    await secureSave(STORAGE_KEY, JSON.stringify(filtered));
  }
};