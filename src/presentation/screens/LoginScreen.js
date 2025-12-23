import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../../services/authService';

const LoginScreen = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  const [newUsername, setNewUsername] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await AuthService.getAllUsers();
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      
      setUsers(allUsers);

      if (allUsers.length === 0) {
        setIsAddingUser(true);
      } 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userToDelete) => {
    Alert.alert(
      "Eliminar Usuario",
      `¿Estás seguro de eliminar a "${userToDelete.username}" y todos sus datos?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await AuthService.deleteSpecificUser(userToDelete.username);
              await loadUsers();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el usuario");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLogin = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const isValid = await AuthService.login(selectedUser.username, pin);
      
      if (isValid) {
        setPin('');
        router.replace('/dashboard');
      } else {
        Alert.alert('Error', 'PIN Incorrecto');
        setPin('');
      }
    } catch (e) {
      Alert.alert('Error', 'Ocurrió un error al ingresar');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!newUsername || !pin || !confirmPin) return Alert.alert('Faltan datos', 'Completa todos los campos');
    if (pin !== confirmPin) return Alert.alert('Error', 'Los PINs no coinciden');
    if (pin.length < 4) return Alert.alert('Seguridad', 'El PIN debe tener al menos 4 dígitos');

    try {
      setLoading(true);
      await AuthService.register(newUsername, pin);
      Alert.alert('Éxito', `Usuario ${newUsername} creado.`);
      
      setNewUsername('');
      setPin('');
      setConfirmPin('');
      setIsAddingUser(false);
      loadUsers();
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo crear el usuario');
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: `Ingresar como ${selectedUser.username}`,
      fallbackLabel: 'Usar PIN'
    });
    if (result.success) {
      await AuthService.login(selectedUser.username, selectedUser.pin);
      router.replace('/dashboard');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isAddingUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: '#E5F1FF' }]}>
            <Ionicons name="person-add" size={50} color="#007AFF" />
          </View>
          <Text style={styles.title}>Nuevo Usuario</Text>
          <Text style={styles.subtitle}>Crea un espacio separado en este dispositivo</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nombre (Ej: Pepe)"
              value={newUsername}
              onChangeText={setNewUsername}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Crear PIN"
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar PIN"
              value={confirmPin}
              onChangeText={setConfirmPin}
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister}>
              <Text style={styles.btnText}>Crear Cuenta</Text>
            </TouchableOpacity>

            {users.length > 0 && (
              <TouchableOpacity onPress={() => setIsAddingUser(false)} style={styles.btnLink}>
                <Text style={styles.linkText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {!selectedUser ? (
          <>
            <Text style={styles.title}>¿Quién eres?</Text>
            <Text style={styles.subtitle}>Selecciona tu perfil</Text>
            
            <ScrollView style={{ width: '100%', maxHeight: 400 }}>
              {users.map((u, index) => (
                <View key={index} style={styles.userCardWrapper}>
                   <TouchableOpacity 
                     style={styles.userCard} 
                     onPress={() => setSelectedUser(u)}
                   >
                     <View style={styles.avatar}>
                       <Text style={styles.avatarText}>{u.username.charAt(0).toUpperCase()}</Text>
                     </View>
                     <Text style={styles.userName}>{u.username}</Text>
                     <Ionicons name="chevron-forward" size={24} color="#ccc" />
                   </TouchableOpacity>

                   <TouchableOpacity 
                     style={styles.deleteBtn} 
                     onPress={() => handleDeleteUser(u)}
                   >
                     <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                   </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.btnAddUser} onPress={() => setIsAddingUser(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
              <Text style={[styles.linkText, { marginLeft: 8 }]}>Agregar otra cuenta</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
             <TouchableOpacity onPress={() => { setSelectedUser(null); setPin(''); }} style={styles.backUser}>
                <Ionicons name="arrow-back" size={24} color="#555" />
                <Text style={{color: '#555', marginLeft: 5}}>Cambiar usuario</Text>
             </TouchableOpacity>

             <View style={[styles.avatarBig, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.avatarText, { fontSize: 40, color: '#34C759' }]}>
                  {selectedUser.username.charAt(0).toUpperCase()}
                </Text>
             </View>

             <Text style={styles.title}>Hola, {selectedUser.username}</Text>
             <Text style={styles.subtitle}>Ingresa tu PIN</Text>

             <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="PIN"
                  value={pin}
                  onChangeText={setPin}
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={6}
                  autoFocus
                />
                
                <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: '#34C759' }]} onPress={handleLogin}>
                  <Text style={styles.btnText}>Entrar</Text>
                </TouchableOpacity>
             </View>

             {isBiometricSupported && Platform.OS !== 'web' && (
                <TouchableOpacity onPress={handleBiometric} style={styles.bioBtn}>
                  <Ionicons name="finger-print" size={32} color="#34C759" />
                  <Text style={{ color: '#34C759', marginTop: 5 }}>Huella</Text>
                </TouchableOpacity>
             )}
          </>
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, alignItems: 'center', padding: 24, paddingTop: 40 },
  
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  subtitle: { color: '#888', marginBottom: 30 },

  iconContainer: { padding: 20, borderRadius: 50, marginBottom: 20 },
  
  form: { width: '100%', maxWidth: 320 },
  input: { 
    width: '100%', height: 55, backgroundColor: '#F2F2F7', 
    borderRadius: 12, paddingHorizontal: 15, fontSize: 16, marginBottom: 15 
  },
  btnPrimary: { 
    backgroundColor: '#007AFF', height: 55, borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center', marginTop: 10 
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  
  btnLink: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },

  userCardWrapper: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
  },
  userCard: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 15, borderRadius: 16,
    borderWidth: 1, borderColor: '#eee',
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
    marginRight: 10
  },
  deleteBtn: {
    padding: 10,
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    borderWidth: 1, borderColor: '#FFE0E0'
  },
  
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#555' },
  userName: { flex: 1, fontSize: 18, fontWeight: '600' },
  
  btnAddUser: { flexDirection: 'row', alignItems: 'center', marginTop: 10, padding: 10 },

  avatarBig: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20
  },
  backUser: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginBottom: 20
  },
  bioBtn: { alignItems: 'center', marginTop: 30 }
});

export default LoginScreen;