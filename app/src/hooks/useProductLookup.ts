import { useEffect, useState } from 'react';

import { fetchProductByBarcode } from '../services';

export type LookupState =
   | 'idle'
   | 'loading'
   | 'success'
   | 'not-found'
   | 'error';

const IDLE_MESSAGE = 'Apunta al codigo EAN-13 o EAN-8';

export function useProductLookup(barcode: string | null) {
   const [lookupState, setLookupState] = useState<LookupState>('idle');
   const [lookupMessage, setLookupMessage] = useState<string>(IDLE_MESSAGE);

   useEffect(() => {
      if (!barcode) {
         setLookupState('idle');
         setLookupMessage(IDLE_MESSAGE);
         return;
      }

      let cancelled = false;

    const lookupProduct = async () => {
      setLookupState('loading');
      setLookupMessage('Buscando producto...');
      console.log('[lookup] consultando barcode:', barcode);

      try {
        const result = await fetchProductByBarcode(barcode);

        if (cancelled) {
          return;
        }

            if (result.found && result.product?.name) {
               setLookupState('success');
               setLookupMessage(result.product.name);
          return;
        }

        setLookupState('not-found');
        setLookupMessage('NOT FOUND');
      } catch {
        if (cancelled) {
          return;
        }

            setLookupState('error');
            setLookupMessage('Error consultando el backend :c');
         }
      };

      void lookupProduct();

      return () => {
         cancelled = true;
      };
   }, [barcode]);

   return { lookupState, lookupMessage };
}
