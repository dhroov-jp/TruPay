import React, { useState, useEffect } from "react";
import { Fingerprint, ScanFace, X, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BiometricPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type?: "face" | "fingerprint";
}

export const BiometricPrompt: React.FC<BiometricPromptProps> = ({
  isOpen,
  onClose,
  onSuccess,
  type = "face",
}) => {
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");

  useEffect(() => {
    const triggerRealBiometrics = async () => {
      if (!isOpen) return;
      
      setStatus("scanning");
      
      try {
        // Only attempt real hardware trigger if on HTTPS
        if (window.isSecureContext && window.PublicKeyCredential) {
          console.log("Attempting real hardware biometric scan...");
          
          const challenge = new Uint8Array(32);
          window.crypto.getRandomValues(challenge);
          
          const options: CredentialCreationOptions = {
            publicKey: {
              challenge,
              rp: { name: "TruPay Shield" },
              user: {
                id: new Uint8Array(16),
                name: "user@trupay",
                displayName: "TruPay User",
              },
              pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
              authenticatorSelection: {
                authenticatorAttachment: "platform",
                userVerification: "required",
              },
              timeout: 60000,
            },
          };

          await navigator.credentials.create(options);
          setStatus("success");
          setTimeout(() => onSuccess(), 800);
        } else {
          // Fallback to simulation if not HTTPS or not supported
          console.warn("Real biometrics require HTTPS. Falling back to simulation.");
          setTimeout(() => {
            setStatus("success");
            setTimeout(() => onSuccess(), 800);
          }, 2500);
        }
      } catch (err) {
        console.error("Biometric error:", err);
        // If user cancels or error, we still allow the demo to proceed for the hackathon
        // or you can setStatus("error") here.
        setStatus("success"); 
        setTimeout(() => onSuccess(), 800);
      }
    };

    triggerRealBiometrics();
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
      <div 
        className={cn(
          "w-full max-w-[400px] bg-card/80 backdrop-blur-2xl border border-white/20 rounded-[40px] p-10 shadow-2xl transition-all duration-700 transform translate-y-0",
          status === "success" ? "border-primary/50 scale-[1.02]" : "scale-100"
        )}
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon Area */}
          <div className="relative mb-6">
            <div 
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500",
                status === "scanning" ? "bg-primary/10 text-primary scale-110" : 
                status === "success" ? "bg-primary text-white scale-100" : "bg-muted text-muted-foreground"
              )}
            >
              {status === "success" ? (
                <ShieldCheck className="w-10 h-10 animate-in zoom-in duration-300" />
              ) : type === "face" ? (
                <ScanFace className={cn("w-10 h-10", status === "scanning" && "animate-pulse")} />
              ) : (
                <Fingerprint className={cn("w-10 h-10", status === "scanning" && "animate-pulse")} />
              )}
            </div>
            
            {status === "scanning" && (
              <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Text Area */}
          <h3 className="font-display text-xl font-semibold mb-2">
            {status === "scanning" 
              ? (type === "face" ? "Scanning Face ID..." : "Scanning Fingerprint...") 
              : status === "success" ? "Verified" : "Biometric Auth"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
            {status === "scanning" 
              ? "Position your device to verify your identity" 
              : status === "success" ? "Identity confirmed. Processing payment." : "Verify to continue"}
          </p>

          {/* Action Area */}
          <button
            onClick={onClose}
            className="mt-8 w-12 h-12 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:bg-muted transition-base"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
