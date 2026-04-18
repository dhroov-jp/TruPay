import { Shield as ShieldIcon, ShieldCheck, Zap, Users, Fingerprint, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PhoneShell } from "@/components/PhoneShell";
import { cn } from "@/lib/utils";

const Shield = () => {
  const { t } = useTranslation();

  return (
    <PhoneShell>
      <div className="px-5 pt-8 pb-24">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="font-display text-3xl font-bold">{t("AI Shield")}</h1>
            <Zap className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("Explainable fraud protection for every UPI payment.")}
          </p>
        </header>

        {/* Status Card */}
        <section className="mb-8 animate-slide-up">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-shield p-6 text-white shadow-glow">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldIcon className="w-32 h-32" />
            </div>
            <div className="relative flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">{t("STATUS")}</p>
                <h2 className="text-2xl font-display font-bold">{t("Active & monitoring")}</h2>
                <p className="text-xs text-white/60 mt-1">{t("Updated just now")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-3 gap-3 mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <StatCard label={t("Payments scanned")} value="127" icon={Activity} />
          <StatCard label={t("Frauds blocked")} value="4" icon={ShieldIcon} color="text-destructive" />
          <StatCard label={t("Avg risk score")} value="8%" icon={Fingerprint} />
        </section>

        {/* Protection Features */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h3 className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t("ACTIVE PROTECTIONS")}
          </h3>
          
          <ProtectionItem 
            icon={Zap}
            title={t("Lookalike VPA detection")}
            desc={t("Catches handle impersonation via character substitution.")}
          />
          <ProtectionItem 
            icon={Users}
            title={t("Community fraud reports")}
            desc={t("Cross-checks every payee against 1.2M reported scam VPAs.")}
          />
          <ProtectionItem 
            icon={Fingerprint}
            title={t("Behavioural scoring")}
            desc={t("Flags unusual amounts, time, and payee patterns in real time.")}
          />
        </section>
      </div>
    </PhoneShell>
  );
};

const StatCard = ({ label, value, icon: Icon, color = "text-primary" }: { label: string, value: string, icon: any, color?: string }) => (
  <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
    <div className={cn("w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mb-3", color)}>
      <Icon className="w-4 h-4" />
    </div>
    <p className="text-xl font-display font-bold mb-1">{value}</p>
    <p className="text-[10px] text-muted-foreground leading-tight font-medium uppercase tracking-wider">{label}</p>
  </div>
);

const ProtectionItem = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="flex items-start gap-4 p-5 rounded-3xl bg-card border border-border shadow-card hover:border-primary/20 transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
      <Icon className="w-6 h-6" />
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-bold">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Shield;
