import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { StockLevel } from '../../constants';

const JAR_W = 36;
const JAR_H = 42;
const LID_H = 6;
const BODY_H = JAR_H - LID_H;

interface Props {
  level: StockLevel;
  selected: boolean;
  onPress: () => void;
}

export function JarButton({ level, selected, onPress }: Props) {
  const borderColor = selected ? '#1A1A2E' : '#BDBDBD';
  const borderWidth = selected ? 2 : 1.5;
  const lidColor = selected ? '#1A1A2E' : '#9E9E9E';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.touch}>
      <View style={{ width: JAR_W, height: JAR_H, alignItems: 'center' }}>
        <View style={[styles.lid, { backgroundColor: lidColor }]} />
        <View style={[styles.body, { borderColor, borderWidth }]}>
          {level.fill !== null && (
            <View
              style={[
                styles.fill,
                { height: `${level.fill * 100}%`, backgroundColor: level.color },
              ]}
            />
          )}
          {level.icon === '✕' && (
            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
              <Text style={styles.cross}>{level.icon}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touch: {
    padding: 2,
  },
  lid: {
    width: JAR_W * 0.8,
    height: LID_H,
    borderRadius: 3,
    marginBottom: 1,
  },
  body: {
    width: JAR_W,
    height: BODY_H,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
    justifyContent: 'flex-end',
  },
  fill: {
    width: '100%',
    opacity: 0.85,
  },
  cross: {
    color: '#9E9E9E',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
  },
});