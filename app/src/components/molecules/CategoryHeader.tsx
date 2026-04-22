import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
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
        <View style={[styles.iconBadge, { backgroundColor: category.color + '22' }]}>
          <MaterialDesignIcons name={category.icon} size={20} color={category.color} />
        </View>
        <Text style={styles.label}>{category.label}</Text>
      </View>
      <View style={styles.right}>
        {completed ? (
          <Text style={styles.completedText}>✓ ¡Listo!</Text>
        ) : filledCount > 0 ? (
          <Text style={styles.count}>{filledCount}/{total}</Text>
        ) : null}
        <MaterialDesignIcons
          name={collapsed ? 'chevron-right' : 'chevron-down'}
          size={20}
          color="#B0A090"
        />
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
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A0E08',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  count: {
    fontSize: 13,
    color: '#C8392B',
    fontWeight: '600',
  },
  completedText: {
    fontSize: 13,
    color: '#C8392B',
    fontWeight: '700',
  },
});
