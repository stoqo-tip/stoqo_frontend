import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DIETS, DietKey } from '../constants';

interface Props {
  onComplete: (diets: DietKey[]) => void;
  onSkip: () => void;
}

export function DietSelection({ onComplete, onSkip }: Props) {
  const [selected, setSelected] = useState<Set<DietKey>>(new Set());

  function toggle(key: DietKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>¿Cómo comés?</Text>
          <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Omitir</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          Seleccioná tus preferencias y solo verás los productos que aplican
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {DIETS.map((diet) => {
          const isSelected = selected.has(diet.key);
          return (
            <TouchableOpacity
              key={diet.key}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => toggle(diet.key)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardEmoji}>{diet.emoji}</Text>
                <View>
                  <Text style={styles.cardLabel}>{diet.label}</Text>
                  <Text style={styles.cardDesc}>{diet.description}</Text>
                </View>
              </View>
              <View style={[styles.check, isSelected && styles.checkSelected]}>
                {isSelected && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => onComplete(Array.from(selected))}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>
            {selected.size === 0
              ? 'Sin restricciones — continuar'
              : `Continuar con ${selected.size} preferencia${selected.size > 1 ? 's' : ''}`}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#4CAF82',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  cardDesc: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkSelected: {
    backgroundColor: '#4CAF82',
    borderColor: '#4CAF82',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
