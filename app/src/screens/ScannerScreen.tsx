import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
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

function ReviewIcon(): React.JSX.Element {
  return (
    <View style={styles.reviewIcon}>
      <View style={styles.reviewSheet}>
        <View style={styles.reviewLineLong} />
        <View style={styles.reviewLineShort} />
        <View style={styles.reviewCheckWrap}>
          <View style={styles.reviewCheckStem} />
          <View style={styles.reviewCheckTick} />
        </View>
      </View>
    </View>
  );
}

export function ScannerScreen({
  onBack,
  onFinalize,
  scannedItems,
  onAddScannedItem,
}: ScannerScreenProps): React.JSX.Element {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const insets = useSafeAreaInsets();

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
        setBannerMessage('No encontrado');
      } catch {
        if (requestId !== lookupRequestIdRef.current) {
          return;
        }

        setLookupState('error');
        setBannerMessage('Error consultando el backend');
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
      <SafeAreaView style={styles.permissionScreen}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionEyebrow}>Camara</Text>
          <ScreenMessage message="Necesitamos permiso para usar la camara" />
          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Dar permiso</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (device == null) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionEyebrow}>Camara</Text>
          <ScreenMessage message="No se encontro una camara disponible" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.screen}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />

      <View style={styles.cameraTint} />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View
          style={[
            styles.topRow,
            {
              paddingTop: Math.max(insets.top, 8),
            },
          ]}
        >
          <Pressable onPress={onBack} style={styles.topActionButton}>
            <Text style={styles.topActionText}>Volver</Text>
          </Pressable>

          <View style={styles.modePill}>
            <Text style={styles.modePillText}>ESCANEAR</Text>
          </View>
        </View>

        <ScannerStatusBanner label={bannerLabel} message={bannerMessage} />

        <ScannerGuideOverlay lookupState={lookupState} />

        <View
          style={[
            styles.bottomDock,
            {
              paddingBottom: Math.max(insets.bottom, 14),
            },
          ]}
        >
          <Text style={styles.counterText}>
            {scannedItems.length} producto
            {scannedItems.length === 1 ? '' : 's'} en lista
          </Text>

          <Pressable
            onPress={onFinalize}
            disabled={scannedItems.length === 0}
            style={[
              styles.finalizeButton,
              scannedItems.length === 0 && styles.finalizeButtonDisabled,
            ]}
          >
            <ReviewIcon />
            <Text style={styles.finalizeButtonText}>Revisar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1F1A14',
  },
  permissionScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5F3EF',
  },
  permissionCard: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderRadius: 28,
    backgroundColor: '#FBFAF7',
    borderWidth: 1,
    borderColor: '#E8E5DF',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    alignItems: 'center',
    gap: 18,
  },
  permissionEyebrow: {
    color: '#7C889F',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  permissionButton: {
    minWidth: 160,
    borderRadius: 18,
    backgroundColor: '#1A1A2E',
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cameraTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 22, 16, 0.30)',
  },
  overlay: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  topActionButton: {
    minHeight: 38,
    borderRadius: 999,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 251, 245, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 248, 240, 0.22)',
  },
  topActionText: {
    color: '#FFF8F0',
    fontSize: 15,
    fontWeight: '700',
  },
  modePill: {
    minHeight: 38,
    borderRadius: 999,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 251, 245, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 248, 240, 0.22)',
  },
  modePillText: {
    color: '#FFF8F0',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bottomDock: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 251, 247, 0.94)',
    borderWidth: 1,
    borderColor: '#EFE7DB',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  counterText: {
    color: '#726A5E',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  finalizeButton: {
    height: 48,
    borderRadius: 18,
    backgroundColor: '#1A1A2E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  finalizeButtonDisabled: {
    backgroundColor: '#979AAF',
  },
  finalizeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  reviewIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewSheet: {
    width: 16,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.6,
    borderColor: '#FFFFFF',
    paddingTop: 3,
    paddingHorizontal: 3,
  },
  reviewLineLong: {
    height: 1.6,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    marginBottom: 2,
  },
  reviewLineShort: {
    width: 7,
    height: 1.6,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    marginBottom: 3,
  },
  reviewCheckWrap: {
    position: 'relative',
    width: 8,
    height: 6,
  },
  reviewCheckStem: {
    position: 'absolute',
    left: 1,
    top: 2,
    width: 3,
    height: 1.6,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  reviewCheckTick: {
    position: 'absolute',
    left: 3,
    top: 1,
    width: 5,
    height: 1.6,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
  },
});
