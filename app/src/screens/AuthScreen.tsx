import React, { useState } from 'react';
import {
   KeyboardAvoidingView,
   Platform,
   Pressable,
   StatusBar,
   StyleSheet,
   Text,
   TextInput,
   View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthContext } from '../context/AuthContext';

type AuthMode = 'login' | 'register';

export function AuthScreen(): React.JSX.Element {
   const { authError, isLoading, login, register } = useAuthContext();
   const [mode, setMode] = useState<AuthMode>('login');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [localError, setLocalError] = useState<string | null>(null);

   const isRegister = mode === 'register';
   const title = isRegister ? 'Crear cuenta' : 'Iniciar sesion';
   const submitLabel = isRegister ? 'Registrarme' : 'Entrar';

   const handleSubmit = async () => {
      if (isLoading) return;

      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail || !password) {
         setLocalError('Completá email y contraseña.');
         return;
      }

      if (password.length < 8) {
         setLocalError('La contraseña debe tener al menos 8 caracteres.');
         return;
      }

      setLocalError(null);

      try {
         if (isRegister) {
            await register(normalizedEmail, password);
         } else {
            await login(normalizedEmail, password);
         }
      } catch {
         // AuthContext exposes the user-facing error.
      }
   };

   const toggleMode = () => {
      setMode(current => (current === 'login' ? 'register' : 'login'));
      setLocalError(null);
   };

   return (
      <SafeAreaView style={styles.safe}>
         <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboard}
         >
            <View style={styles.container}>
               <View style={styles.header}>
                  <Text style={styles.brand}>STOQO</Text>
                  <Text style={styles.title}>{title}</Text>
               </View>

               <View style={styles.form}>
                  <TextInput
                     value={email}
                     onChangeText={setEmail}
                     autoCapitalize="none"
                     autoCorrect={false}
                     keyboardType="email-address"
                     placeholder="Email"
                     placeholderTextColor="#8E8E8E"
                     style={styles.input}
                  />

                  <TextInput
                     value={password}
                     onChangeText={setPassword}
                     autoCapitalize="none"
                     autoCorrect={false}
                     secureTextEntry
                     placeholder="Contraseña"
                     placeholderTextColor="#8E8E8E"
                     style={styles.input}
                  />

                  {localError || authError ? (
                     <Text style={styles.errorText}>{localError ?? authError}</Text>
                  ) : null}

                  <Pressable
                     onPress={handleSubmit}
                     disabled={isLoading}
                     style={[styles.submitButton, isLoading && styles.disabledButton]}
                  >
                     <Text style={styles.submitText}>
                        {isLoading ? 'Procesando...' : submitLabel}
                     </Text>
                  </Pressable>

                  <Pressable onPress={toggleMode} disabled={isLoading} style={styles.linkButton}>
                     <Text style={styles.linkText}>
                        {isRegister ? 'Ya tengo cuenta' : 'Crear cuenta nueva'}
                     </Text>
                  </Pressable>
               </View>
            </View>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   safe: {
      flex: 1,
      backgroundColor: '#FAFAF8',
   },
   keyboard: {
      flex: 1,
   },
   container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
   },
   header: {
      marginBottom: 28,
   },
   brand: {
      fontSize: 16,
      fontWeight: '800',
      color: '#1A1A2E',
      marginBottom: 8,
   },
   title: {
      fontSize: 30,
      fontWeight: '700',
      color: '#1A1A2E',
   },
   form: {
      gap: 12,
   },
   input: {
      minHeight: 52,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#D8D8D2',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 14,
      color: '#1A1A2E',
      fontSize: 16,
   },
   errorText: {
      color: '#B33A3A',
      fontSize: 13,
   },
   submitButton: {
      minHeight: 52,
      borderRadius: 12,
      backgroundColor: '#1A1A2E',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
   },
   disabledButton: {
      backgroundColor: '#B9B9B2',
   },
   submitText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
   },
   linkButton: {
      alignItems: 'center',
      paddingVertical: 12,
   },
   linkText: {
      color: '#1A1A2E',
      fontSize: 14,
      fontWeight: '600',
   },
});
