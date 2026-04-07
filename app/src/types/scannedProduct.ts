export type ScannedProductItem = {
  barcode: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  category: string;
  quantity: number;
};
