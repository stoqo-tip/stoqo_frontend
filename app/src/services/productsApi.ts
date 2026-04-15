export type ProductLookupResult = {
  found: boolean;
  product: {
    barcode: string;
    name: string | null;
    brand: string | null;
    image_url: string | null;
    category: string;
  } | null;
};

import { API_BASE_URL } from '../config/api';

export async function fetchProductByBarcode(
  barcode: string,
): Promise<ProductLookupResult> {
  const response = await fetch(
    `${API_BASE_URL}/open-food-facts/${barcode}`,
  );

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json() as Promise<ProductLookupResult>;
}
