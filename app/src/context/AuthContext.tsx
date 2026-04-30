import React, { createContext, useContext, useEffect, useState } from 'react';

import {
   type AuthUser,
   fetchCurrentUser,
   loginWithEmail,
   logout as logoutFromApi,
   registerWithEmail,
} from '../services';

type AuthContextValue = {
   user: AuthUser | null;
   isLoading: boolean;
   authError: string | null;
   isAuthenticated: boolean;
   login: (email: string,password: string,) => Promise<void>;
   register: (email: string,password: string,) => Promise<void>;
   logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<AuthUser | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [authError, setAuthError] = useState<string | null>(null);

   useEffect(() => {
      let isMounted = true;

      async function loadSession() {
         try {
            const currentUser = await fetchCurrentUser();
            if (isMounted) {
               setUser(currentUser);
            }
         } catch {
            if (isMounted) {
               setUser(null);
            }
         } finally {
            if (isMounted) {
               setIsLoading(false);
            }
         }
      }

      loadSession();

      return () => {
         isMounted = false;
      };
   }, []);

   const login = async (email: string,password: string,) => {
      setIsLoading(true);
      setAuthError(null);

      try {
         const session = await loginWithEmail(email, password);
         setUser(session.user);
      } catch {
         setAuthError('No pudimos iniciar sesion.');
         throw new Error('Login failed');
      } finally {
         setIsLoading(false);
      }
   };

   const register = async (email: string,password: string,) => {
      setIsLoading(true);
      setAuthError(null);

      try {
         const session = await registerWithEmail(email, password);
         setUser(session.user);
      } catch {
         setAuthError('No pudimos crear la cuenta.');
         throw new Error('Register failed');
      } finally {
         setIsLoading(false);
      }
   };

   const logout = async () => {
      setIsLoading(true);
      setAuthError(null);

      try {
         await logoutFromApi();
         setUser(null);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            isLoading,
            authError,
            isAuthenticated: user !== null,
            login,
            register,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}

export function useAuthContext(): AuthContextValue {
   const ctx = useContext(AuthContext);

   if (!ctx) {
      throw new Error('useAuthContext must be used within AuthProvider');
   }

   return ctx;
}
