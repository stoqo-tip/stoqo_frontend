import React from 'react';
import {ActivityIndicator,Pressable,StyleSheet,Text,View,} from 'react-native';

type PantryHomeBottomBarAction = 'used' | 'finished' | 'adjust';

type ActionOption = {
   key: PantryHomeBottomBarAction;
   label: string;
};

type Props = {
   isEditing: boolean;
   isPersistingEdits: boolean;
   actions: ActionOption[];
   activeAction: PantryHomeBottomBarAction;
   hasPendingChanges: boolean;
   onActionChange: (action: PantryHomeBottomBarAction) => void;
   onUndo: () => void;
   onCancelEdit: () => void;
   onConfirmEdit: () => void;
   onEnterEdit: () => void;
   onScan: () => void;
};

export function PantryHomeBottomBar({isEditing,isPersistingEdits,actions,activeAction,hasPendingChanges,onActionChange,onUndo,onCancelEdit,onConfirmEdit,onEnterEdit,onScan,}: Props): React.JSX.Element {
   return (
      <View style={[styles.bottomBar,isPersistingEdits ? styles.bottomBarBusy : null]}>
         {isEditing ? (
            <>
               <View style={styles.editActionRow}>
                  {actions.map(action => {
                     const isActive = action.key === activeAction;

                     return (
                        <Pressable
                           key={action.key}
                           style={[
                              styles.editActionChip,
                              isActive ? styles.editActionChipActive : null,
                           ]}
                           onPress={() => onActionChange(action.key)}
                        >
                           <Text
                              style={[
                                 styles.editActionChipText,
                                 isActive ? styles.editActionChipTextActive : null,
                              ]}
                           >
                              {action.label}
                           </Text>
                        </Pressable>
                     );
                  })}
               </View>

               <View style={styles.editFooterRow}>
                  <View style={styles.editSummaryBlock}>
                     <Text style={styles.editSummaryTitle}>Modo stock</Text>
                     <Text style={styles.editSummaryText}>
                        {hasPendingChanges
                           ? 'Cambios pendientes sin confirmar'
                           : 'Sin cambios pendientes todavia'}
                     </Text>
                  </View>

                  <View style={styles.editFooterActions}>
                     <Pressable
                        style={[
                           styles.undoFooterButton,
                           !hasPendingChanges || isPersistingEdits
                              ? styles.undoFooterButtonDisabled
                              : null,
                        ]}
                        onPress={onUndo}
                        disabled={!hasPendingChanges || isPersistingEdits}
                     >
                        <Text
                           style={[
                              styles.undoFooterButtonText,
                              !hasPendingChanges ? styles.undoFooterButtonTextDisabled : null,
                           ]}
                        >
                           {'\u21A9'}
                        </Text>
                     </Pressable>

                     <Pressable
                        style={[
                           styles.secondaryFooterButton,
                           isPersistingEdits ? styles.secondaryFooterButtonDisabled : null,
                        ]}
                        onPress={onCancelEdit}
                        disabled={isPersistingEdits}
                     >
                        <Text style={styles.secondaryFooterButtonText}>Cancelar</Text>
                     </Pressable>

                     <Pressable
                        style={
                           hasPendingChanges && !isPersistingEdits
                              ? styles.primaryFooterButton
                              : styles.primaryFooterButtonDisabled
                        }
                        onPress={onConfirmEdit}
                        disabled={!hasPendingChanges || isPersistingEdits}
                     >
                        {isPersistingEdits ? (
                           <View style={styles.confirmLoadingContent}>
                              <ActivityIndicator size="small" color="#A49889" />
                              <Text style={styles.primaryFooterButtonTextDisabled}>Guardando...</Text>
                           </View>
                        ) : (
                           <Text
                              style={
                                 hasPendingChanges
                                    ? styles.primaryFooterButtonText
                                    : styles.primaryFooterButtonTextDisabled
                              }
                           >
                              Confirmar
                           </Text>
                        )}
                     </Pressable>
                  </View>
               </View>
            </>
         ) : (
            <View style={styles.restingActionsRow}>
               <Pressable style={styles.jarModeButton} onPress={onEnterEdit}>
                  <View style={styles.jarModeIcon}>
                     <View style={styles.jarModeLid} />
                     <View style={styles.jarModeBody}>
                        <View style={styles.jarModeMarks}>
                           <View style={styles.jarModePlus}>
                              <View style={styles.jarModePlusHorizontal} />
                              <View style={styles.jarModePlusVertical} />
                           </View>
                           <View style={styles.jarModeMinus} />
                        </View>
                     </View>
                  </View>
               </Pressable>

               <Pressable style={styles.scanButton} onPress={onScan}>
                  <View style={styles.barcodeIcon}>
                     <View style={[styles.barcodeBar,styles.barcodeThin,styles.barcodeGapNarrow]} />
                     <View style={[styles.barcodeBar,styles.barcodeWide,styles.barcodeGapNarrow]} />
                     <View style={[styles.barcodeBar,styles.barcodeThin,styles.barcodeGapWide]} />
                     <View style={[styles.barcodeBar,styles.barcodeMedium,styles.barcodeGapNarrow]} />
                     <View style={[styles.barcodeBar,styles.barcodeThin,styles.barcodeGapNarrow]} />
                     <View style={[styles.barcodeBar,styles.barcodeWide,styles.barcodeGapWide]} />
                     <View style={[styles.barcodeBar,styles.barcodeThin,styles.barcodeGapNarrow]} />
                     <View style={[styles.barcodeBar,styles.barcodeThin,styles.barcodeGapNarrow]} />
                     <View style={[styles.barcodeBar,styles.barcodeMedium,styles.barcodeGapWide]} />
                     <View style={[styles.barcodeBar,styles.barcodeWide,styles.barcodeGapNarrow]} />
                     <View style={[styles.barcodeBar,styles.barcodeThin,styles.barcodeGapNarrow]} />
                     <View style={[styles.barcodeBar,styles.barcodeMedium]} />
                  </View>
               </Pressable>
            </View>
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   bottomBar: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderTopWidth: 1,
      borderTopColor: '#EDE6DC',
      backgroundColor: '#FCF7F1',
   },
   bottomBarBusy: {
      opacity: 0.96,
   },
   restingActionsRow: {
      width: '100%',
      minHeight: 58,
      alignItems: 'center',
      justifyContent: 'center',
   },
   editActionRow: {
      width: '100%',
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
   },
   editActionChip: {
      flex: 1,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: '#DDD5C8',
      backgroundColor: '#FFFFFF',
      paddingVertical: 10,
      alignItems: 'center',
   },
   editActionChipActive: {
      backgroundColor: '#C8392B',
      borderColor: '#C8392B',
   },
   editActionChipText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#6A5A4A',
   },
   editActionChipTextActive: {
      color: '#FFFFFF',
   },
   editFooterRow: {
      width: '100%',
      gap: 12,
   },
   editSummaryBlock: {
      width: '100%',
   },
   editSummaryTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: '#40352D',
      marginBottom: 2,
   },
   editSummaryText: {
      fontSize: 13,
      color: '#8A7A6A',
   },
   editFooterActions: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
   },
   undoFooterButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 1,
      borderColor: '#DDD5C8',
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
   },
   undoFooterButtonDisabled: {
      backgroundColor: '#F1ECE5',
      borderColor: '#E4DDD4',
   },
   undoFooterButtonText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#4EA1F3',
      marginTop: -1,
   },
   undoFooterButtonTextDisabled: {
      color: '#B7AA9B',
   },
   secondaryFooterButton: {
      minWidth: 96,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: '#DDD5C8',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 14,
      paddingVertical: 10,
      alignItems: 'center',
   },
   secondaryFooterButtonDisabled: {
      backgroundColor: '#F3EEE7',
      borderColor: '#E4DDD4',
   },
   secondaryFooterButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#6A5A4A',
   },
   primaryFooterButtonDisabled: {
      minWidth: 104,
      borderRadius: 999,
      backgroundColor: '#E9E1D7',
      paddingHorizontal: 14,
      paddingVertical: 10,
      alignItems: 'center',
   },
   primaryFooterButtonTextDisabled: {
      fontSize: 13,
      fontWeight: '700',
      color: '#A49889',
   },
   jarModeButton: {
      position: 'absolute',
      left: 0,
      width: 52,
      height: 52,
      borderRadius: 18,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
   },
   jarModeIcon: {
      width: 28,
      height: 34,
      alignItems: 'center',
   },
   jarModeLid: {
      width: 18,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#C8392B',
      marginBottom: 2,
   },
   jarModeBody: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: '#C8392B',
      alignItems: 'center',
      justifyContent: 'center',
   },
   jarModeMarks: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
   },
   jarModePlus: {
      width: 10,
      height: 10,
      alignItems: 'center',
      justifyContent: 'center',
   },
   jarModePlusHorizontal: {
      position: 'absolute',
      width: 10,
      height: 2,
      borderRadius: 1,
      backgroundColor: '#FFF8F1',
   },
   jarModePlusVertical: {
      position: 'absolute',
      width: 2,
      height: 10,
      borderRadius: 1,
      backgroundColor: '#FFF8F1',
   },
   jarModeMinus: {
      width: 10,
      height: 2,
      borderRadius: 1,
      backgroundColor: '#FFF8F1',
   },
   scanButton: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: '#C8392B',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#C8392B',
      shadowOpacity: 0.35,
      shadowRadius: 10,
      shadowOffset: {width: 0,height: 4},
      elevation: 6,
   },
   barcodeIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 22,
   },
   primaryFooterButton: {
      minWidth: 104,
      borderRadius: 999,
      backgroundColor: '#C8392B',
      paddingHorizontal: 14,
      paddingVertical: 10,
      alignItems: 'center',
   },
   primaryFooterButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
   },
   confirmLoadingContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   barcodeBar: {
      height: 18,
      backgroundColor: '#FFFFFF',
      borderRadius: 1,
   },
   barcodeThin: {
      width: 2,
   },
   barcodeMedium: {
      width: 3,
   },
   barcodeWide: {
      width: 4,
   },
   barcodeGapNarrow: {
      marginRight: 1,
   },
   barcodeGapWide: {
      marginRight: 3,
   },
});
