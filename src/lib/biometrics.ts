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

export const isBiometricAvailable = async (): Promise<boolean> => {
  const platform = Capacitor.getPlatform();
  
  if (platform !== 'web') {
    try {
      const result = await NativeBiometric.isAvailable();
      return result.isAvailable;
    } catch {
      return false;
    }
  }
  
  return !!(window.isSecureContext && window.PublicKeyCredential);
};

export const registerBiometric = async (type: 'face' | 'fingerprint' = 'face'): Promise<boolean> => {
  const platform = Capacitor.getPlatform();
  
  if (platform !== 'web') {
    try {
      await NativeBiometric.verifyIdentity({
        reason: `Register your ${type === 'face' ? 'Face ID' : 'Fingerprint'} for TruPay security`,
        title: `${type === 'face' ? 'Face ID' : 'Fingerprint'} Enrollment`,
        subtitle: "Secure your payments",
        description: `Use your ${type === 'face' ? 'face' : 'fingerprint'} to authorize payments instantly.`,
      });
      return true;
    } catch (error) {
      console.error("Native biometric enrollment failed:", error);
      return false;
    }
  }

  if (window.isSecureContext) {
    return true; 
  }
  
  return false;
};

export const authenticateBiometric = async (type: 'face' | 'fingerprint' = 'face'): Promise<boolean> => {
  const platform = Capacitor.getPlatform();
  
  if (platform !== 'web') {
    try {
      await NativeBiometric.verifyIdentity({
        reason: `Verify ${type === 'face' ? 'Face ID' : 'Fingerprint'} to authorize payment`,
        title: `Confirm with ${type === 'face' ? 'Face ID' : 'Fingerprint'}`,
        subtitle: "Biometric Verification",
        description: `Please scan your ${type === 'face' ? 'face' : 'fingerprint'} to proceed.`,
      });
      return true;
    } catch (error) {
      console.error("Native biometric auth failed:", error);
      return false;
    }
  }

  if (window.isSecureContext || window.location.hostname === 'localhost') {
    return true;
  }

  return false;
};
