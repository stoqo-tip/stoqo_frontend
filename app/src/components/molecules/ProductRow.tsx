import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JarButton } from '../atoms';
import { Product, StockKey, STOCK_LEVELS } from '../../constants';

interface Props {
  product: Product;
  value: StockKey | undefined;
  onChange: (productId: string, level: StockKey) => void;
}

function ProductRowComponent({ product, value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>
        {product.name}
      </Text>
      <View style={styles.jars}>
        {STOCK_LEVELS.map((level) => (
          <JarButton
            key={level.key}
            level={level}
            selected={value === level.key}
            onPress={() => onChange(product.id, level.key)}
          />
        ))}
      </View>
    </View>
  );
}

export const ProductRow = memo(ProductRowComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0EE',
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    marginRight: 8,
  },
  jars: {
    flexDirection: 'row',
    gap: 6,
  },
});