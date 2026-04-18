import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

export type ScannerFeedbackState =
   | 'idle'
   | 'loading'
   | 'success'
   | 'not-found'
   | 'error';

type Props = {
   lookupState: ScannerFeedbackState;
};

export function ScannerGuideOverlay({
   lookupState,
}: Props): React.JSX.Element {
   const feedbackOpacity = useRef(new Animated.Value(0)).current;

   const feedback = useMemo(() => {
      if (lookupState === 'success') {
         return { symbol: '\u2713', color: '#51D97B' };
      }

      if (lookupState === 'not-found' || lookupState === 'error') {
         return { symbol: '\u2715', color: '#FF6A6A' };
      }

      return null;
   }, [lookupState]);

   useEffect(() => {
      if (!feedback) {
         feedbackOpacity.setValue(0);
         return;
      }

      feedbackOpacity.setValue(1);

      Animated.sequence([
         Animated.delay(700),
         Animated.timing(feedbackOpacity, {
            toValue: 0,
            duration: 1800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
         }),
      ]).start();
   }, [feedback, feedbackOpacity]);

   return (
      <View pointerEvents="none" style={styles.scanGuideWrapper}>
         <View style={styles.scanGuide}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
            <View style={styles.centerLine} />

            {feedback ? (
               <Animated.View
                  style={[
                     styles.feedbackBadge,
                     { opacity: feedbackOpacity, borderColor: feedback.color },
                  ]}
               >
                  <Text style={[styles.feedbackSymbol, { color: feedback.color }]}>
                     {feedback.symbol}
                  </Text>
               </Animated.View>
            ) : null}
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   scanGuideWrapper: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
   },
   scanGuide: {
      width: '66%',
      maxWidth: 280,
      height: 150,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 18,
   },
   corner: {
      position: 'absolute',
      width: 26,
      height: 26,
      borderColor: '#FF9A32',
   },
   cornerTopLeft: {
      top: 0,
      left: 0,
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderTopLeftRadius: 14,
   },
   cornerTopRight: {
      top: 0,
      right: 0,
      borderTopWidth: 3,
      borderRightWidth: 3,
      borderTopRightRadius: 14,
   },
   cornerBottomLeft: {
      bottom: 0,
      left: 0,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderBottomLeftRadius: 14,
   },
   cornerBottomRight: {
      bottom: 0,
      right: 0,
      borderBottomWidth: 3,
      borderRightWidth: 3,
      borderBottomRightRadius: 14,
   },
   centerLine: {
      width: '68%',
      height: 2,
      borderRadius: 999,
      backgroundColor: 'rgba(255, 154, 50, 0.92)',
   },
   feedbackBadge: {
      position: 'absolute',
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: 'rgba(8, 10, 16, 0.22)',
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
   },
   feedbackSymbol: {
      fontSize: 42,
      fontWeight: '700',
      lineHeight: 46,
   },
});
