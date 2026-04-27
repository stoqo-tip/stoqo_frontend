import React from 'react';
import {ActivityIndicator,ScrollView,StyleSheet,Text,View,} from 'react-native';

import {PANTRY_STOCK_META,PANTRY_STOCK_ORDER,} from '../../constants';
import {getPendingPantryStockLabel,type PantryStockGroups,} from '../../features/pantry/model';
import type {PantryItem} from '../../types';
import {PantryShelfSection,} from '../molecules';

type Props = {
   items: PantryItem[];
   filteredItems: PantryItem[];
   groupedItems: PantryStockGroups;
   isLoading: boolean;
   loadError: string | null;
   isEditing: boolean;
   pendingUsedByTypeCode: Record<string, number>;
   pendingFinishedByTypeCode: Record<string, true>;
   onDeleteItem: (productCode: string) => void;
   onItemPress: (item: PantryItem) => void;
};

export function PantryInventoryList({items,filteredItems,groupedItems,isLoading,loadError,isEditing,pendingUsedByTypeCode,pendingFinishedByTypeCode,onDeleteItem,onItemPress,}: Props): React.JSX.Element {
   if (isLoading) {
      return (
         <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#C8392B" />
            <Text style={styles.stateText}>Cargando despensa...</Text>
         </View>
      );
   }

   if (loadError) {
      return (
         <View style={styles.loadingState}>
            <Text style={styles.stateError}>{loadError}</Text>
         </View>
      );
   }

   return (
      <ScrollView
         style={styles.scroll}
         contentContainerStyle={styles.scrollContent}
         showsVerticalScrollIndicator={false}
      >
         {PANTRY_STOCK_ORDER.map(stockBand => {
            const sectionItems = groupedItems[stockBand];
            if (sectionItems.length === 0) return null;

            const meta = PANTRY_STOCK_META[stockBand];

            return (
               <PantryShelfSection
                  key={stockBand}
                  title={meta.label}
                  chipBackground={meta.chipBackground}
                  items={sectionItems}
                  onDeleteItem={onDeleteItem}
                  isEditing={isEditing}
                  onItemPress={onItemPress}
                  getPendingLabel={item =>
                     getPendingPantryStockLabel({
                        item,
                        pendingUsedByTypeCode,
                        pendingFinishedByTypeCode,
                     })
                  }
               />
            );
         })}

         {filteredItems.length === 0 && (
            <View style={styles.centerState}>
               <Text style={styles.stateText}>
                  {items.length === 0
                     ? 'Todavia no hay productos en tu despensa.'
                     : 'No encontramos productos para esa busqueda.'}
               </Text>
            </View>
         )}

         <View style={styles.bottomSpacer} />
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   scroll: {
      flex: 1,
   },
   scrollContent: {
      paddingHorizontal: 18,
      paddingTop: 12,
   },
   centerState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 48,
   },
   loadingState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 48,
   },
   stateText: {
      marginTop: 10,
      color: '#8A7A6A',
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
   },
   stateError: {
      color: '#C8392B',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
      lineHeight: 22,
   },
   bottomSpacer: {
      height: 16,
   },
});
