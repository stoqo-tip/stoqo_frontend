import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type ProductCapturePhotoTarget = 'front' | 'nutrition';

export const Routes = {
  Onboarding: 'Onboarding',
  Home: 'Home',
  Analysis: 'Analysis',
  Scanner: 'Scanner',
  Review: 'Review',
  ProductCapture: 'ProductCapture',
  ProductCaptureCamera: 'ProductCaptureCamera',
} as const;

export type RootStackParamList = {
  [Routes.Onboarding]: undefined;
  [Routes.Home]: undefined;
  [Routes.Analysis]: undefined;
  [Routes.Scanner]: undefined;
  [Routes.Review]: undefined;
  [Routes.ProductCapture]: {
    barcode: string;
    frontPhotoPath?: string;
    nutritionPhotoPath?: string;
  };
  [Routes.ProductCaptureCamera]: {
    barcode: string;
    target: ProductCapturePhotoTarget;
    frontPhotoPath?: string;
    nutritionPhotoPath?: string;
  };

};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type ProductCaptureRouteProp = RouteProp<
  RootStackParamList,
  typeof Routes.ProductCapture
>;
export type ProductCaptureCameraRouteProp = RouteProp<
  RootStackParamList,
  typeof Routes.ProductCaptureCamera
>;
