import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const theme = {
    isDark,
    toggleTheme: () => setIsDark(!isDark),
    colors: isDark ? {
      background: '#000000',
      card: '#1C1C1E',
      text: '#FFFFFF',
      subText: '#98989F',
      primary: '#0A84FF',
      danger: '#FF453A',
      iconBg: '#2C2C2E',
      border: '#38383A',
      success: '#30D158'
    } : {
      background: '#F2F2F7',
      card: '#FFFFFF',
      text: '#000000',
      subText: '#8E8E93',
      primary: '#007AFF',
      danger: '#FF3B30',
      iconBg: '#E5F1FF',
      border: '#E5E5EA',
      success: '#34C759'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);