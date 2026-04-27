import {useCallback,useState,} from 'react';

import {confirmPantryStockEdits,} from '../../../services';
import {buildPantryStockEditItems,} from '../model';
import type {PantryItem} from '../../../types';

type UsePantryStockEditConfirmationParams = {
   pendingUsedByTypeCode: Record<string, number>;
   pendingFinishedByTypeCode: Record<string, true>;
   hasPendingChanges: boolean;
   refreshPantry: () => Promise<PantryItem[]>;
   resetEditSession: () => void;
   onSuccess: () => void;
};

type UsePantryStockEditConfirmationResult = {
   isPersistingEdits: boolean;
   handleConfirmEditMode: () => Promise<void>;
};

export function usePantryStockEditConfirmation({pendingUsedByTypeCode,pendingFinishedByTypeCode,hasPendingChanges,refreshPantry,resetEditSession,onSuccess,}: UsePantryStockEditConfirmationParams): UsePantryStockEditConfirmationResult {
   const [isPersistingEdits, setIsPersistingEdits] = useState(false);

   const handleConfirmEditMode = useCallback(async (): Promise<void> => {
      if (!hasPendingChanges || isPersistingEdits) return;

      setIsPersistingEdits(true);

      try {
         await confirmPantryStockEdits({
            items: buildPantryStockEditItems({
               pendingUsedByTypeCode,
               pendingFinishedByTypeCode,
            }),
         });

         await refreshPantry();
         resetEditSession();
         onSuccess();
      } catch {
         await refreshPantry().catch(() => undefined);
      } finally {
         setIsPersistingEdits(false);
      }
   }, [
      hasPendingChanges,
      isPersistingEdits,
      onSuccess,
      pendingFinishedByTypeCode,
      pendingUsedByTypeCode,
      refreshPantry,
      resetEditSession,
   ]);

   return {
      isPersistingEdits,
      handleConfirmEditMode,
   };
}
