import { API_BASE_URL } from '../config/api';

export type ProductCaptureNutrition = {
  energy_kcal_100g: number | null;
  proteins_100g: number | null;
  carbohydrates_100g: number | null;
  sugars_100g: number | null;
  fat_100g: number | null;
  sodium_100g: number | null;
};

export type ProductCaptureSource = 'ML_KIT' | 'PADDLE_OCR';

export type ProductCaptureParseRequest = {
  barcode: string;
  front_text: string;
  nutrition_text: string;
  source: ProductCaptureSource;
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
  source: ProductCaptureSource;
};


export type ProductCaptureCreateResponse = {
  id: number;
  status: string;
};

export type ProductCaptureOcrResponse = {
  barcode: string;
  front_text: string;
  nutrition_text: string;
  source: 'PADDLE_OCR';
  warnings: string[];
};

export type ProductCaptureOcrRequest = {
  barcode: string;
  frontPhotoPath?: string;
  nutritionPhotoPath?: string;
};

function buildPhotoUri(photoPath: string): string {
  if (photoPath.startsWith('file://') || photoPath.startsWith('content://')) {
    return photoPath;
  }

  return `file://${photoPath}`;
}

function appendPhoto(
  formData: FormData,
  fieldName: 'front_image' | 'nutrition_image',
  photoPath?: string,
): void {
  if (!photoPath) {
    return;
  }

  formData.append(fieldName, {
    uri: buildPhotoUri(photoPath),
    name: `${fieldName}.jpg`,
    type: 'image/jpeg',
  } as unknown as Blob);
}

export async function extractProductCaptureOcr(
  payload: ProductCaptureOcrRequest,
): Promise<ProductCaptureOcrResponse> {
  const formData = new FormData();

  formData.append('barcode', payload.barcode);
  appendPhoto(formData, 'front_image', payload.frontPhotoPath);
  appendPhoto(formData, 'nutrition_image', payload.nutritionPhotoPath);

  const response = await fetch(`${API_BASE_URL}/product-captures/ocr`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json() as Promise<ProductCaptureOcrResponse>;
}

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


