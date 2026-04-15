import type { ScannedProductItem } from '../types';

import { API_BASE_URL } from '../config/api';
const DEFAULT_USER_ID = 1;

export async function saveScannedItemsToPantry(
   items: ScannedProductItem[],
): Promise<void> {
   const payload = {
      items: items.map(item => ({
         product_code: item.barcode,
         quantity: item.quantity,
         unit: null,
      })),
   };

   const response = await fetch(
      `${API_BASE_URL}/pantry/users/${DEFAULT_USER_ID}/items`,
      {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(payload),
      },
   );

   if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
   }
}
