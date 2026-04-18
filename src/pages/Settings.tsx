import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Bell, Shield, User, ChevronRight, Lock, HelpCircle } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { getTheme, setTheme, Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const Settings = () => {
  const navigate = useNavigate();
  const [theme, setAppTheme] = useState<Theme>(getTheme());

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setAppTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <PhoneShell>
      <div className="flex flex-col h-full bg-background select-none">
        {/* Header */}
        <header className="shrink-0 px-6 pt-10 pb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-display font-black">Settings</h1>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-8 pb-10">
          {/* Appearance Section */}
          <section className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 px-2">Appearance</p>
            <div className="bg-card border border-border/50 rounded-[32px] overflow-hidden shadow-sm">
              <div 
                onClick={toggleTheme}
                className="flex items-center justify-between p-5 hover:bg-secondary/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                    theme === "dark" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-500"
                  )}>
                    {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">Dark Mode</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Toggle app theme</p>
                  </div>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full p-1 transition-all duration-300",
                  theme === "dark" ? "bg-primary" : "bg-muted"
                )}>
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white transition-all duration-300 transform",
                    theme === "dark" ? "translate-x-6" : "translate-x-0"
                  )} />
                </div>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 px-2">Security</p>
            <div className="bg-card border border-border/50 rounded-[32px] overflow-hidden shadow-sm divide-y divide-border/50">
              <SettingItem 
                icon={<Shield className="w-5 h-5" />} 
                title="AI Shield Status" 
                subtitle="High-protection enabled" 
                color="text-emerald-500 bg-emerald-500/10" 
              />
              <SettingItem 
                icon={<Lock className="w-5 h-5" />} 
                title="Biometric Lock" 
                subtitle="On payment & launch" 
                color="text-primary bg-primary/10" 
              />
            </div>
          </section>

          {/* General Section */}
          <section className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 px-2">General</p>
            <div className="bg-card border border-border/50 rounded-[32px] overflow-hidden shadow-sm divide-y divide-border/50">
              <SettingItem 
                icon={<User className="w-5 h-5" />} 
                title="Personal Info" 
                subtitle="KYC & Bank details" 
                color="text-zinc-500 bg-zinc-100" 
              />
              <SettingItem 
                icon={<Bell className="w-5 h-5" />} 
                title="Notifications" 
                subtitle="Transaction & Fraud alerts" 
                color="text-zinc-500 bg-zinc-100" 
              />
              <SettingItem 
                icon={<HelpCircle className="w-5 h-5" />} 
                title="Support" 
                subtitle="Help center & Report" 
                color="text-zinc-500 bg-zinc-100" 
              />
            </div>
          </section>

        </div>
      </div>
    </PhoneShell>
  );
};

const SettingItem = ({ icon, title, subtitle, color }: { icon: any, title: string, subtitle: string, color: string }) => (
  <div className="flex items-center justify-between p-5 hover:bg-secondary/30 transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-colors", color)}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-[10px] text-muted-foreground font-medium">{subtitle}</p>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
  </div>
);

export default Settings;
