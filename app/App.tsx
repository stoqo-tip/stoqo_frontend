import React, { useState } from 'react';
import {
  HomeScreen,
  Onboarding,
  ScannerScreen,
  ScannedProductsReviewScreen,
} from './src/screens';
import type { ScannedProductItem } from './src/types';

type Screen = 'onboarding' | 'home' | 'scanner' | 'review';

export default function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [scannedItems, setScannedItems] = useState<ScannedProductItem[]>([]);

  const handleStartScanning = () => {
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

  if (currentScreen === 'onboarding') {
    return (
      <Onboarding
        onComplete={(pantry) => {
          console.log('Despensa inicial:', pantry);
          setCurrentScreen('home');
        }}
        onSkip={() => setCurrentScreen('home')}
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
    />
  );
}
