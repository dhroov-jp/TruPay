import React, { useState, useEffect, useCallback, useRef } from "react";
import { Fingerprint, ScanFace, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getBiometricSettings,
  setBiometricSettings,
  uint8ToBase64,
  base64ToUint8,
} from "@/lib/biometrics";

interface BiometricPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** "enroll" = register new credential, "verify" = authenticate with stored credential */
  mode?: "enroll" | "verify";
  type?: "face" | "fingerprint";
}

export const BiometricPrompt: React.FC<BiometricPromptProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "verify",
  type = "face",
}) => {
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Guard ref: prevents concurrent WebAuthn calls ("request already pending" error)
  const isInFlightRef = useRef(false);
  // Keep stable refs to callbacks so useEffect doesn't re-run when they change
  const onSuccessRef = useRef(onSuccess);
  const modeRef = useRef(mode);
  const typeRef = useRef(type);

  useEffect(() => { onSuccessRef.current = onSuccess; }, [onSuccess]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { typeRef.current = type; }, [type]);

  const checkSupport = (): boolean => {
    if (!window.isSecureContext || !window.PublicKeyCredential || !navigator.credentials) {
      setStatus("error");
      setErrorMessage(
        "Biometrics require a secure context (HTTPS or localhost). Please open the app via localhost or a live HTTPS URL."
      );
      return false;
    }
    return true;
  };

  const run = useCallback(async () => {
    // Block concurrent calls — this is what fixes "A request is already pending"
    if (isInFlightRef.current) return;
    isInFlightRef.current = true;

    setErrorMessage("");
    setStatus("scanning");

    try {
      if (!checkSupport()) return;

      const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        setStatus("error");
        setErrorMessage(
          "No biometric sensor found. Set up Face ID / Fingerprint in your device Settings first."
        );
        return;
      }

      if (modeRef.current === "enroll") {
        // ── ENROLL: register a new credential ───────────────────────────────
        const challenge = new Uint8Array(32);
        const userId = new Uint8Array(16);
        window.crypto.getRandomValues(challenge);
        window.crypto.getRandomValues(userId);

        const credential = await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: { name: "TruPay", id: window.location.hostname },
            user: {
              id: userId,
              name: "trupay-user",
              displayName: "TruPay User",
            },
            pubKeyCredParams: [
              { alg: -7, type: "public-key" },   // ES256 – Face ID, most Android
              { alg: -257, type: "public-key" },  // RS256 – Windows Hello
            ],
            authenticatorSelection: {
              authenticatorAttachment: "platform", // device biometrics only
              userVerification: "required",
              residentKey: "preferred",
            },
            timeout: 60000,
          },
        }) as PublicKeyCredential | null;

        if (!credential) {
          setStatus("error");
          setErrorMessage("Enrollment was cancelled. Please try again.");
          return;
        }

        // Persist the credential ID for future verifications
        const rawId = new Uint8Array(credential.rawId);
        const current = getBiometricSettings();
        setBiometricSettings({
          ...current,
          enabled: true,
          type: typeRef.current,
          credentialId: uint8ToBase64(rawId),
        });

      } else {
        // ── VERIFY: authenticate with stored credential ──────────────────────
        const settings = getBiometricSettings();
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const assertion = await navigator.credentials.get({
          publicKey: {
            challenge,
            rpId: window.location.hostname,
            userVerification: "required",
            timeout: 60000,
            ...(settings.credentialId
              ? {
                  allowCredentials: [
                    {
                      type: "public-key" as const,
                      id: base64ToUint8(settings.credentialId),
                      transports: ["internal" as AuthenticatorTransport],
                    },
                  ],
                }
              : {}),
          },
        });

        if (!assertion) {
          setStatus("error");
          setErrorMessage("Biometric verification did not complete. Please try again.");
          return;
        }
      }

      setStatus("success");
      setTimeout(() => onSuccessRef.current(), 800);

    } catch (err) {
      console.error("Biometric error:", err);
      setStatus("error");
      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            setErrorMessage("Request was cancelled or timed out. Tap 'Try Again'.");
            break;
          case "InvalidStateError":
            setErrorMessage("This credential is already registered. Proceeding to verify.");
            // Auto-switch to verify after a short pause
            setTimeout(() => {
              modeRef.current = "verify";
              isInFlightRef.current = false;
              run();
            }, 1000);
            return; // don't release the guard yet
          case "NotSupportedError":
            setErrorMessage("Your browser does not support biometric auth. Use Chrome or Safari.");
            break;
          default:
            setErrorMessage(`Biometric error: ${err.message}`);
        }
      } else {
        setErrorMessage("Could not verify biometrics. Make sure biometrics are set up on this device.");
      }
    } finally {
      isInFlightRef.current = false;
    }
  }, []); // No deps — all values accessed via refs

  // Only fire when isOpen becomes true (not on every render)
  useEffect(() => {
    if (!isOpen) {
      setStatus("idle");
      setErrorMessage("");
      isInFlightRef.current = false;
      return;
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // ← intentionally only [isOpen], not [run]

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
      <div
        className={cn(
          "w-full max-w-[400px] bg-card/80 backdrop-blur-2xl border border-white/20 rounded-[40px] p-10 shadow-2xl transition-all duration-700",
          status === "success" ? "border-primary/50 scale-[1.02]" : "scale-100"
        )}
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="relative mb-6">
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500",
                status === "scanning"
                  ? "bg-primary/10 text-primary scale-110"
                  : status === "success"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
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

          {/* Text */}
          <h3 className="font-display text-xl font-semibold mb-2">
            {status === "scanning"
              ? mode === "enroll"
                ? type === "face" ? "Setting up Face ID..." : "Setting up Fingerprint..."
                : type === "face" ? "Scanning Face ID..." : "Scanning Fingerprint..."
              : status === "success"
              ? "Verified ✓"
              : status === "error"
              ? "Verification Failed"
              : "Biometric Auth"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
            {status === "scanning"
              ? mode === "enroll"
                ? "Your device will prompt you to register your biometric"
                : "Use your " + (type === "face" ? "face" : "fingerprint") + " to verify"
              : status === "success"
              ? mode === "enroll"
                ? "Biometric registered successfully."
                : "Identity confirmed. Continuing…"
              : status === "error"
              ? errorMessage
              : "Authenticate to continue"}
          </p>

          {status === "error" && (
            <button
              onClick={() => {
                isInFlightRef.current = false; // reset guard before retry
                run();
              }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
            >
              Try Again
            </button>
          )}

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
