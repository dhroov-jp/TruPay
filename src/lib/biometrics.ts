export type BiometricType = "face" | "fingerprint";

export interface BiometricSettings {
  enabled: boolean;
  type: BiometricType;
  /** Base64-encoded credential ID stored after successful enrollment */
  credentialId?: string;
}

const BIOMETRIC_SETTINGS_KEY = "trupay_biometrics";

const DEFAULT_SETTINGS: BiometricSettings = {
  enabled: false,
  type: "face",
};

export const getBiometricSettings = (): BiometricSettings => {
  try {
    const raw = localStorage.getItem(BIOMETRIC_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<BiometricSettings>;
    return {
      enabled: Boolean(parsed.enabled),
      type: parsed.type === "fingerprint" ? "fingerprint" : "face",
      credentialId: parsed.credentialId,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const setBiometricSettings = (settings: BiometricSettings): void => {
  localStorage.setItem(BIOMETRIC_SETTINGS_KEY, JSON.stringify(settings));
};

/** Convert a Uint8Array to a base64 string for storage */
export const uint8ToBase64 = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes));

/** Convert a stored base64 string back to Uint8Array */
export const base64ToUint8 = (b64: string): Uint8Array =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
