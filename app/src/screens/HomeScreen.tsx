import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PantryShelfSection } from '../components/molecules';
import { PANTRY_STOCK_META, PANTRY_STOCK_ORDER, getPantryStockBand } from '../constants';
import { useScanContext } from '../context/ScanContext';
import { Routes, type RootStackNavigationProp } from '../navigation/types';
import { confirmPantryStockEdits, deletePantryItem, fetchPantryItems } from '../services';
import type { PantryItem } from '../types';

type EditAction = 'used' | 'finished' | 'adjust';

type DisplayPantryItem = PantryItem & {
  pendingUsedCount: number;
  originalQuantity: number;
};

type ActionHistoryEntry =
  | {
    kind: 'used';
    productTypeCode: string;
  }
  | {
    kind: 'finished';
    productTypeCode: string;
    previousUsedCount: number;
  };

const EDIT_ACTIONS: Array<{ key: EditAction; label: string }> = [
  { key: 'used', label: 'Use' },
  { key: 'finished', label: 'Se termino' },
  { key: 'adjust', label: 'Ajustar' },
];

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { resetScan } = useScanContext();

  const [items, setItems] = useState<PantryItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeEditAction, setActiveEditAction] = useState<EditAction>('used');
  const [pendingUsedByTypeCode, setPendingUsedByTypeCode] = useState<Record<string, number>>({});
  const [pendingFinishedByTypeCode, setPendingFinishedByTypeCode] = useState<Record<string, true>>({});
  const [actionHistory, setActionHistory] = useState<ActionHistoryEntry[]>([]);

  const handleEnterEditMode = () => {
    setActiveEditAction('used');
    setPendingUsedByTypeCode({});
    setPendingFinishedByTypeCode({});
    setActionHistory([]);
    setIsEditing(true);
  };

  const handleCancelEditMode = () => {
    setActiveEditAction('used');
    setPendingUsedByTypeCode({});
    setPendingFinishedByTypeCode({});
    setActionHistory([]);
    setIsEditing(false);
  };

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadPantry() {
        setIsLoading(true);
        setLoadError(null);
        try {
          const pantryItems = await fetchPantryItems();
          if (isMounted) setItems(pantryItems);
        } catch {
          if (isMounted) setLoadError('No pudimos cargar tu despensa.');
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }

      loadPantry();
      return () => {
        isMounted = false;
      };
    }, []),
  );

  const handleDeleteItem = async (productCode: string) => {
    setItems(prev => prev.filter(i => i.productCode !== productCode));
    try {
      await deletePantryItem(productCode);
    } catch {
      const pantryItems = await fetchPantryItems().catch(() => null);
      if (pantryItems) setItems(pantryItems);
    }
  };

  const handleStartScanning = () => {
    resetScan();
    navigation.navigate(Routes.Scanner);
  };

  const handlePantryItemPress = (item: PantryItem) => {
    if (!isEditing) return;

    const productTypeCode = item.productTypeCode;
    if (!productTypeCode) return;
    if (item.quantity <= 0) return;

    if (activeEditAction === 'used') {
      setPendingUsedByTypeCode(prev => ({
        ...prev,
        [productTypeCode]: (prev[productTypeCode] ?? 0) + 1,
      }));

      setActionHistory(prev => [
        ...prev,
        { kind: 'used', productTypeCode },
      ]);

      return;
    }

    if (activeEditAction === 'finished') {
      const previousUsedCount = pendingUsedByTypeCode[productTypeCode] ?? 0;

      setPendingFinishedByTypeCode(prev => ({
        ...prev,
        [productTypeCode]: true,
      }));

      setPendingUsedByTypeCode(prev => {
        if (!(productTypeCode in prev)) return prev;

        const rest = { ...prev };
        delete rest[productTypeCode];
        return rest;
      });

      setActionHistory(prev => [
        ...prev,
        { kind: 'finished', productTypeCode, previousUsedCount },
      ]);
    }
  };

  const handleUndoLastAction = () => {
    const lastAction = actionHistory[actionHistory.length - 1];
    if (!lastAction) return;

    if (lastAction.kind === 'used') {
      setPendingUsedByTypeCode(prev => {
        const current = prev[lastAction.productTypeCode] ?? 0;

        if (current <= 1) {
          const rest = { ...prev };
          delete rest[lastAction.productTypeCode];
          return rest;
        }

        return {
          ...prev,
          [lastAction.productTypeCode]: current - 1,
        };
      });
    }

    if (lastAction.kind === 'finished') {
      setPendingFinishedByTypeCode(prev => {
        const rest = { ...prev };
        delete rest[lastAction.productTypeCode];
        return rest;
      });

      setPendingUsedByTypeCode(prev => {
        if (lastAction.previousUsedCount <= 0) return prev;

        return {
          ...prev,
          [lastAction.productTypeCode]: lastAction.previousUsedCount,
        };
      });
    }

    setActionHistory(prev => prev.slice(0, -1));
  };

  const handleConfirmEditMode = async () => {
    if (!hasPendingChanges) return;

    try {
      await confirmPantryStockEdits({
        items: pendingStockEditItems,
      });

      const pantryItems = await fetchPantryItems();

      setItems(pantryItems);
      setActiveEditAction('used');
      setPendingUsedByTypeCode({});
      setPendingFinishedByTypeCode({});
      setActionHistory([]);
      setIsEditing(false);
    } catch {
      const pantryItems = await fetchPantryItems().catch(() => null);
      if (pantryItems) setItems(pantryItems);
    }
  };

  const normalizedSearchText = searchText.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!normalizedSearchText) return items;
    return items.filter(item =>
      `${item.name} ${item.brand ?? ''}`.toLowerCase().includes(normalizedSearchText),
    );
  }, [items, normalizedSearchText]);

  const displayedItems = useMemo<DisplayPantryItem[]>(() => {
    return filteredItems.map(item => {
      const pendingUsedCount = item.productTypeCode
        ? (pendingUsedByTypeCode[item.productTypeCode] ?? 0)
        : 0;

      const isFinishedPending = item.productTypeCode
        ? Boolean(pendingFinishedByTypeCode[item.productTypeCode])
        : false;

      return {
        ...item,
        originalQuantity: item.quantity,
        quantity: isFinishedPending ? 0 : Math.max(item.quantity - pendingUsedCount, 0),
        pendingUsedCount,
      };
    });
  }, [filteredItems, pendingFinishedByTypeCode, pendingUsedByTypeCode]);

  const groupedItems = useMemo(() => {
    const groups = {
      empty: [] as DisplayPantryItem[],
      low: [] as DisplayPantryItem[],
      medium: [] as DisplayPantryItem[],
      full: [] as DisplayPantryItem[],
    };

    for (const item of displayedItems) {
      groups[getPantryStockBand(item.originalQuantity)].push(item);
    }

    return groups;
  }, [displayedItems]);

  const hasPendingChanges = useMemo(() => {
    return (
      Object.keys(pendingUsedByTypeCode).length > 0 ||
      Object.keys(pendingFinishedByTypeCode).length > 0
    );
  }, [pendingFinishedByTypeCode, pendingUsedByTypeCode]);

  const pendingStockEditItems = useMemo(() => {
    const usedItems = Object.entries(pendingUsedByTypeCode).map(
      ([productTypeCode, usedCount]) => ({
        product_type_code: productTypeCode,
        used_count: usedCount,
      }),
    );

    const finishedItems = Object.keys(pendingFinishedByTypeCode).map(
      productTypeCode => ({
        product_type_code: productTypeCode,
        finished: true,
      }),
    );

    return [...usedItems, ...finishedItems];
  }, [pendingFinishedByTypeCode, pendingUsedByTypeCode]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Text style={styles.title}>Mi despensa</Text>

          <Pressable
            onPress={() => navigation.navigate(Routes.Analysis)}
            hitSlop={10}
            disabled={isEditing}
          >
            <Text style={[styles.habitsLink, isEditing ? styles.habitsLinkDisabled : null]}>
              Mis habitos
            </Text>
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar producto..."
            placeholderTextColor="#B0A898"
            style={styles.searchInput}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#C8392B" />
            <Text style={styles.stateText}>Cargando despensa...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.loadingState}>
            <Text style={styles.stateError}>{loadError}</Text>
          </View>
        ) : (
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
                  onDeleteItem={handleDeleteItem}
                  isEditing={isEditing}
                  onItemPress={handlePantryItemPress}
                  getPendingLabel={item =>
                    item.productTypeCode && pendingFinishedByTypeCode[item.productTypeCode]
                      ? '0'
                      : item.productTypeCode && pendingUsedByTypeCode[item.productTypeCode]
                        ? `-${pendingUsedByTypeCode[item.productTypeCode]}`
                        : null
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
        )}

        <View style={styles.bottomBar}>
          {isEditing ? (
            <>
              <View style={styles.editActionRow}>
                {EDIT_ACTIONS.map(action => {
                  const isActive = action.key === activeEditAction;
                  return (
                    <Pressable
                      key={action.key}
                      style={[
                        styles.editActionChip,
                        isActive ? styles.editActionChipActive : null,
                      ]}
                      onPress={() => setActiveEditAction(action.key)}
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
                      !hasPendingChanges ? styles.undoFooterButtonDisabled : null,
                    ]}
                    onPress={handleUndoLastAction}
                    disabled={!hasPendingChanges}
                  >
                    <Text
                      style={[
                        styles.undoFooterButtonText,
                        !hasPendingChanges ? styles.undoFooterButtonTextDisabled : null,
                      ]}
                    >
                      ↩
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.secondaryFooterButton}
                    onPress={handleCancelEditMode}
                  >
                    <Text style={styles.secondaryFooterButtonText}>Cancelar</Text>
                  </Pressable>

                  <Pressable
                    style={
                      hasPendingChanges
                        ? styles.primaryFooterButton
                        : styles.primaryFooterButtonDisabled
                    }
                    onPress={handleConfirmEditMode}
                    disabled={!hasPendingChanges}
                  >
                    <Text
                      style={
                        hasPendingChanges
                          ? styles.primaryFooterButtonText
                          : styles.primaryFooterButtonTextDisabled
                      }
                    >
                      Confirmar
                    </Text>
                  </Pressable>

                </View>
              </View>
            </>
          ) : (
            <View style={styles.restingActionsRow}>
              <Pressable style={styles.jarModeButton} onPress={handleEnterEditMode}>
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

              <Pressable style={styles.scanButton} onPress={handleStartScanning}>
                <View style={styles.barcodeIcon}>
                  <View style={[styles.barcodeBar, styles.barcodeThin, styles.barcodeGapNarrow]} />
                  <View style={[styles.barcodeBar, styles.barcodeWide, styles.barcodeGapNarrow]} />
                  <View style={[styles.barcodeBar, styles.barcodeThin, styles.barcodeGapWide]} />
                  <View style={[styles.barcodeBar, styles.barcodeMedium, styles.barcodeGapNarrow]} />
                  <View style={[styles.barcodeBar, styles.barcodeThin, styles.barcodeGapNarrow]} />
                  <View style={[styles.barcodeBar, styles.barcodeWide, styles.barcodeGapWide]} />
                  <View style={[styles.barcodeBar, styles.barcodeThin, styles.barcodeGapNarrow]} />
                  <View style={[styles.barcodeBar, styles.barcodeThin, styles.barcodeGapNarrow]} />
                  <View style={[styles.barcodeBar, styles.barcodeMedium, styles.barcodeGapWide]} />
                  <View style={[styles.barcodeBar, styles.barcodeWide, styles.barcodeGapNarrow]} />
                  <View style={[styles.barcodeBar, styles.barcodeThin, styles.barcodeGapNarrow]} />
                  <View style={[styles.barcodeBar, styles.barcodeMedium]} />
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EDE6',
  },
  shell: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: '#FDFAF7',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E8E0D6',
    overflow: 'hidden',
    shadowColor: '#2A1A0E',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE6DC',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A0E08',
    letterSpacing: -0.5,
  },
  habitsLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C8392B',
  },
  habitsLinkDisabled: {
    color: '#C9B8AA',
  },

  searchWrap: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE6DC',
  },
  searchInput: {
    height: 44,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDD5C8',
    paddingHorizontal: 18,
    color: '#1A0E08',
    fontSize: 16,
  },

  scroll: { flex: 1 },
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
  bottomSpacer: { height: 16 },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EDE6DC',
    backgroundColor: '#FCF7F1',
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
    shadowOffset: { width: 0, height: 4 },
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
  barcodeBar: { height: 18, backgroundColor: '#FFFFFF', borderRadius: 1 },
  barcodeThin: { width: 2 },
  barcodeMedium: { width: 3 },
  barcodeWide: { width: 4 },
  barcodeGapNarrow: { marginRight: 1 },
  barcodeGapWide: { marginRight: 3 },
});
