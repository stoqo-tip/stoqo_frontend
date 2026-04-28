import { API_BASE_URL } from '../config/api';

export type ProductCaptureNutrition = {
  energy_kcal_100g: number | null;
  proteins_100g: number | null;
  carbohydrates_100g: number | null;
  sugars_100g: number | null;
  fat_100g: number | null;
  sodium_100g: number | null;
};

export type ProductCaptureParseRequest = {
  barcode: string;
  front_text: string;
  nutrition_text: string;
  source: 'ML_KIT';
};

export type ProductCaptureParsed = {
  barcode: string;
  brand: string | null;
  name: string | null;
  quantity_raw: string | null;
  quantity_value: number | null;
  quantity_unit: string | null;
  nutrition: ProductCaptureNutrition;
  warnings: string[];
  needs_review: boolean;
};

export type ProductCaptureCreateRequest = ProductCaptureParsed & {
  front_text: string;
  nutrition_text: string;
  source: 'ML_KIT';
};

export type ProductCaptureCreateResponse = {
  id: number;
  status: string;
};

export async function parseProductCapture(
  payload: ProductCaptureParseRequest,
): Promise<ProductCaptureParsed> {
  const response = await fetch(`${API_BASE_URL}/product-captures/parse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json() as Promise<ProductCaptureParsed>;
}

export async function submitProductCapture(
  payload: ProductCaptureCreateRequest,
): Promise<ProductCaptureCreateResponse> {
  const response = await fetch(`${API_BASE_URL}/product-captures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json() as Promise<ProductCaptureCreateResponse>;
}
