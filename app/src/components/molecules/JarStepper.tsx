import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimatedJar } from '../atoms';
import { StockKey, STOCK_LEVELS } from '../../constants';

const CYCLE: StockKey[] = ['ignore', 'empty', 'low', 'medium', 'full'];

function nextLevel(current: StockKey | undefined): StockKey {
  if (!current || current === 'ignore') return 'low';
  const idx = CYCLE.indexOf(current);
  return idx < CYCLE.length - 1 ? CYCLE[idx + 1] : current;
}

function prevLevel(current: StockKey | undefined): StockKey {
  if (!current) return 'ignore';
  const idx = CYCLE.indexOf(current);
  return idx > 0 ? CYCLE[idx - 1] : current;
}

interface Props {
  value: StockKey | undefined;
  onChange: (level: StockKey) => void;
}

export function JarStepper({ value, onChange }: Props) {
  const canIncrement = value !== 'full';
  const canDecrement = !!value && value !== 'ignore';

  const levelLabel =
    value && value !== 'ignore'
      ? STOCK_LEVELS.find((l) => l.key === value)?.label ?? ''
      : value === 'ignore'
      ? 'No consumo'
      : '';

  const labelColor =
    value === 'ignore'
      ? '#AAAAAA'
      : STOCK_LEVELS.find((l) => l.key === value)?.color ?? '#999999';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onChange(prevLevel(value))}
        style={[styles.btn, !canDecrement && styles.btnOff]}
        disabled={!canDecrement}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Text style={[styles.btnGlyph, !canDecrement && styles.btnGlyphOff]}>−</Text>
      </TouchableOpacity>

      <View style={styles.jarWrap}>
        <AnimatedJar stockKey={value} />
        <Text style={[styles.levelLabel, { color: labelColor }, !value && styles.levelLabelHint]}>
          {value ? levelLabel : 'toca +'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => onChange(nextLevel(value))}
        style={[styles.btn, !canIncrement && styles.btnOff]}
        disabled={!canIncrement}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Text style={[styles.btnGlyph, !canIncrement && styles.btnGlyphOff]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOff: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  btnGlyph: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 22,
    includeFontPadding: false,
  },
  btnGlyphOff: {
    color: '#D0D0D0',
  },
  jarWrap: {
    alignItems: 'center',
    width: 52,
  },
  levelLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 3,
    letterSpacing: 0.2,
  },
  levelLabelHint: {
    color: '#CCCCCC',
    fontWeight: '400',
  },
});
