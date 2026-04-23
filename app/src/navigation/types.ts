import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const Routes = {
  Onboarding: 'Onboarding',
  Home: 'Home',
  Analysis: 'Analysis',
  Scanner: 'Scanner',
  Review: 'Review',
} as const;

export type RootStackParamList = {
  [Routes.Onboarding]: undefined;
  [Routes.Home]: undefined;
  [Routes.Analysis]: undefined;
  [Routes.Scanner]: undefined;
  [Routes.Review]: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
