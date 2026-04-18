import { NativeBiometric } from 'capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';

export interface BiometricSettings {
  enabled: boolean;
  type: 'face' | 'fingerprint';
}

const SETTINGS_KEY = 'trupay_biometric_settings';

export const getBiometricSettings = (): BiometricSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return { enabled: false, type: 'face' };
};

export const setBiometricSettings = (settings: BiometricSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const uint8ToBase64 = (arr: Uint8Array): string => {
  return btoa(String.fromCharCode.apply(null, Array.from(arr)));
};

export const base64ToUint8 = (str: string): Uint8Array => {
  return new Uint8Array(atob(str).split("").map(c => c.charCodeAt(0)));
};

export const isBiometricAvailable = async (): Promise<boolean> => {
  const platform = Capacitor.getPlatform();
  if (platform === 'web') {
    return window.hasOwnProperty('PublicKeyCredential');
  }
  
  try {
    const result = await NativeBiometric.isAvailable();
    return result.isAvailable;
  } catch {
    return false;
  }
};

export const registerBiometric = async (): Promise<boolean> => {
  const platform = Capacitor.getPlatform();
  if (platform !== 'web') {
    try {
      await NativeBiometric.verifyIdentity({
        reason: "Register your biometric for TruPay security",
        title: "Biometric Enrollment",
        subtitle: "Secure your payments",
        description: "Use your fingerprint or face to authorize payments instantly.",
      });
      return true;
    } catch (error) {
      console.error("Biometric registration failed:", error);
      return false;
    }
  }

  throw new Error("Biometrics require a secure context (HTTPS or localhost) on web.");
};

export const authenticateBiometric = async (): Promise<boolean> => {
  const platform = Capacitor.getPlatform();
  
  if (platform !== 'web') {
    try {
      await NativeBiometric.verifyIdentity({
        reason: "Authorize payment",
        title: "Confirm Payment",
        subtitle: "Biometric Verification",
        description: "Please verify your identity to proceed with the payment.",
      });
      return true;
    } catch (error) {
      console.error("Native biometric failed:", error);
      return false;
    }
  }

  throw new Error("Biometrics require a secure context (HTTPS or localhost) on web.");
};
