import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, CheckCircle2, Loader2, ShieldCheck, ArrowRight, Star } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { cn } from "@/lib/utils";
import { USER_BANKS } from "@/data/bankingData";

const OnboardingBank = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"finding" | "select">("finding");
  const [primaryIndex, setPrimaryIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep("select");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const banks = USER_BANKS;

  return (
    <PhoneShell hideNav>
      <div className="h-full flex flex-col px-8 pt-20 pb-12 bg-background">
        <div className="flex-1">
          <h1 className="text-3xl font-display font-bold mb-3">
            {step === "finding" ? "Finding Accounts" : "Select Default"}
          </h1>
          <p className="text-muted-foreground text-sm mb-10">
            {step === "finding" 
              ? "Searching for bank accounts linked to +91 98765 43210" 
              : "Multiple accounts found. Choose your primary account for payments."}
          </p>

          {step === "finding" ? (
            <div className="flex flex-col items-center justify-center pt-12">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <Loader2 className="w-full h-full text-primary/20 animate-spin stroke-[1]" />
                <Landmark className="absolute w-12 h-12 text-primary animate-pulse" />
              </div>
              <p className="mt-8 text-sm font-medium text-primary animate-pulse italic">Scanning NPCI database...</p>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom duration-500">
              {banks.map((bank, i) => (
                <button 
                  key={bank.name}
                  onClick={() => setPrimaryIndex(i)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-[28px] border-2 transition-all text-left",
                    primaryIndex === i 
                      ? "bg-primary/5 border-primary shadow-sm" 
                      : "bg-secondary/50 border-transparent opacity-70"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                      primaryIndex === i ? "bg-primary text-primary-foreground" : "bg-white text-muted-foreground"
                    )}>
                      <Landmark className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{bank.name}</p>
                        {primaryIndex === i && (
                          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] font-bold uppercase tracking-tighter">
                            <Star className="w-2 h-2 fill-current" />
                            Default
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{bank.account} • {bank.type}</p>
                    </div>
                  </div>
                  {primaryIndex === i && <CheckCircle2 className="w-6 h-6 text-primary" />}
                </button>
              ))}
              
              <div className="mt-8 p-4 rounded-2xl bg-success/5 border border-success/10 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-success mt-0.5" />
                <p className="text-[11px] text-success/80 leading-relaxed">
                  Encryption active. Your UPI PIN and credentials are protected by hardware-level security.
                </p>
              </div>
            </div>
          )}
        </div>

        {step === "select" && (
          <button 
            onClick={() => navigate("/home")}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-2 font-bold shadow-glow animate-in slide-in-from-bottom duration-500"
          >
            Finish Setup
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </PhoneShell>
  );
};

export default OnboardingBank;
