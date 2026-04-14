import React, { memo, useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, PanResponder } from 'react-native';
import { JarStepper } from './JarStepper';
import { Product, StockKey } from '../../constants';

const SWIPE_THRESHOLD = 70;
const REVEAL_WIDTH = 90;

interface Props {
  product: Product;
  value: StockKey | undefined;
  onChange: (productId: string, level: StockKey) => void;
}

function ProductRowComponent({ product, value, onChange }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const stripOpacity = useRef(new Animated.Value(0)).current;

  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dx < -10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderMove: (_, gs) => {
        if (gs.dx >= 0) return;
        translateX.setValue(gs.dx * 0.55);
        stripOpacity.setValue(Math.min(1, Math.abs(gs.dx) / SWIPE_THRESHOLD));
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -SWIPE_THRESHOLD) {
          Animated.sequence([
            Animated.timing(translateX, { toValue: -(REVEAL_WIDTH + 20), duration: 85, useNativeDriver: true }),
            Animated.spring(translateX, { toValue: 0, tension: 75, friction: 7, useNativeDriver: true }),
          ]).start();
          Animated.timing(stripOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
          onChangeRef.current(product.id, 'ignore');
        } else {
          Animated.spring(translateX, { toValue: 0, tension: 75, friction: 8, useNativeDriver: true }).start();
          Animated.timing(stripOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, { toValue: 0, tension: 75, friction: 8, useNativeDriver: true }).start();
        Animated.timing(stripOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
      },
    })
  ).current;

  const isIgnore = value === 'ignore';

  return (
    <View style={styles.outerRow}>
      <Animated.View style={[styles.noTengoStrip, { opacity: stripOpacity }]} pointerEvents="none">
        <Text style={styles.noTengoLabel}>No{'\n'}consumo</Text>
      </Animated.View>

      <Animated.View
        style={[styles.row, isIgnore && styles.rowIgnore, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Text style={[styles.name, isIgnore && styles.nameIgnore]} numberOfLines={1}>
          {product.name}
        </Text>
        <JarStepper
          value={value}
          onChange={(level) => onChange(product.id, level)}
        />
      </Animated.View>
    </View>
  );
}

export const ProductRow = memo(ProductRowComponent);

const styles = StyleSheet.create({
  outerRow: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0EE',
  },
  noTengoStrip: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: REVEAL_WIDTH,
    backgroundColor: '#F0F0EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTengoLabel: {
    color: '#AAAAAA',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  rowIgnore: {
    backgroundColor: '#FAFAFA',
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    marginRight: 10,
  },
  nameIgnore: {
    color: '#AAAAAA',
  },
});
