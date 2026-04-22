import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import {
  ConsumptionAnalysisScreen,
  HomeScreen,
  Onboarding,
  ScannerScreen,
  ScannedProductsReviewScreen,
} from '../screens';
import { Routes, type RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.Onboarding} component={Onboarding} />
      <Stack.Screen name={Routes.Home} component={HomeScreen} />
      <Stack.Screen name={Routes.Analysis} component={ConsumptionAnalysisScreen} />
      <Stack.Screen name={Routes.Scanner} component={ScannerScreen} />
      <Stack.Screen name={Routes.Review} component={ScannedProductsReviewScreen} />
    </Stack.Navigator>
  );
}
