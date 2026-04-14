import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  HomeScreen,
  Onboarding,
  ScannerScreen,
  ScannedProductsReviewScreen,
} from './src/screens';
import { saveScannedItemsToPantry } from './src/services';
import type { ScannedProductItem } from './src/types';

type Screen = 'onboarding' | 'home' | 'scanner' | 'review';

export default function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [scannedItems, setScannedItems] = useState<ScannedProductItem[]>([]);
  const [isSavingPantry, setIsSavingPantry] = useState(false);
  const [reviewSaveError, setReviewSaveError] = useState<string | null>(null);

  const handleStartScanning = () => {
    setReviewSaveError(null);
    setScannedItems([]);
    setCurrentScreen('scanner');
  };

  const handleAddScannedItem = (item: ScannedProductItem) => {
    setScannedItems(prev => {
      if (prev.some(existingItem => existingItem.barcode === item.barcode)) {
        return prev;
      }

      return [...prev, item];
    });
  };

  const handleIncrementQuantity = (barcode: string) => {
    setScannedItems(prev =>
      prev.map(item =>
        item.barcode === barcode
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecrementQuantity = (barcode: string) => {
    setScannedItems(prev =>
      prev.map(item =>
        item.barcode === barcode
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  };

  const handleRemoveItem = (barcode: string) => {
    setScannedItems(prev => prev.filter(item => item.barcode !== barcode));
  };

  const handleConfirmScannedItems = async () => {
    if (scannedItems.length === 0 || isSavingPantry) {
      return;
    }

    setIsSavingPantry(true);
    setReviewSaveError(null);

    try {
      await saveScannedItemsToPantry(scannedItems);
      setScannedItems([]);
      setCurrentScreen('home');
    } catch {
      setReviewSaveError('No pudimos guardar los productos en la alacena.');
    } finally {
      setIsSavingPantry(false);
    }
  };

  let content: React.JSX.Element;

  if (currentScreen === 'onboarding') {
    content = (
      <Onboarding
        onComplete={(pantry) => {
          console.log('Despensa inicial:', pantry);
          setCurrentScreen('home');
        }}
        onSkip={() => setCurrentScreen('home')}
      />
    );
  } else if (currentScreen === 'home') {
    content = <HomeScreen onStartScanning={handleStartScanning} />;
  } else if (currentScreen === 'scanner') {
    content = (
      <ScannerScreen
        onBack={() => {
          setCurrentScreen('home');
        }}
        onFinalize={() => {
          setReviewSaveError(null);
          setCurrentScreen('review');
        }}
        scannedItems={scannedItems}
        onAddScannedItem={handleAddScannedItem}
      />
    );
  } else {
    content = (
      <ScannedProductsReviewScreen
        items={scannedItems}
        onBackToScanner={() => {
          setCurrentScreen('scanner');
        }}
        onBackHome={() => {
          setCurrentScreen('home');
        }}
        onIncrementQuantity={handleIncrementQuantity}
        onDecrementQuantity={handleDecrementQuantity}
        onRemoveItem={handleRemoveItem}
        onConfirmItems={handleConfirmScannedItems}
        isSaving={isSavingPantry}
        saveError={reviewSaveError}
      />
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      {content}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
