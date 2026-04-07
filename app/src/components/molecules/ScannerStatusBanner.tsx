import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ScannerStatusBannerProps = {
  label: string;
  message?: string;
};

export function ScannerStatusBanner({
  label,
  message,
}: ScannerStatusBannerProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
    fontWeight: '600',
  },
  message: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});
