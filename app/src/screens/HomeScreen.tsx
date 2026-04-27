import { useNavigation, } from '@react-navigation/native';
import React, { useState, } from 'react';
import {StyleSheet,View,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SaveSuccessOverlay, } from '../components/molecules';
import { useScanContext } from '../context/ScanContext';
import { Routes, type RootStackNavigationProp } from '../navigation/types';
import { PANTRY_STOCK_EDIT_ACTIONS, usePantryHome, } from '../features/pantry/hooks';
import {PantryHomeBottomBar,PantryHomeHeader,PantryInventoryList,} from '../components/organisms';

export function HomeScreen(): React.JSX.Element {

  const navigation = useNavigation<RootStackNavigationProp>();
  const { resetScan } = useScanContext();

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const pantryHome = usePantryHome({
    onSaveSuccess: () => setShowSaveSuccess(true),
  });

  const handleStartScanning = () => {
    resetScan();
    navigation.navigate(Routes.Scanner);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shell}>
        <PantryHomeHeader
          searchText={pantryHome.searchText}
          isEditing={pantryHome.isEditing}
          onSearchTextChange={pantryHome.setSearchText}
          onAnalysisPress={() => navigation.navigate(Routes.Analysis)}
        />
        <PantryInventoryList
          items={pantryHome.items}
          filteredItems={pantryHome.filteredItems}
          groupedItems={pantryHome.groupedItems}
          isLoading={pantryHome.isLoading}
          loadError={pantryHome.loadError}
          isEditing={pantryHome.isEditing}
          pendingUsedByTypeCode={pantryHome.pendingUsedByTypeCode}
          pendingFinishedByTypeCode={pantryHome.pendingFinishedByTypeCode}
          onDeleteItem={pantryHome.handleDeleteItem}
          onItemPress={pantryHome.handleInventoryItemPress}
        />

        <PantryHomeBottomBar
          isEditing={pantryHome.isEditing}
          isPersistingEdits={pantryHome.isPersistingEdits}
          actions={PANTRY_STOCK_EDIT_ACTIONS}
          activeAction={pantryHome.activeEditAction}
          hasPendingChanges={pantryHome.hasPendingChanges}
          onActionChange={pantryHome.setActiveEditAction}
          onUndo={pantryHome.handleUndoLastAction}
          onCancelEdit={pantryHome.handleCancelEditMode}
          onConfirmEdit={pantryHome.handleConfirmEditMode}
          onEnterEdit={pantryHome.handleEnterEditMode}
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
