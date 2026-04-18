import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, ArrowRight, Loader2 } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const OnboardingPin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [firstPin, setFirstPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKeypad = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        if (step === "enter") {
          setTimeout(() => {
            setFirstPin(newPin);
            setPin("");
            setStep("confirm");
          }, 400);
        } else {
          if (newPin === firstPin) {
            handleComplete(newPin);
          } else {
            toast.error("PINs do not match. Try again.");
            setPin("");
            setStep("enter");
            setFirstPin("");
          }
        }
      }
    }
  };

  const handleComplete = (finalPin: string) => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("trupay_pin", finalPin);
      sessionStorage.setItem("trupay_unlocked", "true"); // Mark as already verified
      // Wake up the auth guard instantly to prevent redirect loops
      window.dispatchEvent(new Event("storage")); 
      
      toast.success("Security PIN set successfully!");
      setLoading(false);
      navigate("/home", { replace: true });
    }, 1500);
  };

  const deleteLast = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <PhoneShell hideNav>
      <div className="h-full flex flex-col bg-background p-8">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 animate-in zoom-in duration-500">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-display font-bold mb-3 animate-in fade-in duration-700">
            {step === "enter" ? "Set Security PIN" : "Confirm PIN"}
          </h1>
          <p className="text-muted-foreground text-sm max-w-[240px] mb-12 animate-in fade-in duration-700 delay-100">
            {step === "enter" 
              ? "Create a 4-digit PIN to secure all your future payments." 
              : "Re-enter your 4-digit PIN to verify."}
          </p>

          <div className="flex gap-4 mb-16">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i}
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-all duration-300",
                  pin.length > i ? "bg-primary border-primary scale-125 shadow-glow" : "border-muted-foreground/30 scale-100"
                )}
              />
            ))}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-8 mb-8 animate-in fade-in duration-700 delay-300">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeypad(num.toString())}
              className="h-16 flex items-center justify-center text-2xl font-display font-bold hover:bg-secondary/50 rounded-2xl active:scale-90 transition-all"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeypad("0")}
            className="h-16 flex items-center justify-center text-2xl font-display font-bold hover:bg-secondary/50 rounded-2xl active:scale-90 transition-all"
          >
            0
          </button>
          <button
            onClick={deleteLast}
            className="h-16 flex items-center justify-center text-lg font-bold text-muted-foreground hover:text-foreground active:scale-90 transition-all"
          >
            ⌫
          </button>
        </div>

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-500">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <ShieldCheck className="absolute inset-0 m-auto w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Securing Account</h2>
              <p className="text-sm text-muted-foreground">Encrypting your vault...</p>
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
};

export default OnboardingPin;
