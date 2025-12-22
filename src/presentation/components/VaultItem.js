import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateToken } from '../../domain/totpEngine';

const VaultItem = ({ item, onToggleFavorite }) => {
  const [code, setCode] = useState('--- ---');
  const [timeLeft, setTimeLeft] = useState(30);
  const [showNote, setShowNote] = useState(false);

  const isNote = item.type === 'note';

  useEffect(() => {
    if (isNote) return;

    const update = () => {
      const seconds = Math.floor(Date.now() / 1000);
      const remaining = 30 - (seconds % 30);
      setTimeLeft(remaining);
      const result = generateToken(item.secret, item.issuer);
      setCode(result.code);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [item.secret, isNote]);

  const handlePress = () => {
    if (isNote) {
      setShowNote(!showNote); // Expandir/Contraer nota
    } else {
      Clipboard.setString(code);
      Alert.alert('Copiado', 'Código TOTP copiado al portapapeles');
    }
  };

  const copyNote = () => {
    Clipboard.setString(item.secret);
    Alert.alert('Copiado', 'Nota copiada al portapapeles');
  };
  const renderContent = () => {
    if (isNote) {
      return (
        <View style={styles.noteContainer}>
          <Ionicons name="document-text-outline" size={24} color="#555" style={{marginBottom: 5}}/>
          {showNote ? (
            <TouchableOpacity onLongPress={copyNote}>
              <Text style={styles.noteText}>{item.secret}</Text>
              <Text style={styles.hint}>(Mantén presionado para copiar)</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noteBlur}>•••• •••• •••• ••••</Text>
          )}
        </View>
      );
    }

    const displayToken = code.length === 6 ? `${code.slice(0,3)} ${code.slice(3)}` : code;
    return (
      <View style={styles.tokenContainer}>
        <Text style={[styles.code, { color: timeLeft < 5 ? '#FF3B30' : '#007AFF' }]}>
          {displayToken}
        </Text>
        <Text style={styles.timer}>{timeLeft}s</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBox, { backgroundColor: isNote ? '#FFF4E5' : '#E5F1FF' }]}>
             <Ionicons 
               name={isNote ? "sticky-note" : "qr-code"} 
               size={20} 
               color={isNote ? "#FF9500" : "#007AFF"} 
             />
          </View>
          <View style={{marginLeft: 10, flex: 1}}>
            <Text style={styles.issuer}>{item.issuer}</Text>
            <Text style={styles.account}>{item.account}</Text>
          </View>
        </View>

        {/* Botón Corazón */}
        <TouchableOpacity onPress={() => onToggleFavorite(item.id)} style={styles.favButton}>
          <Ionicons 
            name={item.isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={item.isFavorite ? "#FF3B30" : "#C7C7CC"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {renderContent()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', marginVertical: 6, marginHorizontal: 16, borderRadius: 16,
    padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  issuer: { fontSize: 16, fontWeight: '700', color: '#000' },
  account: { fontSize: 13, color: '#8E8E93' },
  favButton: { padding: 5 },
  body: { marginTop: 10, alignItems: 'flex-end' },
  tokenContainer: { alignItems: 'flex-end' },
  code: { fontSize: 28, fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  timer: { fontSize: 11, color: '#C7C7CC' },
  noteContainer: { width: '100%', alignItems: 'flex-start', backgroundColor: '#FAFAFA', padding: 10, borderRadius: 8 },
  noteText: { fontSize: 14, color: '#333', fontFamily: 'monospace' },
  noteBlur: { fontSize: 20, color: '#CCC', letterSpacing: 2 },
  hint: { fontSize: 10, color: '#999', marginTop: 5 }
});

export default VaultItem;