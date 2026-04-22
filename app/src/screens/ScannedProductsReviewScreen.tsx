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
            <View style={styles.headerTopRow}>
               <Pressable onPress={onBackToScanner} style={styles.topAction}>
                  <Text style={styles.topActionText}>Volver</Text>
               </Pressable>

               <Pressable onPress={onBackHome} style={styles.skipBtn}>
                  <Text style={styles.skipText}>Inicio</Text>
               </Pressable>
            </View>

            <Text style={styles.title}>Productos escaneados</Text>
            <Text style={styles.subtitle}>
               Ajustá cantidades y deslizá a la izquierda para eliminar.
            </Text>
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
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
               <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No hay productos escaneados</Text>
                  <Text style={styles.emptySubtitle}>
                     Escaneá al menos uno y después tocá finalizar.
                  </Text>
               </View>
            }
         />

         <View style={styles.ctaContainer}>
            {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

            <Pressable
               onPress={onConfirmItems}
               disabled={items.length === 0 || isSaving}
               style={[
                  styles.ctaBtn,
                  (items.length === 0 || isSaving) && styles.ctaBtnDisabled,
               ]}
            >
               <Text style={styles.ctaText}>
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
      backgroundColor: '#FAFAF8',
   },
   header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
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
      letterSpacing: -0.6,
   },
   subtitle: {
      marginTop: 4,
      fontSize: 15,
      color: '#757575',
      lineHeight: 21,
   },
   listContent: {
      paddingHorizontal: 16,
      paddingTop: 6,
      paddingBottom: 100,
   },
   emptyState: {
      paddingTop: 80,
      alignItems: 'center',
      gap: 10,
   },
   emptyTitle: {
      color: '#222222',
      fontSize: 20,
      fontWeight: '700',
   },
   emptySubtitle: {
      color: '#666666',
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 24,
   },
   ctaContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: '#EFEFEF',
      backgroundColor: '#FAFAF8',
      gap: 10,
   },
   errorText: {
      color: '#D14343',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
   },
   ctaBtn: {
      backgroundColor: '#1A1A2E',
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
   },
   ctaBtnDisabled: {
      backgroundColor: '#D0D0CC',
   },
   ctaText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.2,
   },
});
