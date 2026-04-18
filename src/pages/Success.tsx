import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, ShieldCheck } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { Contact } from "@/data/mockData";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contact, amount, score } = (location.state || {}) as {
    contact?: Contact;
    amount?: number;
    score?: number;
  };

  useEffect(() => {
    if (!contact) navigate("/home", { replace: true });
  }, [contact, navigate]);

  if (!contact || !amount) return null;

  return (
    <PhoneShell hideNav>
      <div className="h-full flex flex-col items-center justify-center px-6 text-center bg-background overflow-hidden select-none">
        
        {/* Animated Success Badge */}
        <div className="relative animate-slide-up">
          <div className="w-24 h-24 rounded-full bg-success/15 flex items-center justify-center animate-shield-pulse">
            <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/20">
              <Check className="w-8 h-8 text-success-foreground" strokeWidth={4} />
            </div>
          </div>
        </div>

        {/* Amount Section */}
        <div className="mt-8 space-y-1 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <p className="font-display text-5xl font-black tabular-nums tracking-tighter">
            ₹{amount.toLocaleString("en-IN")}
          </p>
          <div className="flex flex-col">
            <p className="text-base font-bold text-foreground opacity-70">paid to {contact.name}</p>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">{contact.upi}</p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-col gap-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
            <ShieldCheck className="w-4 h-4" />
            AI Shield Verified · {score ?? 0}% Risk
          </div>
          
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-yellow-400/10 text-yellow-700 dark:text-yellow-400 text-[10px] font-black uppercase tracking-widest border border-yellow-400/20 animate-in zoom-in duration-700 delay-500">
            <span className="text-sm">🪙</span>
            2X TruCoins Earned!
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-12 w-full max-w-[280px] animate-slide-up" style={{ animationDelay: "300ms" }}>
          <button
            onClick={() => navigate("/home", { replace: true })}
            className="w-full py-5 rounded-[28px] bg-primary text-primary-foreground font-display font-black text-lg shadow-glow hover:brightness-110 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </PhoneShell>
  );
};

export default Success;
