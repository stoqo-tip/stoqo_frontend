import { API_BASE_URL } from '../config/api';
import { clearAuthToken, getAuthHeaders, saveAuthToken } from './authTokenStorage';

export type AuthUser = {
   id: number;
   email: string;
};

export type AuthSession = {
   accessToken: string;
   user: AuthUser;
};

type AuthResponse = {
   access_token: string;
   token_type: string;
   user: AuthUser;
};

function toAuthSession(response: AuthResponse): AuthSession {
   return {
      accessToken: response.access_token,
      user: response.user,
   };
}

export async function registerWithEmail(
   email: string,
   password: string,
): Promise<AuthSession> {
   const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
   });

   if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
   }

   const data = (await response.json()) as AuthResponse;
   await saveAuthToken(data.access_token);
   return toAuthSession(data);
}

export async function loginWithEmail(
   email: string,
   password: string,
): Promise<AuthSession> {
   const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
   });

   if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
   }

   const data = (await response.json()) as AuthResponse;
   await saveAuthToken(data.access_token);
   return toAuthSession(data);
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
   const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: await getAuthHeaders(),
   });

   if (response.status === 401) {
      await clearAuthToken();
      return null;
   }

   if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
   }

   return response.json() as Promise<AuthUser>;
}

export async function logout(): Promise<void> {
   await clearAuthToken();
}
