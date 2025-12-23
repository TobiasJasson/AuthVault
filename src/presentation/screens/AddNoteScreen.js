import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { VaultService } from '../../services/vaultService';
import { useTheme } from '../context/ThemeContext';

const AddNoteScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} /> 
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Nueva Nota Segura</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.subText }]}>Título (Ej: Epic Games Backup)</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} 
          value={title} 
          onChangeText={setTitle} 
          placeholder="Título..."
          placeholderTextColor={colors.subText}
        />

        <Text style={[styles.label, { color: colors.subText }]}>Contenido (Códigos, Pines, Texto)</Text>
        <TextInput 
          style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} 
          value={note} 
          onChangeText={setNote} 
          placeholder="Pega aquí tus códigos..." 
          placeholderTextColor={colors.subText}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#FF9500' }]} onPress={handleSave}>
          <Text style={styles.saveText}>Guardar Nota</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: 'transparent'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: { 
    padding: 15, borderRadius: 12, marginBottom: 20, 
    borderWidth: 1 
  },
  textArea: { height: 150 },
  saveButton: { 
    padding: 16, borderRadius: 12, alignItems: 'center', 
    shadowColor: "#FF9500", shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default AddNoteScreen;