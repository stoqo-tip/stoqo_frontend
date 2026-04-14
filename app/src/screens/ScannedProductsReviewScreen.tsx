import React from 'react';
import {
   FlatList,
   Pressable,
   StyleSheet,
   Text,
   View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScannedProductReviewRow } from '../components/molecules';
import type { ScannedProductItem } from '../types';

type ScannedProductsReviewScreenProps = {
   items: ScannedProductItem[];
   onBackToScanner: () => void;
   onBackHome: () => void;
   onIncrementQuantity: (barcode: string) => void;
   onDecrementQuantity: (barcode: string) => void;
   onRemoveItem: (barcode: string) => void;
   onConfirmItems: () => void;
   isSaving: boolean;
   saveError: string | null;
};

export function ScannedProductsReviewScreen({
   items,
   onBackToScanner,
   onBackHome,
   onIncrementQuantity,
   onDecrementQuantity,
   onRemoveItem,
   onConfirmItems,
   isSaving,
   saveError,
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
            renderItem={({ item }) => (
               <ScannedProductReviewRow
                  item={item}
                  onIncrementQuantity={onIncrementQuantity}
                  onDecrementQuantity={onDecrementQuantity}
                  onRemoveItem={onRemoveItem}
               />
            )}
            ListEmptyComponent={
               <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No hay productos escaneados</Text>
                  <Text style={styles.emptySubtitle}>
                     Escanea al menos uno y despues toca finalizar.
                  </Text>
               </View>
            }
         />

         <View style={styles.footer}>
            {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

            <Pressable
               onPress={onConfirmItems}
               disabled={items.length === 0 || isSaving}
               style={[
                  styles.confirmButton,
                  (items.length === 0 || isSaving) && styles.confirmButtonDisabled,
               ]}
            >
               <Text style={styles.confirmButtonText}>
                  {isSaving ? 'Guardando...' : 'Guardar en alacena'}
               </Text>
            </Pressable>
         </View>
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
      paddingTop: 24,
      paddingBottom: 16,
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
   footer: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 24,
      gap: 10,
      backgroundColor: '#f7f7fb',
   },
   errorText: {
      color: '#d14343',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
   },
   confirmButton: {
      backgroundColor: '#3158ff',
      borderRadius: 18,
      paddingVertical: 14,
      alignItems: 'center',
   },
   confirmButtonDisabled: {
      backgroundColor: '#7f92d6',
   },
   confirmButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
   },
});
