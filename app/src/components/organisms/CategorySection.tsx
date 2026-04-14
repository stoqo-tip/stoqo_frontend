import React, { memo, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CategoryLegend } from '../molecules';
import { ProductRow } from '../molecules';
import { Category, StockKey } from '../../constants';

interface Props {
  category: Category;
  pantry: Record<string, StockKey>;
  onUpdate: (productId: string, level: StockKey) => void;
}

function CategorySectionComponent({ category, pantry, onUpdate }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const [completed, setCompleted] = useState(false);

  const filledCount = category.products.filter((p) => pantry[p.id] !== undefined).length;
  const total = category.products.length;
  const prevFilledRef = useRef(filledCount);

  useEffect(() => {
    if (filledCount === total && prevFilledRef.current < total) {
      setCompleted(true);
      const timer = setTimeout(() => {
        setCollapsed(true);
        setCompleted(false);
      }, 900);
      return () => clearTimeout(timer);
    }
    prevFilledRef.current = filledCount;
  }, [filledCount, total]);

  function handleToggle() {
    setCollapsed((c) => !c);
  }

  return (
    <View style={[styles.container, completed && styles.containerCompleted]}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.emoji}>{category.emoji}</Text>
          <Text style={styles.label}>{category.label}</Text>
        </View>
        <View style={styles.headerRight}>
          {completed ? (
            <Text style={styles.completedText}>✓ ¡Listo!</Text>
          ) : filledCount > 0 ? (
            <Text style={styles.count}>{filledCount}/{total}</Text>
          ) : null}
          <Text style={styles.chevron}>{collapsed ? '›' : '⌄'}</Text>
        </View>
      </TouchableOpacity>

      {!collapsed && (
        <>
          <CategoryLegend />
          {category.products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              value={pantry[product.id]}
              onChange={onUpdate}
            />
          ))}
        </>
      )}
    </View>
  );
}

export const CategorySection = memo(CategorySectionComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    minHeight: 52,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  containerCompleted: {
    borderWidth: 1.5,
    borderColor: '#4CAF82',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: {
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
  headerRight: {
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
