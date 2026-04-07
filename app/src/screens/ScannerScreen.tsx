import React, { useCallback, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

import { ScreenMessage } from '../components/atoms';
import {
  ScannerGuideOverlay,
  ScannerStatusBanner,
} from '../components/molecules';
import { useProductLookup, useStableBarcodeScanner } from '../hooks';

type ScannerScreenProps = {
  onBack: () => void;
};

type ScanEvent = {
  barcode: string;
  scannedAt: number;
};

export function ScannerScreen({
  onBack,
}: ScannerScreenProps): React.JSX.Element {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [lastScanEvent, setLastScanEvent] = useState<ScanEvent | null>(null);

  const handleBarcodeAccepted = useCallback((barcode: string) => {
    setLastScanEvent({
      barcode,
      scannedAt: Date.now(),
    });
  }, []);

  const codeScanner = useStableBarcodeScanner(handleBarcodeAccepted);
  const { lookupState, lookupMessage } = useProductLookup(
    lastScanEvent?.barcode ?? null,
  );

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.centered}>
        <ScreenMessage message="Necesitamos permiso para usar la camara" />
        <Button title="Dar permiso" onPress={requestPermission} />
      </SafeAreaView>
    );
  }

  if (device == null) {
    return (
      <SafeAreaView style={styles.centered}>
        <ScreenMessage message="No se encontro una camara disponible" />
      </SafeAreaView>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />

      <View style={styles.topActions}>
        <Button title="Volver" onPress={onBack} />
      </View>

      <ScannerGuideOverlay lookupState={lookupState} />

      <ScannerStatusBanner
        label={lastScanEvent?.barcode ?? 'Apunta al codigo EAN-13 o EAN-8'}
        message={lookupMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  topActions: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
});
