import { useNavigation, } from '@react-navigation/native';
import React, { useState, } from 'react';
import {StyleSheet,View,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SaveSuccessOverlay, } from '../components/molecules';
import { useScanContext } from '../context/ScanContext';
import { Routes, type RootStackNavigationProp } from '../navigation/types';
import { applyPendingStockEdits, filterPantryItems, groupPantryItemsByStockBand, hasPendingPantryStockEdits, } from '../features/pantry/model';
import { PANTRY_STOCK_EDIT_ACTIONS, usePantryInventory, usePantryStockEditConfirmation, usePantryStockEditSession, } from '../features/pantry/hooks';
import {PantryHomeBottomBar,PantryHomeHeader,PantryInventoryList,} from '../components/organisms';

export function HomeScreen(): React.JSX.Element {

  const navigation = useNavigation<RootStackNavigationProp>();
  const { resetScan } = useScanContext();

  const { items, isLoading, loadError, refreshPantry, handleDeleteItem, } = usePantryInventory();
  const [searchText, setSearchText] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
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

  const handleStartScanning = () => {
    resetScan();
    navigation.navigate(Routes.Scanner);
  };

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

  const { isPersistingEdits, handleConfirmEditMode, } = usePantryStockEditConfirmation({
    pendingUsedByTypeCode,
    pendingFinishedByTypeCode,
    hasPendingChanges,
    refreshPantry,
    resetEditSession,
    onSuccess: () => setShowSaveSuccess(true),
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shell}>
        <PantryHomeHeader
          searchText={searchText}
          isEditing={isEditing}
          onSearchTextChange={setSearchText}
          onAnalysisPress={() => navigation.navigate(Routes.Analysis)}
        />
        <PantryInventoryList
          items={items}
          filteredItems={filteredItems}
          groupedItems={groupedItems}
          isLoading={isLoading}
          loadError={loadError}
          isEditing={isEditing}
          pendingUsedByTypeCode={pendingUsedByTypeCode}
          pendingFinishedByTypeCode={pendingFinishedByTypeCode}
          onDeleteItem={handleDeleteItem}
          onItemPress={item => {
            if (isPersistingEdits) return;
            handlePantryItemPress(item);
          }}
        />

        <PantryHomeBottomBar
          isEditing={isEditing}
          isPersistingEdits={isPersistingEdits}
          actions={PANTRY_STOCK_EDIT_ACTIONS}
          activeAction={activeEditAction}
          hasPendingChanges={hasPendingChanges}
          onActionChange={setActiveEditAction}
          onUndo={handleUndoLastAction}
          onCancelEdit={handleCancelEditMode}
          onConfirmEdit={handleConfirmEditMode}
          onEnterEdit={handleEnterEditMode}
          onScan={handleStartScanning}
        />

      </View>

      <SaveSuccessOverlay
        visible={showSaveSuccess}
        label="Stock actualizado"
        onDone={() => setShowSaveSuccess(false)}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EDE6',
  },
  shell: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: '#FDFAF7',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E8E0D6',
    overflow: 'hidden',
    shadowColor: '#2A1A0E',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
