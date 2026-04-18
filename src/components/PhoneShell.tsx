import { ReactNode } from "react";
import { ShieldCheck, Sparkles, Lock } from "lucide-react";
import { BottomNav } from "./BottomNav";

interface Props {
  children: ReactNode;
  hideNav?: boolean;
}

export const PhoneShell = ({ children, hideNav }: Props) => {
  return (
    <div className="min-h-screen w-full bg-gradient-mesh bg-background">
      {/* Mobile: full-bleed app */}
      <div className="lg:hidden flex justify-center">
        <div className="w-full max-w-[440px] min-h-screen bg-background relative overflow-hidden">
          <div className="pb-28 min-h-screen">{children}</div>
          {!hideNav && (
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 px-4 pb-4 pt-2 pointer-events-none">
              <BottomNav />
            </nav>
          )}
        </div>
      </div>

      {/* Desktop: marketing layout + phone mockup */}
      <div className="hidden lg:grid min-h-screen grid-cols-2 gap-12 px-16 py-12 max-w-[1400px] mx-auto items-center">
        <DesktopHero />
        <div className="flex justify-center">
          <PhoneFrame hideNav={hideNav}>{children}</PhoneFrame>
        </div>
      </div>
    </div>
  );
};

const PhoneFrame = ({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) => (
  <div className="relative">
    {/* Glow */}
    <div className="absolute -inset-8 bg-gradient-shield opacity-20 blur-3xl rounded-[60px] -z-10" />
    {/* Bezel */}
    <div className="w-[400px] h-[820px] bg-foreground rounded-[52px] p-3 shadow-elevated">
      <div className="relative w-full h-full bg-background rounded-[42px] overflow-hidden">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-foreground rounded-full z-50" />
        <div className="w-full h-full overflow-y-auto no-scrollbar pb-28">
          {children}
        </div>
        {!hideNav && (
          <nav className="absolute bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 pointer-events-none">
            <BottomNav />
          </nav>
        )}
      </div>
    </div>
  </div>
);

const DesktopHero = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-card">
      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
      <span className="text-xs font-medium">AI-powered UPI protection</span>
    </div>
    <div>
      <h1 className="font-display text-6xl font-semibold tracking-tight leading-[1.05]">
        Pay safely.
        <br />
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          Shielded by AI.
        </span>
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-md">
        TruPay Shield scans every UPI payment in real-time and explains exactly why a transaction
        looks suspicious — before your money leaves.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-3 max-w-md">
      <Feature
        icon={<Sparkles className="w-4 h-4" />}
        title="Explainable fraud detection"
        desc="See the scam type, risk score, and attack flow."
      />
      <Feature
        icon={<Lock className="w-4 h-4" />}
        title="Zero data leaves your device"
        desc="On-device ML models keep your payments private."
      />
      <Feature
        icon={<ShieldCheck className="w-4 h-4" />}
        title="Stops 4 classic UPI scams"
        desc="KYC, refund, fake handle, QR tamper — all blocked."
      />
    </div>
    <p className="text-xs text-muted-foreground">
      Try it live in the phone preview → tap <span className="font-semibold text-foreground">Send</span> and pick a risky payee.
    </p>
  </div>
);

const Feature = ({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) => (
  <div className="flex gap-3 p-4 rounded-2xl bg-card border border-border shadow-card">
    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
  </div>
);
