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
import { fetchPantryItems } from '../services';
import type { PantryItem } from '../types';

type HomeScreenProps = {
  onStartScanning: () => void;
};

export function HomeScreen({
  onStartScanning,
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

        if (isMounted) {
          setItems(pantryItems);
        }
      } catch {
        if (isMounted) {
          setLoadError('No pudimos cargar tu despensa.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPantry();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedSearchText = searchText.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!normalizedSearchText) {
      return items;
    }

    return items.filter(item => {
      const haystack = `${item.name} ${item.brand ?? ''}`.toLowerCase();
      return haystack.includes(normalizedSearchText);
    });
  }, [items, normalizedSearchText]);

  const groupedItems = useMemo(() => {
    const groups = {
      empty: [] as PantryItem[],
      low: [] as PantryItem[],
      medium: [] as PantryItem[],
      full: [] as PantryItem[],
    };

    for (const item of filteredItems) {
      groups[getPantryStockBand(item.quantity)].push(item);
    }

    return groups;
  }, [filteredItems]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Text style={styles.title}>Mi despensa :)</Text>

          <View style={styles.searchWrap}>
            <TextInput value={searchText} onChangeText={setSearchText} placeholder="Buscar producto..." placeholderTextColor="#8090AD" style={styles.searchInput}/>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#1A1A2E" />
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
              if (sectionItems.length === 0) {
                return null;
              }
              const meta = PANTRY_STOCK_META[stockBand];
              return (
                <PantryShelfSection
                  key={stockBand}
                  title={meta.label}
                  chipBackground={meta.chipBackground}
                  items={sectionItems}
                />
              );
            })}
            {filteredItems.length === 0 ? (
              <View style={styles.centerState}>
                <Text style={styles.stateText}>
                  {items.length === 0
                    ? 'Todavía no hay productos en tu despensa.'
                    : 'No encontramos productos para esa búsqueda.'}
                </Text>
              </View>
            ) : null}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}

        <View style={styles.bottomBar}>
          <Pressable style={styles.scanButton} onPress={onStartScanning}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EF',
  },
  shell: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: '#FBFAF7',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E8E5DF',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECE8E0',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: -0.4,
  },
  searchWrap: {
    marginTop: 12,
  },
  searchInput: {
    height: 46,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8DDE8',
    paddingHorizontal: 18,
    color: '#33415C',
    fontSize: 17,
  },
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
  stateText: {
    marginTop: 10,
    color: '#6E6E6E',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  stateError: {
    color: '#C54A4A',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 16,
  },
  bottomBar: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECE8E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6F84A7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
  },
  barcodeBar: {
    height: 18,
    backgroundColor: '#6F84A7',
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
