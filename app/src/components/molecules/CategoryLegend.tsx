import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JarButton } from '../atoms';
import { STOCK_LEVELS } from '../../constants';

export function CategoryLegend() {
  return (
    <View style={styles.container}>
      {STOCK_LEVELS.map((level) => (
        <View key={level.key} style={styles.item}>
          <JarButton level={level} selected={false} onPress={() => {}} />
          <Text style={styles.label}>{level.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#F5F5F3',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 9,
    color: '#9E9E9E',
    textAlign: 'center',
    width: 44,
  },
});