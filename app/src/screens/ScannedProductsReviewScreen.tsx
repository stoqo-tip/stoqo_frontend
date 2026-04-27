import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SaveSuccessOverlay, ScannedProductReviewRow } from '../components/molecules';
import { useScanContext } from '../context/ScanContext';
import { Routes, type RootStackNavigationProp } from '../navigation/types';

export function ScannedProductsReviewScreen(): React.JSX.Element {
  const navigation = useNavigation<RootStackNavigationProp>();
  const {
    scannedItems,
    isSaving,
    saveError,
    showSuccess,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    confirmItems,
    resetScan,
  } = useScanContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Pressable onPress={() => navigation.navigate(Routes.Scanner)} style={styles.topAction}>
            <Text style={styles.topActionText}>Volver</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate(Routes.Home)} style={styles.skipBtn}>
            <Text style={styles.skipText}>Inicio</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Productos escaneados</Text>
        <Text style={styles.subtitle}>
          Ajustá cantidades y deslizá a la izquierda para eliminar.
        </Text>
      </View>

      <FlatList
        data={scannedItems}
        keyExtractor={item => item.barcode}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ScannedProductReviewRow
            item={item}
            onIncrementQuantity={incrementQuantity}
            onDecrementQuantity={decrementQuantity}
            onRemoveItem={removeItem}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No hay productos escaneados</Text>
            <Text style={styles.emptySubtitle}>
              Escaneá al menos uno y después tocá finalizar.
            </Text>
          </View>
        }
      />

      <View style={styles.ctaContainer}>
        {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

        <Pressable
          onPress={confirmItems}
          disabled={scannedItems.length === 0 || isSaving}
          style={[
            styles.ctaBtn,
            (scannedItems.length === 0 || isSaving) && styles.ctaBtnDisabled,
          ]}
        >
          <Text style={styles.ctaText}>
            {isSaving ? 'Guardando...' : 'Guardar en alacena'}
          </Text>
        </Pressable>
      </View>

      <SaveSuccessOverlay
        visible={showSuccess}
        label="Guardado en la alacena"
        onDone={() => {
          resetScan();
          navigation.navigate(Routes.Home);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topAction: {
    paddingVertical: 6,
  },
  topActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C8392B',
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  skipText: {
    fontSize: 13,
    color: '#757575',
  },
  title: {
    marginTop: 14,
    fontSize: 30,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: '#757575',
    lineHeight: 21,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 100,
  },
  emptyState: {
    paddingTop: 80,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    color: '#222222',
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#666666',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FAFAF8',
    gap: 10,
  },
  errorText: {
    color: '#D14343',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  ctaBtn: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBtnDisabled: {
    backgroundColor: '#D0D0CC',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
