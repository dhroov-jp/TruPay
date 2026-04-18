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
  scenario: ScamScenario;
  score: number;
}

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
    const target = state.score;
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
  const { scenario, contact, amount } = state;

  const summary = scenario.aiSummary.replace("{amount}", amount.toLocaleString("en-IN"));

  const sevColor = (s: "high" | "medium" | "low") =>
    s === "high"
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : s === "medium"
      ? "bg-warning/15 text-warning-foreground border-warning/30"
      : "bg-muted text-muted-foreground border-border";

  return (
    <PhoneShell hideNav>
      {/* Header */}
      <header className="px-5 pt-12 pb-3 flex items-center gap-3 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-[11px] text-destructive font-semibold tracking-widest uppercase">AI Shield Alert</p>
          <p className="text-sm font-semibold">Payment held for review</p>
        </div>
        <ShieldAlert className="w-5 h-5 text-destructive animate-pulse" />
      </header>

      {/* Risk score ring */}
      <section className="px-5 mt-2 animate-slide-up">
        <div className="rounded-3xl bg-gradient-danger text-destructive-foreground p-5 shadow-danger relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <RiskRing score={animatedScore} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-destructive-foreground/80">Fraud Risk</p>
              <p className="font-display text-3xl font-bold leading-tight">{animatedScore}%</p>
              <p className="text-xs text-destructive-foreground/90 mt-1 font-medium">{scenario.scamType}</p>
            </div>
          </div>
          <p className="text-xs text-destructive-foreground/90 mt-3 leading-relaxed">{scenario.tagline}</p>
        </div>
      </section>

      {/* Payee + amount */}
      <section className="px-5 mt-3 animate-slide-up" style={{ animationDelay: "60ms" }}>
        <div className="rounded-2xl bg-card border border-border p-3.5 flex items-center gap-3 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center font-display font-semibold text-sm">
            {contact.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{contact.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{contact.upi}</p>
          </div>
          <p className="font-display text-base font-semibold">₹{amount.toLocaleString("en-IN")}</p>
        </div>
      </section>

      {/* AI summary */}
      <Block icon={<Lightbulb className="w-4 h-4" />} title="Why our AI flagged this" delay={120}>
        <p className="text-sm leading-relaxed text-foreground/85">{summary}</p>
      </Block>

      {/* Detection rules */}
      <Block icon={<AlertTriangle className="w-4 h-4" />} title="Triggered detection rules" delay={180}>
        <div className="space-y-2">
          {scenario.rules.map((r) => (
            <div key={r.id} className="flex gap-3 items-start">
              <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border shrink-0 mt-0.5", sevColor(r.severity))}>
                {r.severity}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* Attack flow */}
      <Block icon={<ChevronRight className="w-4 h-4" />} title="How this scam works" delay={240}>
        <ol className="relative border-l-2 border-dashed border-border ml-2 space-y-3">
          {scenario.attackFlow.map((s) => (
            <li key={s.step} className="pl-4 relative">
              <span className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center font-display">
                {s.step}
              </span>
              <p className="text-sm font-semibold leading-tight">{s.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{s.description}</p>
            </li>
          ))}
        </ol>
      </Block>

      {/* Recommendation */}
      <section className="px-5 mt-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
        <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4">
          <p className="text-[11px] uppercase tracking-widest text-destructive font-bold mb-1">Recommended action</p>
          <p className="text-sm font-medium leading-relaxed text-foreground">{scenario.recommendation}</p>
        </div>
      </section>

      {/* Actions */}
      <section className="px-5 mt-5 mb-8 space-y-2 animate-slide-up" style={{ animationDelay: "360ms" }}>
        <button
          onClick={() => navigate("/", { replace: true })}
          className="w-full py-4 rounded-2xl bg-gradient-primary text-primary-foreground font-display font-semibold shadow-glow flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" /> Cancel Payment (recommended)
        </button>
        <button
          onClick={() => navigate("/", { replace: true })}
          className="w-full py-3 rounded-2xl bg-card border border-border text-sm font-medium flex items-center justify-center gap-2 hover:border-destructive/40 transition-base"
        >
          <Flag className="w-4 h-4 text-destructive" /> Report this VPA to bank
        </button>
        <button
          onClick={() => navigate("/", { replace: true })}
          className="w-full py-3 text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          I understand the risk — proceed anyway
        </button>
      </section>
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
    <div className="rounded-2xl bg-card border border-border p-4 shadow-card">
      <div className="flex items-center gap-2 mb-3 text-primary">
        {icon}
        <h3 className="font-display font-semibold text-sm text-foreground">{title}</h3>
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
        <circle cx="40" cy="40" r={r} stroke="currentColor" strokeWidth="6" fill="none" className="text-white/20" />
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
          className="text-white transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <ShieldAlert className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};

export default Risk;
