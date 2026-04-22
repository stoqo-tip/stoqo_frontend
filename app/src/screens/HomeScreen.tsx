import React, { useEffect, useMemo, useState } from 'react';
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
import {
  PANTRY_STOCK_META,
  PANTRY_STOCK_ORDER,
  getPantryStockBand,
} from '../constants';
import { deletePantryItem, fetchPantryItems } from '../services';
import type { PantryItem } from '../types';

type HomeScreenProps = {
  onStartScanning: () => void;
  onOpenAnalysis: () => void;
};

export function HomeScreen({
  onStartScanning,
  onOpenAnalysis,
}: HomeScreenProps): React.JSX.Element {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
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
    return () => { isMounted = false; };
  }, []);

  const handleDeleteItem = async (productCode: string) => {
    setItems(prev => prev.filter(i => i.productCode !== productCode));
    try {
      await deletePantryItem(productCode);
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

  const groupedItems = useMemo(() => {
    const groups = { empty: [] as PantryItem[], low: [] as PantryItem[], medium: [] as PantryItem[], full: [] as PantryItem[] };
    for (const item of filteredItems) groups[getPantryStockBand(item.quantity)].push(item);
    return groups;
  }, [filteredItems]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shell}>

        <View style={styles.header}>
          <Text style={styles.title}>Mi despensa</Text>
          <Pressable onPress={onOpenAnalysis} hitSlop={10}>
            <Text style={styles.habitsLink}>Mis hábitos →</Text>
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
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#C8392B" />
            <Text style={styles.stateText}>Cargando despensa...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.centerState}>
            <Text style={styles.stateError}>{loadError}</Text>
          </View>
        ) : (
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                />
              );
            })}
            {filteredItems.length === 0 && (
              <View style={styles.centerState}>
                <Text style={styles.stateText}>
                  {items.length === 0
                    ? 'Todavía no hay productos en tu despensa.'
                    : 'No encontramos productos para esa búsqueda.'}
                </Text>
              </View>
            )}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}

        <View style={styles.bottomBar}>
          <Pressable style={styles.scanButton} onPress={onStartScanning}>
            <View style={styles.barcodeIcon}>
              <View style={[styles.barcodeBar, styles.barcodeThin,   styles.barcodeGapNarrow]} />
              <View style={[styles.barcodeBar, styles.barcodeWide,   styles.barcodeGapNarrow]} />
              <View style={[styles.barcodeBar, styles.barcodeThin,   styles.barcodeGapWide]}   />
              <View style={[styles.barcodeBar, styles.barcodeMedium, styles.barcodeGapNarrow]} />
              <View style={[styles.barcodeBar, styles.barcodeThin,   styles.barcodeGapNarrow]} />
              <View style={[styles.barcodeBar, styles.barcodeWide,   styles.barcodeGapWide]}   />
              <View style={[styles.barcodeBar, styles.barcodeThin,   styles.barcodeGapNarrow]} />
              <View style={[styles.barcodeBar, styles.barcodeThin,   styles.barcodeGapNarrow]} />
              <View style={[styles.barcodeBar, styles.barcodeMedium, styles.barcodeGapWide]}   />
              <View style={[styles.barcodeBar, styles.barcodeWide,   styles.barcodeGapNarrow]} />
              <View style={[styles.barcodeBar, styles.barcodeThin,   styles.barcodeGapNarrow]} />
              <View style={[styles.barcodeBar, styles.barcodeMedium]}                          />
            </View>
          </Pressable>
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
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EDE6DC',
    alignItems: 'center',
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
  barcodeBar:       { height: 18, backgroundColor: '#FFFFFF', borderRadius: 1 },
  barcodeThin:      { width: 2 },
  barcodeMedium:    { width: 3 },
  barcodeWide:      { width: 4 },
  barcodeGapNarrow: { marginRight: 1 },
  barcodeGapWide:   { marginRight: 3 },
});
