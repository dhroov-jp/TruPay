import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Loader2, ShieldAlert, BadgeCheck, Ban, MessageSquare } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { TrustBadge } from "@/components/TrustBadge";
import { Contact, computeRisk } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { generateFeatures, checkFraud } from "@/services/fraudService";
import { BiometricPrompt } from "@/components/BiometricPrompt";
import { UpiPinPad } from "@/components/UpiPinPad";
import { updateBalance } from "@/lib/upi";
import { canMakePayment, getDailyLimit, getTodaySpent } from "@/lib/limits";
import { addTransaction } from "@/lib/transactions";
import { toast } from "sonner";
import { BACKEND_IP } from "@/config";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel
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
          setShowPinPad(true);
        }, 1500);
      }
    } catch (err) {
      setChecking(false);
      toast.error("Fraud Engine Connection Failed", {
        description: `Could not reach ${BACKEND_IP}.`,
      });
    }
  };

  const onBiometricSuccess = () => {
    setShowBiometric(false);
    setShowPinPad(true);
  };

  const onPinSuccess = () => {
    setShowPinPad(false);
    if (pinMode === "balance") {
      setViewingBalance(selectedBank);
      setTimeout(() => setViewingBalance(null), 5000);
    } else {
      addTransaction({
        name: contact.name,
        type: "sent",
        amount: numericAmount,
        shielded: true
      });
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

  const handleCheckBalance = (index: number) => {
    setPinMode("balance");
    setSelectedBank(index);
    setShowPinPad(true);
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];
  const shouldHideButton = showFraudAlert || showLimitAlert;

  return (
    <PhoneShell hideNav>
      <div className="flex flex-col h-full bg-background overflow-hidden select-none">
        {/* Fixed Header */}
        <header className="shrink-0 px-5 pt-10 pb-4 flex items-center gap-4 z-[40]">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mb-0.5">Paying to</p>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-display font-bold truncate">{contact.name}</p>
              <TrustBadge trust={contact.trust} compact />
            </div>
          </div>
        </header>

        {/* Fixed Content - Absolutely No Scrolling */}
        <div className="flex-1 flex flex-col justify-between pt-2 pb-36">
          <div className="px-5 text-center animate-slide-up">
            <p className="text-[10px] text-muted-foreground/60 font-medium mb-6 tabular-nums uppercase tracking-widest">{contact.upi}</p>
            
            <div className="flex items-start justify-center gap-1.5 mb-6">
              <span className="font-display text-4xl font-bold text-muted-foreground mt-2">₹</span>
              <span className={cn(
                "font-display text-6xl font-bold tabular-nums tracking-tighter transition-all duration-300",
                !amount ? "text-muted-foreground/20" : "text-foreground"
              )}>
                {amount || "0"}
              </span>
            </div>
            
            <div className="relative w-full max-w-[280px] mx-auto group mb-4">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <MessageSquare className="w-4 h-4" />
              </div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
                className="w-full bg-secondary/40 border border-transparent rounded-2xl py-3.5 pl-11 pr-4 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background focus:border-primary/30 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="px-5">
            {!showBanks ? (
              <div className="px-5 grid grid-cols-3 gap-x-8 gap-y-2 animate-in fade-in zoom-in-95 duration-300">
                {keys.map((k) => (
                  <button 
                    key={k} 
                    onClick={() => press(k)} 
                    className={cn(
                      "h-14 flex items-center justify-center rounded-2xl text-2xl font-display font-semibold transition-all duration-200 active:scale-90",
                      k === "del" ? "text-muted-foreground hover:text-foreground" : "hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    {k === "del" ? "⌫" : k}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black px-2 mb-3">Choose Account</p>
                {banks.map((bank, i) => (
                  <div 
                    key={bank.name}
                    onClick={() => setSelectedBank(i)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-3xl border-2 transition-all duration-300 cursor-pointer shadow-sm",
                      selectedBank === i ? "bg-primary/5 border-primary" : "bg-card border-transparent hover:border-border"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        selectedBank === i ? "border-primary bg-primary" : "border-muted-foreground/30"
                      )}>
                        {selectedBank === i && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{bank.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{bank.account}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "fixed bottom-0 left-0 right-0 px-5 pb-8 bg-gradient-to-t from-background via-background/95 to-transparent pt-12 z-[100] transition-all duration-500",
          shouldHideButton ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100 pointer-events-auto"
        )}>
          <div className="max-w-[400px] mx-auto">
            <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-4 opacity-50">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              AI Shield Protection Active
            </div>
            
            <button
              onClick={() => showBanks ? handlePay() : setShowBanks(true)}
              disabled={numericAmount <= 0 || checking}
              className={cn(
                "w-full py-5 rounded-[28px] font-display font-black text-lg text-primary-foreground transition-all duration-500 flex items-center justify-center gap-3 active:scale-[0.98]",
                numericAmount > 0 ? "bg-gradient-primary shadow-glow hover:brightness-110" : "bg-muted text-muted-foreground grayscale"
              )}
            >
              {checking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="animate-pulse">Analyzing Risk…</span>
                </>
              ) : (
                <>{showBanks ? `Pay ₹${numericAmount.toLocaleString("en-IN")}` : "Proceed To Pay"}</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlays */}
      <BiometricPrompt isOpen={showBiometric} onClose={() => setShowBiometric(false)} onSuccess={onBiometricSuccess} type={contact.trust === "trusted" ? "face" : "fingerprint"} />
      <UpiPinPad isOpen={showPinPad} onClose={() => setShowPinPad(false)} onSuccess={onPinSuccess} payeeName={contact.name} amount={numericAmount} />

      {/* Redesigned Premium Dark Dialogs */}
      <AlertDialog open={showLimitAlert} onOpenChange={setShowLimitAlert}>
        <AlertDialogContent className="rounded-[40px] max-w-[90%] w-[360px] p-8 bg-zinc-900 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
          <AlertDialogHeader>
            <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
              <Ban className="w-8 h-8 text-amber-500" />
            </div>
            <AlertDialogTitle className="text-center font-display text-2xl font-bold text-white">Limit Exceeded</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-zinc-400 text-base leading-relaxed">
              Daily quota of <b className="text-white">₹{getDailyLimit().toLocaleString("en-IN")}</b> reached.
              <br/><br/>
              Remaining: <span className="text-amber-500 font-bold">₹{Math.max(getDailyLimit() - getTodaySpent(), 0).toLocaleString("en-IN")}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogAction onClick={() => setShowLimitAlert(false)} className="bg-white text-black rounded-2xl py-7 text-lg font-bold w-full hover:bg-zinc-200 transition-colors">
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showFraudAlert} onOpenChange={setShowFraudAlert}>
        <AlertDialogContent className="rounded-[40px] max-w-[90%] w-[360px] p-8 bg-zinc-900 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
          <AlertDialogHeader>
            <div className="mx-auto w-16 h-16 rounded-3xl bg-destructive/20 flex items-center justify-center mb-4 border border-destructive/30">
              <ShieldAlert className="w-8 h-8 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center font-display text-2xl font-bold text-white">Fraud Alert!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-zinc-400 text-base leading-relaxed">
              Our AI Shield has flagged this transaction as <span className="text-destructive font-bold">High Risk</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-3 mt-6">
            <AlertDialogAction onClick={viewRiskDetails} className="bg-destructive text-white rounded-2xl py-7 text-lg font-bold shadow-glow hover:brightness-110 transition-all">
              View Detailed Risk
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => navigate("/home")} className="rounded-2xl py-7 text-lg font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
              Cancel Securely
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PhoneShell>
  );
};

export default Pay;
