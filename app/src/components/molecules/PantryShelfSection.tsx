import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PantryStockJar } from '../atoms';
import type { PantryItem } from '../../types';

type Props = {
   title: string;
   chipBackground: string;
   items: PantryItem[];
};

export function PantryShelfSection({
   title,
   chipBackground,
   items,
}: Props): React.JSX.Element {
   const showSwipeHint = items.length > 1;

   return (
      <View style={styles.section}>
         <View style={styles.sectionHeader}>
            <View style={[styles.chip, { backgroundColor: chipBackground }]}>
               <Text style={styles.chipText}>{title} ›</Text>
            </View>
         </View>

         <View style={styles.shelfCard}>
            <ScrollView
               horizontal
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={[
                  styles.shelfContent,
                  showSwipeHint ? styles.shelfContentWithHint : null,
               ]}
            >
               {items.map(item => (
                  <View key={item.productCode} style={styles.productCard}>
                     <View style={styles.jarShadow} />
                     <PantryStockJar quantity={item.quantity} />
                     <Text numberOfLines={1} style={styles.productName}>
                        {item.name}
                     </Text>
                  </View>
               ))}
            </ScrollView>
            {showSwipeHint ? (
               <View pointerEvents="none" style={styles.swipeHintFade}>
                  <View style={styles.fadeSoft} />
                  <View style={styles.fadeMedium} />
                  <View style={styles.fadeStrong} />
                  <View style={styles.chevronWrap}>
                     <Text style={styles.swipeHintArrow}>›</Text>
                  </View>
               </View>
            ) : null}

         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   section: {
      marginBottom: 10,
   },
   sectionHeader: {
      marginBottom: 6,
   },
   chip: {
      alignSelf: 'flex-start',
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 6,
   },
   chipText: {
      color: '#4A4A4A',
      fontSize: 13,
      fontWeight: '700',
   },
   shelfCard: {
      position: 'relative',
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#EDEBE6',
      paddingVertical: 8,
      shadowColor: '#000000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
   },
   shelfContent: {
      paddingHorizontal: 12,
      gap: 10,
   },
   shelfContentWithHint: {
      paddingRight: 42,
   },
   productCard: {
      width: 74,
      alignItems: 'center',
   },
   jarShadow: {
      position: 'absolute',
      bottom: 20,
      width: 46,
      height: 10,
      borderRadius: 999,
      backgroundColor: 'rgba(0, 0, 0, 0.07)',
   },
   productName: {
      marginTop: 6,
      color: '#38455E',
      fontSize: 11,
      lineHeight: 13,
      fontWeight: '600',
      textAlign: 'center',
   },
   swipeHintFade: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: 52,
      justifyContent: 'center',
      alignItems: 'flex-end',
   },
   fadeSoft: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 24,
      width: 24,
      backgroundColor: 'rgba(251, 250, 247, 0.18)',
   },
   fadeMedium: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 10,
      width: 22,
      backgroundColor: 'rgba(251, 250, 247, 0.48)',
   },
   fadeStrong: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: 22,
      backgroundColor: 'rgba(251, 250, 247, 0.88)',
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
   },
   chevronWrap: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      borderWidth: 1,
      borderColor: '#E5E0D8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 6,
      shadowColor: '#000000',
      shadowOpacity: 0.05,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
   },
   swipeHintArrow: {
      color: '#7A879D',
      fontSize: 16,
      fontWeight: '700',
      lineHeight: 18,
      marginTop: -1,
   },

});
