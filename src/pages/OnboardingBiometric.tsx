import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanFace, Fingerprint, Loader2, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PhoneShell } from "@/components/PhoneShell";
import { BiometricPrompt } from "@/components/BiometricPrompt";
import { cn } from "@/lib/utils";
import { setBiometricSettings } from "@/lib/biometrics";

const OnboardingBiometric = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [bioType, setBioType] = useState<"face" | "fingerprint">("face");

  const handleEnroll = () => {
    setIsEnrolling(true);
    setShowPrompt(true);
  };

  const handleBiometricSuccess = () => {
    setBiometricSettings({ enabled: true, type: bioType });
    setShowPrompt(false);
    navigate("/onboarding/bank");
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
    setIsEnrolling(false);
  };

  const handleSkip = () => {
    setBiometricSettings({ enabled: false, type: bioType });
    navigate("/onboarding/bank");
  };

  return (
    <PhoneShell hideNav>
      <div className="h-full flex flex-col px-8 pt-10 pb-12 bg-background relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2 tracking-tight text-center">{t('Secure your App')}</h1>
          <p className="text-muted-foreground text-[13px] mb-8 max-w-[280px] text-center leading-snug">
            {t('Protect your account with biometric authentication for faster and safer payments.')}
          </p>

          <div className="flex justify-center gap-3 w-full mb-8 px-2">
            <button 
              onClick={() => setBioType("face")}
              className={cn(
                "flex-1 relative aspect-square rounded-[28px] flex flex-col items-center justify-center gap-2 transition-all duration-300 border-2 overflow-hidden",
                bioType === "face" 
                  ? "bg-primary/5 border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                  : "bg-card border-transparent hover:border-primary/20"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                bioType === "face" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                <ScanFace className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-bold transition-colors leading-tight px-2 text-center",
                bioType === "face" ? "text-primary" : "text-muted-foreground"
              )}>{t('Face ID')}</span>
            </button>

            <button 
              onClick={() => setBioType("fingerprint")}
              className={cn(
                "flex-1 relative aspect-square rounded-[28px] flex flex-col items-center justify-center gap-2 transition-all duration-300 border-2 overflow-hidden",
                bioType === "fingerprint" 
                  ? "bg-primary/5 border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                  : "bg-card border-transparent hover:border-primary/20"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                bioType === "fingerprint" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                <Fingerprint className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-bold transition-colors leading-tight px-2 text-center",
                bioType === "fingerprint" ? "text-primary" : "text-muted-foreground"
              )}>{t('Touch ID')}</span>
            </button>
          </div>

          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Ambient circular ring */}
            <div className="absolute inset-0 rounded-full border border-primary/10" />
            <div className="absolute inset-1.5 rounded-full border border-dashed border-primary/20 animate-[spin_20s_linear_infinite]" />
            
            <div className={cn(
              "w-28 h-28 rounded-[36px] flex items-center justify-center transition-all duration-500 relative z-20",
              isEnrolling ? "bg-primary/10 shadow-glow scale-105" : "bg-secondary/30"
            )}>
              {bioType === "face" ? (
                <ScanFace className={cn("w-12 h-12 transition-all duration-500", isEnrolling ? "text-primary" : "text-muted-foreground/10")} />
              ) : (
                <Fingerprint className={cn("w-12 h-12 transition-all duration-500", isEnrolling ? "text-primary" : "text-muted-foreground/10")} />
              )}
              
              {isEnrolling && (
                <>
                  <div className="absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-primary/50 animate-scan-line z-30" />
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent animate-pulse rounded-[36px] z-10" />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-8 relative z-10">
          <button 
            onClick={handleEnroll}
            disabled={isEnrolling}
            className="w-full h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-3 font-bold shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
          >
            {isEnrolling ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('Authenticating...')}
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                {t('Enable')} {bioType === 'face' ? t('Face ID') : t('Touch ID')}
              </>
            )}
          </button>
          <button 
            onClick={handleSkip}
            className="w-full h-10 flex items-center justify-center text-muted-foreground text-xs font-semibold hover:text-foreground transition-colors mb-4"
          >
            {t('Skip for now')}
          </button>
        </div>

        <BiometricPrompt
          isOpen={showPrompt}
          onClose={handleClosePrompt}
          onSuccess={handleBiometricSuccess}
          mode="enroll"
          type={bioType}
        />
      </div>
    </PhoneShell>
  );
};

export default OnboardingBiometric;
