import React, { useRef, useState } from 'react';
import {
   Animated,
   PanResponder,
   Pressable,
   StyleSheet,
   Text,
   View,
} from 'react-native';

import type { ScannedProductItem } from '../../types';

type Props = {
   item: ScannedProductItem;
   onIncrementQuantity: (barcode: string) => void;
   onDecrementQuantity: (barcode: string) => void;
   onRemoveItem: (barcode: string) => void;
};

const SWIPE_INCREMENT_THRESHOLD = 28;
const SWIPE_DECREMENT_THRESHOLD = -28;
const SWIPE_DELETE_THRESHOLD = -110;

const ACTION_PANEL_WIDTH = 124;
const DECREMENT_OFFSET = -56;
const DELETE_OFFSET = -92;
const INCREMENT_OFFSET = 56;
const ACTION_FLASH_DURATION_MS = 120;

function clamp(value: number, min: number, max: number): number {
   return Math.max(min, Math.min(max, value));
}

type RightActionPanelProps = {
   deleteMode: boolean;
   quantity: number;
   onRemove: () => void;
};

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

function RightActionPanel({
   deleteMode,
   quantity,
   onRemove,
}: RightActionPanelProps): React.JSX.Element {
   if (deleteMode) {
      return (
         <Pressable style={styles.deletePanel} onPress={onRemove}>
            <TrashIcon />
         </Pressable>
      );
   }

   return (
      <View style={styles.rightHint}>
         {quantity > 1 ? <Text style={styles.actionText}>-</Text> : null}
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
      [item.brand, item.category].filter(Boolean).join(' \u2022 ') || item.barcode;

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

   const flashAction = (toValue: number, onCommit: () => void) => {
      animateTo(toValue, () => {
         onCommit();

         setTimeout(() => {
            animateTo(0);
         }, ACTION_FLASH_DURATION_MS);
      });
   };

   const handleIncrement = () => {
      flashAction(INCREMENT_OFFSET, () => {
         onIncrementQuantity(item.barcode);
      });
   };

   const handleDecrement = () => {
      flashAction(DECREMENT_OFFSET, () => {
         onDecrementQuantity(item.barcode);
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

         translateX.setValue(clamp(gestureState.dx, -170, 80));
      },
      onPanResponderRelease: (_, gestureState) => {
         if (deleteMode) {
            return;
         }

         if (gestureState.dx >= SWIPE_INCREMENT_THRESHOLD) {
            handleIncrement();
            return;
         }

         if (gestureState.dx <= SWIPE_DELETE_THRESHOLD) {
            activateDeleteMode();
            return;
         }

         if (
            gestureState.dx <= SWIPE_DECREMENT_THRESHOLD &&
            item.quantity > 1
         ) {
            handleDecrement();
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
            <View style={styles.leftHint}>
               <Text style={styles.actionText}>+</Text>
            </View>

            <RightActionPanel
               deleteMode={deleteMode}
               quantity={item.quantity}
               onRemove={() => onRemoveItem(item.barcode)}
            />
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

               <View style={styles.trailingInfo}>
                  <Text style={styles.quantityBadge}>x{item.quantity}</Text>
               </View>
            </Pressable>
         </Animated.View>
      </View>
   );
}

const styles = StyleSheet.create({
   wrapper: {
      width: '100%',
      marginBottom: 18,
      position: 'relative',
      borderRadius: 22,
      overflow: 'hidden',
   },
   backgroundLayer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: 22,
      overflow: 'hidden',
   },
   leftHint: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: ACTION_PANEL_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#c9ebc7',
   },
   rightHint: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: ACTION_PANEL_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fdeabf',
   },
   deletePanel: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: ACTION_PANEL_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#b95a5d',
   },
   actionText: {
      color: '#1f1f24',
      fontSize: 22,
      fontWeight: '800',
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
      backgroundColor: '#fff',
      borderRadius: 22,
      zIndex: 1,
   },
   rowDeleteMode: {
      backgroundColor: '#fff7f7',
   },
   rowContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      paddingHorizontal: 18,
      paddingVertical: 18,
   },
   infoColumn: {
      flex: 1,
      gap: 6,
      minWidth: 0,
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
   trailingInfo: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginLeft: 8,
   },
   quantityBadge: {
      color: '#2a2a34',
      fontSize: 15,
      fontWeight: '700',
   },
});
