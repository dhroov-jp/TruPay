import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Send, ScanLine, Clock, ShieldCheck, ArrowUpRight, ArrowDownLeft, Shield } from "lucide-react";
import { useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { TRANSACTIONS } from "@/data/mockData";
import { getBalance } from "@/lib/upi";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { cn } from "@/lib/utils";

const Home = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const balance = getBalance();

  const quickActions = [
    { icon: Send, label: "Send", to: "/send", primary: true },
    { icon: ScanLine, label: "Scan QR", to: "/scan" },
    { icon: Clock, label: "History", to: "/history" },
    { icon: ShieldCheck, label: "Shield", to: "/shield" },
  ];

  return (
    <PhoneShell>
      {/* Header */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between animate-fade-in">
        <div>
          <p className="text-xs text-muted-foreground">Good evening</p>
          <h1 className="text-lg font-display font-semibold">Arjun Patel</h1>
        </div>
        <div 
          onClick={() => setIsProfileOpen(true)}
          className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-semibold shadow-card cursor-pointer hover:scale-105 transition-transform"
        >
          AP
        </div>
      </header>

      {/* Balance Card */}
      <section className="px-5 animate-slide-up">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-balance text-primary-foreground p-5 shadow-elevated">
          <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-accent/20 blur-2xl" />
          <div className="relative flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-primary-foreground/70">Total Balance</span>
            <button
              onClick={() => setShowBalance((v) => !v)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-base"
            >
              {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="relative">
            <p className="font-display text-4xl font-semibold tracking-tight">
              {showBalance ? `₹ ${balance.toLocaleString("en-IN").split(".")[0]}` : "₹ ••••••"}
              <span className="text-lg text-primary-foreground/60">.{balance.toFixed(2).split(".")[1]}</span>
            </p>
            <p className="text-xs text-primary-foreground/70 mt-2">HDFC •••• 4421 · UPI Linked</p>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-5 mt-5 grid grid-cols-4 gap-2 animate-slide-up" style={{ animationDelay: "60ms" }}>
        {quickActions.map(({ icon: Icon, label, to, primary }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div
              className={cn(
                "w-full aspect-square rounded-2xl flex items-center justify-center transition-base shadow-card",
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

      {/* AI Shield status */}
      <section
        className="px-5 mt-5 animate-slide-up"
        style={{ animationDelay: "120ms" }}
        onClick={() => navigate("/shield")}
      >
        <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3 shadow-card cursor-pointer hover:border-primary/40 transition-base">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-shield flex items-center justify-center text-primary-foreground animate-shield-pulse">
              <Shield className="w-5 h-5" strokeWidth={2.4} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold flex items-center gap-2">
              AI Shield Active
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Protected 4 transactions this week · 1 fraud blocked
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </section>

      {/* Recent transactions */}
      <section className="px-5 mt-6 animate-slide-up" style={{ animationDelay: "180ms" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold">Recent activity</h2>
          <button onClick={() => navigate("/history")} className="text-xs text-primary font-medium">
            View all
          </button>
        </div>
        <div className="space-y-2">
          {TRANSACTIONS.slice(0, 4).map((t) => {
            const isSent = t.type === "sent";
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3 shadow-card"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isSent ? "bg-secondary text-foreground" : "bg-success/10 text-success"
                  )}
                >
                  {isSent ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate flex items-center gap-1.5">
                    {t.name}
                    {t.shielded && (
                      <ShieldCheck className="w-3 h-3 text-primary shrink-0" strokeWidth={2.5} />
                    )}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{t.time}</p>
                </div>
                <p
                  className={cn(
                    "text-sm font-display font-semibold tabular-nums",
                    isSent ? "text-foreground" : "text-success"
                  )}
                >
                  {isSent ? "−" : "+"} ₹{t.amount.toLocaleString("en-IN")}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </PhoneShell>
  );
};

export default Home;
