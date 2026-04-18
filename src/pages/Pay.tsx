import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { TrustBadge } from "@/components/TrustBadge";
import { Contact, computeRisk } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Pay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contact = location.state?.contact as Contact | undefined;

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!contact) navigate("/send", { replace: true });
  }, [contact, navigate]);

  const numericAmount = useMemo(() => parseFloat(amount || "0"), [amount]);

  if (!contact) return null;

  const press = (k: string) => {
    if (k === "del") return setAmount((a) => a.slice(0, -1));
    if (k === "." && amount.includes(".")) return;
    if (amount.length >= 9) return;
    setAmount((a) => (a === "0" ? k : a + k));
  };

  const handlePay = () => {
    if (numericAmount <= 0) return;
    setChecking(true);
    setTimeout(() => {
      const { score, scenario } = computeRisk(contact, numericAmount);
      setChecking(false);
      if (score >= 70 && scenario) {
        navigate("/risk", { state: { contact, amount: numericAmount, note, scenario, score } });
      } else {
        navigate("/success", { state: { contact, amount: numericAmount, score } });
      }
    }, 1400);
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];

  return (
    <PhoneShell hideNav>
      <header className="px-5 pt-12 pb-3 flex items-center gap-3 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-[11px] text-muted-foreground">Paying to</p>
          <p className="text-sm font-semibold">{contact.name}</p>
        </div>
        <TrustBadge trust={contact.trust} />
      </header>

      <div className="px-5 mt-2 text-center animate-slide-up">
        <p className="text-xs text-muted-foreground mb-2">{contact.upi}</p>
        <div className="flex items-end justify-center gap-1 my-6">
          <span className="font-display text-3xl text-muted-foreground">₹</span>
          <span
            className={cn(
              "font-display text-6xl font-semibold tabular-nums tracking-tight",
              !amount && "text-muted-foreground/40"
            )}
          >
            {amount || "0"}
          </span>
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note"
          className="w-full max-w-xs mx-auto bg-secondary rounded-full px-4 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Keypad */}
      <div className="px-5 mt-6 grid grid-cols-3 gap-1.5 animate-slide-up">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            className="py-3.5 rounded-2xl text-xl font-display font-medium hover:bg-secondary active:bg-muted transition-base"
          >
            {k === "del" ? "⌫" : k}
          </button>
        ))}
      </div>

      <div className="px-5 mt-4 mb-6">
        <div className="flex items-center gap-2 justify-center text-[11px] text-muted-foreground mb-3">
          <ShieldCheck className="w-3 h-3 text-primary" />
          AI Shield will scan this payment before PIN entry
        </div>
        <button
          onClick={handlePay}
          disabled={numericAmount <= 0 || checking}
          className={cn(
            "w-full py-4 rounded-2xl font-display font-semibold text-primary-foreground transition-base flex items-center justify-center gap-2",
            numericAmount > 0
              ? "bg-gradient-primary shadow-glow hover:opacity-95"
              : "bg-muted text-muted-foreground"
          )}
        >
          {checking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              AI scanning…
            </>
          ) : (
            <>Pay ₹{numericAmount > 0 ? numericAmount.toLocaleString("en-IN") : "0"}</>
          )}
        </button>
      </div>
    </PhoneShell>
  );
};

export default Pay;
