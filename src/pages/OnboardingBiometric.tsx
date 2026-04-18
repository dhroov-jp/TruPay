import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanFace, Fingerprint, ShieldCheck, Loader2 } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { cn } from "@/lib/utils";

const OnboardingBiometric = () => {
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [bioType, setBioType] = useState<"face" | "finger">("face");

  const handleEnroll = () => {
    setIsEnrolling(true);
    setTimeout(() => {
      navigate("/onboarding/bank");
    }, 3000);
  };

  return (
    <PhoneShell hideNav>
      <div className="h-full flex flex-col px-8 pt-20 pb-12 bg-background">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-display font-bold mb-3 animate-in fade-in duration-500">Secure your App</h1>
          <p className="text-muted-foreground text-sm mb-12 animate-in fade-in duration-500 delay-100">
            Choose how you want to unlock TruPay and verify large transactions.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <button 
              onClick={() => setBioType("face")}
              className={cn(
                "w-24 h-24 rounded-[32px] flex flex-col items-center justify-center gap-2 transition-all border-2",
                bioType === "face" ? "bg-primary/5 border-primary text-primary" : "bg-secondary border-transparent text-muted-foreground"
              )}
            >
              <ScanFace className="w-8 h-8" />
              <span className="text-[10px] font-bold">Face ID</span>
            </button>
            <button 
              onClick={() => setBioType("finger")}
              className={cn(
                "w-24 h-24 rounded-[32px] flex flex-col items-center justify-center gap-2 transition-all border-2",
                bioType === "finger" ? "bg-primary/5 border-primary text-primary" : "bg-secondary border-transparent text-muted-foreground"
              )}
            >
              <Fingerprint className="w-8 h-8" />
              <span className="text-[10px] font-bold">Touch ID</span>
            </button>
          </div>

          <div className="relative mx-auto w-40 h-40 rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center overflow-hidden">
            {isEnrolling ? (
              <>
                {bioType === "face" ? <ScanFace className="w-16 h-16 text-primary animate-pulse" /> : <Fingerprint className="w-16 h-16 text-primary animate-pulse" />}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-scan-line shadow-glow" />
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
              </>
            ) : (
              bioType === "face" ? <ScanFace className="w-16 h-16 text-muted-foreground/30" /> : <Fingerprint className="w-16 h-16 text-muted-foreground/30" />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleEnroll}
            disabled={isEnrolling}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-2 font-bold shadow-glow"
          >
            {isEnrolling ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning...
              </>
            ) : (
              "Enable Biometrics"
            )}
          </button>
          <button 
            onClick={() => navigate("/onboarding/bank")}
            className="w-full py-4 text-muted-foreground text-sm font-semibold"
          >
            Skip for now
          </button>
        </div>
      </div>
    </PhoneShell>
  );
};

export default OnboardingBiometric;
