import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  Send, 
  ScanLine, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Shield 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PhoneShell } from "@/components/PhoneShell";
import { getTransactions } from "@/lib/transactions";
import { getBalance } from "@/lib/upi";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { cn } from "@/lib/utils";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const balance = useMemo(() => getBalance(), []);
  const transactions = getTransactions();
  const userName = localStorage.getItem("trupay_user_name") || "User";

  const QUICK_ACTIONS = [
    { icon: Send, label: t("Send"), to: "/send", primary: true },
    { icon: ScanLine, label: t("Scan QR"), to: "/scan" },
    { icon: Clock, label: t("History"), to: "/history" },
    { icon: ShieldCheck, label: t("Shield"), to: "/shield" },
  ];

  const OFFERS = [
    { id: 1, title: t("Flat ₹50 Cashback"), desc: t("On first bill payment"), icon: "🎟️", color: "from-orange-400 to-red-500" },
    { id: 2, title: t("20% Off Zomato"), desc: t("Use code TRUPAY20"), icon: "🍕", color: "from-blue-400 to-indigo-500" },
    { id: 3, title: t("Earn 2X Coins"), desc: t("On every Scan & Pay"), icon: "🪙", color: "from-yellow-400 to-amber-600" },
  ];

  return (
    <PhoneShell>
      {/* Header Section */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between animate-fade-in">
        <div>
          <p className="text-xs text-muted-foreground">{t("Good evening")}</p>
          <h1 className="text-lg font-display font-semibold truncate max-w-[150px]">{userName}</h1>
        </div>
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-semibold shadow-card hover:scale-105 transition-transform shrink-0"
        >
          {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
        </button>
      </header>

      {/* Wallet Card */}
      <section className="px-5 animate-slide-up">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-balance text-primary-foreground p-5 shadow-elevated">
          <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-primary-foreground/70">{t("Total Balance")}</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="relative">
            <p className="font-display text-4xl font-semibold tracking-tight">
              {showBalance ? `₹ ${balance.toLocaleString("en-IN").split(".")[0]}` : "₹ ••••••"}
              <span className="text-lg text-primary-foreground/60">.{balance.toFixed(2).split(".")[1]}</span>
            </p>
            <p className="text-xs text-primary-foreground/70 mt-2">HDFC •••• 4421 · {t("UPI Linked")}</p>
          </div>
        </div>
      </section>

      {/* Grid Actions */}
      <section className="px-5 mt-5 grid grid-cols-4 gap-2 animate-slide-up" style={{ animationDelay: "60ms" }}>
        {QUICK_ACTIONS.map(({ icon: Icon, label, to, primary }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div
              className={cn(
                "w-full aspect-square rounded-2xl flex items-center justify-center transition-all shadow-card",
                primary
                  ? "bg-gradient-primary text-primary-foreground group-hover:shadow-glow"
                  : "bg-card border border-border text-primary group-hover:border-primary/40"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <span className="text-[11px] font-medium">{label}</span>
          </button>
        ))}
      </section>

      {/* AI Security Banner */}
      <section
        className="px-5 mt-5 animate-slide-up"
        style={{ animationDelay: "120ms" }}
        onClick={() => navigate("/shield")}
      >
        <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3 shadow-card cursor-pointer hover:border-primary/40 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-gradient-shield flex items-center justify-center text-primary-foreground animate-shield-pulse">
            <Shield className="w-5 h-5" strokeWidth={2.4} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold flex items-center gap-2">
              {t("AI Shield Active")}
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {t("Protected 4 transactions this week")} · {t("1 fraud blocked")}
            </p>
          </div>
        </div>
      </section>

      {/* Rewards & Offers Section */}
      <section className="mt-6 animate-slide-up" style={{ animationDelay: "150ms" }}>
        <div className="px-5 flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold">{t("Rewards & Offers")}</h2>
          <button 
            onClick={() => navigate("/rewards")}
            className="text-xs text-primary font-medium hover:underline"
          >
            {t("View Store")}
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-5 pb-2 no-scrollbar">
          {OFFERS.map((offer) => (
            <div 
              key={offer.id}
              className="flex-shrink-0 w-[240px] p-4 rounded-2xl bg-card border border-border shadow-sm flex items-start gap-3 hover:border-primary/20 transition-all cursor-pointer"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br shadow-sm", offer.color)}>
                {offer.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{offer.title}</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{offer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transaction Feed */}
      <section className="px-5 mt-6 animate-slide-up" style={{ animationDelay: "180ms" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold">{t("Recent activity")}</h2>
          <button onClick={() => navigate("/history")} className="text-xs text-primary font-medium">
            {t("View all")}
          </button>
        </div>
        <div className="space-y-2">
          {transactions.length > 0 ? (
            transactions.slice(0, 4).map((t) => {
              const isSent = t.type === "sent";
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3 shadow-card"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isSent ? "bg-secondary text-foreground" : "bg-success/10 text-success"
                  )}>
                    {isSent ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate flex items-center gap-1.5">
                      {t.name}
                      {t.shielded && <ShieldCheck className="w-3 h-3 text-primary shrink-0" strokeWidth={2.5} />}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{t.time}</p>
                  </div>
                  <p className={cn(
                    "text-sm font-display font-semibold tabular-nums",
                    isSent ? "text-foreground" : "text-success"
                  )}>
                    {isSent ? "−" : "+"} ₹{t.amount.toLocaleString("en-IN")}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-6 rounded-3xl bg-card/50 border border-dashed border-border text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t("No transactions yet")}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">{t("Your recent activity will appear here.")}</p>
            </div>
          )}
        </div>
      </section>

      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </PhoneShell>
  );
};

export default Home;
