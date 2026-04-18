import { browserLocalPersistence, onIdTokenChanged, setPersistence, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AUTH_TOKEN_STORAGE_KEY = "trupay_auth_token";

let unsubscribeTokenListener: (() => void) | null = null;
let persistenceReady = false;

const storeAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
};

export const clearClientAuthState = () => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
};

export const initializeAuthSession = async () => {
  if (!auth) {
    clearClientAuthState();
    return;
  }

  if (!persistenceReady) {
    await setPersistence(auth, browserLocalPersistence);
    persistenceReady = true;
  }

  if (!unsubscribeTokenListener) {
    unsubscribeTokenListener = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        clearClientAuthState();
        return;
      }

      const token = await user.getIdToken();
      storeAuthToken(token);
    });
  }
};

export const signOutAndCleanup = async () => {
  if (auth) {
    await signOut(auth);
  }

  clearClientAuthState();
  // We explicitly DO NOT clear trupay_bank_accounts or trupay_biometric_settings
  // so that returning users have a seamless experience.
};
