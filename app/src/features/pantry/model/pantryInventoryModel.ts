import {getPantryStockBand,type PantryStockBand,} from '../../../constants';
import type {PantryItem} from '../../../types';

export type DisplayPantryItem = PantryItem & {
   pendingUsedCount: number;
   originalQuantity: number;
};

export type PantryStockGroups = Record<PantryStockBand, DisplayPantryItem[]>;

export type PendingPantryStockEditItem = {
   product_type_code: string;
   used_count?: number;
   finished?: boolean;
};

type PendingStockEditState = {
   pendingUsedByTypeCode: Record<string, number>;
   pendingFinishedByTypeCode: Record<string, true>;
};

export function filterPantryItems(items: PantryItem[],searchText: string,): PantryItem[] {
   const normalizedSearchText = searchText.trim().toLowerCase();

   if (!normalizedSearchText) return items;

   return items.filter(item =>
      `${item.name} ${item.brand ?? ''}`.toLowerCase().includes(normalizedSearchText),
   );
}

export function applyPendingStockEdits({items,pendingUsedByTypeCode,pendingFinishedByTypeCode,}: PendingStockEditState & {items: PantryItem[];}): DisplayPantryItem[] {
   return items.map(item => {
      const pendingUsedCount = item.productTypeCode
         ? (pendingUsedByTypeCode[item.productTypeCode] ?? 0)
         : 0;

      const isFinishedPending = item.productTypeCode
         ? Boolean(pendingFinishedByTypeCode[item.productTypeCode])
         : false;

      return {
         ...item,
         originalQuantity: item.quantity,
         quantity: isFinishedPending ? 0 : Math.max(item.quantity - pendingUsedCount, 0),
         pendingUsedCount,
      };
   });
}

export function groupPantryItemsByStockBand(items: DisplayPantryItem[],): PantryStockGroups {
   const groups: PantryStockGroups = {
      empty: [],
      low: [],
      medium: [],
      full: [],
   };

   for (const item of items) {
      groups[getPantryStockBand(item.originalQuantity)].push(item);
   }

   return groups;
}

export function hasPendingPantryStockEdits({pendingUsedByTypeCode,pendingFinishedByTypeCode,}: PendingStockEditState): boolean {
   return (
      Object.keys(pendingUsedByTypeCode).length > 0 ||
      Object.keys(pendingFinishedByTypeCode).length > 0
   );
}

export function buildPantryStockEditItems({pendingUsedByTypeCode,pendingFinishedByTypeCode,}: PendingStockEditState): PendingPantryStockEditItem[] {
   const usedItems = Object.entries(pendingUsedByTypeCode).map(
      ([productTypeCode, usedCount]) => ({
         product_type_code: productTypeCode,
         used_count: usedCount,
      }),
   );

   const finishedItems = Object.keys(pendingFinishedByTypeCode).map(
      productTypeCode => ({
         product_type_code: productTypeCode,
         finished: true,
      }),
   );

   return [...usedItems, ...finishedItems];
}

export function getPendingPantryStockLabel({item,pendingUsedByTypeCode,pendingFinishedByTypeCode,}: PendingStockEditState & {item: PantryItem;}): string | null {
   if (!item.productTypeCode) return null;

   if (pendingFinishedByTypeCode[item.productTypeCode]) return '0';

   const pendingUsedCount = pendingUsedByTypeCode[item.productTypeCode];

   return pendingUsedCount ? `-${pendingUsedCount}` : null;
}
