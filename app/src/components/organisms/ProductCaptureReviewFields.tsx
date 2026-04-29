import React from 'react';
import {StyleSheet,TextInput,View,} from 'react-native';

type ProductCaptureReviewFieldsProps = {
   barcode: string;
   brand: string;
   name: string;
   quantityRaw: string;
   quantityValue: string;
   quantityUnit: string;
   onChangeBrand: (value: string) => void;
   onChangeName: (value: string) => void;
   onChangeQuantityRaw: (value: string) => void;
   onChangeQuantityValue: (value: string) => void;
   onChangeQuantityUnit: (value: string) => void;
};

export function ProductCaptureReviewFields({
   barcode,
   brand,
   name,
   quantityRaw,
   quantityValue,
   quantityUnit,
   onChangeBrand,
   onChangeName,
   onChangeQuantityRaw,
   onChangeQuantityValue,
   onChangeQuantityUnit,
}: ProductCaptureReviewFieldsProps): React.JSX.Element {
   return (
      <>
         <TextInput
            value={barcode}
            editable={false}
            style={[styles.input, styles.readonlyInput]}
         />
         <TextInput
            value={brand}
            onChangeText={onChangeBrand}
            placeholder="Marca"
            placeholderTextColor="#999999"
            style={styles.input}
         />
         <TextInput
            value={name}
            onChangeText={onChangeName}
            placeholder="Nombre"
            placeholderTextColor="#999999"
            style={styles.input}
         />

         <View style={styles.row}>
            <TextInput
               value={quantityRaw}
               onChangeText={onChangeQuantityRaw}
               placeholder="Cantidad"
               placeholderTextColor="#999999"
               style={[styles.input, styles.rowInput]}
            />
            <TextInput
               value={quantityValue}
               onChangeText={onChangeQuantityValue}
               keyboardType="decimal-pad"
               placeholder="Valor"
               placeholderTextColor="#999999"
               style={[styles.input, styles.smallInput]}
            />
            <TextInput
               value={quantityUnit}
               onChangeText={onChangeQuantityUnit}
               placeholder="Unidad"
               placeholderTextColor="#999999"
               style={[styles.input, styles.smallInput]}
            />
         </View>
      </>
   );
}

const styles = StyleSheet.create({
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
});
