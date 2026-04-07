import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  type Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

import { ScreenMessage } from '../components/atoms';
import {
  ScannerGuideOverlay,
  ScannerStatusBanner,
  type ScannerFeedbackState,
} from '../components/molecules';
import { fetchProductByBarcode } from '../services';
import type { ScannedProductItem } from '../types';
import { isValidEAN } from '../utils';


type ScannerScreenProps = {
  onBack: () => void;
  onFinalize: () => void;
  scannedItems: ScannedProductItem[];
  onAddScannedItem: (item: ScannedProductItem) => void;
};

const DEFAULT_LABEL = 'Apunta al codigo EAN-13 o EAN-8';
const SWITCH_CONFIRMATIONS = 2;

function getWinner(codes: Code[]): string | null {
  const validValues = codes
    .filter(code => {
      if (!code.value) {
        return false;
      }

      return isValidEAN(code.type, code.value);
    })
    .map(code => code.value as string);

  if (validValues.length === 0) {
    return null;
  }

  const counts = new Map<string, number>();

  for (const value of validValues) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  let winner: string | null = null;
  let winnerCount = 0;

  for (const [value, count] of counts.entries()) {
    if (count > winnerCount) {
      winner = value;
      winnerCount = count;
    }
  }

  return winner;
}

export function ScannerScreen({
  onBack,
  onFinalize,
  scannedItems,
  onAddScannedItem,
}: ScannerScreenProps): React.JSX.Element {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [lookupState, setLookupState] = useState<ScannerFeedbackState>('idle');
  const [bannerLabel, setBannerLabel] = useState(DEFAULT_LABEL);
  const [bannerMessage, setBannerMessage] = useState<string | undefined>();

  const scannedBarcodeSet = useMemo(
    () => new Set(scannedItems.map(item => item.barcode)),
    [scannedItems],
  );

  const activeBarcodeRef = useRef<string | null>(null);
  const candidateBarcodeRef = useRef<string | null>(null);
  const candidateCountRef = useRef(0);
  const lookupRequestIdRef = useRef(0);

  const handleAcceptedBarcode = useCallback(
    async (barcode: string) => {
      setBannerLabel(barcode);

      if (scannedBarcodeSet.has(barcode)) {
        setLookupState('success');
        setBannerMessage('Ya esta en la lista');
        return;
      }

      setLookupState('loading');
      setBannerMessage('Buscando producto...');

      const requestId = ++lookupRequestIdRef.current;
      
      try {
        const result = await fetchProductByBarcode(barcode);

        if (requestId !== lookupRequestIdRef.current) {
          return;
        }

        if (result.found && result.product) {
          onAddScannedItem({
            barcode: result.product.barcode,
            name: result.product.name ?? result.product.barcode,
            brand: result.product.brand,
            imageUrl: result.product.image_url,
            category: result.product.category,
            quantity: 1,
          });

          setLookupState('success');
          setBannerMessage(result.product.name ?? 'Producto encontrado');
          return;
        }

        setLookupState('not-found');
        setBannerMessage('NOT FOUND');

      } catch {
        if (requestId !== lookupRequestIdRef.current) {
          return;
        }

        setLookupState('error');
        setBannerMessage('Error consultando el backend :c');
      }
    },
    [onAddScannedItem, scannedBarcodeSet],
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8'],
    onCodeScanned: (codes: Code[]) => {
      const winner = getWinner(codes);

      if (!winner) {
        candidateBarcodeRef.current = null;
        candidateCountRef.current = 0;
        return;
      }

      if (activeBarcodeRef.current == null) {
        activeBarcodeRef.current = winner;
        candidateBarcodeRef.current = null;
        candidateCountRef.current = 0;
        handleAcceptedBarcode(winner).catch(() => undefined);
        return;
      }

      if (activeBarcodeRef.current === winner) {
        candidateBarcodeRef.current = null;
        candidateCountRef.current = 0;
        return;
      }

      if (candidateBarcodeRef.current !== winner) {
        candidateBarcodeRef.current = winner;
        candidateCountRef.current = 1;
        return;
      }

      candidateCountRef.current += 1;

      if (candidateCountRef.current >= SWITCH_CONFIRMATIONS) {
        activeBarcodeRef.current = winner;
        candidateBarcodeRef.current = null;
        candidateCountRef.current = 0;
        handleAcceptedBarcode(winner).catch(() => undefined);
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

      <ScannerGuideOverlay lookupState={lookupState} />

      <ScannerStatusBanner label={bannerLabel} message={bannerMessage} />

      <View style={styles.bottomActions}>
        <Text style={styles.counterText}>
          {scannedItems.length} producto{scannedItems.length === 1 ? '' : 's'} en
          lista
        </Text>

        <Pressable
          onPress={onFinalize}
          disabled={scannedItems.length === 0}
          style={[
            styles.finalizeButton,
            scannedItems.length === 0 && styles.finalizeButtonDisabled,
          ]}
        >
          <Text style={styles.finalizeButtonText}>Finalizar</Text>
        </Pressable>
      </View>
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
  bottomActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    gap: 12,
  },
  counterText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingVertical: 8,
    borderRadius: 12,
  },
  finalizeButton: {
    backgroundColor: '#3158ff',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  finalizeButtonDisabled: {
    backgroundColor: '#7f92d6',
  },
  finalizeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
