import type { PantryItem, ScannedProductItem } from '../types';

import { API_BASE_URL } from '../config/api';

const DEFAULT_USER_ID = 1;

type PantryItemsResponse = {
   items: Array<{
      product_code: string;
      name: string;
      brand: string | null;
      quantity: number | null;
      unit: string | null;
   }>;
};

export async function fetchPantryItems(): Promise<PantryItem[]> {
   const response = await fetch(
      `${API_BASE_URL}/pantry/users/${DEFAULT_USER_ID}/items`,
   );

   if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
   }

   const data = (await response.json()) as PantryItemsResponse;

   return data.items.map(item => ({
      productCode: item.product_code,
      name: item.name,
      brand: item.brand,
      quantity: item.quantity ?? 0,
      unit: item.unit,
   }));
}

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
