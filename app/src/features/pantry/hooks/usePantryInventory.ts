import {useFocusEffect,} from '@react-navigation/native';
import {useCallback,useState,} from 'react';

import {deletePantryItem,fetchPantryItems,} from '../../../services';
import type {PantryItem} from '../../../types';

type UsePantryInventoryResult = {
   items: PantryItem[];
   isLoading: boolean;
   loadError: string | null;
   refreshPantry: () => Promise<PantryItem[]>;
   handleDeleteItem: (productCode: string) => Promise<void>;
};

export function usePantryInventory(): UsePantryInventoryResult {
   const [items, setItems] = useState<PantryItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [loadError, setLoadError] = useState<string | null>(null);

   const refreshPantry = useCallback(async (): Promise<PantryItem[]> => {
      const pantryItems = await fetchPantryItems();

      setItems(pantryItems);
      setLoadError(null);

      return pantryItems;
   }, []);

   useFocusEffect(
      useCallback(() => {
         let isMounted = true;

         async function loadPantry() {
            setIsLoading(true);
            setLoadError(null);

            try {
               const pantryItems = await fetchPantryItems();
               if (isMounted) setItems(pantryItems);
            } catch {
               if (isMounted) setLoadError('No pudimos cargar tu despensa.');
            } finally {
               if (isMounted) setIsLoading(false);
            }
         }

         loadPantry();

         return () => {
            isMounted = false;
         };
      }, []),
   );

   const handleDeleteItem = useCallback(async (productCode: string): Promise<void> => {
      setItems(prev => prev.filter(item => item.productCode !== productCode));

      try {
         await deletePantryItem(productCode);
      } catch {
         const pantryItems = await fetchPantryItems().catch(() => null);
         if (pantryItems) setItems(pantryItems);
      }
   }, []);

   return {
      items,
      isLoading,
      loadError,
      refreshPantry,
      handleDeleteItem,
   };
}
