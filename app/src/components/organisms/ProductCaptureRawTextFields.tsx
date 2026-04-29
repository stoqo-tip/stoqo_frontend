import React from 'react';
import {StyleSheet,Text,TextInput,View,} from 'react-native';

type ProductCaptureRawTextFieldsProps = {
   frontText: string;
   nutritionText: string;
   onChangeFrontText: (value: string) => void;
   onChangeNutritionText: (value: string) => void;
};

export function ProductCaptureRawTextFields({
   frontText,
   nutritionText,
   onChangeFrontText,
   onChangeNutritionText,
}: ProductCaptureRawTextFieldsProps): React.JSX.Element {
   return (
      <>
         <View style={styles.fieldGroup}>
            <Text style={styles.label}>Texto frente</Text>
            <TextInput
               value={frontText}
               onChangeText={onChangeFrontText}
               placeholder="Texto detectado del frente"
               placeholderTextColor="#999999"
               multiline={true}
               textAlignVertical="top"
               style={styles.textArea}
            />
         </View>

         <View style={styles.fieldGroup}>
            <Text style={styles.label}>Texto nutricion</Text>
            <TextInput
               value={nutritionText}
               onChangeText={onChangeNutritionText}
               placeholder="Texto detectado de la tabla nutricional"
               placeholderTextColor="#999999"
               multiline={true}
               textAlignVertical="top"
               style={styles.textArea}
            />
         </View>
      </>
   );
}

const styles = StyleSheet.create({
   fieldGroup: {
      gap: 6,
   },
   label: {
      color: '#4F4A45',
      fontSize: 13,
      fontWeight: '800',
   },
   textArea: {
      minHeight: 92,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#E4E0DA',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: '#1A1A2E',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
   },
});
