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

const API_BASE_URL = 'http://127.0.0.1:8000';
const DEFAULT_USER_ID = 1;

export async function fetchProductByBarcode(
  barcode: string,
): Promise<ProductLookupResult> {
  const response = await fetch(
    `${API_BASE_URL}/open-food-facts/${barcode}?user_id=${DEFAULT_USER_ID}`,
  );

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json() as Promise<ProductLookupResult>;
}
