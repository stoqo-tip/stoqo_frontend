import {useState,type Dispatch,type SetStateAction,} from 'react';
import type {PantryItem} from '../../../types';

export type PantryStockEditAction = 'used' | 'finished' | 'adjust';

type ActionHistoryEntry =
   | {
      kind: 'used';
      productTypeCode: string;
   }
   | {
      kind: 'finished';
      productTypeCode: string;
      previousUsedCount: number;
   };


type UsePantryStockEditSessionResult = {
   isEditing: boolean;
   activeEditAction: PantryStockEditAction;
   setActiveEditAction: Dispatch<SetStateAction<PantryStockEditAction>>;
   pendingUsedByTypeCode: Record<string, number>;
   pendingFinishedByTypeCode: Record<string, true>;
   handleEnterEditMode: () => void;
   handleCancelEditMode: () => void;
   handlePantryItemPress: (item: PantryItem) => void;
   handleUndoLastAction: () => void;
   resetEditSession: () => void;
};

export const PANTRY_STOCK_EDIT_ACTIONS: Array<{key: PantryStockEditAction; label: string}> = [
   {key: 'used', label: 'Usé'},
   {key: 'finished', label: 'Se termino'},
   {key: 'adjust', label: 'Ajustar'},
];

export function usePantryStockEditSession(): UsePantryStockEditSessionResult {
   const [isEditing, setIsEditing] = useState(false);
   const [activeEditAction, setActiveEditAction] = useState<PantryStockEditAction>('used');
   const [pendingUsedByTypeCode, setPendingUsedByTypeCode] = useState<Record<string, number>>({});
   const [pendingFinishedByTypeCode, setPendingFinishedByTypeCode] = useState<Record<string, true>>({});
   const [actionHistory, setActionHistory] = useState<ActionHistoryEntry[]>([]);

   const resetEditSession = () => {
      setActiveEditAction('used');
      setPendingUsedByTypeCode({});
      setPendingFinishedByTypeCode({});
      setActionHistory([]);
      setIsEditing(false);
   };

   const handleEnterEditMode = () => {
      setActiveEditAction('used');
      setPendingUsedByTypeCode({});
      setPendingFinishedByTypeCode({});
      setActionHistory([]);
      setIsEditing(true);
   };

   const handleCancelEditMode = () => {
      resetEditSession();
   };

   const handlePantryItemPress = (item: PantryItem) => {
      if (!isEditing) return;
      const productTypeCode = item.productTypeCode;
      if (!productTypeCode) return;
      if (item.quantity <= 0) return;

      if (activeEditAction === 'used') {
         setPendingUsedByTypeCode(prev => ({
            ...prev,
            [productTypeCode]: (prev[productTypeCode] ?? 0) + 1,
         }));

         setActionHistory(prev => [
            ...prev,
            {kind: 'used', productTypeCode},
         ]);

         return;
      }

      if (activeEditAction === 'finished') {
         const previousUsedCount = pendingUsedByTypeCode[productTypeCode] ?? 0;

         setPendingFinishedByTypeCode(prev => ({
            ...prev,
            [productTypeCode]: true,
         }));

         setPendingUsedByTypeCode(prev => {
            if (!(productTypeCode in prev)) return prev;

            const rest = {...prev};
            delete rest[productTypeCode];
            return rest;
         });

         setActionHistory(prev => [
            ...prev,
            {kind: 'finished', productTypeCode, previousUsedCount},
         ]);
      }
   };

   const handleUndoLastAction = () => {

      const lastAction = actionHistory[actionHistory.length - 1];
      if (!lastAction) return;

      if (lastAction.kind === 'used') {
         setPendingUsedByTypeCode(prev => {
            const current = prev[lastAction.productTypeCode] ?? 0;

            if (current <= 1) {
               const rest = {...prev};
               delete rest[lastAction.productTypeCode];
               return rest;
            }

            return {
               ...prev,
               [lastAction.productTypeCode]: current - 1,
            };
         });
      }

      if (lastAction.kind === 'finished') {
         setPendingFinishedByTypeCode(prev => {
            const rest = {...prev};
            delete rest[lastAction.productTypeCode];
            return rest;
         });

         setPendingUsedByTypeCode(prev => {
            if (lastAction.previousUsedCount <= 0) return prev;

            return {
               ...prev,
               [lastAction.productTypeCode]: lastAction.previousUsedCount,
            };
         });
      }

      setActionHistory(prev => prev.slice(0, -1));
   };

   return {
      isEditing,
      activeEditAction,
      setActiveEditAction,
      pendingUsedByTypeCode,
      pendingFinishedByTypeCode,
      handleEnterEditMode,
      handleCancelEditMode,
      handlePantryItemPress,
      handleUndoLastAction,
      resetEditSession,
   };
}
