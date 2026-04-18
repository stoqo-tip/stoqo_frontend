import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  HomeScreen,
  Onboarding,
  ScannerScreen,
  ScannedProductsReviewScreen,
} from './src/screens';
import { saveOnboardingItemsToPantry, saveScannedItemsToPantry } from './src/services';
import type { PantryState } from './src/screens';
import type { ScannedProductItem } from './src/types';


type Screen = 'onboarding' | 'home' | 'scanner' | 'review';

export default function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [scannedItems, setScannedItems] = useState<ScannedProductItem[]>([]);
  const [isSavingPantry, setIsSavingPantry] = useState(false);
  const [reviewSaveError, setReviewSaveError] = useState<string | null>(null);
  const [isSavingOnboarding, setIsSavingOnboarding] = useState(false);
  const [onboardingSaveError, setOnboardingSaveError] = useState<string | null>(null);

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

  const handleCompleteOnboarding = async (pantry: PantryState) => {
    if (isSavingOnboarding) {
      return;
    }

    setIsSavingOnboarding(true);
    setOnboardingSaveError(null);

    try {
      await saveOnboardingItemsToPantry(pantry);
      setCurrentScreen('home');
    } catch {
      setOnboardingSaveError('No pudimos guardar la alacena inicial.');
    } finally {
      setIsSavingOnboarding(false);
    }
  };


  const renderScreen = (): React.JSX.Element => {
    if (currentScreen === 'onboarding') {
      return (
        <Onboarding
          onComplete={handleCompleteOnboarding}
          onSkip={() => setCurrentScreen('home')}
          isSaving={isSavingOnboarding}
          saveError={onboardingSaveError}
        />
      );
    }

    if (currentScreen === 'home') {
      return <HomeScreen onStartScanning={handleStartScanning} />;
    }

    if (currentScreen === 'scanner') {
      return (
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
    }

    return (
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
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>{renderScreen()}</SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
