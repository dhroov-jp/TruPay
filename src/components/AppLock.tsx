import { useState, useEffect } from "react";
import { BiometricPrompt } from "./BiometricPrompt";
import { Shield } from "lucide-react";
import { getBiometricSettings } from "@/lib/biometrics";

export const AppLock = ({ children }: { children: React.ReactNode }) => {
  const [biometricSettings] = useState(() => getBiometricSettings());
  const [isLocked, setIsLocked] = useState(() => biometricSettings.enabled);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!biometricSettings.enabled || !isLocked) {
      return;
    }

    // Show biometric prompt after a short delay on mount
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [biometricSettings.enabled, isLocked]);

  const handleUnlock = () => {
    setShowPrompt(false);
    setIsLocked(false);
  };

  if (!isLocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 animate-pulse">
        <Shield className="w-10 h-10" />
      </div>
      <h1 className="font-display text-2xl font-bold mb-2">TruPay Shield</h1>
      <p className="text-sm text-muted-foreground mb-10 max-w-[200px]">
        Authenticate to access your secure payments
      </p>
      
      <button
        onClick={() => setShowPrompt(true)}
        className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-glow"
      >
        Unlock with {biometricSettings.type === "face" ? "Face ID" : "Touch ID"}
      </button>

      <BiometricPrompt
        isOpen={showPrompt}
        onClose={() => {}} // Force authentication
        onSuccess={handleUnlock}
        type={biometricSettings.type === "face" ? "face" : "fingerprint"}
      />
    </div>
  );
};
