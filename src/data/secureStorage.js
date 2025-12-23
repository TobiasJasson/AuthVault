import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
const WEB_SECRET_KEY = 'authvault-demo-key-123'; 

export const secureSave = async (key, value) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(value, WEB_SECRET_KEY).toString();
    await AsyncStorage.setItem(key, encrypted);
  } catch (e) {
    console.error("Error guardando (Web):", e);
    throw e; 
  }
};

export const secureGet = async (key) => {
  try {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) return null;
    
    const bytes = CryptoJS.AES.decrypt(encrypted, WEB_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Error leyendo (Web):", e);
    return null;
  }
};