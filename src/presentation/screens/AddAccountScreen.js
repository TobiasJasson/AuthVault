import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { VaultService } from '../../services/vaultService';

const AddAccountScreen = () => {
  const router = useRouter();
  const [issuer, setIssuer] = useState('');
  const [account, setAccount] = useState('');
  const [secret, setSecret] = useState('');

  const handleSave = async () => {
    if (!issuer || !secret) {
      Alert.alert('Error', 'El proveedor y el secreto son obligatorios');
      return;
    }

    const success = await VaultService.addAccount({ issuer, account, secret });
    if (success) {
      Alert.alert('Éxito', 'Cuenta guardada');
      router.back();
    } else {
      Alert.alert('Error', 'No se pudo guardar');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nueva Cuenta</Text>
        
        <Text style={styles.label}>Proveedor (Ej: Google)</Text>
        <TextInput style={styles.input} value={issuer} onChangeText={setIssuer} />

        <Text style={styles.label}>Cuenta (Ej: mi@email.com)</Text>
        <TextInput style={styles.input} value={account} onChangeText={setAccount} />

        <Text style={styles.label}>Clave Secreta (Key)</Text>
        <TextInput 
          style={styles.input} 
          value={secret} 
          onChangeText={setSecret} 
          placeholder="JBSWY3DPEHPK3PXP"
          autoCapitalize="characters"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5, color: '#333' },
  input: { 
    backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20,
    borderWidth: 1, borderColor: '#ddd' 
  },
  saveButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { marginTop: 15, alignItems: 'center' },
  cancelText: { color: '#FF3B30' }
});

export default AddAccountScreen;