import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Loader2, ShieldAlert, BadgeCheck, Ban } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { TrustBadge } from "@/components/TrustBadge";
import { Contact, computeRisk } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { generateFeatures, checkFraud } from "@/services/fraudService";
import { BiometricPrompt } from "@/components/BiometricPrompt";
import { UpiPinPad } from "@/components/UpiPinPad";
import { triggerUpiIntent, updateBalance } from "@/lib/upi";
import { canMakePayment, getDailyLimit, getTodaySpent } from "@/lib/limits";
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
  const [showLimitAlert, setShowLimitAlert] = useState(false);
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

    // CHECK DAILY LIMIT FIRST
    const { canPay } = canMakePayment(numericAmount);
    if (!canPay) {
      setShowLimitAlert(true);
      return;
    }

    setChecking(true);
    setPinMode("pay");
    
    try {
      const result = await checkFraud(generateFeatures(contact, numericAmount), contact.upi, numericAmount);
      const isDatabaseRisky = contact.isRisky || contact.name.toLowerCase().includes("amazon");
      setChecking(false);
      
      if (result.isFraud || isDatabaseRisky) {
        setFraudScore(isDatabaseRisky ? 92 : result.score);
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
        description: `Could not reach ${BACKEND_IP}.`,
      });
    }
  };

  const onPinSuccess = () => {
    setShowPinPad(false);
    if (pinMode === "balance") {
      setViewingBalance(selectedBank);
      setTimeout(() => setViewingBalance(null), 5000);
    } else {
      updateBalance(numericAmount, "debit");
      navigate("/success", { state: { contact, amount: numericAmount, score: fraudScore } });
    }
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];

  return (
    <PhoneShell hideNav>
      <header className="px-5 pt-8 pb-3 flex items-center gap-3 animate-fade-in">
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
          <span className={cn("font-display text-6xl font-semibold tabular-nums tracking-tight", !amount && "text-muted-foreground/40")}>
            {amount || "0"}
          </span>
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-3 gap-1.5 animate-slide-up">
        {keys.map((k) => (
          <button key={k} onClick={() => press(k)} className="py-3.5 rounded-2xl text-xl font-display font-medium hover:bg-secondary transition-base">
            {k === "del" ? "⌫" : k}
          </button>
        ))}
      </div>

      {showBanks && (
        <div className="px-5 mt-4 space-y-2 animate-in slide-in-from-bottom duration-300">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-1">Choose Bank Account</p>
          {banks.map((bank, i) => (
            <div 
              key={bank.name}
              onClick={() => setSelectedBank(i)}
              className={cn("flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer", selectedBank === i ? "bg-primary/5 border-primary" : "bg-card border-border")}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", selectedBank === i ? "border-primary" : "border-muted-foreground/30")}>
                  {selectedBank === i && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">{bank.name}</p>
                  <p className="text-[10px] text-muted-foreground">{bank.account}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 mt-8 mb-8">
        <button
          onClick={() => {
            const { canPay } = canMakePayment(numericAmount);
            if (!canPay && numericAmount > 0) {
              setShowLimitAlert(true);
              return;
            }
            showBanks ? handlePay() : setShowBanks(true);
          }}
          disabled={numericAmount <= 0 || checking}
          className={cn(
            "w-full py-4 rounded-2xl font-display font-semibold text-primary-foreground transition-base flex items-center justify-center gap-2",
            numericAmount > 0 ? "bg-gradient-primary shadow-glow" : "bg-muted text-muted-foreground"
          )}
        >
          {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : (showBanks ? `Pay ₹${numericAmount.toLocaleString("en-IN")}` : "Proceed")}
        </button>
      </div>

      <BiometricPrompt isOpen={showBiometric} onClose={() => setShowBiometric(false)} onSuccess={onBiometricSuccess} type={contact.trust === "trusted" ? "face" : "fingerprint"} />
      <UpiPinPad isOpen={showPinPad} onClose={() => setShowPinPad(false)} onSuccess={onPinSuccess} payeeName={contact.name} amount={numericAmount} />

      {/* Limit Alert Dialog */}
      <AlertDialog open={showLimitAlert} onOpenChange={setShowLimitAlert}>
        <AlertDialogContent className="rounded-[32px] max-w-[90%] w-[340px]">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
              <Ban className="w-6 h-6 text-amber-600" />
            </div>
            <AlertDialogTitle className="text-center font-display text-xl">Daily Limit Exceeded</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You've set a daily limit of <b>₹{getDailyLimit().toLocaleString("en-IN")}</b>. 
              <br/><br/>
              Remaining today: <span className="text-amber-600 font-bold">₹{Math.max(getDailyLimit() - getTodaySpent(), 0).toLocaleString("en-IN")}</span>. 
              Please reduce the amount or change your limit in settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowLimitAlert(false)} className="bg-primary text-primary-foreground rounded-2xl py-6 w-full">
              Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Fraud Alert */}
      <AlertDialog open={showFraudAlert} onOpenChange={setShowFraudAlert}>
        <AlertDialogContent className="rounded-[32px] max-w-[90%] w-[340px]">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <ShieldAlert className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center font-display text-xl">Fraud Detected!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Our AI model has flagged this transaction as highly suspicious.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            <AlertDialogAction onClick={viewRiskDetails} className="bg-destructive text-white rounded-2xl py-6">View Risk Details</AlertDialogAction>
            <AlertDialogCancel onClick={() => navigate("/")} className="rounded-2xl py-6">Cancel Payment</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PhoneShell>
  );
};

export default Pay;
