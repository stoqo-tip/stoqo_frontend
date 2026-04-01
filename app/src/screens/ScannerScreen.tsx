import React, { useRef, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  type Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

import {
  MIN_DETECTIONS,
  SAME_CODE_COOLDOWN_MS,
  SCAN_WINDOW_MS,
} from '../constants';
import type { BarcodeSample } from '../types';
import { isValidEan } from '../utils';
import { ScreenMessage } from '../components/atoms';
import { ScannerStatusBanner } from '../components/molecules';

type ScannerScreenProps = {
  onBack: () => void;
};

export function ScannerScreen({
  onBack,
}: ScannerScreenProps): React.JSX.Element {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  const lastAcceptedCodeRef = useRef<string | null>(null);
  const lastAcceptedAtRef = useRef<number>(0);
  const bufferedScansRef = useRef<BarcodeSample[]>([]);
  const scanWindowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const processBufferedScans = () => {
    const samples = bufferedScansRef.current;
    bufferedScansRef.current = [];
    scanWindowTimeoutRef.current = null;

    if (samples.length === 0) {
      return;
    }

    const counts = new Map<string, number>();

    for (const sample of samples) {
      const currentCount = counts.get(sample.value) ?? 0;
      counts.set(sample.value, currentCount + 1);
    }

    let winner: string | null = null;
    let winnerCount = 0;

    for (const [value, count] of counts.entries()) {
      if (count > winnerCount) {
        winner = value;
        winnerCount = count;
      }
    }

    if (!winner || winnerCount < MIN_DETECTIONS) {
      return;
    }

    const now = Date.now();
    const isSameAsLastAccepted = lastAcceptedCodeRef.current === winner;
    const isInsideCooldown =
      now - lastAcceptedAtRef.current < SAME_CODE_COOLDOWN_MS;

    if (isSameAsLastAccepted && isInsideCooldown) {
      return;
    }

    lastAcceptedCodeRef.current = winner;
    lastAcceptedAtRef.current = now;

    setLastScannedCode(winner);
   //  console.log('Codigo detectado:', winner);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8'],
    onCodeScanned: (codes: Code[]) => {
      const validValues = codes
        .filter(code => {
          if (!code.value) {
            return false;
          }

          return isValidEan(code.type, code.value);
        })
        .map(code => code.value as string);

      if (validValues.length === 0) {
        return;
      }

      for (const value of validValues) {
        bufferedScansRef.current.push({ value });
      }

      if (scanWindowTimeoutRef.current == null) {
        scanWindowTimeoutRef.current = setTimeout(() => {
          processBufferedScans();
        }, SCAN_WINDOW_MS);
      }
    },
  });

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

      <ScannerStatusBanner
        label={lastScannedCode ?? 'Apunta al codigo EAN-13 o EAN-8'}
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
