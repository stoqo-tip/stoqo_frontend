import * as Keychain from 'react-native-keychain';

const AUTH_TOKEN_SERVICE = 'stoqo.authToken';
const AUTH_TOKEN_USERNAME = 'authToken';

export async function saveAuthToken(token: string): Promise<void> {
   await Keychain.setGenericPassword(AUTH_TOKEN_USERNAME, token, {
      service: AUTH_TOKEN_SERVICE,
   });
}

export async function getAuthToken(): Promise<string | null> {
   const credentials = await Keychain.getGenericPassword({
      service: AUTH_TOKEN_SERVICE,
   });

   if (!credentials) {
      return null;
   }

   return credentials.password;
}

export async function clearAuthToken(): Promise<void> {
   await Keychain.resetGenericPassword({
      service: AUTH_TOKEN_SERVICE,
   });
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
   const token = await getAuthToken();

   if (!token) {
      return {};
   }

   return {
      Authorization: `Bearer ${token}`,
   };
}
