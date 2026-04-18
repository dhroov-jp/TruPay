import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldAlert, AlertTriangle, ChevronRight, Lightbulb, X, Flag } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { Contact, ScamScenario } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface State {
  contact: Contact;
  amount: number;
  note: string;
  scenario?: ScamScenario; // Made optional
  score: number;
}

const DEFAULT_SCENARIO: ScamScenario = {
  scamType: "Suspicious Activity Detected",
  tagline: "AI Shield has detected patterns often associated with financial fraud.",
  aiSummary: "Your payment of ₹{amount} was flagged because the recipient's behavioral patterns match known high-risk signatures in our database.",
  rules: [
    { id: "R1", label: "High Risk Recipient", detail: "This VPA has been flagged for unusual transaction volume.", severity: "high" },
    { id: "R2", label: "Pattern Mismatch", detail: "The payment behavior does not align with typical peer-to-peer transfers.", severity: "medium" }
  ],
  attackFlow: [
    { step: 1, title: "Initial Contact", description: "The sender is contacted via social media or messaging apps." },
    { step: 2, title: "Pressure Tactic", description: "Urgency is created to force a quick payment." },
    { step: 3, title: "Payment Request", description: "Funds are requested via a specific UPI handle." }
  ],
  recommendation: "Cancel this payment and verify the recipient's identity through a secondary, trusted channel."
};

const Risk = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as State | undefined;
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, [state, navigate]);

  useEffect(() => {
    if (!state) return;
    let frame = 0;
    const target = state.score || 70;
    const id = setInterval(() => {
      frame += 2;
      if (frame >= target) {
        setAnimatedScore(target);
        clearInterval(id);
      } else {
        setAnimatedScore(frame);
      }
    }, 16);
    return () => clearInterval(id);
  }, [state]);

  if (!state) return null;
  const { contact, amount } = state;
  const scenario = state.scenario || DEFAULT_SCENARIO; // Fallback to safe default

  const summary = (scenario.aiSummary || "Suspicious activity detected for amount ₹{amount}").replace("{amount}", amount.toLocaleString("en-IN"));

  const sevColor = (s: "high" | "medium" | "low") =>
    s === "high"
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : s === "medium"
      ? "bg-warning/15 text-warning-foreground border-warning/30"
      : "bg-muted text-muted-foreground border-border";

  return (
    <PhoneShell hideNav>
      <div className="flex flex-col h-full bg-background overflow-hidden">
        {/* Header */}
        <header className="shrink-0 px-5 pt-12 pb-3 flex items-center gap-3 animate-fade-in border-b border-border/10">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <p className="text-[10px] text-destructive font-black tracking-[0.2em] uppercase">AI Shield Alert</p>
            <p className="text-sm font-bold">Risk Assessment Report</p>
          </div>
          <ShieldAlert className="w-5 h-5 text-destructive animate-pulse" />
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          {/* Risk score ring */}
          <section className="px-5 mt-4 animate-slide-up">
            <div className="rounded-[32px] bg-zinc-900 text-white p-6 shadow-2xl relative overflow-hidden border border-white/5">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-destructive/20 blur-3xl opacity-50" />
              <div className="relative flex items-center gap-6">
                <RiskRing score={animatedScore} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black mb-1">Risk Score</p>
                  <p className="font-display text-4xl font-black leading-tight text-white">{animatedScore}%</p>
                  <p className="text-xs text-destructive font-bold mt-1 uppercase tracking-wider">{scenario.scamType}</p>
                </div>
              </div>
              <p className="text-xs text-white/60 mt-4 leading-relaxed font-medium">{scenario.tagline}</p>
            </div>
          </section>

          {/* Payee + amount */}
          <section className="px-5 mt-4 animate-slide-up" style={{ animationDelay: "60ms" }}>
            <div className="rounded-[28px] bg-card border border-border p-4 flex items-center gap-4 shadow-card">
              <div className="w-11 h-11 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center font-display font-black text-sm">
                {contact.initials || contact.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black truncate">{contact.name}</p>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-medium">{contact.upi}</p>
              </div>
              <p className="font-display text-lg font-black text-foreground">₹{amount.toLocaleString("en-IN")}</p>
            </div>
          </section>

          {/* AI summary */}
          <Block icon={<Lightbulb className="w-4 h-4" />} title="Why our AI flagged this" delay={120}>
            <p className="text-sm leading-relaxed text-foreground/80 font-medium">{summary}</p>
          </Block>

          {/* Detection rules */}
          <Block icon={<AlertTriangle className="w-4 h-4" />} title="Triggered detection rules" delay={180}>
            <div className="space-y-3">
              {(scenario.rules || []).map((r) => (
                <div key={r.id} className="flex gap-4 items-start">
                  <span className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shrink-0 mt-0.5 shadow-sm", sevColor(r.severity))}>
                    {r.severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 font-medium">{r.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Block>

          {/* Attack flow */}
          <Block icon={<ChevronRight className="w-4 h-4" />} title="How this scam works" delay={240}>
            <ol className="relative border-l-2 border-dashed border-border/50 ml-2.5 space-y-5 my-2">
              {(scenario.attackFlow || []).map((s) => (
                <li key={s.step} className="pl-6 relative">
                  <span className="absolute -left-[13px] top-0 w-6 h-6 rounded-xl bg-zinc-900 text-white text-[10px] font-black flex items-center justify-center font-display border border-white/10 shadow-lg">
                    {s.step}
                  </span>
                  <p className="text-sm font-bold leading-tight text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-medium">{s.description}</p>
                </li>
              ))}
            </ol>
          </Block>

          {/* Recommendation */}
          <section className="px-5 mt-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="rounded-[28px] border-2 border-destructive/20 bg-destructive/5 p-5 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-destructive font-black mb-2">Recommended action</p>
              <p className="text-sm font-bold leading-relaxed text-foreground">{scenario.recommendation}</p>
            </div>
          </section>

          {/* Actions */}
          <section className="px-5 mt-6 mb-10 space-y-3 animate-slide-up" style={{ animationDelay: "360ms" }}>
            <button
              onClick={() => navigate("/", { replace: true })}
              className="w-full py-5 rounded-[28px] bg-destructive text-white font-display font-black text-lg shadow-glow-destructive flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" /> Cancel Payment
            </button>
            <button
              onClick={() => navigate("/", { replace: true })}
              className="w-full py-4 rounded-2xl bg-card border border-border text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-2 hover:border-destructive/40 hover:text-destructive transition-all"
            >
              <Flag className="w-4 h-4 text-destructive" /> Report VPA
            </button>
            <button
              onClick={() => navigate("/", { replace: true })}
              className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              I understand the risk — proceed anyway
            </button>
          </section>
        </div>
      </div>
    </PhoneShell>
  );
};

const Block = ({
  icon,
  title,
  children,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: number;
}) => (
  <section className="px-5 mt-4 animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
    <div className="rounded-[32px] bg-card border border-border p-5 shadow-card overflow-hidden">
      <div className="flex items-center gap-3 mb-4 text-primary">
        <div className="p-2 rounded-xl bg-primary/10">
          {icon}
        </div>
        <h3 className="font-display font-black text-[10px] uppercase tracking-[0.2em] text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  </section>
);

const RiskRing = ({ score }: { score: number }) => {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} stroke="currentColor" strokeWidth="6" fill="none" className="text-white/10" />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="text-destructive transition-all duration-1000 ease-out shadow-glow-destructive"
          style={{ filter: "drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <ShieldAlert className="w-6 h-6 text-destructive" />
      </div>
    </div>
  );
};

export default Risk;
