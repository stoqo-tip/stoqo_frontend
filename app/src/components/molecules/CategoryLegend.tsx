import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function CategoryLegend() {
  return (
    <View style={styles.container}>
      <Text style={styles.hint}>← deslizá un producto para marcarlo como No consumo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F3',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  hint: {
    fontSize: 10,
    color: '#AAAAAA',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
