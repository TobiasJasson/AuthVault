import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      if (Platform.OS !== 'web' && compatible) {
        authenticate();
      }
    })();
  }, []);

  const authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Desbloquear AuthVault',
        fallbackLabel: 'Usar PIN',
      });
      if (result.success) {
        unlockApp();
      }
    } catch (error) {
      console.log('Error biométrico', error);
    }
  };

  const handlePinSubmit = () => {
    if (pin === '1234') {
      unlockApp();
    } else {
      Alert.alert('Error', 'PIN Incorrecto (Prueba con 1234)');
      setPin('');
    }
  };

  const unlockApp = () => {
    router.replace('/dashboard'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="lock-closed-outline" size={80} color="#007AFF" />
        <Text style={styles.title}>AuthVault</Text>
        <Text style={styles.subtitle}>Verifica tu identidad</Text>

        {}
        <View style={styles.pinContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ingresa PIN (1234)"
            value={pin}
            onChangeText={setPin}
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
          />
          <TouchableOpacity style={styles.button} onPress={handlePinSubmit}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        {}
        {isBiometricSupported && Platform.OS !== 'web' && (
          <TouchableOpacity onPress={authenticate} style={styles.bioButton}>
            <Ionicons name="finger-print" size={40} color="#007AFF" />
            <Text style={styles.bioText}>Usar Biometría</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginVertical: 10 },
  subtitle: { color: '#888', marginBottom: 40 },
  pinContainer: { width: '100%', maxWidth: 300, alignItems: 'center' },
  input: { 
    width: '100%', height: 50, borderWidth: 1, borderColor: '#ddd', 
    borderRadius: 10, paddingHorizontal: 15, fontSize: 18, marginBottom: 15, textAlign: 'center' 
  },
  button: { 
    backgroundColor: '#007AFF', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' 
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bioButton: { marginTop: 40, alignItems: 'center' },
  bioText: { color: '#007AFF', marginTop: 5 }
});

export default LoginScreen;