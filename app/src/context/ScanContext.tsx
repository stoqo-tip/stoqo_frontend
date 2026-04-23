import React, { createContext, useContext, useState } from 'react';

import { saveScannedItemsToPantry } from '../services';
import type { ScannedProductItem } from '../types';

type ScanContextValue = {
  scannedItems: ScannedProductItem[];
  isSaving: boolean;
  saveError: string | null;
  showSuccess: boolean;
  addItem: (item: ScannedProductItem) => void;
  incrementQuantity: (barcode: string) => void;
  decrementQuantity: (barcode: string) => void;
  removeItem: (barcode: string) => void;
  confirmItems: () => Promise<void>;
  resetScan: () => void;
};

const ScanContext = createContext<ScanContextValue | null>(null);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [scannedItems, setScannedItems] = useState<ScannedProductItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const addItem = (item: ScannedProductItem) => {
    setScannedItems(prev => {
      if (prev.some(existing => existing.barcode === item.barcode)) return prev;
      return [...prev, item];
    });
  };

  const incrementQuantity = (barcode: string) => {
    setScannedItems(prev =>
      prev.map(item =>
        item.barcode === barcode ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decrementQuantity = (barcode: string) => {
    setScannedItems(prev =>
      prev.map(item =>
        item.barcode === barcode
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  };

  const removeItem = (barcode: string) => {
    setScannedItems(prev => prev.filter(item => item.barcode !== barcode));
  };

  const confirmItems = async () => {
    if (scannedItems.length === 0 || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await saveScannedItemsToPantry(scannedItems);
      setShowSuccess(true);
    } catch {
      setSaveError('No pudimos guardar los productos en la alacena.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetScan = () => {
    setScannedItems([]);
    setShowSuccess(false);
    setSaveError(null);
  };

  return (
    <ScanContext.Provider
      value={{
        scannedItems,
        isSaving,
        saveError,
        showSuccess,
        addItem,
        incrementQuantity,
        decrementQuantity,
        removeItem,
        confirmItems,
        resetScan,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScanContext(): ScanContextValue {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScanContext must be used within ScanProvider');
  return ctx;
}
