import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimatedJar } from '../atoms';
import { PantryEntry, UnitType, UnitLabel } from '../../constants';

const MAX_UNITS = 10;

function formatTotal(units: number, unitSize: number, unitType: UnitType): string | null {
  if (unitType === 'count') return null;
  const total = units * unitSize;
  if (unitType === 'g') {
    if (total >= 1000) {
      const kg = total / 1000;
      return `${Number.isInteger(kg) ? kg : kg.toFixed(1)}kg`;
    }
    return `${total}g`;
  }
  if (total >= 1000) {
    const L = total / 1000;
    return `${Number.isInteger(L) ? L : L.toFixed(1)}L`;
  }
  return `${total}mL`;
}

interface Props {
  value: PantryEntry | undefined;
  unitSize: number;
  unitType: UnitType;
  unitLabel: UnitLabel;
  onChange: (entry: PantryEntry | undefined) => void;
}

export function JarStepper({ value, unitSize, unitType, unitLabel, onChange }: Props) {
  const units = value?.status === 'units' ? value.units : 0;
  const isIgnore = value?.status === 'ignore';
  const hasAny = units > 0;

  const fillRatio = Math.min(units / 5, 1);

  function increment() {
    onChange({ status: 'units', units: units + 1, unitSize, unitType });
  }

  function decrement() {
    if (units <= 1) {
      onChange(undefined);
    } else {
      onChange({ status: 'units', units: units - 1, unitSize, unitType });
    }
  }

  const canIncrement = !isIgnore && units < MAX_UNITS;
  const canDecrement = hasAny;

  const unitText = units === 1 ? unitLabel.singular : unitLabel.plural;

  const labelText = hasAny
    ? `${units} ${unitText}`
    : isIgnore
    ? 'No consumo'
    : '';

  const labelColor = hasAny ? '#7C6FCD' : isIgnore ? '#AAAAAA' : '#CCCCCC';

  const totalLabel = hasAny ? formatTotal(units, unitSize, unitType) : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={decrement}
        disabled={!canDecrement}
        style={[styles.btn, !canDecrement && styles.btnOff]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Text style={[styles.btnGlyph, !canDecrement && styles.btnGlyphOff]}>−</Text>
      </TouchableOpacity>

      <View style={styles.jarWrap}>
        <AnimatedJar fillRatio={fillRatio} isIgnore={isIgnore} />
        <Text style={[styles.levelLabel, { color: labelColor }, !value && styles.levelLabelHint]}>
          {value ? labelText : 'toca +'}
        </Text>
        {totalLabel && (
          <Text style={styles.totalLabel}>{totalLabel}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={increment}
        disabled={!canIncrement}
        style={[styles.btn, !canIncrement && styles.btnOff]}
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
  totalLabel: {
    fontSize: 8,
    color: '#AAAAAA',
    marginTop: 1,
    letterSpacing: 0.1,
  },
});
