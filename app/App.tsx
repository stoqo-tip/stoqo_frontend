import React, { useState } from 'react';
import { HomeScreen, ScannerScreen, Onboarding } from './src/screens';

type Screen = 'onboarding' | 'home' | 'scanner';

export default function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');

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
    return (
      <HomeScreen
        onStartScanning={() => setCurrentScreen('scanner')}
      />
    );
  }
  return (
    <ScannerScreen
      onBack={() => setCurrentScreen('home')}
    />
  );
}
