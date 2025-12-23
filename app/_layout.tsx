  import * as NavigationBar from 'expo-navigation-bar'; // Importante
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { ThemeProvider, useTheme } from '../src/presentation/context/ThemeContext';

  const AppLayout = () => {
    const { isDark, colors } = useTheme();
    
    useEffect(() => {
      if (Platform.OS === 'android') {
        NavigationBar.setBackgroundColorAsync(isDark ? '#000000' : '#F2F2F7');
        NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
      }
    }, [isDark]);

    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="dashboard" />
          <Stack.Screen name="add-account" options={{ presentation: 'modal' }} />
          <Stack.Screen name="add-note" options={{ presentation: 'modal' }} />
          <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style={isDark ? "light" : "dark"} backgroundColor={isDark ? '#000000' : '#F2F2F7'} />
      </>
    );
  };

  export default function RootLayout() {
    return (
      <ThemeProvider>
        <AppLayout />
      </ThemeProvider>
    );
  }