import React from 'react';
import {Pressable,StyleSheet,Text,TextInput,View,} from 'react-native';

type Props = {
   searchText: string;
   isEditing: boolean;
   onSearchTextChange: (text: string) => void;
   onAnalysisPress: () => void;
   onLogoutPress: () => void;
};

export function PantryHomeHeader({searchText,isEditing,onSearchTextChange,onAnalysisPress,onLogoutPress,}: Props): React.JSX.Element {
   return (
      <>
         <View style={styles.header}>
            <Text style={styles.title}>Mi despensa</Text>

            <View style={styles.actions}>
               <Pressable
                  onPress={onAnalysisPress}
                  hitSlop={10}
                  disabled={isEditing}
               >
                  <Text style={[styles.actionLink,isEditing ? styles.actionLinkDisabled : null]}>
                     Mis habitos
                  </Text>
               </Pressable>

               <Pressable
                  onPress={onLogoutPress}
                  hitSlop={10}
                  disabled={isEditing}
               >
                  <Text style={[styles.logoutLink,isEditing ? styles.actionLinkDisabled : null]}>
                     Salir
                  </Text>
               </Pressable>
            </View>
         </View>

         <View style={styles.searchWrap}>
            <TextInput
               value={searchText}
               onChangeText={onSearchTextChange}
               placeholder="Buscar producto..."
               placeholderTextColor="#B0A898"
               style={styles.searchInput}
            />
         </View>
      </>
   );
}

const styles = StyleSheet.create({
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#EDE6DC',
   },
   title: {
      fontSize: 26,
      fontWeight: '800',
      color: '#1A0E08',
      letterSpacing: -0.5,
   },
   actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
   },
   actionLink: {
      fontSize: 14,
      fontWeight: '600',
      color: '#C8392B',
   },
   logoutLink: {
      fontSize: 14,
      fontWeight: '600',
      color: '#756A5F',
   },
   actionLinkDisabled: {
      color: '#C9B8AA',
   },
   searchWrap: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#EDE6DC',
   },
   searchInput: {
      height: 44,
      borderRadius: 999,
      backgroundColor: '#FFFFFF',
      borderWidth: 1.5,
      borderColor: '#DDD5C8',
      paddingHorizontal: 18,
      color: '#1A0E08',
      fontSize: 16,
   },
});
