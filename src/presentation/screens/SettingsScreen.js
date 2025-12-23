import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthService } from '../../services/authService';
import { VaultService } from '../../services/vaultService';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const [newPin, setNewPin] = useState('');

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Deseas salir? Tus datos permanecerán guardados.', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Salir', 
        onPress: async () => {
          if (AuthService.logout) {
            await AuthService.logout(); 
          }
          router.replace('/'); 
        }
      }
    ]);
  };

  const handleUpdatePin = async () => {
    if (newPin.length < 4) {
      return Alert.alert('Error', 'El PIN debe tener mínimo 4 dígitos');
    }
    await AuthService.updatePin(newPin);
    Alert.alert('Éxito', 'PIN actualizado correctamente');
    setNewPin('');
  };

  const handleDeleteAll = () => {
    Alert.alert('¡Cuidado!', '¿Borrar TODAS las cuentas y notas?', [
      { text: 'Cancelar' },
      { 
        text: 'Borrar Todo', 
        style: 'destructive', 
        onPress: async () => {
          await VaultService.clearVault();
          Alert.alert('Limpieza', 'La bóveda se ha vaciado.');
        } 
      }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Configuración</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={[styles.sectionTitle, { color: colors.subText }]}>SEGURIDAD</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.text }]}>Cambiar PIN Maestro</Text>
          <View style={styles.row}>
            <TextInput 
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]} 
              placeholder="Nuevo PIN" 
              placeholderTextColor={colors.subText}
              value={newPin} 
              onChangeText={setNewPin} 
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity style={[styles.btnSmall, { backgroundColor: colors.primary }]} onPress={handleUpdatePin}>
              <Text style={styles.btnTextSmall}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.subText }]}>APARIENCIA</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.rowBetween}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Ionicons name="moon-outline" size={24} color={colors.text} style={{marginRight:12}}/>
              <Text style={[styles.labelSimple, { color: colors.text }]}>Tema Oscuro</Text>
            </View>
            <Switch 
              value={isDark} 
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.subText }]}>SESIÓN</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.primary} style={{marginRight:10}} />
            <Text style={[styles.logoutText, { color: colors.primary }]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.subText }]}>ZONA DE PELIGRO</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.danger, borderWidth: 1 }]}>
          <TouchableOpacity style={styles.dangerBtn} onPress={handleDeleteAll}>
            <Ionicons name="trash-bin-outline" size={24} color={colors.danger} style={{marginRight:10}} />
            <Text style={[styles.dangerText, { color: colors.danger }]}>Borrar Bóveda Completa</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: colors.subText }]}>AuthVault v1.0.3</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 20,
    flexDirection: 'row', alignItems: 'center', 
    borderBottomWidth: 1 
  },
  backBtn: { marginRight: 15 },
  title: { fontSize: 28, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 14, marginBottom: 10, marginLeft: 5, fontWeight:'600', letterSpacing: 1 },
  card: { borderRadius: 16, padding: 20, marginBottom: 25 },
  label: { fontSize: 18, marginBottom: 12, fontWeight:'500' },
  labelSimple: { fontSize: 18, fontWeight:'500' },
  row: { flexDirection: 'row' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { flex: 1, borderRadius: 10, padding: 12, marginRight: 10, fontSize: 16 },
  btnSmall: { borderRadius: 10, paddingHorizontal: 20, justifyContent: 'center' },
  btnTextSmall: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  logoutText: { fontWeight: 'bold', fontSize: 18 },

  dangerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dangerText: { fontWeight: 'bold', fontSize: 18 },
  version: { textAlign: 'center', marginTop: 20 }
});

export default SettingsScreen;