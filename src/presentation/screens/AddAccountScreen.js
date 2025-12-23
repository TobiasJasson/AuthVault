import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { VaultService } from '../../services/vaultService';
import { useTheme } from '../context/ThemeContext';

const AddAccountScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={[styles.header, { backgroundColor: colors.card }]}>
         <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
         </TouchableOpacity>
         <Text style={[styles.title, { color: colors.text, marginBottom: 0 }]}>Nueva Cuenta</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.subText }]}>Proveedor (Ej: Google)</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} 
          value={issuer} 
          onChangeText={setIssuer} 
          placeholderTextColor={colors.subText}
        />

        <Text style={[styles.label, { color: colors.subText }]}>Cuenta (Ej: mi@email.com)</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} 
          value={account} 
          onChangeText={setAccount} 
          placeholderTextColor={colors.subText}
        />

        <Text style={[styles.label, { color: colors.subText }]}>Clave Secreta (Key)</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} 
          value={secret} 
          onChangeText={setSecret} 
          placeholder="JBSWY3DPEHPK3PXP"
          placeholderTextColor={colors.subText}
          autoCapitalize="characters"
        />

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
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
  container: { flex: 1 },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 20,
    flexDirection: 'row', alignItems: 'center', gap: 15
  },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  input: { 
    padding: 15, borderRadius: 10, marginBottom: 20,
    borderWidth: 1
  },
  saveButton: { padding: 15, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { marginTop: 15, alignItems: 'center' },
  cancelText: { color: '#FF3B30' }
});

export default AddAccountScreen;