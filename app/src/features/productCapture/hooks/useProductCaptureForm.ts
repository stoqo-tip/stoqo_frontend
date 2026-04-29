import {useEffect,useMemo,useState,} from 'react';


import {
   buildInitialProductCaptureParsed,
   buildProductCaptureNutritionDraft,
   buildProductCaptureNutritionFromDraft,
   EMPTY_PRODUCT_CAPTURE_NUTRITION_DRAFT,
   nullableNumberToText,
   textToNullableNumber,
   type ProductCaptureNutritionDraft,
} from '../model';
import {
   parseProductCapture,
   submitProductCapture,
   type ProductCaptureNutrition,
   type ProductCaptureParsed,
} from '../../../services';

// Punto de integracion: reemplazar estos placeholders por OCR de ML Kit.
const MOCK_FRONT_TEXT = `Nescafe
Dolca Original
100 g`;

const MOCK_NUTRITION_TEXT = `Valor energetico 80 kcal
Proteinas 1.8 g
Carbohidratos 16 g
Azucares 14 g
Grasas totales 0.5 g
Sodio 40 mg`;

type UseProductCaptureFormParams = {
   barcode: string;
   frontPhotoPath?: string;
   nutritionPhotoPath?: string;
};

export function useProductCaptureForm({barcode, frontPhotoPath, nutritionPhotoPath,}: UseProductCaptureFormParams) {

   const [frontText, setFrontText] = useState('');
   const [nutritionText, setNutritionText] = useState('');
   const [parsed, setParsed] = useState<ProductCaptureParsed>(() =>
      buildInitialProductCaptureParsed(barcode),
   );
   const [brand, setBrand] = useState('');
   const [name, setName] = useState('');
   const [quantityRaw, setQuantityRaw] = useState('');
   const [quantityValue, setQuantityValue] = useState('');
   const [quantityUnit, setQuantityUnit] = useState('');
   const [nutritionDraft, setNutritionDraft] = useState<ProductCaptureNutritionDraft>(
      EMPTY_PRODUCT_CAPTURE_NUTRITION_DRAFT,
   );
   const [isParsing, setIsParsing] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [successMessage, setSuccessMessage] = useState<string | null>(null);

   const canParse = frontText.trim().length > 0 || nutritionText.trim().length > 0;
   const canSave = name.trim().length > 0 && !isSaving;

   const nutrition = useMemo<ProductCaptureNutrition>(
      () => buildProductCaptureNutritionFromDraft(nutritionDraft),
      [nutritionDraft],
   );

      useEffect(() => {
      if (frontPhotoPath && frontText.length === 0) {
         setFrontText(MOCK_FRONT_TEXT);
      }
   }, [frontPhotoPath,frontText.length,]);

   useEffect(() => {
      if (nutritionPhotoPath && nutritionText.length === 0) {
         setNutritionText(MOCK_NUTRITION_TEXT);
      }
   }, [nutritionPhotoPath,nutritionText.length,]);


   function applyParsedCapture(nextParsed: ProductCaptureParsed): void {
      setParsed(nextParsed);
      setBrand(nextParsed.brand ?? '');
      setName(nextParsed.name ?? '');
      setQuantityRaw(nextParsed.quantity_raw ?? '');
      setQuantityValue(nullableNumberToText(nextParsed.quantity_value));
      setQuantityUnit(nextParsed.quantity_unit ?? '');
      setNutritionDraft(buildProductCaptureNutritionDraft(nextParsed.nutrition));
   }

   async function handleParse(): Promise<void> {
      setIsParsing(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
         const nextParsed = await parseProductCapture({
            barcode,
            front_text: frontText,
            nutrition_text: nutritionText,
            source: 'ML_KIT',
         });
         applyParsedCapture(nextParsed);
      } catch {
         setErrorMessage('No se pudo procesar la captura.');
      } finally {
         setIsParsing(false);
      }
   }

   async function handleSave(): Promise<void> {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
         const response = await submitProductCapture({
            ...parsed,
            barcode,
            brand: brand.trim() || null,
            name: name.trim() || null,
            quantity_raw: quantityRaw.trim() || null,
            quantity_value: textToNullableNumber(quantityValue),
            quantity_unit: quantityUnit.trim() || null,
            nutrition,
            front_text: frontText,
            nutrition_text: nutritionText,
            source: 'ML_KIT',
            needs_review: true,
         });

         setSuccessMessage(`Solicitud #${response.id} guardada`);
      } catch {
         setErrorMessage('No se pudo guardar la solicitud.');
      } finally {
         setIsSaving(false);
      }
   }

   return {
      barcode,
      frontText,
      nutritionText,
      parsed,
      brand,
      name,
      quantityRaw,
      quantityValue,
      quantityUnit,
      nutritionDraft,
      isParsing,
      isSaving,
      errorMessage,
      successMessage,
      canParse,
      canSave,
      setBrand,
      setName,
      setQuantityRaw,
      setQuantityValue,
      setQuantityUnit,
      setNutritionDraft,
      handleParse,
      handleSave,
   };
}
