import TextRecognition from '@react-native-ml-kit/text-recognition';

export type ProductCaptureOcrTarget = 'front' | 'nutrition';

type ExtractProductCaptureTextFromPhotoParams = {
   photoPath: string;
   target: ProductCaptureOcrTarget;
};

function buildMlKitImageUri(photoPath: string): string {
   if (photoPath.startsWith('file://') || photoPath.startsWith('content://')) {
      return photoPath;
   }

   return `file://${photoPath}`;
}

async function recognizeText(imageUri: string): Promise<string> {
   const result = await TextRecognition.recognize(imageUri);

   return result.text.trim();
}

export async function extractProductCaptureTextFromPhoto({photoPath,}: ExtractProductCaptureTextFromPhotoParams): Promise<string> {
   const imageUri = buildMlKitImageUri(photoPath);
   const textFromUri = await recognizeText(imageUri);

   if (textFromUri.length > 0 || imageUri === photoPath) {
      return textFromUri;
   }

   return recognizeText(photoPath);
}
