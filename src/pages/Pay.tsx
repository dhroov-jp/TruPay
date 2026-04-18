import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Loader2, ShieldAlert, BadgeCheck } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { TrustBadge } from "@/components/TrustBadge";
import { Contact, computeRisk } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { generateFeatures, checkFraud } from "@/services/fraudService";
import { BiometricPrompt } from "@/components/BiometricPrompt";
import { UpiPinPad } from "@/components/UpiPinPad";
import { triggerUpiIntent, updateBalance } from "@/lib/upi";
import { toast } from "sonner";
import { BACKEND_IP } from "@/config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { USER_BANKS } from "@/data/bankingData";

const Pay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contact = location.state?.contact as Contact | undefined;

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [checking, setChecking] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinMode, setPinMode] = useState<"pay" | "balance">("pay");
  const [showFraudAlert, setShowFraudAlert] = useState(false);
  const [fraudScore, setFraudScore] = useState(0);
  const [showBanks, setShowBanks] = useState(false);
  const [selectedBank, setSelectedBank] = useState(0);
  const [viewingBalance, setViewingBalance] = useState<number | null>(null);

  const banks = USER_BANKS;

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

  const handlePay = async () => {
    if (numericAmount <= 0) return;
    setChecking(true);
    setPinMode("pay");
    
    // 1. Generate 22 features and check with dashboard API
    try {
      const features = generateFeatures(contact, numericAmount);
      const result = await checkFraud(features, contact.upi, numericAmount);
      
      setChecking(false);
      setFraudScore(result.score);

      if (result.isFraud) {
        setShowFraudAlert(true);
      } else {
        setIsVerified(true);
        setTimeout(() => {
          setIsVerified(false);
          setShowBiometric(true);
        }, 1500);
      }
    } catch (err) {
      setChecking(false);
      toast.error("Fraud Engine Connection Failed", {
        description: `Could not reach ${BACKEND_IP}. Ensure your friend's dashboard is active and on the same WiFi.`,
      });
    }
  };

  const handleCheckBalance = (index: number) => {
    setPinMode("balance");
    setSelectedBank(index);
    setShowPinPad(true);
  };

  const onBiometricSuccess = () => {
    setShowBiometric(false);
    setShowPinPad(true);
  };

  const onPinSuccess = () => {
    setShowPinPad(false);
    
    if (pinMode === "balance") {
      setViewingBalance(selectedBank);
      setTimeout(() => setViewingBalance(null), 5000); // Hide after 5s
    } else {
      updateBalance(numericAmount, "debit");
      navigate("/success", { state: { contact, amount: numericAmount, score: fraudScore } });
    }
  };

  const viewRiskDetails = () => {
    setShowFraudAlert(false);
    const { scenario } = computeRisk(contact, numericAmount);
    navigate("/risk", { 
      state: { 
        contact, 
        amount: numericAmount, 
        note, 
        scenario, 
        score: Math.max(fraudScore, 70) 
      } 
    });
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

      {/* Bank Selection (Conditional) */}
      {showBanks && (
        <div className="px-5 mt-4 space-y-2 animate-in slide-in-from-bottom duration-300">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-1">Choose Bank Account</p>
          {banks.map((bank, i) => (
            <div 
              key={bank.name}
              onClick={() => setSelectedBank(i)}
              className={cn(
                "flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer",
                selectedBank === i ? "bg-primary/5 border-primary shadow-sm" : "bg-card border-border"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                  selectedBank === i ? "border-primary" : "border-muted-foreground/30"
                )}>
                  {selectedBank === i && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">{bank.name}</p>
                  <p className="text-[10px] text-muted-foreground">{bank.account}</p>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckBalance(i);
                }}
                className="text-[10px] font-bold text-primary px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20"
              >
                {viewingBalance === i ? `₹${bank.balance.toLocaleString("en-IN")}` : "Check Balance"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 mt-6 mb-6">
        <div className="flex items-center gap-2 justify-center text-[11px] text-muted-foreground mb-3">
          <ShieldCheck className="w-3 h-3 text-primary" />
          AI Shield will scan this payment before PIN entry
        </div>
        
        {isVerified ? (
          <div className="w-full py-4 rounded-2xl bg-success/10 border border-success/20 text-success font-display font-semibold flex items-center justify-center gap-2 animate-in zoom-in duration-300">
            <BadgeCheck className="w-5 h-5" />
            Shield Verified: Authentic Payee
          </div>
        ) : (
          <button
            onClick={() => showBanks ? handlePay() : setShowBanks(true)}
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
                <div className="relative">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <div className="absolute inset-0 bg-white/30 blur-md animate-pulse rounded-full" />
                </div>
                AI scanning security signals…
              </>
            ) : (
              <>{showBanks ? `Pay ₹${numericAmount.toLocaleString("en-IN")}` : "Proceed"}</>
            )}
          </button>
        )}
      </div>

      {/* Biometric Prompt */}
      <BiometricPrompt 
        isOpen={showBiometric} 
        onClose={() => setShowBiometric(false)} 
        onSuccess={onBiometricSuccess}
        type={contact.trust === "trusted" ? "face" : "fingerprint"}
      />

      {/* NPCI UPI PIN Pad */}
      <UpiPinPad
        isOpen={showPinPad}
        onClose={() => setShowPinPad(false)}
        onSuccess={onPinSuccess}
        payeeName={contact.name}
        amount={numericAmount}
      />

      {/* Fraud Alert Dialog */}
      <AlertDialog open={showFraudAlert} onOpenChange={setShowFraudAlert}>
        <AlertDialogContent className="rounded-[32px] max-w-[90%] w-[340px]">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <ShieldAlert className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center font-display text-xl">Fraud Detected!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Our AI model has flagged this transaction as highly suspicious. We recommend canceling immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            <AlertDialogAction 
              onClick={viewRiskDetails}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-2xl py-6"
            >
              View Risk Details
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={() => navigate("/home")}
              className="rounded-2xl py-6"
            >
              Cancel Payment
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PhoneShell>
  );
};

export default Pay;
