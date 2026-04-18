import { ShieldCheck, ShieldAlert, Sparkles } from "lucide-react";
import { TrustLevel } from "@/data/mockData";
import { cn } from "@/lib/utils";

const config = {
  trusted: { label: "Trusted", icon: ShieldCheck, classes: "bg-success/10 text-success border-success/20" },
  new: { label: "New Payee", icon: Sparkles, classes: "bg-warning/15 text-warning-foreground border-warning/30" },
  risky: { label: "Risky", icon: ShieldAlert, classes: "bg-destructive/10 text-destructive border-destructive/20" },
} as const;

export const TrustBadge = ({ trust, compact }: { trust: TrustLevel; compact?: boolean }) => {
  const { label, icon: Icon, classes } = config[trust];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        classes
      )}
    >
      <Icon className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} strokeWidth={2.5} />
      {label}
    </span>
  );
};
