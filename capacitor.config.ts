import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trupay.ai',
  appName: 'TruPay',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      providers: ["google.com"],
      skipNativeAuth: false
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "694530490769-3npf3c04g48j6lcfnqm2a8orb7kar1ss.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
