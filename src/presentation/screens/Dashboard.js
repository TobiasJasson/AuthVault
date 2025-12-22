import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import VaultItem from '../components/VaultItem';
import { VaultService } from '../../services/vaultService';

const Dashboard = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
      setMenuOpen(false); 
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    const accounts = await VaultService.getAccounts();
    setData(accounts);
    setLoading(false);
  };

  const toggleFavorite = async (id) => {
    const newAccounts = await VaultService.toggleFavorite(id);
    setData(newAccounts);
  };

  const handleFabPress = () => setMenuOpen(!menuOpen);

  const navigateTo = (route) => {
    setMenuOpen(false);
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>AuthVault</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VaultItem item={item} onToggleFavorite={toggleFavorite} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }} // Espacio para que el FAB no tape el último item
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="shield-checkmark-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Tu bóveda está vacía.</Text>
            </View>
          }
        />
      )}

      {/* --- CAPA OSCURA (Cuando el menú está abierto) --- */}
      {menuOpen && (
        <TouchableOpacity style={styles.backdrop} onPress={() => setMenuOpen(false)} activeOpacity={1} />
      )}

      {/* --- MENU DESPLEGABLE --- */}
      <View style={styles.fabContainer}>
        {menuOpen && (
          <View style={styles.menuOptions}>
            
            {/* Opción 1: Nueva Nota */}
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/add-note')}>
              <Text style={styles.menuLabel}>Nueva Nota</Text>
              <View style={[styles.miniFab, { backgroundColor: '#FF9500' }]}>
                <Ionicons name="document-text" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Opción 2: Nueva Cuenta */}
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/add-account')}>
              <Text style={styles.menuLabel}>Nueva Cuenta</Text>
              <View style={[styles.miniFab, { backgroundColor: '#007AFF' }]}>
                <Ionicons name="qr-code" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

          </View>
        )}

        {/* --- BOTÓN PRINCIPAL (+) --- */}
        <TouchableOpacity 
          style={[styles.fab, menuOpen ? styles.fabOpen : null]} 
          onPress={handleFabPress}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={menuOpen ? "close" : "add"} 
            size={32} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { padding: 20, backgroundColor: '#F2F2F7' },
  title: { fontSize: 34, fontWeight: 'bold', color: '#000' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#888', marginTop: 10 },
  
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)', 
    zIndex: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 2,
  },
  fab: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#007AFF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },
  fabOpen: { backgroundColor: '#333' }, // Cambia de color al abrir
  
  menuOptions: { marginBottom: 15, alignItems: 'flex-end' },
  menuItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  menuLabel: { marginRight: 10, fontWeight: '600', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, overflow: 'hidden', shadowColor:'#000', elevation:1 },
  miniFab: {
    width: 45, height: 45, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
  }
});

export default Dashboard;