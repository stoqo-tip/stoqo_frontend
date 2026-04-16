import React from 'react';
import { StyleSheet, View } from 'react-native';

import { getPantryStockBand } from '../../constants';

const JAR_W = 50;
const JAR_H = 58;
const LID_H = 7;
const BODY_H = JAR_H - LID_H;

const JAR_VISUALS = {
   empty: {
      fill: 0,
      fillColor: '#D9DEE7',
      lidColor: '#B8BEC8',
      borderColor: '#AAB3C2',
      backgroundColor: '#F3F4F7',
   },
   low: {
      fill: 0.28,
      fillColor: '#FFB347',
      lidColor: '#C49A74',
      borderColor: '#7E8DA8',
      backgroundColor: '#F8F8F5',
   },
   medium: {
      fill: 0.56,
      fillColor: '#FFE066',
      lidColor: '#D6C78E',
      borderColor: '#7E8DA8',
      backgroundColor: '#F8F8F5',
   },
   full: {
      fill: 0.82,
      fillColor: '#6FCF97',
      lidColor: '#9FCB9B',
      borderColor: '#7E8DA8',
      backgroundColor: '#F8F8F5',
   },
} as const;

type Props = {
   quantity: number;
};

export function PantryStockJar({ quantity }: Props): React.JSX.Element {
   const stockBand = getPantryStockBand(quantity);
   const visual = JAR_VISUALS[stockBand];

   return (
      <View style={styles.container}>
         <View style={[styles.lid, { backgroundColor: visual.lidColor }]} />
         <View
            style={[
               styles.body,
               {
                  borderColor: visual.borderColor,
                  backgroundColor: visual.backgroundColor,
               },
            ]}
         >
            {visual.fill > 0 ? (
               <View
                  style={[
                     styles.fill,
                     {
                        height: `${visual.fill * 100}%`,
                        backgroundColor: visual.fillColor,
                     },
                  ]}
               />
            ) : null}
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      width: JAR_W,
      height: JAR_H,
      alignItems: 'center',
   },
   lid: {
      width: JAR_W * 0.74,
      height: LID_H,
      borderRadius: 4,
      marginBottom: 3,
   },
   body: {
      width: JAR_W,
      height: BODY_H,
      borderWidth: 2,
      borderRadius: 12,
      overflow: 'hidden',
      justifyContent: 'flex-end',
   },
   fill: {
      width: '100%',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      opacity: 0.9,
   },
});
