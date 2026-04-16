import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ScannerStatusBannerProps = {
  label: string;
  message?: string;
};

const DEFAULT_LABEL = 'Apunta al codigo EAN-13 o EAN-8';

export function ScannerStatusBanner({
  label,
  message,
}: ScannerStatusBannerProps): React.JSX.Element {
  const isDefaultLabel = label === DEFAULT_LABEL;

  if (isDefaultLabel && !message) {
    return <View style={styles.hidden} />;
  }

  const titleText = message ?? label;
  const subtitleText = message ? label : undefined;

  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.title}>
        {titleText}
      </Text>

      {subtitleText ? (
        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitleText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
  container: {
    position: 'absolute',
    top: 122,
    left: 56,
    right: 56,
    backgroundColor: 'rgba(255, 251, 247, 0.92)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEE5D8',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: {
    color: '#1A1A2E',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '800',
  },
  subtitle: {
    color: '#6C665F',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 14,
  },
});
