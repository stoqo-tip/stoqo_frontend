import React from 'react';
import {Pressable,StyleSheet,Text,} from 'react-native';

type ProductCapturePhotoCardProps = {
   title: string;
   hasText: boolean;
   onPress: () => void;
};

export function ProductCapturePhotoCard({
   title,
   hasText,
   onPress,
}: ProductCapturePhotoCardProps): React.JSX.Element {
   return (
      <Pressable onPress={onPress} style={styles.captureButton}>
         <Text style={styles.captureButtonTitle}>{title}</Text>
         <Text style={styles.captureButtonText}>
            {hasText ? 'Texto capturado' : 'Capturar foto'}
         </Text>
      </Pressable>
   );
}

const styles = StyleSheet.create({
   captureButton: {
      flex: 1,
      minHeight: 112,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E7DED4',
      backgroundColor: '#FFF8F0',
      padding: 14,
      justifyContent: 'space-between',
   },
   captureButtonTitle: {
      color: '#1A1A2E',
      fontSize: 16,
      fontWeight: '800',
   },
   captureButtonText: {
      color: '#726A5E',
      fontSize: 13,
      fontWeight: '700',
   },
});
