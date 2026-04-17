import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const JAR_W = 46;
const JAR_H = 56;
const LID_H = 7;
const BODY_H = JAR_H - LID_H;
const FILL_COLOR = '#7C6FCD';

interface Props {
  fillRatio: number;
  isIgnore: boolean;
}

export function AnimatedJar({ fillRatio, isIgnore }: Props) {
  const fillAnim = useRef(new Animated.Value(fillRatio)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevFillRef = useRef(fillRatio);
  const prevIgnoreRef = useRef(isIgnore);

  useEffect(() => {
    const changed = prevFillRef.current !== fillRatio || prevIgnoreRef.current !== isIgnore;
    prevFillRef.current = fillRatio;
    prevIgnoreRef.current = isIgnore;

    if (changed) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.13, duration: 75, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 280, friction: 8, useNativeDriver: true }),
      ]).start();
    }

    Animated.spring(fillAnim, {
      toValue: fillRatio,
      tension: 90,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [fillRatio, isIgnore, fillAnim, scaleAnim]);

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isActive = fillRatio > 0 || isIgnore;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <View style={[styles.lid, isActive ? styles.lidActive : styles.lidInactive]} />
      <View style={[styles.body, isActive ? styles.bodyActive : styles.bodyInactive]}>
        <Animated.View style={[styles.fill, { height: fillHeight, backgroundColor: FILL_COLOR }]} />
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
  lidActive: {
    backgroundColor: '#1A1A2E',
  },
  lidInactive: {
    backgroundColor: '#BDBDBD',
  },
  body: {
    width: JAR_W,
    height: BODY_H,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F3',
    justifyContent: 'flex-end',
  },
  bodyActive: {
    borderColor: '#1A1A2E',
    borderWidth: 2,
  },
  bodyInactive: {
    borderColor: '#CCCCCC',
    borderWidth: 1.5,
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
