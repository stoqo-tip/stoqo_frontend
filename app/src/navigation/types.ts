import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export const Routes = {
  Onboarding: 'Onboarding',
  Home: 'Home',
  Analysis: 'Analysis',
  Scanner: 'Scanner',
  Review: 'Review',
  ProductCapture: 'ProductCapture',
} as const;

export type RootStackParamList = {
  [Routes.Onboarding]: undefined;
  [Routes.Home]: undefined;
  [Routes.Analysis]: undefined;
  [Routes.Scanner]: undefined;
  [Routes.Review]: undefined;
  [Routes.ProductCapture]: { barcode: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type ProductCaptureRouteProp = RouteProp<
  RootStackParamList,
  typeof Routes.ProductCapture
>;
