import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Loader2, ShieldCheck } from "lucide-react";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { PhoneShell } from "@/components/PhoneShell";
import { Input } from "@/components/ui/input";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [showPhoneFlow, setShowPhoneFlow] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const getOrCreateRecaptchaVerifier = async () => {
    if (!auth) {
      throw new Error("Firebase Auth is not initialized.");
    }

    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
        // OTP flow continues after successful challenge.
      },
    });

    await verifier.render();
    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      toast.error("Firebase is not configured. Add VITE_FIREBASE_* keys in .env.");
      return;
    }

    setLoading("google");
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Google authentication successful.");
      navigate("/onboarding/biometric");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google sign-in failed.";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  const handleSendOtp = async () => {
    if (!isFirebaseConfigured || !auth) {
      toast.error("Firebase is not configured. Add VITE_FIREBASE_* keys in .env.");
      return;
    }

    const normalizedPhone = phoneNumber.replace(/\s+/g, "").trim();
    if (!/^\+[1-9]\d{9,14}$/.test(normalizedPhone)) {
      toast.error("Enter a valid phone number in E.164 format, for example +919876543210.");
      return;
    }

    setLoading("phone");
    try {
      const verifier = await getOrCreateRecaptchaVerifier();
      const result = await signInWithPhoneNumber(auth, normalizedPhone, verifier);
      setConfirmationResult(result);
      setOtpCode("");
      toast.success("OTP sent. Enter the verification code.");
    } catch (error) {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
      const message = error instanceof Error ? error.message : "Could not send OTP.";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      toast.error("Send OTP first.");
      return;
    }

    if (!/^\d{6}$/.test(otpCode.trim())) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }

    setLoading("otp");
    try {
      await confirmationResult.confirm(otpCode.trim());
      toast.success("Phone number verified.");
      navigate("/onboarding/biometric");
    } catch (error) {
      const message = error instanceof Error ? error.message : "OTP verification failed.";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <PhoneShell hideNav>
      <div className="h-full flex flex-col px-8 pt-20 pb-12 bg-background">
        <div className="flex-1">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-glow animate-in zoom-in duration-500">
            <span className="text-primary-foreground font-display text-3xl font-bold">T</span>
          </div>
          
          <h1 className="text-4xl font-display font-bold tracking-tight mb-4 animate-in slide-in-from-left duration-500 delay-100">
            Experience the <br />
            <span className="text-primary italic">future</span> of UPI.
          </h1>
          <p className="text-muted-foreground text-sm max-w-[240px] leading-relaxed animate-in slide-in-from-left duration-500 delay-200">
            Secure, AI-powered payments for the next billion users.
          </p>
        </div>

        <div className="space-y-4 animate-in slide-in-from-bottom duration-700 delay-300">
          <button 
            onClick={handleGoogleLogin}
            className="w-full h-14 rounded-2xl bg-white border border-border flex items-center justify-center gap-3 font-semibold hover:bg-secondary transition-base shadow-sm"
          >
            {loading === "google" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                Continue with Google
              </>
            )}
          </button>

          <button 
            onClick={() => setShowPhoneFlow((prev) => !prev)}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-3 font-bold shadow-glow transition-base hover:opacity-90"
          >
            {loading === "phone" || loading === "otp" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <Phone className="w-5 h-5" />
                {showPhoneFlow ? "Hide Phone Login" : "Continue with Phone"}
              </>
            )}
          </button>

          {showPhoneFlow && (
            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur px-4 py-4 space-y-3">
              <div className="space-y-2">
                <label htmlFor="phone-number" className="text-xs font-semibold text-muted-foreground">
                  Phone Number
                </label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+919876543210"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  autoComplete="tel"
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading === "phone"}
                className="w-full h-11 rounded-xl bg-primary/10 text-primary font-semibold border border-primary/20"
              >
                {loading === "phone" ? "Sending OTP..." : confirmationResult ? "Resend OTP" : "Send OTP"}
              </button>

              {confirmationResult && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="otp-code" className="text-xs font-semibold text-muted-foreground">
                      OTP Code
                    </label>
                    <Input
                      id="otp-code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={otpCode}
                      onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ""))}
                      autoComplete="one-time-code"
                    />
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading === "otp"}
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
                  >
                    {loading === "otp" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Verify OTP
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          <p className="text-[10px] text-center text-muted-foreground px-8 pt-4">
            By continuing, you agree to TruPay's <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>

        <div id="recaptcha-container" />
      </div>
    </PhoneShell>
  );
};

export default Login;
