import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { StockKey, STOCK_LEVELS } from '../../constants';

const JAR_W = 46;
const JAR_H = 56;
const LID_H = 7;
const BODY_H = JAR_H - LID_H;

interface Props {
  stockKey: StockKey | undefined;
}

function getFill(key: StockKey | undefined): number {
  if (!key || key === 'ignore') return 0;
  const level = STOCK_LEVELS.find((l) => l.key === key);
  if (!level || level.fill === null) return 0;
  return level.fill === 0 ? 0.05 : level.fill;
}

function getColor(key: StockKey | undefined): string {
  if (!key || key === 'ignore') return '#E0E0E0';
  return STOCK_LEVELS.find((l) => l.key === key)?.color ?? '#E0E0E0';
}

export function AnimatedJar({ stockKey }: Props) {
  const fill = getFill(stockKey);
  const color = getColor(stockKey);

  const fillAnim = useRef(new Animated.Value(fill)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevKeyRef = useRef(stockKey);

  useEffect(() => {
    if (prevKeyRef.current !== stockKey) {
      prevKeyRef.current = stockKey;
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.13, duration: 75, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 280, friction: 8, useNativeDriver: true }),
      ]).start();
    }
    Animated.spring(fillAnim, {
      toValue: fill,
      tension: 90,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [fill, stockKey]);

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isActive = !!stockKey && stockKey !== 'ignore';
  const isIgnore = stockKey === 'ignore';

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <View style={[styles.lid, { backgroundColor: isActive ? '#1A1A2E' : '#BDBDBD' }]} />
      <View style={[styles.body, { borderColor: isActive ? '#1A1A2E' : '#CCCCCC', borderWidth: isActive ? 2 : 1.5 }]}>
        <Animated.View style={[styles.fill, { height: fillHeight, backgroundColor: color }]} />
        {isIgnore && (
          <View style={styles.absoluteFill} pointerEvents="none">
            <View style={styles.ignoreWrap}>
              <View style={[styles.ignoreLine, { transform: [{ rotate: '45deg' }] }]} />
              <View style={[styles.ignoreLine, { transform: [{ rotate: '-45deg' }] }]} />
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: JAR_W,
    height: JAR_H,
    alignItems: 'center',
  },
  lid: {
    width: JAR_W * 0.72,
    height: LID_H,
    borderRadius: 3,
    marginBottom: 1,
  },
  body: {
    width: JAR_W,
    height: BODY_H,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F3',
    justifyContent: 'flex-end',
  },
  fill: {
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  ignoreWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ignoreLine: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: '#BDBDBD',
    borderRadius: 1,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
