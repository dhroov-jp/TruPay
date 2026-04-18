import { Shield, ShieldCheck, AlertTriangle, Activity, Sparkles } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";

const stats = [
  { icon: ShieldCheck, label: "Payments scanned", value: "127", tint: "text-primary bg-primary/10" },
  { icon: AlertTriangle, label: "Frauds blocked", value: "4", tint: "text-destructive bg-destructive/10" },
  { icon: Activity, label: "Avg risk score", value: "8%", tint: "text-success bg-success/10" },
];

const protections = [
  { title: "Lookalike VPA detection", desc: "Catches handle impersonation via character substitution." },
  { title: "Community fraud reports", desc: "Cross-checks every payee against 1.2M reported scam VPAs." },
  { title: "Behavioural scoring", desc: "Flags unusual amounts, time, and payee patterns in real time." },
  { title: "Reverse-collect detection", desc: "Warns when an incoming 'refund' is actually a debit." },
  { title: "QR tamper checks", desc: "Verifies merchant identity before merchant payments." },
];

const Shield_ = () => (
  <PhoneShell>
    <header className="px-5 pt-12 pb-4 animate-fade-in">
      <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
        AI Shield
        <Sparkles className="w-4 h-4 text-primary" />
      </h1>
      <p className="text-xs text-muted-foreground">Explainable fraud protection for every UPI payment.</p>
    </header>

    {/* Hero */}
    <section className="px-5 animate-slide-up">
      <div className="rounded-3xl bg-gradient-shield text-primary-foreground p-5 shadow-elevated relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center animate-shield-pulse">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-primary-foreground/80">Status</p>
            <p className="font-display text-xl font-semibold">Active & monitoring</p>
            <p className="text-xs text-primary-foreground/80">Updated just now</p>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="px-5 mt-4 grid grid-cols-3 gap-2 animate-slide-up" style={{ animationDelay: "60ms" }}>
      {stats.map(({ icon: Icon, label, value, tint }) => (
        <div key={label} className="bg-card border border-border rounded-2xl p-3 shadow-card">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${tint}`}>
            <Icon className="w-4 h-4" />
          </div>
          <p className="font-display text-lg font-semibold leading-none">{value}</p>
          <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{label}</p>
        </div>
      ))}
    </section>

    {/* What's protected */}
    <section className="px-5 mt-5 animate-slide-up" style={{ animationDelay: "120ms" }}>
      <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-2 px-1">
        Active protections
      </h2>
      <div className="bg-card border border-border rounded-2xl divide-y divide-border shadow-card overflow-hidden">
        {protections.map((p) => (
          <div key={p.title} className="p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight">{p.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <p className="text-center text-[10px] text-muted-foreground mt-6 px-8 leading-relaxed">
      TruPay Shield uses on-device AI signals + community fraud intelligence. We never read your messages or PIN.
    </p>
  </PhoneShell>
);

export default Shield_;
