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
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="relative animate-slide-up">
          <div className="w-24 h-24 rounded-full bg-success/15 flex items-center justify-center animate-shield-pulse">
            <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center">
              <Check className="w-8 h-8 text-success-foreground" strokeWidth={3} />
            </div>
          </div>
        </div>

        <p className="font-display text-4xl font-semibold mt-6 tabular-nums">
          ₹{amount.toLocaleString("en-IN")}
        </p>
        <p className="text-sm text-muted-foreground mt-1">paid to {contact.name}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{contact.upi}</p>

        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          AI Shield verified · {score ?? 5}% risk
        </div>

        <button
          onClick={() => navigate("/home", { replace: true })}
          className="mt-10 w-full max-w-xs py-4 rounded-2xl bg-gradient-primary text-primary-foreground font-display font-semibold shadow-glow"
        >
          Done
        </button>
      </div>
    </PhoneShell>
  );
};

export default Success;
