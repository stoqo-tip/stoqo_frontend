import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuthContext } from '../context/AuthContext';
import {
  AuthScreen,
  ConsumptionAnalysisScreen,
  HomeScreen,
  Onboarding,
  ScannerScreen,
  ScannedProductsReviewScreen,
} from '../screens';
import { Routes, type RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack(): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#1A1A2E" size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name={Routes.Auth} component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name={Routes.Onboarding} component={Onboarding} />
          <Stack.Screen name={Routes.Home} component={HomeScreen} />
          <Stack.Screen name={Routes.Analysis} component={ConsumptionAnalysisScreen} />
          <Stack.Screen name={Routes.Scanner} component={ScannerScreen} />
          <Stack.Screen name={Routes.Review} component={ScannedProductsReviewScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAF8',
  },
});
