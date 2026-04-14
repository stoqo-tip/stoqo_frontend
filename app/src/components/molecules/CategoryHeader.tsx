import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Category } from '../../constants';

interface Props {
  category: Category;
  filledCount: number;
  total: number;
  collapsed: boolean;
  completed: boolean;
  onToggle: () => void;
}

export function CategoryHeader({ category, filledCount, total, collapsed, completed, onToggle }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.8}>
      <View style={styles.left}>
        <Text style={styles.emoji}>{category.emoji}</Text>
        <Text style={styles.label}>{category.label}</Text>
      </View>
      <View style={styles.right}>
        {completed ? (
          <Text style={styles.completedText}>✓ ¡Listo!</Text>
        ) : filledCount > 0 ? (
          <Text style={styles.count}>{filledCount}/{total}</Text>
        ) : null}
        <Text style={styles.chevron}>{collapsed ? '›' : '⌄'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  count: {
    fontSize: 13,
    color: '#4CAF82',
    fontWeight: '600',
  },
  completedText: {
    fontSize: 13,
    color: '#4CAF82',
    fontWeight: '700',
  },
  chevron: {
    fontSize: 20,
    color: '#BDBDBD',
  },
});
