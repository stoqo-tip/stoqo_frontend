import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
   ActivityIndicator,
   Pressable,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
   Routes,
   type ProductCaptureRouteProp,
   type RootStackNavigationProp,
} from '../navigation/types';
import {
   parseProductCapture,
   submitProductCapture,
   type ProductCaptureNutrition,
   type ProductCaptureParsed,
} from '../services';

const EMPTY_NUTRITION: ProductCaptureNutrition = {
   energy_kcal_100g: null,
   proteins_100g: null,
   carbohydrates_100g: null,
   sugars_100g: null,
   fat_100g: null,
   sodium_100g: null,
};

// Punto de integracion: reemplazar estos placeholders por OCR de ML Kit.
const MOCK_FRONT_TEXT = `Nescafe
Dolca Original
100 g`;

const MOCK_NUTRITION_TEXT = `Valor energetico 80 kcal
Proteinas 1.8 g
Carbohidratos 16 g
Azucares 14 g
Grasas totales 0.5 g
Sodio 40 mg`;

function nullableNumberToText(value: number | null | undefined): string {
   return value == null ? '' : String(value);
}

function textToNullableNumber(value: string): number | null {
   const normalizedValue = value.trim().replace(',', '.');

   if (!normalizedValue) {
      return null;
   }

   const numericValue = Number(normalizedValue);
   return Number.isNaN(numericValue) ? null : numericValue;
}

function buildInitialParsed(barcode: string): ProductCaptureParsed {
   return {
      barcode,
      brand: null,
      name: null,
      quantity_raw: null,
      quantity_value: null,
      quantity_unit: null,
      nutrition: EMPTY_NUTRITION,
      warnings: [],
      needs_review: true,
   };
}

type NutritionDraft = Record<keyof ProductCaptureNutrition, string>;

const NUTRITION_FIELDS: Array<{
   key: keyof ProductCaptureNutrition;
   label: string;
}> = [
      { key: 'energy_kcal_100g', label: 'Kcal cada 100 g' },
      { key: 'proteins_100g', label: 'Proteinas' },
      { key: 'carbohydrates_100g', label: 'Carbohidratos' },
      { key: 'sugars_100g', label: 'Azucares' },
      { key: 'fat_100g', label: 'Grasas' },
      { key: 'sodium_100g', label: 'Sodio' },
   ];

export function ProductCaptureScreen(): React.JSX.Element {
   const navigation = useNavigation<RootStackNavigationProp>();
   const route = useRoute<ProductCaptureRouteProp>();
   const { barcode } = route.params;

   const [frontText, setFrontText] = useState('');
   const [nutritionText, setNutritionText] = useState('');
   const [parsed, setParsed] = useState<ProductCaptureParsed>(() =>
      buildInitialParsed(barcode),
   );
   const [brand, setBrand] = useState('');
   const [name, setName] = useState('');
   const [quantityRaw, setQuantityRaw] = useState('');
   const [quantityValue, setQuantityValue] = useState('');
   const [quantityUnit, setQuantityUnit] = useState('');
   const [nutritionDraft, setNutritionDraft] = useState<NutritionDraft>({
      energy_kcal_100g: '',
      proteins_100g: '',
      carbohydrates_100g: '',
      sugars_100g: '',
      fat_100g: '',
      sodium_100g: '',
   });
   const [isParsing, setIsParsing] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [successMessage, setSuccessMessage] = useState<string | null>(null);

   const canParse = frontText.trim().length > 0 || nutritionText.trim().length > 0;
   const canSave = name.trim().length > 0 && !isSaving;

   const nutrition = useMemo<ProductCaptureNutrition>(
      () =>
         NUTRITION_FIELDS.reduce<ProductCaptureNutrition>(
            (accumulator, field) => ({
               ...accumulator,
               [field.key]: textToNullableNumber(nutritionDraft[field.key]),
            }),
            { ...EMPTY_NUTRITION },
         ),
      [nutritionDraft],
   );

   function applyParsedCapture(nextParsed: ProductCaptureParsed): void {
      setParsed(nextParsed);
      setBrand(nextParsed.brand ?? '');
      setName(nextParsed.name ?? '');
      setQuantityRaw(nextParsed.quantity_raw ?? '');
      setQuantityValue(nullableNumberToText(nextParsed.quantity_value));
      setQuantityUnit(nextParsed.quantity_unit ?? '');
      setNutritionDraft({
         energy_kcal_100g: nullableNumberToText(nextParsed.nutrition.energy_kcal_100g),
         proteins_100g: nullableNumberToText(nextParsed.nutrition.proteins_100g),
         carbohydrates_100g: nullableNumberToText(
            nextParsed.nutrition.carbohydrates_100g,
         ),
         sugars_100g: nullableNumberToText(nextParsed.nutrition.sugars_100g),
         fat_100g: nullableNumberToText(nextParsed.nutrition.fat_100g),
         sodium_100g: nullableNumberToText(nextParsed.nutrition.sodium_100g),
      });
   }

   async function handleParse(): Promise<void> {
      setIsParsing(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
         const nextParsed = await parseProductCapture({
            barcode,
            front_text: frontText,
            nutrition_text: nutritionText,
            source: 'ML_KIT',
         });
         applyParsedCapture(nextParsed);
      } catch {
         setErrorMessage('No se pudo procesar la captura.');
      } finally {
         setIsParsing(false);
      }
   }

   async function handleSave(): Promise<void> {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
         const response = await submitProductCapture({
            ...parsed,
            barcode,
            brand: brand.trim() || null,
            name: name.trim() || null,
            quantity_raw: quantityRaw.trim() || null,
            quantity_value: textToNullableNumber(quantityValue),
            quantity_unit: quantityUnit.trim() || null,
            nutrition,
            front_text: frontText,
            nutrition_text: nutritionText,
            source: 'ML_KIT',
            needs_review: true,
         });

         setSuccessMessage(`Solicitud #${response.id} guardada`);
      } catch {
         setErrorMessage('No se pudo guardar la solicitud.');
      } finally {
         setIsSaving(false);
      }
   }

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
                  <Pressable
                     onPress={() => setFrontText(MOCK_FRONT_TEXT)}
                     style={styles.captureButton}
                  >
                     <Text style={styles.captureButtonTitle}>Frente</Text>
                     <Text style={styles.captureButtonText}>
                        {frontText ? 'Texto capturado' : 'Capturar foto'}
                     </Text>
                  </Pressable>

                  <Pressable
                     onPress={() => setNutritionText(MOCK_NUTRITION_TEXT)}
                     style={styles.captureButton}
                  >
                     <Text style={styles.captureButtonTitle}>Nutricion</Text>
                     <Text style={styles.captureButtonText}>
                        {nutritionText ? 'Texto capturado' : 'Capturar foto'}
                     </Text>
                  </Pressable>
               </View>

               <Pressable
                  onPress={handleParse}
                  disabled={!canParse || isParsing}
                  style={[styles.parseButton, (!canParse || isParsing) && styles.disabledButton]}
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

               <TextInput
                  value={barcode}
                  editable={false}
                  style={[styles.input, styles.readonlyInput]}
               />
               <TextInput
                  value={brand}
                  onChangeText={setBrand}
                  placeholder="Marca"
                  placeholderTextColor="#999999"
                  style={styles.input}
               />
               <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Nombre"
                  placeholderTextColor="#999999"
                  style={styles.input}
               />

               <View style={styles.row}>
                  <TextInput
                     value={quantityRaw}
                     onChangeText={setQuantityRaw}
                     placeholder="Cantidad"
                     placeholderTextColor="#999999"
                     style={[styles.input, styles.rowInput]}
                  />
                  <TextInput
                     value={quantityValue}
                     onChangeText={setQuantityValue}
                     keyboardType="decimal-pad"
                     placeholder="Valor"
                     placeholderTextColor="#999999"
                     style={[styles.input, styles.smallInput]}
                  />
                  <TextInput
                     value={quantityUnit}
                     onChangeText={setQuantityUnit}
                     placeholder="Unidad"
                     placeholderTextColor="#999999"
                     style={[styles.input, styles.smallInput]}
                  />
               </View>
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Nutricion cada 100 g</Text>

               {NUTRITION_FIELDS.map(field => (
                  <View key={field.key} style={styles.nutritionRow}>
                     <Text style={styles.nutritionLabel}>{field.label}</Text>
                     <TextInput
                        value={nutritionDraft[field.key]}
                        onChangeText={value =>
                           setNutritionDraft(current => ({
                              ...current,
                              [field.key]: value,
                           }))
                        }
                        keyboardType="decimal-pad"
                        placeholder="-"
                        placeholderTextColor="#999999"
                        style={styles.nutritionInput}
                     />
                  </View>
               ))}
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
               style={[styles.saveButton, !canSave && styles.disabledButton]}
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
   captureButton: {
      flex: 1,
      minHeight: 112,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E7DED4',
      backgroundColor: '#FFF8F0',
      padding: 14,
      justifyContent: 'space-between',
   },
   captureButtonTitle: {
      color: '#1A1A2E',
      fontSize: 16,
      fontWeight: '800',
   },
   captureButtonText: {
      color: '#726A5E',
      fontSize: 13,
      fontWeight: '700',
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
   input: {
      minHeight: 46,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#E4E0DA',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 12,
      color: '#1A1A2E',
      fontSize: 15,
      fontWeight: '600',
   },
   readonlyInput: {
      color: '#757575',
      backgroundColor: '#F6F5F2',
   },
   row: {
      flexDirection: 'row',
      gap: 8,
   },
   rowInput: {
      flex: 1.2,
   },
   smallInput: {
      flex: 0.8,
   },
   nutritionRow: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
   },
   nutritionLabel: {
      flex: 1,
      color: '#4F4A45',
      fontSize: 14,
      fontWeight: '700',
   },
   nutritionInput: {
      width: 92,
      minHeight: 42,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E4E0DA',
      color: '#1A1A2E',
      textAlign: 'right',
      paddingHorizontal: 10,
      fontSize: 14,
      fontWeight: '700',
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
