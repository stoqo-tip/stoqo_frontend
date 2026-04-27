import {useState,} from 'react';

import type {PantryItem} from '../../../types';
import {applyPendingStockEdits,filterPantryItems,groupPantryItemsByStockBand,hasPendingPantryStockEdits,} from '../model';
import {usePantryInventory,} from './usePantryInventory';
import {usePantryStockEditConfirmation,} from './usePantryStockEditConfirmation';
import {usePantryStockEditSession,} from './usePantryStockEditSession';

type UsePantryHomeParams = {
   onSaveSuccess: () => void;
};

export function usePantryHome({onSaveSuccess,}: UsePantryHomeParams) {
   const {items,isLoading,loadError,refreshPantry,handleDeleteItem,} = usePantryInventory();
   const [searchText, setSearchText] = useState('');
   const {
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
   } = usePantryStockEditSession();

   const filteredItems = filterPantryItems(items, searchText);

   const displayedItems = applyPendingStockEdits({
      items: filteredItems,
      pendingUsedByTypeCode,
      pendingFinishedByTypeCode,
   });

   const groupedItems = groupPantryItemsByStockBand(displayedItems);

   const hasPendingChanges = hasPendingPantryStockEdits({
      pendingUsedByTypeCode,
      pendingFinishedByTypeCode,
   });

   const {isPersistingEdits,handleConfirmEditMode,} = usePantryStockEditConfirmation({
      pendingUsedByTypeCode,
      pendingFinishedByTypeCode,
      hasPendingChanges,
      refreshPantry,
      resetEditSession,
      onSuccess: onSaveSuccess,
   });

   const handleInventoryItemPress = (item: PantryItem) => {
      if (isPersistingEdits) return;
      handlePantryItemPress(item);
   };

   return {
      items,
      filteredItems,
      groupedItems,
      isLoading,
      loadError,
      searchText,
      setSearchText,
      isEditing,
      activeEditAction,
      setActiveEditAction,
      isPersistingEdits,
      hasPendingChanges,
      pendingUsedByTypeCode,
      pendingFinishedByTypeCode,
      handleEnterEditMode,
      handleCancelEditMode,
      handleInventoryItemPress,
      handleUndoLastAction,
      handleConfirmEditMode,
      handleDeleteItem,
   };
}
