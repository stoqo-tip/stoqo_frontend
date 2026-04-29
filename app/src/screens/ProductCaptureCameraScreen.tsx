import {useNavigation,useRoute,} from '@react-navigation/native';
import React, {useRef,useState,} from 'react';
import {Pressable,StyleSheet,Text,View,} from 'react-native';
import {SafeAreaView,} from 'react-native-safe-area-context';
import {Camera,useCameraDevice,useCameraPermission,} from 'react-native-vision-camera';

import {ScreenMessage,} from '../components/atoms';
import {Routes,type ProductCaptureCameraRouteProp,type RootStackNavigationProp,} from '../navigation/types';

export function ProductCaptureCameraScreen(): React.JSX.Element {
   const navigation = useNavigation<RootStackNavigationProp>();
   const route = useRoute<ProductCaptureCameraRouteProp>();
   const {barcode,target,} = route.params;
   const cameraRef = useRef<Camera>(null);

   const device = useCameraDevice('back');
   const {hasPermission,requestPermission,} = useCameraPermission();
   const [isTakingPhoto,setIsTakingPhoto,] = useState(false);
   const [errorMessage,setErrorMessage,] = useState<string | null>(null);

   async function handleTakePhoto(): Promise<void> {
      if (!cameraRef.current || isTakingPhoto) {
         return;
      }

      setIsTakingPhoto(true);
      setErrorMessage(null);

      try {
         const photo = await cameraRef.current.takePhoto();
         navigation.navigate(Routes.ProductCapture, {
            barcode,
            ...(target === 'front'
               ? {frontPhotoPath: photo.path,}
               : {nutritionPhotoPath: photo.path,}),
         });
      } catch {
         setErrorMessage('No se pudo capturar la foto.');
      } finally {
         setIsTakingPhoto(false);
      }
   }

   if (!hasPermission) {
      return (
         <SafeAreaView style={styles.permissionScreen}>
            <View style={styles.permissionCard}>
               <Text style={styles.permissionEyebrow}>Camara</Text>
               <ScreenMessage message="Necesitamos permiso para usar la camara" />
               <Pressable style={styles.permissionButton} onPress={requestPermission}>
                  <Text style={styles.permissionButtonText}>Dar permiso</Text>
               </Pressable>
            </View>
         </SafeAreaView>
      );
   }

   if (device == null) {
      return (
         <SafeAreaView style={styles.permissionScreen}>
            <View style={styles.permissionCard}>
               <Text style={styles.permissionEyebrow}>Camara</Text>
               <ScreenMessage message="No se encontro una camara disponible" />
            </View>
         </SafeAreaView>
      );
   }

   return (
      <View style={styles.screen}>
         <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
         />

         <SafeAreaView style={styles.overlay} edges={['top','bottom']}>
            <View style={styles.topRow}>
               <Pressable
                  onPress={() => navigation.navigate(Routes.ProductCapture, {barcode,})}
                  style={styles.topActionButton}
               >
                  <Text style={styles.topActionText}>Volver</Text>
               </Pressable>

               <View style={styles.modePill}>
                  <Text style={styles.modePillText}>
                     {target === 'front' ? 'FRENTE' : 'NUTRICION'}
                  </Text>
               </View>
            </View>

            <View style={styles.bottomDock}>
               {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

               <Pressable
                  onPress={handleTakePhoto}
                  disabled={isTakingPhoto}
                  style={[styles.captureButton,isTakingPhoto && styles.captureButtonDisabled,]}
               >
                  <Text style={styles.captureButtonText}>
                     {isTakingPhoto ? 'Capturando...' : 'Tomar foto'}
                  </Text>
               </Pressable>
            </View>
         </SafeAreaView>
      </View>
   );
}

const styles = StyleSheet.create({
   screen: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#1F1A14',
   },
   permissionScreen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: '#F5F3EF',
   },
   permissionCard: {
      width: '100%',
      maxWidth: 360,
      paddingHorizontal: 22,
      paddingVertical: 24,
      borderRadius: 28,
      backgroundColor: '#FBFAF7',
      borderWidth: 1,
      borderColor: '#E8E5DF',
      alignItems: 'center',
      gap: 18,
   },
   permissionEyebrow: {
      color: '#7C889F',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
   },
   permissionButton: {
      minWidth: 160,
      borderRadius: 18,
      backgroundColor: '#1A1A2E',
      paddingVertical: 14,
      paddingHorizontal: 22,
      alignItems: 'center',
      justifyContent: 'center',
   },
   permissionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
   },
   overlay: {
      flex: 1,
      justifyContent: 'space-between',
   },
   topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingTop: 12,
   },
   topActionButton: {
      minHeight: 38,
      borderRadius: 999,
      paddingHorizontal: 14,
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 251, 245, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255, 248, 240, 0.22)',
   },
   topActionText: {
      color: '#FFF8F0',
      fontSize: 15,
      fontWeight: '700',
   },
   modePill: {
      minHeight: 38,
      borderRadius: 999,
      paddingHorizontal: 16,
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 251, 245, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255, 248, 240, 0.22)',
   },
   modePillText: {
      color: '#FFF8F0',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.8,
   },
   bottomDock: {
      marginHorizontal: 18,
      marginBottom: 18,
      padding: 16,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 251, 247, 0.94)',
      borderWidth: 1,
      borderColor: '#EFE7DB',
      gap: 10,
   },
   errorText: {
      color: '#D14343',
      fontSize: 14,
      fontWeight: '700',
      textAlign: 'center',
   },
   captureButton: {
      height: 54,
      borderRadius: 18,
      backgroundColor: '#C8392B',
      alignItems: 'center',
      justifyContent: 'center',
   },
   captureButtonDisabled: {
      backgroundColor: '#D0D0CC',
   },
   captureButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '800',
   },
});
