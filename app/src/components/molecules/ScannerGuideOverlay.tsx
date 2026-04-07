import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import {
   SCAN_GUIDE_HEIGHT,
   SCAN_GUIDE_WIDTH_RATIO,
} from '../../constants';
import type { LookupState } from '../../hooks';

type Props = {
   lookupState: LookupState;
};

export function ScannerGuideOverlay({
   lookupState,
}: Props): React.JSX.Element {
   const feedbackOpacity = useRef(new Animated.Value(0)).current;

   const feedback = useMemo(() => {
      if (lookupState === 'success') {
         return { symbol: '✓', color: '#51d97b' };
      }

      if (lookupState === 'not-found' || lookupState === 'error') {
         return { symbol: '✕', color: '#ff5f5f' };
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
            duration: 2200,
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
      width: `${SCAN_GUIDE_WIDTH_RATIO * 100}%`,
      maxWidth: 360,
      height: SCAN_GUIDE_HEIGHT,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
   },
   corner: {
      position: 'absolute',
      width: 34,
      height: 34,
      borderColor: '#ff8f2a',
      shadowColor: '#ff8f2a',
      shadowOpacity: 0.6,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
      elevation: 6,
   },
   cornerTopLeft: {
      top: 0,
      left: 0,
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderTopLeftRadius: 20,
   },
   cornerTopRight: {
      top: 0,
      right: 0,
      borderTopWidth: 3,
      borderRightWidth: 3,
      borderTopRightRadius: 20,
   },
   cornerBottomLeft: {
      bottom: 0,
      left: 0,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderBottomLeftRadius: 20,
   },
   cornerBottomRight: {
      bottom: 0,
      right: 0,
      borderBottomWidth: 3,
      borderRightWidth: 3,
      borderBottomRightRadius: 20,
   },
   centerLine: {
      width: '78%',
      height: 1.5,
      backgroundColor: 'rgba(255, 143, 42, 0.85)',
      shadowColor: '#ff8f2a',
      shadowOpacity: 0.65,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 0 },
      elevation: 3,
   },
   feedbackBadge: {
      position: 'absolute',
      width: 108,
      height: 108,
      borderRadius: 54,
      backgroundColor: 'rgba(8, 10, 16, 0.42)',
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
   },
   feedbackSymbol: {
      fontSize: 62,
      fontWeight: '700',
      lineHeight: 68,
   },
});
