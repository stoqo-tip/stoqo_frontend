import { useCallback, useEffect, useRef } from 'react';
import {
   type Code,
   type CodeScanner,
   useCodeScanner,
} from 'react-native-vision-camera';

import {
   BARCODE_LOST_DELAY_MS,
   BARCODE_SWITCH_CONFIRMATIONS,
   SAME_CODE_COOLDOWN_MS,
} from '../constants';
import { isValidEan } from '../utils';

function getWinner(codes: Code[]): string | null {
   const validValues = codes
      .filter(code => {
         if (!code.value) {
            return false;
         }

         return isValidEan(code.type, code.value);
      })
      .map(code => code.value as string);

   if (validValues.length === 0) {
      return null;
   }

   const counts = new Map<string, number>();

   for (const value of validValues) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
   }

   let winner: string | null = null;
   let winnerCount = 0;

   for (const [value, count] of counts.entries()) {
      if (count > winnerCount) {
         winner = value;
         winnerCount = count;
      }
   }

   return winner;
}

export function useStableBarcodeScanner(
   onBarcodeAccepted: (barcode: string) => void,
): CodeScanner {
   const activeBarcodeRef = useRef<string | null>(null);
   const candidateBarcodeRef = useRef<string | null>(null);
   const candidateCountRef = useRef(0);
   const repeatScanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
   const barcodeLostTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   const acceptBarcode = useCallback(
      (barcode: string) => {
         console.log('[scanner] codigo capturado:', barcode);
         onBarcodeAccepted(barcode);
      },
      [onBarcodeAccepted],
   );

   const startRepeatTimer = useCallback(
      (barcode: string) => {
      if (repeatScanIntervalRef.current) {
            clearInterval(repeatScanIntervalRef.current);
      }

      repeatScanIntervalRef.current = setInterval(() => {
            if (activeBarcodeRef.current === barcode) {
               acceptBarcode(barcode);
            }
         }, SAME_CODE_COOLDOWN_MS);
      },
      [acceptBarcode],
   );

   const clearRepeatTimer = useCallback(() => {
      if (repeatScanIntervalRef.current) {
         clearInterval(repeatScanIntervalRef.current);
         repeatScanIntervalRef.current = null;
      }
   }, []);

   const handleWinnerDetected = useCallback(
      (winner: string) => {
         if (barcodeLostTimeoutRef.current) {
            clearTimeout(barcodeLostTimeoutRef.current);
            barcodeLostTimeoutRef.current = null;
         }

         if (activeBarcodeRef.current == null) {
            activeBarcodeRef.current = winner;
            candidateBarcodeRef.current = null;
            candidateCountRef.current = 0;

            acceptBarcode(winner);
            startRepeatTimer(winner);
            return;
         }

         if (activeBarcodeRef.current === winner) {
            candidateBarcodeRef.current = null;
            candidateCountRef.current = 0;
            return;
         }

         if (candidateBarcodeRef.current !== winner) {
            candidateBarcodeRef.current = winner;
            candidateCountRef.current = 1;
            return;
         }

         candidateCountRef.current += 1;

         if (candidateCountRef.current >= BARCODE_SWITCH_CONFIRMATIONS) {
            activeBarcodeRef.current = winner;
            candidateBarcodeRef.current = null;
            candidateCountRef.current = 0;

            acceptBarcode(winner);
            startRepeatTimer(winner);
          }
      },
      [acceptBarcode, startRepeatTimer],
   );

   const handleNoBarcodeDetected = useCallback(() => {
      if (barcodeLostTimeoutRef.current) {
         clearTimeout(barcodeLostTimeoutRef.current);
      }

      barcodeLostTimeoutRef.current = setTimeout(() => {
         activeBarcodeRef.current = null;
         candidateBarcodeRef.current = null;
         candidateCountRef.current = 0;
         clearRepeatTimer();
      }, BARCODE_LOST_DELAY_MS);
   }, [clearRepeatTimer]);

   useEffect(() => {
      return () => {
         if (barcodeLostTimeoutRef.current) {
            clearTimeout(barcodeLostTimeoutRef.current);
        }

         clearRepeatTimer();
      };
   }, [clearRepeatTimer]);

   return useCodeScanner({
      codeTypes: ['ean-13', 'ean-8'],
      onCodeScanned: (codes: Code[]) => {
         const winner = getWinner(codes);

         if (!winner) {
            handleNoBarcodeDetected();
            return;
         }

         handleWinnerDetected(winner);
      },
   });
}
