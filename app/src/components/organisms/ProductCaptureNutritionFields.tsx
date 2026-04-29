import React from 'react';
import {StyleSheet,Text,TextInput,View,} from 'react-native';

import {PRODUCT_CAPTURE_NUTRITION_FIELDS,type ProductCaptureNutritionDraft,} from '../../features/productCapture/model';

type ProductCaptureNutritionFieldsProps = {
   nutritionDraft: ProductCaptureNutritionDraft;
   onChangeNutritionDraft: (draft: ProductCaptureNutritionDraft) => void;
};

export function ProductCaptureNutritionFields({
   nutritionDraft,
   onChangeNutritionDraft,
}: ProductCaptureNutritionFieldsProps): React.JSX.Element {
   return (
      <>
         {PRODUCT_CAPTURE_NUTRITION_FIELDS.map(field => (
            <View key={field.key} style={styles.nutritionRow}>
               <Text style={styles.nutritionLabel}>{field.label}</Text>
               <TextInput
                  value={nutritionDraft[field.key]}
                  onChangeText={value =>
                     onChangeNutritionDraft({
                        ...nutritionDraft,
                        [field.key]: value,
                     })
                  }
                  keyboardType="decimal-pad"
                  placeholder="-"
                  placeholderTextColor="#999999"
                  style={styles.nutritionInput}
               />
            </View>
         ))}
      </>
   );
}

const styles = StyleSheet.create({
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
});
