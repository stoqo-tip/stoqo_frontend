import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackNavigationProp } from '../navigation/types';
import type { ConsumptionProduct } from '../services/consumptionApi';
import { fetchConsumptionAnalysis } from '../services/consumptionApi';

type Urgency = { bg: string; textColor: string; label: string };

function getUrgency(daysUntilNext: number | null): Urgency {
  if (daysUntilNext === null) return { bg: '#EDE6DC', textColor: '#8A7A6A', label: 'Sin datos' };
  if (daysUntilNext <= 0)    return { bg: '#FAE0DC', textColor: '#C8392B', label: 'Comprá hoy' };
  if (daysUntilNext === 1)   return { bg: '#FDF0E0', textColor: '#A85A00', label: 'Mañana' };
  if (daysUntilNext <= 4)    return { bg: '#FDF5E8', textColor: '#8A6A00', label: `En ${daysUntilNext} días` };
  return                            { bg: '#E8F5E8', textColor: '#2A6A35', label: `En ${daysUntilNext} días` };
}

function ProductCard({ item }: { item: ConsumptionProduct }) {
  const u = getUrgency(item.days_until_next);

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.productName}>{item.display_name}</Text>
        <View style={[styles.chip, { backgroundColor: u.bg }]}>
          <Text style={[styles.chipText, { color: u.textColor }]}>{u.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardStats}>
        <StatItem label="Frecuencia" value={item.frequency_label} />
        <View style={styles.statDivider} />
        <StatItem
          label="Último escaneo"
          value={item.days_since_last !== null ? `hace ${item.days_since_last}d` : '—'}
        />
        <View style={styles.statDivider} />
        <StatItem label="Escaneos" value={String(item.event_count)} />
      </View>
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function ConsumptionAnalysisScreen(): React.JSX.Element {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [products, setProducts] = useState<ConsumptionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await fetchConsumptionAnalysis();
        if (isMounted) setProducts(data);
      } catch {
        if (isMounted) setLoadError('No pudimos cargar el análisis.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shell}>

        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={12}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.title}>Mis hábitos</Text>
          <View style={styles.backButton} />
        </View>

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#C8392B" />
            <Text style={styles.stateText}>Analizando consumo...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.centerState}>
            <Text style={styles.stateError}>{loadError}</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.stateText}>
              Todavía no hay escaneos registrados.{'\n'}
              Escaneá productos para ver tus hábitos de compra.
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => item.product_type_code}
            renderItem={({ item }) => <ProductCard item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

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
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE6DC',
  },
  backButton: {
    width: 36,
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A0E08',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A0E08',
    letterSpacing: -0.5,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
    gap: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EDE6DC',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A0E08',
    flex: 1,
    marginRight: 10,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDE6DC',
    marginBottom: 12,
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#EDE6DC',
  },
  statLabel: {
    fontSize: 11,
    color: '#B0A090',
    marginBottom: 3,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A0E08',
    textAlign: 'center',
  },

  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  },
});
