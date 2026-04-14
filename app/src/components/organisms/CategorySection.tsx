import React, { memo, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CategoryHeader, CategoryLegend, ProductRow } from '../molecules';
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

  return (
    <View style={[styles.container, completed && styles.containerCompleted]}>
      <CategoryHeader
        category={category}
        filledCount={filledCount}
        total={total}
        collapsed={collapsed}
        completed={completed}
        onToggle={() => setCollapsed((c) => !c)}
      />
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
});
