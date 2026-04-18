import { ShieldCheck, ShieldAlert, Sparkles } from "lucide-react";
import { TrustLevel } from "@/data/mockData";
import { cn } from "@/lib/utils";

const config = {
  trusted: { label: "Trusted", icon: ShieldCheck, classes: "bg-success/10 text-success border-success/20" },
  new: { label: "New Payee", icon: Sparkles, classes: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  risky: { label: "Risky", icon: ShieldAlert, classes: "bg-destructive/10 text-destructive border-destructive/20" },
} as const;

export const TrustBadge = ({ trust, compact }: { trust: TrustLevel | any; compact?: boolean }) => {
  // Defensive check to prevent destructuring errors if trust is undefined or unrecognized
  const trustKey = (trust && config[trust as keyof typeof config]) ? (trust as keyof typeof config) : "new";
  const { label, icon: Icon, classes } = config[trustKey];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium transition-all duration-300",
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        classes
      )}
    >
      <Icon className={compact ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} strokeWidth={2.5} />
      {label}
    </span>
  );
};
