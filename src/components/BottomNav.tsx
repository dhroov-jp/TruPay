import { Home, Send, Clock, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const { t } = useTranslation();
  
  const items = [
    { to: "/", icon: Home, label: t("Home") },
    { to: "/send", icon: Send, label: t("Send") },
    { to: "/history", icon: Clock, label: t("History") },
    { to: "/shield", icon: ShieldCheck, label: t("Shield") },
  ];

  return (
    <div className="pointer-events-auto bg-card/90 backdrop-blur-xl border border-border rounded-[28px] shadow-elevated px-2 py-2 flex items-center justify-between">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-2xl transition-base",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn("p-1.5 rounded-xl transition-base", isActive && "bg-primary/10")}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 2} />
                </div>
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
    </div>
  );
};
