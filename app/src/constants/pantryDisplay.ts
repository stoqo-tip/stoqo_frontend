export type PantryStockBand = 'empty' | 'low' | 'medium' | 'full';

export const PANTRY_STOCK_EMPTY_MAX = 0;
export const PANTRY_STOCK_LOW_MAX = 1;
export const PANTRY_STOCK_MEDIUM_MAX = 2;
export const PANTRY_STOCK_FULL_MIN = 3;

export const PANTRY_STOCK_ORDER: PantryStockBand[] = [
   'empty',
   'low',
   'medium',
   'full',
];

export const PANTRY_STOCK_META: Record<
   PantryStockBand,
   {
      label: string;
      chipBackground: string;
   }
> = {
   empty: {
      label: 'Nada',
      chipBackground: '#ECE7DD',
   },
   low: {
      label: 'Poco',
      chipBackground: '#F6E2C8',
   },
   medium: {
      label: 'Medio',
      chipBackground: '#F2EDC9',
   },
   full: {
      label: 'Mucho',
      chipBackground: '#DDECD7',
   },
};

export function getPantryStockBand(quantity: number): PantryStockBand {
   if (quantity >= PANTRY_STOCK_FULL_MIN) {
      return 'full';
   }

   if (quantity === PANTRY_STOCK_MEDIUM_MAX) {
      return 'medium';
   }

   if (quantity === PANTRY_STOCK_LOW_MAX) {
      return 'low';
   }

   return 'empty';
}
