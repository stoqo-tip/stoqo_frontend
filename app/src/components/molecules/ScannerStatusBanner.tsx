import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ScannerStatusBannerProps = {
  label: string;
};

export function ScannerStatusBanner({
  label,
}: ScannerStatusBannerProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 12,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
