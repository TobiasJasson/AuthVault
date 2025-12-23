import * as SecureStore from 'expo-secure-store';

export const secureSave = async (key, value) => {
  await SecureStore.setItemAsync(key, value);
};

export const secureGet = async (key) => {
  return await SecureStore.getItemAsync(key);
};