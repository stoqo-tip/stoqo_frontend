import React, { useState } from 'react';
import { HomeScreen, ScannerScreen } from './src/screens';

export default function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'scanner'>('home');

  if (currentScreen === 'home') {
    return (
      <HomeScreen
        onStartScanning={() => {
          setCurrentScreen('scanner');
        }}
      />
    );
  }
  return (
  <ScannerScreen
    onBack={() => {
      setCurrentScreen('home');
    }}
  />
);
}
