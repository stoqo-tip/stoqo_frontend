import type { PantryState } from '../screens';
import type { PantryItem, ScannedProductItem } from '../types';

import { API_BASE_URL } from '../config/api';
import { PANTRY_CATEGORIES } from '../constants';
import { getAuthHeaders } from './authTokenStorage';

const ONBOARDING_PRODUCTS = new Map(
   PANTRY_CATEGORIES.flatMap(category =>
      category.products.map(product => [product.id, product] as const),
   ),
);

function getOnboardingUnitLabel(
   productTypeCode: string,
   units: number,
): string | null {
   const product = ONBOARDING_PRODUCTS.get(productTypeCode);
   const unitLabel = product?.unitLabel;

   if (!unitLabel) {
      return null;
   }

   return units === 1 ? unitLabel.singular : unitLabel.plural;
}

type PantryItemsResponse = {
   items: Array<{
      product_code: string;
      product_type_code: string | null;
      name: string;
      brand: string | null;
      quantity: number | null;
      unit: string | null;
   }>;
};

type ConfirmPantryStockEditsRequest = {
   items: Array<{
      product_type_code: string;
      used_count?: number;
      finished?: boolean;
   }>;
};

export async function fetchPantryItems(): Promise<PantryItem[]> {
   const response = await fetch(`${API_BASE_URL}/pantry/me/items`, {
      headers: await getAuthHeaders(),
   });

   if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
   }

   const data = (await response.json()) as PantryItemsResponse;

   return data.items.map(item => ({
      productCode: item.product_code,
      productTypeCode: item.product_type_code,
      name: item.name,
      brand: item.brand,
      quantity: item.quantity ?? 0,
      unit: item.unit,
   }));
}

export async function confirmPantryStockEdits(
   payload: ConfirmPantryStockEditsRequest,
): Promise<void> {
   const response = await fetch(`${API_BASE_URL}/pantry/me/items/confirm-stock-edits`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         ...(await getAuthHeaders()),
      },
      body: JSON.stringify(payload),
   });

   if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
   }
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

   const response = await fetch(`${API_BASE_URL}/pantry/me/items`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         ...(await getAuthHeaders()),
      },
      body: JSON.stringify(payload),
   });

   if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
   }
}

export async function deletePantryItem(productCode: string): Promise<void> {
   const response = await fetch(
      `${API_BASE_URL}/pantry/me/items/${encodeURIComponent(productCode)}`,
      {
         method: 'DELETE',
         headers: await getAuthHeaders(),
      },
   );

   if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
   }
}

export async function saveOnboardingItemsToPantry(
   pantry: PantryState,
): Promise<void> {
   const payload = {
      items: Object.entries(pantry).map(([productTypeCode, entry]) => ({
         product_type_code: productTypeCode,
         quantity: entry.units,
         unit: getOnboardingUnitLabel(productTypeCode, entry.units),
      })),
   };

   const response = await fetch(`${API_BASE_URL}/pantry/me/items`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         ...(await getAuthHeaders()),
      },
      body: JSON.stringify(payload),
   });

   if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
   }
}
