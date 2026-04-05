import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ScreenMessageProps = {
  message: string;
};

export function ScreenMessage({
  message,
}: ScreenMessageProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});
