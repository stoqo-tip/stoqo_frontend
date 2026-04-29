import { useNavigation, useRoute, } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';

import { ProductCapturePhotoCard, } from '../components/molecules';
import { ProductCaptureNutritionFields, ProductCaptureRawTextFields, ProductCaptureReviewFields, } from '../components/organisms';
import { useProductCaptureForm, } from '../features/productCapture/hooks';
import { Routes, type ProductCaptureRouteProp, type RootStackNavigationProp, } from '../navigation/types';

export function ProductCaptureScreen(): React.JSX.Element {
   const navigation = useNavigation<RootStackNavigationProp>();
   const route = useRoute<ProductCaptureRouteProp>();
   const { barcode, frontPhotoPath, nutritionPhotoPath, } = route.params;
   const {
      frontText,
      nutritionText,
      parsed,
      brand,
      name,
      quantityRaw,
      quantityValue,
      quantityUnit,
      nutritionDraft,
      isParsing,
      isReadingOcr,
      isSaving,
      errorMessage,
      successMessage,
      canParse,
      canSave,
      setBrand,
      setName,
      setQuantityRaw,
      setQuantityValue,
      setQuantityUnit,
      setNutritionDraft,
      setFrontText,
      setNutritionText,
      handleParse,
      handleSave,
   } = useProductCaptureForm({
      barcode,
      frontPhotoPath,
      nutritionPhotoPath,
   });

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
               <View style={styles.headerTopRow}>
                  <Pressable onPress={() => navigation.navigate(Routes.Scanner)} style={styles.topAction}>
                     <Text style={styles.topActionText}>Volver</Text>
                  </Pressable>

                  <Pressable onPress={() => navigation.navigate(Routes.Home)} style={styles.skipBtn}>
                     <Text style={styles.skipText}>Inicio</Text>
                  </Pressable>
               </View>

               <Text style={styles.title}>Cargar producto</Text>
               <Text style={styles.subtitle}>{barcode}</Text>
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Captura</Text>
               <View style={styles.captureGrid}>
                  <ProductCapturePhotoCard
                     title="Frente"
                     hasText={frontText.length > 0}
                     onPress={() =>
                        navigation.navigate(Routes.ProductCaptureCamera, {
                           barcode,
                           target: 'front',
                           frontPhotoPath,
                           nutritionPhotoPath,
                        })

                     }
                  />
                  <ProductCapturePhotoCard
                     title="Nutricion"
                     hasText={nutritionText.length > 0}
                     onPress={() =>
                        navigation.navigate(Routes.ProductCaptureCamera, {
                           barcode,
                           target: 'nutrition',
                           frontPhotoPath,
                           nutritionPhotoPath,
                        })

                     }
                  />
               </View>

               <ProductCaptureRawTextFields
                  frontText={frontText}
                  nutritionText={nutritionText}
                  onChangeFrontText={setFrontText}
                  onChangeNutritionText={setNutritionText}
               />

               {isReadingOcr ? (
                  <View style={styles.ocrStatus}>
                     <ActivityIndicator color="#C8392B" />
                     <Text style={styles.ocrStatusText}>Leyendo imagen...</Text>
                  </View>
               ) : null}

               {errorMessage ? <Text style={styles.captureErrorText}>{errorMessage}</Text> : null}

               <Pressable
                  onPress={handleParse}

                  disabled={!canParse || isParsing || isReadingOcr}
                  style={[styles.parseButton, (!canParse || isParsing || isReadingOcr) && styles.disabledButton,]}
               >
                  {isParsing ? (
                     <ActivityIndicator color="#FFFFFF" />
                  ) : (
                     <Text style={styles.parseButtonText}>Extraer datos</Text>
                  )}
               </Pressable>
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Revision</Text>

               <ProductCaptureReviewFields
                  barcode={barcode}
                  brand={brand}
                  name={name}
                  quantityRaw={quantityRaw}
                  quantityValue={quantityValue}
                  quantityUnit={quantityUnit}
                  onChangeBrand={setBrand}
                  onChangeName={setName}
                  onChangeQuantityRaw={setQuantityRaw}
                  onChangeQuantityValue={setQuantityValue}
                  onChangeQuantityUnit={setQuantityUnit}
               />
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Nutricion cada 100 g</Text>

               <ProductCaptureNutritionFields
                  nutritionDraft={nutritionDraft}
                  onChangeNutritionDraft={setNutritionDraft}
               />
            </View>

            {parsed.warnings.length > 0 ? (
               <View style={styles.warningBox}>
                  {parsed.warnings.map(warning => (
                     <Text key={warning} style={styles.warningText}>
                        {warning}
                     </Text>
                  ))}
               </View>
            ) : null}

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

            <Pressable
               onPress={handleSave}
               disabled={!canSave}
               style={[styles.saveButton, !canSave && styles.disabledButton,]}
            >
               <Text style={styles.saveButtonText}>
                  {isSaving ? 'Guardando...' : 'Guardar solicitud'}
               </Text>
            </Pressable>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#FAFAF8',
   },
   content: {
      paddingHorizontal: 20,
      paddingBottom: 32,
   },
   header: {
      paddingTop: 16,
      paddingBottom: 18,
   },
   headerTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   topAction: {
      paddingVertical: 6,
   },
   topActionText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#C8392B',
   },
   skipBtn: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#BDBDBD',
   },
   skipText: {
      fontSize: 13,
      color: '#757575',
   },
   title: {
      marginTop: 14,
      fontSize: 30,
      fontWeight: '700',
      color: '#1A1A2E',
   },
   subtitle: {
      marginTop: 4,
      fontSize: 15,
      color: '#757575',
      lineHeight: 21,
   },
   section: {
      marginBottom: 16,
      padding: 16,
      borderRadius: 18,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#EFEFEF',
      gap: 12,
   },
   sectionTitle: {
      color: '#1A1A2E',
      fontSize: 18,
      fontWeight: '800',
   },
   captureGrid: {
      flexDirection: 'row',
      gap: 12,
   },
   parseButton: {
      minHeight: 48,
      borderRadius: 16,
      backgroundColor: '#C8392B',
      alignItems: 'center',
      justifyContent: 'center',
   },
   parseButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '800',
   },
   ocrStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   ocrStatusText: {
      color: '#4F4A45',
      fontSize: 13,
      fontWeight: '800',
   },
   captureErrorText: {
      color: '#D14343',
      fontSize: 13,
      fontWeight: '700',
      lineHeight: 18,
   },
   warningBox: {
      marginBottom: 12,
      padding: 12,
      borderRadius: 14,
      backgroundColor: '#FFF7E5',
      borderWidth: 1,
      borderColor: '#F1D7A8',
      gap: 4,
   },
   warningText: {
      color: '#8A611C',
      fontSize: 13,
      fontWeight: '700',
   },
   errorText: {
      color: '#D14343',
      fontSize: 14,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 10,
   },
   successText: {
      color: '#297D4B',
      fontSize: 14,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: 10,
   },
   saveButton: {
      minHeight: 52,
      borderRadius: 16,
      backgroundColor: '#1A1A2E',
      alignItems: 'center',
      justifyContent: 'center',
   },
   saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '800',
   },
   disabledButton: {
      backgroundColor: '#D0D0CC',
   },
});
