import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { VaultService } from '../../services/vaultService';
import { Ionicons } from '@expo/vector-icons';

const AddNoteScreen = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const handleSave = async () => {
    if (!title || !note) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    const success = await VaultService.addAccount({ 
      issuer: title, 
      account: 'Nota Segura', 
      secret: note,
      type: 'note'
    });

    if (success) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Nota Segura</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Título (Ej: Epic Games Backup)</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Título..." />

        <Text style={styles.label}>Contenido (Códigos, Pines, Texto)</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={note} 
          onChangeText={setNote} 
          placeholder="Pega aquí tus códigos..." 
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Guardar Nota</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#555' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E5E5EA' },
  textArea: { height: 150 },
  saveButton: { backgroundColor: '#FF9500', padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: "#FF9500", shadowOpacity: 0.3, shadowRadius: 5 },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default AddNoteScreen;