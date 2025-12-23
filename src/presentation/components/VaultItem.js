import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateToken } from '../../domain/totpEngine';
import { useTheme } from '../context/ThemeContext';

const VaultItem = ({ item, onToggleFavorite, onDelete }) => {
  const { colors, isDark } = useTheme();
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
      try {
        const result = generateToken(item.secret, item.issuer);
        if (result.code === 'ERROR') setCode('ERROR');
        else setCode(result.code);
      } catch (error) {
        setCode('ERROR');
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [item.secret, isNote]);

  const handleCopy = () => {
    if (code === 'ERROR' && !isNote) return;
    const content = isNote ? item.secret : code;
    Clipboard.setString(content);
  };

  const handleDeletePress = () => {
    Alert.alert("Eliminar", "¿Borrar este item?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => onDelete(item.id) }
    ]);
  };

  const renderRightContent = () => {
    if (isNote) {
      return (
        <View style={styles.rightContent}>
          {showNote ? (
            <Text style={[styles.noteTextVisible, { color: colors.text }]}>
              {item.secret}
            </Text>
          ) : (
            <Text style={[styles.noteBlur, { color: colors.subText }]}>••••</Text>
          )}
        </View>
      );
    }

    const isError = code === 'ERROR';
    if (isError) {
      return (
        <View style={styles.rightContent}>
          <View style={[styles.errorBadge, { backgroundColor: colors.background }]}>
            <Ionicons name="alert-circle" size={18} color={colors.subText} style={{ marginRight: 4 }} />
            <Text style={[styles.errorText, { color: colors.subText }]}>Inválido</Text>
          </View>
        </View>
      );
    }

    const displayToken = code.length === 6 ? `${code.slice(0, 3)} ${code.slice(3)}` : code;
    return (
      <View style={styles.rightContent}>
        <Text style={[styles.code, { color: timeLeft < 5 ? colors.danger : colors.primary }]}>
          {displayToken}
        </Text>
        <Text style={[styles.timer, { color: colors.subText }]}>{timeLeft}s</Text>
      </View>
    );
  };

  return (
    <View 
      style={[styles.container, { backgroundColor: colors.card, shadowColor: isDark ? '#000' : '#888' }]}
    >
      
      <TouchableOpacity 
        onPress={handleCopy} 
        activeOpacity={0.6}
        style={styles.copyZone}
      >
        <View style={styles.leftSection}>
          <View style={[styles.iconBox, { backgroundColor: isNote ? '#FFF4E5' : colors.iconBg }]}>
            <Ionicons
              name={isNote ? "sticky-note" : "qr-code"}
              size={28} 
              color={isNote ? "#FF9500" : colors.primary}
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={[styles.issuer, { color: colors.text }]} numberOfLines={1}>
              {item.issuer}
            </Text>
            <Text style={[styles.account, { color: colors.subText }]} numberOfLines={1}>
              {item.account}
            </Text>
          </View>
        </View>

        {renderRightContent()}
      </TouchableOpacity>

      <View style={[styles.actionsBox, { borderLeftColor: colors.border }]}>
        
        <TouchableOpacity onPress={() => onToggleFavorite(item.id)} style={styles.actionBtn}>
          <Ionicons
            name={item.isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={item.isFavorite ? colors.danger : colors.subText}
          />
        </TouchableOpacity>

        {isNote && (
          <TouchableOpacity onPress={() => setShowNote(!showNote)} style={styles.actionBtn}>
            <Ionicons
              name={showNote ? "eye-off-outline" : "eye-outline"}
              size={24}
              color={colors.subText}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          onPress={handleDeletePress} 
          style={styles.actionBtn}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} 
        >
          <Ionicons name="trash-outline" size={24} color={colors.danger} />
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    minHeight: 80,
  },
  
  copyZone: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingRight: 8,
  },

  leftSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1, 
    marginRight: 10 
  },
  iconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  infoBox: { 
    flex: 1,
    justifyContent: 'center',
    marginRight: 5
  },
  issuer: { 
    fontSize: 17,
    fontWeight: '700', 
    marginBottom: 3
  },
  account: { 
    fontSize: 13, 
  },

  rightContent: { 
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 80,
  },
  code: { 
    fontSize: 20,
    fontWeight: '700', 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1
  },
  timer: { 
    fontSize: 12, 
    marginTop: 4,
    fontWeight: '600'
  },
  errorBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6 
  },
  errorText: { fontSize: 12, fontWeight: '600' },
  
  noteTextVisible: { 
    fontSize: 15, 
    fontWeight: '500', 
    textAlign: 'right', 
    maxWidth: 140,
  },
  noteBlur: { fontSize: 24, letterSpacing: 3, lineHeight: 24 },

  actionsBox: { 
    flexDirection: 'column', 
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(150,150,150,0.1)',
    gap: 16,
    backgroundColor: 'rgba(0,0,0,0.02)'
  },
  actionBtn: {
    padding: 4,
    alignItems: 'center'
  }
});

export default VaultItem;