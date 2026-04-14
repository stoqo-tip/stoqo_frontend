import React, { useRef, useState } from 'react';
import {
   Animated,
   PanResponder,
   Pressable,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';

import type { ScannedProductItem } from '../../types';

type Props = {
   item: ScannedProductItem;
   onIncrementQuantity: (barcode: string) => void;
   onDecrementQuantity: (barcode: string) => void;
   onRemoveItem: (barcode: string) => void;
};

const SWIPE_DELETE_THRESHOLD = -110;
const DELETE_OFFSET = -92;
const ACTION_PANEL_WIDTH = 124;

function clamp(value: number, min: number, max: number): number {
   return Math.max(min, Math.min(max, value));
}

function TrashIcon(): React.JSX.Element {
   return (
      <View style={styles.trashIcon}>
         <View style={styles.trashHandle} />
         <View style={styles.trashLid} />
         <View style={styles.trashBody}>
            <View style={styles.trashLine} />
            <View style={styles.trashLine} />
            <View style={styles.trashLine} />
         </View>
      </View>
   );
}

type QuantityStepperProps = {
   quantity: number;
   onIncrement: () => void;
   onDecrement: () => void;
};

function QuantityStepper({
   quantity,
   onIncrement,
   onDecrement,
}: QuantityStepperProps): React.JSX.Element {
   const canDecrement = quantity > 1;

   return (
      <View style={styles.stepper}>
         <TouchableOpacity
            onPress={onDecrement}
            disabled={!canDecrement}
            style={[styles.stepperButton, !canDecrement && styles.stepperButtonOff]}
            activeOpacity={0.75}
         >
            <Text
               style={[
                  styles.stepperGlyph,
                  !canDecrement && styles.stepperGlyphOff,
               ]}
            >
               -
            </Text>
         </TouchableOpacity>

         <View style={styles.quantityWrap}>
            <Text style={styles.quantityValue}>x{quantity}</Text>
            <Text style={styles.quantityHint}>cantidad</Text>
         </View>

         <TouchableOpacity
            onPress={onIncrement}
            style={styles.stepperButton}
            activeOpacity={0.75}
         >
            <Text style={styles.stepperGlyph}>+</Text>
         </TouchableOpacity>
      </View>
   );
}

export function ScannedProductReviewRow({
   item,
   onIncrementQuantity,
   onDecrementQuantity,
   onRemoveItem,
}: Props): React.JSX.Element {
   const translateX = useRef(new Animated.Value(0)).current;
   const [deleteMode, setDeleteMode] = useState(false);

   const secondaryText =
      [item.brand, item.category].filter(Boolean).join(' • ') || item.barcode;

   const animateTo = (toValue: number, callback?: () => void) => {
      Animated.spring(translateX, {
         toValue,
         useNativeDriver: true,
         bounciness: 5,
         speed: 24,
      }).start(() => {
         if (callback) {
            callback();
         }
      });
   };

   const activateDeleteMode = () => {
      setDeleteMode(true);
      animateTo(DELETE_OFFSET);
   };

   const closeDeleteMode = () => {
      setDeleteMode(false);
      animateTo(0);
   };

   const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
         return (
            Math.abs(gestureState.dx) > 6 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
         );
      },
      onPanResponderMove: (_, gestureState) => {
         if (deleteMode) {
            return;
         }

         translateX.setValue(clamp(gestureState.dx, -170, 0));
      },
      onPanResponderRelease: (_, gestureState) => {
         if (deleteMode) {
            return;
         }

         if (gestureState.dx <= SWIPE_DELETE_THRESHOLD) {
            activateDeleteMode();
            return;
         }

         animateTo(0);
      },
      onPanResponderTerminate: () => {
         if (!deleteMode) {
            animateTo(0);
         }
      },
   });

   return (
      <View style={styles.wrapper}>
         <View style={styles.backgroundLayer}>
            <Pressable
               style={styles.deletePanel}
               onPress={() => onRemoveItem(item.barcode)}
            >
               <TrashIcon />
            </Pressable>
         </View>

         <Animated.View
            style={[
               styles.row,
               deleteMode && styles.rowDeleteMode,
               { transform: [{ translateX }] },
            ]}
            {...panResponder.panHandlers}
         >
            <Pressable
               style={styles.rowContent}
               onPress={() => {
                  if (deleteMode) {
                     closeDeleteMode();
                  }
               }}
            >
               <View style={styles.infoColumn}>
                  <Text style={styles.itemName} numberOfLines={2}>
                     {item.name}
                  </Text>
                  <Text style={styles.itemMeta} numberOfLines={2}>
                     {secondaryText}
                  </Text>
               </View>

               <QuantityStepper
                  quantity={item.quantity}
                  onIncrement={() => onIncrementQuantity(item.barcode)}
                  onDecrement={() => onDecrementQuantity(item.barcode)}
               />
            </Pressable>
         </Animated.View>
      </View>
   );
}

const styles = StyleSheet.create({
   wrapper: {
      width: '100%',
      marginBottom: 16,
      position: 'relative',
      borderRadius: 24,
      overflow: 'hidden',
   },
   backgroundLayer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: 24,
      overflow: 'hidden',
   },
   deletePanel: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: ACTION_PANEL_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#c35f63',
   },
   trashIcon: {
      width: 38,
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-start',
   },
   trashHandle: {
      width: 12,
      height: 4,
      borderWidth: 2,
      borderBottomWidth: 0,
      borderColor: '#fff',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      marginBottom: 2,
   },
   trashLid: {
      width: 26,
      height: 5,
      borderWidth: 2,
      borderColor: '#fff',
      borderRadius: 4,
      marginBottom: 2,
   },
   trashBody: {
      width: 24,
      height: 22,
      borderWidth: 2,
      borderColor: '#fff',
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingHorizontal: 3,
   },
   trashLine: {
      width: 2,
      height: 11,
      borderRadius: 1,
      backgroundColor: '#fff',
   },
   row: {
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      zIndex: 1,
      borderWidth: 1,
      borderColor: '#EFEDE7',
   },
   rowDeleteMode: {
      backgroundColor: '#fff7f7',
   },
   rowContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      paddingHorizontal: 18,
      paddingVertical: 18,
   },
   infoColumn: {
      flex: 1,
      minWidth: 0,
      gap: 6,
   },
   itemName: {
      color: '#1A1A2E',
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: -0.3,
   },
   itemMeta: {
      color: '#8D8D8D',
      fontSize: 14,
      lineHeight: 20,
   },
   stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
   },
   stepperButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#1A1A2E',
      alignItems: 'center',
      justifyContent: 'center',
   },
   stepperButtonOff: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: '#E0E0E0',
   },
   stepperGlyph: {
      fontSize: 22,
      lineHeight: 24,
      color: '#FFFFFF',
      fontWeight: '400',
   },
   stepperGlyphOff: {
      color: '#D0D0D0',
   },
   quantityWrap: {
      alignItems: 'center',
      minWidth: 46,
   },
   quantityValue: {
      color: '#1A1A2E',
      fontSize: 16,
      fontWeight: '700',
   },
   quantityHint: {
      marginTop: 2,
      color: '#B3B3B3',
      fontSize: 10,
      fontWeight: '500',
   },
});
