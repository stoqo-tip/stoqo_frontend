import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  total: number;
  filled: number;
}

export function OnboardingProgressBar({ total, filled }: Props) {
  const pct = total === 0 ? 0 : filled / total;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%` }]} />
      </View>
      <Text style={styles.label}>
        {filled} de {total} productos marcados
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  track: {
    height: 6,
    backgroundColor: '#E8E8E4',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#4CAF82',
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
});