import React, { useState, useEffect } from "react";
import { Check, Delete, ShieldCheck, X, AlertCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UpiPinPadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
  payeeName: string;
  amount: number;
}

export const UpiPinPad: React.FC<UpiPinPadProps> = ({
  isOpen,
  onClose,
  onSuccess,
  payeeName,
  amount,
}) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSetting, setIsSetting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState(false);
  const pinLength = 4;

  useEffect(() => {
    if (isOpen) {
      const savedPin = localStorage.getItem("trupay_upi_pin");
      setIsSetting(!savedPin);
      setPin("");
      setConfirmPin("");
      setIsConfirming(false);
      setError(false);
    }
  }, [isOpen]);

  const handlePress = (num: string) => {
    if (error) setError(false);
    if (pin.length < pinLength) {
      setPin((p) => p + num);
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length !== pinLength) return;

    if (isSetting) {
      if (!isConfirming) {
        setConfirmPin(pin);
        setPin("");
        setIsConfirming(true);
      } else {
        if (pin === confirmPin) {
          localStorage.setItem("trupay_upi_pin", pin);
          toast.success("UPI PIN Set Successfully!");
          onSuccess(pin);
        } else {
          setError(true);
          setPin("");
          toast.error("PINs do not match. Try again.");
          setIsConfirming(false);
        }
      }
    } else {
      const savedPin = localStorage.getItem("trupay_upi_pin");
      if (pin === savedPin) {
        onSuccess(pin);
      } else {
        setError(true);
        setPin("");
        toast.error("Incorrect UPI PIN", {
          description: "Please enter the correct 4-digit PIN."
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-zinc-950 flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Premium Dark Header */}
      <div className="shrink-0 flex items-center justify-between p-5 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-[9px] shadow-lg shadow-blue-900/20">
            NPCI
          </div>
          <div className="text-left">
            <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-white/40 leading-none mb-1">Secure Network</span>
            <span className="block text-xs font-bold text-white tracking-wide leading-none">BHIM UPI Gateway</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center active:scale-90 transition-all hover:bg-white/10"
        >
          <X className="w-5 h-5 text-white/40" />
        </button>
      </div>

      {/* Modern Status Section - Compacted */}
      <div className="shrink-0 px-6 pt-6 pb-2 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-2xl">
          <Lock className="w-5 h-5 text-primary animate-pulse" />
        </div>
        
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-2 leading-none">
          {isSetting ? "New Registration" : "Payment Authorization"}
        </p>
        <h2 className="text-lg font-display font-black text-white text-center px-4 leading-tight">
          {isSetting ? "Set Secure 4-Digit PIN" : `Paying ${payeeName}`}
        </h2>
        
        <div className="mt-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
          <p className="text-2xl font-display font-black text-white tracking-tight tabular-nums">
            ₹{amount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* PIN Input Area - Balanced Spacing */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <p className={cn(
          "text-[9px] font-black uppercase tracking-[0.4em] mb-8 transition-colors leading-none",
          error ? "text-destructive" : "text-white/30"
        )}>
          {isSetting 
            ? (isConfirming ? "Confirm PIN" : "Enter New PIN") 
            : "Enter UPI PIN"}
        </p>
        
        <div className={cn(
          "flex gap-6",
          error && "animate-shake"
        )}>
          {[...Array(pinLength)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3.5 h-3.5 rounded-full border-2 transition-all duration-300",
                i < pin.length 
                  ? "bg-primary border-primary scale-125 shadow-[0_0_12px_rgba(59,130,246,0.5)]" 
                  : cn("bg-transparent border-white/10", error && "border-destructive/40")
              )}
            />
          ))}
        </div>

        {error ? (
          <div className="mt-8 flex items-center gap-2 text-destructive font-bold text-[9px] uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-3.5 h-3.5" />
            Verification Failed
          </div>
        ) : (
          <div className="mt-8 flex items-center gap-2.5 text-success font-black text-[8px] uppercase tracking-[0.3em] bg-success/10 px-4 py-2 rounded-full border border-success/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            AI Shield Vault Active
          </div>
        )}
      </div>

      {/* Premium Numeric Keypad - Slimmer rows to fit all screens */}
      <div className="shrink-0 grid grid-cols-3 bg-white/5 backdrop-blur-2xl border-t border-white/5 shadow-2xl">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => handlePress(n.toString())}
            className="py-4 text-2xl font-display font-black text-white hover:bg-white/5 active:bg-white/10 transition-all border-r border-b border-white/5"
          >
            {n}
          </button>
        ))}
        <button
          onClick={handleDelete}
          className="py-4 flex items-center justify-center border-r border-white/5 hover:bg-white/5 active:bg-white/10 transition-all"
        >
          <Delete className="w-6 h-6 text-white/40" />
        </button>
        <button
          onClick={() => handlePress("0")}
          className="py-4 text-2xl font-display font-black text-white border-r border-white/5 hover:bg-white/5 active:bg-white/10 transition-all"
        >
          0
        </button>
        <button
          onClick={handleSubmit}
          className={cn(
            "py-4 flex items-center justify-center transition-all duration-500",
            pin.length === pinLength 
              ? "bg-primary text-white shadow-glow" 
              : "bg-white/5 text-white/10 pointer-events-none"
          )}
        >
          <Check className="w-8 h-8" strokeWidth={4} />
        </button>
      </div>
      
      {/* Safe Area Padding - Minimal */}
      <div className="h-6 bg-zinc-950" />
    </div>
  );
};
