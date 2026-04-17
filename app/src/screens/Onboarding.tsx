import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategorySection } from '../components/organisms';
import { OnboardingProgressBar } from '../components/molecules';
import { PANTRY_CATEGORIES, PantryEntry } from '../constants';

export type PantryState = Record<string, PantryEntry>;

interface Props {
  onComplete: (pantry: PantryState) => void;
  onSkip?: () => void;
}

export function Onboarding({ onComplete, onSkip }: Props) {
  const [pantry, setPantry] = useState<PantryState>({});

  const allProducts = PANTRY_CATEGORIES.flatMap((c) => c.products);
  const filledCount = Object.keys(pantry).length;

  const handleUpdate = useCallback((productId: string, entry: PantryEntry | undefined) => {
    setPantry((prev) => {
      if (entry === undefined) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: entry };
    });
  }, []);

  function handleComplete() {
    const result: PantryState = {};
    for (const [id, entry] of Object.entries(pantry)) {
      if (entry.status !== 'ignore') result[id] = entry;
    }
    onComplete(result);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tu alacena</Text>
          <Text style={styles.subtitle}>Marcá lo que tenés en casa ahora mismo</Text>
        </View>
        {onSkip && (
          <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Omitir</Text>
          </TouchableOpacity>
        )}
      </View>

      <OnboardingProgressBar total={allProducts.length} filled={filledCount} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {PANTRY_CATEGORIES.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            pantry={pantry}
            onUpdate={handleUpdate}
          />
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.ctaBtn, filledCount === 0 && styles.ctaBtnDisabled]}
          onPress={handleComplete}
          disabled={filledCount === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>
            {filledCount === 0 ? 'Marcá al menos un producto' : 'Listo — guardar despensa'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    marginTop: 4,
  },
  skipText: {
    fontSize: 13,
    color: '#757575',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bottomSpacer: {
    height: 100,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FAFAF8',
  },
  ctaBtn: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBtnDisabled: {
    backgroundColor: '#D0D0CC',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
