import type {
   ProductCaptureNutrition,
   ProductCaptureParsed,
} from '../../../services';

export type ProductCaptureNutritionDraft = Record<
   keyof ProductCaptureNutrition,
   string
>;

export type ProductCaptureNutritionField = {
   key: keyof ProductCaptureNutrition;
   label: string;
};

export const EMPTY_PRODUCT_CAPTURE_NUTRITION: ProductCaptureNutrition = {
   energy_kcal_100g: null,
   proteins_100g: null,
   carbohydrates_100g: null,
   sugars_100g: null,
   fat_100g: null,
   sodium_100g: null,
};

export const PRODUCT_CAPTURE_NUTRITION_FIELDS: ProductCaptureNutritionField[] = [
   { key: 'energy_kcal_100g', label: 'Kcal cada 100 g' },
   { key: 'proteins_100g', label: 'Proteinas' },
   { key: 'carbohydrates_100g', label: 'Carbohidratos' },
   { key: 'sugars_100g', label: 'Azucares' },
   { key: 'fat_100g', label: 'Grasas' },
   { key: 'sodium_100g', label: 'Sodio' },
];

export const EMPTY_PRODUCT_CAPTURE_NUTRITION_DRAFT: ProductCaptureNutritionDraft = {
   energy_kcal_100g: '',
   proteins_100g: '',
   carbohydrates_100g: '',
   sugars_100g: '',
   fat_100g: '',
   sodium_100g: '',
};

export function nullableNumberToText(value: number | null | undefined): string {
   return value == null ? '' : String(value);
}

export function textToNullableNumber(value: string): number | null {
   const normalizedValue = value.trim().replace(',', '.');

   if (!normalizedValue) {
      return null;
   }

   const numericValue = Number(normalizedValue);
   return Number.isNaN(numericValue) ? null : numericValue;
}

export function buildInitialProductCaptureParsed(
   barcode: string,
): ProductCaptureParsed {
   return {
      barcode,
      brand: null,
      name: null,
      quantity_raw: null,
      quantity_value: null,
      quantity_unit: null,
      nutrition: EMPTY_PRODUCT_CAPTURE_NUTRITION,
      warnings: [],
      needs_review: true,
   };
}

export function buildProductCaptureNutritionFromDraft(
   nutritionDraft: ProductCaptureNutritionDraft,
): ProductCaptureNutrition {
   return PRODUCT_CAPTURE_NUTRITION_FIELDS.reduce<ProductCaptureNutrition>(
      (accumulator, field) => ({
         ...accumulator,
         [field.key]: textToNullableNumber(nutritionDraft[field.key]),
      }),
      { ...EMPTY_PRODUCT_CAPTURE_NUTRITION },
   );
}

export function buildProductCaptureNutritionDraft(
   nutrition: ProductCaptureNutrition,
): ProductCaptureNutritionDraft {
   return {
      energy_kcal_100g: nullableNumberToText(nutrition.energy_kcal_100g),
      proteins_100g: nullableNumberToText(nutrition.proteins_100g),
      carbohydrates_100g: nullableNumberToText(nutrition.carbohydrates_100g),
      sugars_100g: nullableNumberToText(nutrition.sugars_100g),
      fat_100g: nullableNumberToText(nutrition.fat_100g),
      sodium_100g: nullableNumberToText(nutrition.sodium_100g),
   };
}
