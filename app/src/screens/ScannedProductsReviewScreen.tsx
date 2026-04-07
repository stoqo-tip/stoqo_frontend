import React from 'react';
import {
   FlatList,
   Pressable,
   StyleSheet,
   Text,
   View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ScannedProductItem } from '../types';

type ScannedProductsReviewScreenProps = {
   items: ScannedProductItem[];
   onBackToScanner: () => void;
   onBackHome: () => void;
   onIncrementQuantity: (barcode: string) => void;
   onDecrementQuantity: (barcode: string) => void;
   onRemoveItem: (barcode: string) => void;
};

export function ScannedProductsReviewScreen({
   items,
   onBackToScanner,
   onBackHome,
   onIncrementQuantity,
   onDecrementQuantity,
   onRemoveItem,
}: ScannedProductsReviewScreenProps): React.JSX.Element {
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <Pressable onPress={onBackToScanner}>
               <Text style={styles.headerAction}>Volver</Text>
            </Pressable>

            <Text style={styles.title}>Productos escaneados</Text>

            <Pressable onPress={onBackHome}>
               <Text style={styles.headerAction}>Inicio</Text>
            </Pressable>
         </View>

         <FlatList
            data={items}
            keyExtractor={item => item.barcode}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
               const secondaryText =
                  [item.brand, item.category].filter(Boolean).join(' \u2022 ') ||
                  item.barcode;

               return (
                  <View style={styles.row}>
                     <View style={styles.infoColumn}>
                        <Text style={styles.itemName} numberOfLines={2}>
                           {item.name}
                        </Text>
                        <Text style={styles.itemMeta} numberOfLines={2}>
                           {secondaryText}
                        </Text>
                     </View>

                     <View style={styles.actionsColumn}>
                        <View style={styles.quantityPill}>
                           <Pressable
                              disabled={item.quantity === 1}
                              onPress={() => onDecrementQuantity(item.barcode)}
                              style={[
                                 styles.quantityButton,
                                 item.quantity === 1 && styles.quantityButtonDisabled,
                              ]}
                           >
                              <Text style={styles.minusText}>-</Text>
                           </Pressable>

                           <Text style={styles.quantityValue}>{item.quantity}</Text>

                           <Pressable
                              onPress={() => onIncrementQuantity(item.barcode)}
                              style={styles.quantityButton}
                           >
                              <Text style={styles.plusText}>+</Text>
                           </Pressable>
                        </View>

                        <Pressable
                           onPress={() => onRemoveItem(item.barcode)}
                           style={styles.deleteButton}
                        >
                           <Text style={styles.deleteButtonText}>Borrar</Text>
                        </Pressable>
                     </View>
                  </View>
               );
            }}
            ListEmptyComponent={
               <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No hay productos escaneados</Text>
                  <Text style={styles.emptySubtitle}>
                     Escanea al menos uno y despues toca finalizar.
                  </Text>
               </View>
            }
         />
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f7f7fb',
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: '#e8e8ef',
      backgroundColor: '#fff',
   },
   headerAction: {
      color: '#3158ff',
      fontSize: 15,
      fontWeight: '600',
   },
   title: {
      color: '#222',
      fontSize: 20,
      fontWeight: '700',
   },
   listContent: {
      paddingHorizontal: 20,
      paddingVertical: 24,
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      backgroundColor: '#fff',
      borderRadius: 22,
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: 18,
   },
   infoColumn: {
      flex: 1,
      gap: 6,
   },
   itemName: {
      color: '#1f1f24',
      fontSize: 17,
      fontWeight: '600',
   },
   itemMeta: {
      color: '#8f8f97',
      fontSize: 14,
      lineHeight: 20,
   },
   actionsColumn: {
      alignItems: 'flex-end',
      gap: 10,
   },
   quantityPill: {
      minWidth: 132,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 2,
      borderColor: '#5163ff',
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: '#fff',
   },
   quantityButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
   },
   quantityButtonDisabled: {
      opacity: 0.35,
   },
   minusText: {
      color: '#ff6a4d',
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 30,
   },
   plusText: {
      color: '#5163ff',
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 30,
   },
   quantityValue: {
      color: '#2a2a34',
      fontSize: 22,
      fontWeight: '700',
      minWidth: 24,
      textAlign: 'center',
   },
   deleteButton: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: '#ffd0d0',
      backgroundColor: '#fff4f4',
      paddingHorizontal: 14,
      paddingVertical: 7,
   },
   deleteButtonText: {
      color: '#e05656',
      fontSize: 13,
      fontWeight: '700',
   },
   emptyState: {
      paddingTop: 80,
      alignItems: 'center',
      gap: 10,
   },
   emptyTitle: {
      color: '#222',
      fontSize: 20,
      fontWeight: '700',
   },
   emptySubtitle: {
      color: '#666',
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 24,
   },
});
