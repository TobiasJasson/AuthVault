import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VaultService } from '../../services/vaultService';
import { useTheme } from '../context/ThemeContext';

const AddAccountScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  
  const [issuer, setIssuer] = useState('');
  const [account, setAccount] = useState('');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    if (params.scannedSecret) {
      setSecret(params.scannedSecret);
      if (params.scannedIssuer) setIssuer(params.scannedIssuer);
      if (params.scannedAccount) setAccount(params.scannedAccount);
    }
  }, [params]);

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
         
         <TouchableOpacity onPress={() => router.push('/scan-qr')}>
            <Ionicons name="qr-code-outline" size={24} color={colors.primary} />
         </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.subText }]}>Proveedor</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} 
          value={issuer} 
          onChangeText={setIssuer} 
          placeholderTextColor={colors.subText}
        />

        <Text style={[styles.label, { color: colors.subText }]}>Cuenta</Text>
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
          placeholder=" "
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
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
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