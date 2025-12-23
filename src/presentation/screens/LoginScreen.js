import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform, Alert, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthService } from '../../services/authService';

const LoginScreen = () => {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    const registered = await AuthService.isRegistered();
    setIsRegistering(!registered);
    
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);

    setLoading(false);

    if (registered && compatible && Platform.OS !== 'web') {
      authenticateBiometric();
    }
  };

  const authenticateBiometric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Ingresar a AuthVault',
        fallbackLabel: 'Usar PIN',
      });
      if (result.success) {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.log('Error bio', error);
    }
  };

  const handleAction = async () => {
    if (isRegistering) {
      if (!username || !pin || !confirmPin) {
        return Alert.alert('Error', 'Completa todos los campos');
      }
      if (pin !== confirmPin) {
        return Alert.alert('Error', 'Los PINs no coinciden');
      }
      if (pin.length < 4) {
        return Alert.alert('Error', 'El PIN debe tener al menos 4 dígitos');
      }

      await AuthService.register(username, pin);
      Alert.alert('¡Bienvenido!', 'Cuenta creada con éxito.');
      router.replace('/dashboard');

    } else {
      const isValid = await AuthService.login(pin);
      if (isValid) {
        router.replace('/dashboard');
      } else {
        Alert.alert('Acceso Denegado', 'PIN incorrecto');
        setPin('');
      }
    }
  };

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#007AFF"/></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={isRegistering ? "person-add-outline" : "shield-checkmark-outline"} size={60} color="#007AFF" />
        </View>

        <Text style={styles.title}>{isRegistering ? 'Crear Cuenta' : 'Bienvenido'}</Text>
        <Text style={styles.subtitle}>
          {isRegistering ? 'Configura tu seguridad para empezar' : 'Ingresa tu PIN o Huella'}
        </Text>

        <View style={styles.form}>
          {isRegistering && (
            <TextInput
              style={styles.input}
              placeholder="Nombre de Usuario"
              value={username}
              onChangeText={setUsername}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="PIN de Seguridad"
            value={pin}
            onChangeText={setPin}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
          />

          {isRegistering && (
            <TextInput
              style={styles.input}
              placeholder="Confirmar PIN"
              value={confirmPin}
              onChangeText={setConfirmPin}
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleAction}>
            <Text style={styles.buttonText}>{isRegistering ? 'Registrarme' : 'Entrar'}</Text>
          </TouchableOpacity>
        </View>

        {!isRegistering && isBiometricSupported && Platform.OS !== 'web' && (
          <TouchableOpacity onPress={authenticateBiometric} style={styles.bioButton}>
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
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  iconContainer: { marginBottom: 20, backgroundColor: '#E5F1FF', padding: 20, borderRadius: 50 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  subtitle: { color: '#888', marginBottom: 30, textAlign: 'center' },
  form: { width: '100%', maxWidth: 320 },
  input: { 
    width: '100%', height: 55, backgroundColor: '#F2F2F7', 
    borderRadius: 12, paddingHorizontal: 15, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: 'transparent'
  },
  button: { 
    backgroundColor: '#007AFF', width: '100%', height: 55, borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center', marginTop: 10,
    shadowColor: "#007AFF", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  bioButton: { marginTop: 40, alignItems: 'center' },
  bioText: { color: '#007AFF', marginTop: 5, fontWeight: '500' }
});

export default LoginScreen;