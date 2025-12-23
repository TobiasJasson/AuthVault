import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QRScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitamos acceso a la cámara</Text>
        <Button onPress={requestPermission} title="Dar permiso" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const url = new URL(data);
      
      if (url.protocol !== 'otpauth:' || url.host !== 'totp') {
        alert('Código QR no válido para autenticación');
        setScanned(false);
        return;
      }

      const params = new URLSearchParams(url.search);
      const secret = params.get('secret');
      const issuer = params.get('issuer') || 'Desconocido';
      const account = decodeURIComponent(url.pathname.replace('/', ''));

      if (!secret) {
        alert('El QR no tiene secreto');
        setScanned(false);
        return;
      }

      router.replace({
        pathname: '/add-account',
        params: { 
          scannedIssuer: issuer,
          scannedAccount: account,
          scannedSecret: secret
        }
      });

    } catch (error) {
      alert('Error leyendo el QR');
      setScanned(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="close-circle" size={40} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Escanear QR</Text>
          </View>
          
          <View style={styles.scanFrame} />
          <Text style={styles.instruction}>Apunta al código QR</Text>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  message: { textAlign: 'center', paddingBottom: 10, color: '#fff' },
  overlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 50 },
  topBar: { width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  backBtn: { marginRight: 20 },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  scanFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#34C759', borderRadius: 20, backgroundColor: 'transparent' },
  instruction: { color: 'white', fontSize: 16, marginTop: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 10 }
});