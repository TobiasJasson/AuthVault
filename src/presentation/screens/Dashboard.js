import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Asegúrate de usar SafeAreaView de la librería correcta si estás en versiones nuevas, 
// pero por ahora mantendré el import original para no romperte estilos si no has instalado la otra librería.
import { AuthService } from '../../services/authService';
import { VaultService } from '../../services/vaultService';
import VaultItem from '../components/VaultItem';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('Usuario');

  useFocusEffect(
    useCallback(() => {
      loadData();
      setMenuOpen(false); 
    }, [])
  );

  const loadData = async () => {
    try {
      // 1. CORRECCIÓN: Usamos el nombre correcto 'getCurrentUser'
      // Nota: getCurrentUser es síncrona en tu servicio, no necesita await, pero no hace daño.
      const user = AuthService.getCurrentUser();

      // 2. PROTECCIÓN: Si por alguna razón (recarga web) no hay usuario, volvemos al login
      if (!user) {
        router.replace('/');
        return;
      }

      setUsername(user.username);

      // 3. CARGA SEGURA: Solo pedimos cuentas si sabemos que hay usuario
      const accounts = await VaultService.getAccounts();
      setData([...accounts]); 
      
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id) => {
    await VaultService.toggleFavorite(id);
    loadData(); // Recargamos para ver el cambio
  };

  const handleDelete = async (id) => {
    await VaultService.deleteAccount(id);
    // Actualizamos el estado local para que sea más rápido visualmente
    setData(currentData => currentData.filter(item => item.id !== id));
  };

  const navigateTo = (route) => {
    setMenuOpen(false);
    router.push(route);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View>
          <Text style={[styles.subtitle, { color: colors.subText }]}>HOLA, {username.toUpperCase()}</Text>
          <Text style={[styles.title, { color: colors.text }]}>Bóveda</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/settings')} 
          style={[styles.settingsBtn, { backgroundColor: colors.card }]}
        >
           <Ionicons name="settings-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VaultItem 
              item={item} 
              onToggleFavorite={toggleFavorite} 
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="shield-checkmark-outline" size={70} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.text }]}>Tu bóveda está vacía.</Text>
              <Text style={[styles.emptySubText, { color: colors.subText }]}>Toca el + para agregar seguridad.</Text>
            </View>
          }
        />
      )}

      {menuOpen && (
        <TouchableOpacity 
          style={[styles.backdrop, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.85)' }]} 
          onPress={() => setMenuOpen(false)} 
          activeOpacity={1} 
        />
      )}

      <View style={styles.fabContainer}>
        {menuOpen && (
          <View style={styles.menuOptions}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/add-note')}>
              <Text style={[styles.menuLabel, { color: colors.text, backgroundColor: colors.card }]}>Nueva Nota</Text>
              <View style={[styles.miniFab, { backgroundColor: '#FF9500' }]}>
                <Ionicons name="document-text" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/add-account')}>
              <Text style={[styles.menuLabel, { color: colors.text, backgroundColor: colors.card }]}>Nueva Cuenta</Text>
              <View style={[styles.miniFab, { backgroundColor: colors.primary }]}>
                <Ionicons name="qr-code" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.fab, menuOpen ? { backgroundColor: colors.text } : { backgroundColor: colors.primary }]} 
          onPress={() => setMenuOpen(!menuOpen)}
          activeOpacity={0.9}
        >
          <Ionicons name={menuOpen ? "close" : "add"} size={36} color={menuOpen ? colors.background : "#fff"} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingHorizontal: 24, 
    paddingTop: Platform.OS === 'android' ? 50 : 20, 
    paddingBottom: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  subtitle: { 
    fontSize: 16,
    fontWeight: '700', 
    letterSpacing: 1 
  },
  title: { 
    fontSize: 38,
    fontWeight: '800', 
    marginTop: 4 
  },
  settingsBtn: { 
    padding: 10, 
    borderRadius: 50,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
  },

  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 20, fontWeight: '700', marginTop: 15 },
  emptySubText: { marginTop: 8, fontSize: 16 },
  
  backdrop: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  fabContainer: { position: 'absolute', bottom: 30, right: 24, alignItems: 'flex-end', zIndex: 2 },
  fab: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  menuOptions: { marginBottom: 15, alignItems: 'flex-end' },
  menuItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  menuLabel: { 
    marginRight: 12, fontWeight: '700', fontSize: 15, 
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, 
    overflow: 'hidden', shadowColor:'#000', elevation:2 
  },
  miniFab: {
    width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
  }
});

export default Dashboard;