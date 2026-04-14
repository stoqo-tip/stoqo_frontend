import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, PanResponder } from 'react-native';
import { StockKey, STOCK_LEVELS } from '../../constants';

const JAR_W = 46;
const JAR_H = 56;
const LID_H = 7;
const BODY_H = JAR_H - LID_H;

interface Props {
  stockKey: StockKey | undefined;
  onIncrement: () => void;
  onDecrement: () => void;
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

export function AnimatedJar({ stockKey, onIncrement, onDecrement }: Props) {
  const fill = getFill(stockKey);
  const color = getColor(stockKey);

  const fillAnim = useRef(new Animated.Value(fill)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevKeyRef = useRef(stockKey);

  useEffect(() => {
    // Scale pulse on every level change
    if (prevKeyRef.current !== stockKey) {
      prevKeyRef.current = stockKey;
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.13,
          duration: 75,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 280,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // Spring-animate fill level
    Animated.spring(fillAnim, {
      toValue: fill,
      tension: 90,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [fill, stockKey]);

  const panResponder = useRef(
    PanResponder.create({
      // Only claim the gesture if it is clearly horizontal
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > 35) onIncrement();
        else if (gs.dx < -35) onDecrement();
      },
    })
  ).current;

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isActive = !!stockKey && stockKey !== 'ignore';
  const isIgnore = stockKey === 'ignore';
  const borderColor = isActive ? '#1A1A2E' : '#CCCCCC';
  const lidColor = isActive ? '#1A1A2E' : '#BDBDBD';

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      {/* Lid */}
      <View style={[styles.lid, { backgroundColor: lidColor }]} />

      {/* Body */}
      <View
        style={[styles.body, { borderColor, borderWidth: isActive ? 2 : 1.5 }]}
      >
        {/* Liquid fill */}
        <Animated.View
          style={[
            styles.fill,
            { height: fillHeight, backgroundColor: color },
          ]}
        />

        {/* "No consumo" X overlay */}
        {isIgnore && (
          <View
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          >
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
});
