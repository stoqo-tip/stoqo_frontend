import React, { memo, useEffect, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { AnimatedJar } from '../atoms';
import { Product, StockKey, STOCK_LEVELS } from '../../constants';

// Ordered states for the +/- cycle
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
  product: Product;
  value: StockKey | undefined;
  onChange: (productId: string, level: StockKey) => void;
}

const SWIPE_THRESHOLD = 70;
const REVEAL_WIDTH = 90;

function ProductRowComponent({ product, value, onChange }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const stripOpacity = useRef(new Animated.Value(0)).current;

  // Keep a ref to onChange so the PanResponder closure always sees the latest version
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const panResponder = useRef(
    PanResponder.create({
      // Only capture clearly leftward, more-horizontal-than-vertical swipes
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dx < -10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderMove: (_, gs) => {
        if (gs.dx >= 0) return;
        const drag = gs.dx * 0.55; // resistance factor
        translateX.setValue(drag);
        // Fade in the strip proportionally to how far the user has dragged
        stripOpacity.setValue(Math.min(1, Math.abs(gs.dx) / SWIPE_THRESHOLD));
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -SWIPE_THRESHOLD) {
          // Commit: slide further, then spring back
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: -(REVEAL_WIDTH + 20),
              duration: 85,
              useNativeDriver: true,
            }),
            Animated.spring(translateX, {
              toValue: 0,
              tension: 75,
              friction: 7,
              useNativeDriver: true,
            }),
          ]).start();
          Animated.timing(stripOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
          onChangeRef.current(product.id, 'ignore');
        } else {
          // Cancel: spring back
          Animated.spring(translateX, {
            toValue: 0,
            tension: 75,
            friction: 8,
            useNativeDriver: true,
          }).start();
          Animated.timing(stripOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          tension: 75,
          friction: 8,
          useNativeDriver: true,
        }).start();
        Animated.timing(stripOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const isNoTengo = value === 'ignore';
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
    <View style={styles.outerRow}>
      {/* "Sin stock" strip revealed on left-swipe */}
      <Animated.View
        style={[styles.noTengoStrip, { opacity: stripOpacity }]}
        pointerEvents="none"
      >
        <Text style={styles.noTengoLabel}>No{'\n'}consumo</Text>
      </Animated.View>

      {/* Main row — slides left on swipe */}
      <Animated.View
        style={[
          styles.row,
          isNoTengo && styles.rowNoTengo,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <Text
          style={[styles.name, isNoTengo && styles.nameNoTengo]}
          numberOfLines={1}
        >
          {product.name}
        </Text>

        <View style={styles.controls}>
          {/* Minus button */}
          <TouchableOpacity
            onPress={() => onChange(product.id, prevLevel(value))}
            style={[styles.btn, !canDecrement && styles.btnOff]}
            disabled={!canDecrement}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Text style={[styles.btnGlyph, !canDecrement && styles.btnGlyphOff]}>
              −
            </Text>
          </TouchableOpacity>

          {/* Animated jar + level label */}
          <View style={styles.jarWrap}>
            <AnimatedJar
              stockKey={value}
              onIncrement={() => onChange(product.id, nextLevel(value))}
              onDecrement={() => onChange(product.id, prevLevel(value))}
            />
            <Text
              style={[
                styles.levelLabel,
                { color: labelColor },
                !value && styles.levelLabelHint,
              ]}
            >
              {value ? levelLabel : 'toca +'}
            </Text>
          </View>

          {/* Plus button — always active when not at 'full', even when no tengo */}
          <TouchableOpacity
            onPress={() => onChange(product.id, nextLevel(value))}
            style={[styles.btn, !canIncrement && styles.btnOff]}
            disabled={!canIncrement}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Text style={[styles.btnGlyph, !canIncrement && styles.btnGlyphOff]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
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
  rowNoTengo: {
    backgroundColor: '#FAFAFA',
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    marginRight: 10,
  },
  nameNoTengo: {
    color: '#AAAAAA',
  },
  controls: {
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
