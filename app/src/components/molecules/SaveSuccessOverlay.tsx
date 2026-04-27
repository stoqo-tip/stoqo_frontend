import React,{useEffect,useRef,} from 'react';
import {Animated,StyleSheet,} from 'react-native';

type Props = {
   visible: boolean;
   label: string;
   onDone: () => void;
};

export function SaveSuccessOverlay({visible,label,onDone,}: Props): React.JSX.Element | null {
   const circleScale = useRef(new Animated.Value(0)).current;
   const checkOpacity = useRef(new Animated.Value(0)).current;
   const overlayOpacity = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      if (!visible) {
         circleScale.setValue(0);
         checkOpacity.setValue(0);
         overlayOpacity.setValue(0);
         return;
      }

      Animated.sequence([
         Animated.timing(overlayOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
         }),
         Animated.spring(circleScale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
         }),
         Animated.timing(checkOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
         }),
      ]).start();

      const timer = setTimeout(onDone, 1200);

      return () => clearTimeout(timer);
   }, [visible,circleScale,checkOpacity,overlayOpacity,onDone]);

   if (!visible) return null;

   return (
      <Animated.View style={[styles.overlay,{opacity: overlayOpacity}]}>
         <Animated.View style={[styles.circle,{transform: [{scale: circleScale}]}]}>
            <Animated.Text style={[styles.check,{opacity: checkOpacity}]}>
               {'\u2713'}
            </Animated.Text>
         </Animated.View>

         <Animated.Text style={[styles.label,{opacity: checkOpacity}]}>
            {label}
         </Animated.Text>
      </Animated.View>
   );
}

const styles = StyleSheet.create({
   overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(26, 26, 46, 0.38)',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
   },
   circle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: '#4CAF50',
      justifyContent: 'center',
      alignItems: 'center',
   },
   check: {
      fontSize: 50,
      color: '#FFFFFF',
      fontWeight: '700',
   },
   label: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.2,
   },
});
