import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Scan, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight,
  UserPlus,
  ArrowRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PhoneShell } from "@/components/PhoneShell";
import { cn } from "@/lib/utils";

const Send = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const CONTACTS = [
    { id: 1, name: "Aarav Sharma", upi: "aarav@okicici", trust: "trusted" },
    { id: 2, name: "Priya Mehta", upi: "priya.m@okhdfc", trust: "trusted" },
    { id: 3, name: "Mom", upi: "savita@oksbi", trust: "trusted" },
    { id: 4, name: "Amazonn Pay", upi: "amazonn-pay@ybl", trust: "risky" },
    { id: 5, name: "SBI KYC Update", upi: "sbi.kyc.verify@paytm", trust: "risky" },
    { id: 6, name: "Flinkart Refund Desk", upi: "ramesh.kumar11@oksbi", trust: "risky" },
  ];

  const filtered = CONTACTS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.upi.toLowerCase().includes(search.toLowerCase())
  );

  const isUpiId = search.includes("@");
  const isPhoneNumber = /^\d{10}$/.test(search);
  const showNewPayOption = (isUpiId || isPhoneNumber) && filtered.length === 0;

  const handlePayNew = () => {
    const newContact = {
      id: "new-" + Date.now(),
      name: isPhoneNumber ? search : search.split("@")[0],
      upi: isPhoneNumber ? `${search}@upi` : search,
      trust: "new"
    };
    navigate("/pay", { state: { contact: newContact } });
  };

  return (
    <PhoneShell>
      <div className="px-5 pt-8 pb-20">
        <header className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-display font-bold">{t("Send Money")}</h1>
        </header>

        <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder={t("Name, UPI ID or mobile")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-card"
          />
          <button 
            onClick={() => navigate("/scan")}
            className="absolute inset-y-2 right-2 px-3 rounded-xl bg-primary text-primary-foreground hover:shadow-glow transition-all"
          >
            <Scan className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8">
          {showNewPayOption && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <h3 className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                NEW PAYMENT
              </h3>
              <button
                onClick={handlePayNew}
                className="w-full flex items-center gap-4 p-5 bg-primary/5 border border-primary/20 rounded-[32px] hover:bg-primary/10 transition-all text-left shadow-card"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-display font-bold shrink-0 shadow-glow">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Pay "{search}"</p>
                  <p className="text-xs text-muted-foreground truncate">Tap to initiate payment</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

          <ContactSection 
            title={t("TRUSTED CONTACTS")} 
            contacts={filtered.filter(c => c.trust === "trusted")} 
            onSelect={(c) => navigate("/pay", { state: { contact: c } })}
            t={t}
          />
          <ContactSection 
            title={t("OTHER & FLAGGED")} 
            contacts={filtered.filter(c => c.trust === "risky")} 
            onSelect={(c) => navigate("/pay", { state: { contact: c } })}
            t={t}
          />

          {filtered.length === 0 && !showNewPayOption && search && (
            <div className="py-12 text-center bg-secondary/30 rounded-[32px] border-2 border-dashed border-border animate-in fade-in duration-500">
              <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-sm font-bold text-muted-foreground">No contacts found</p>
              <p searchable className="text-[10px] text-muted-foreground opacity-60 mt-1">Try entering a 10-digit number or UPI ID</p>
            </div>
          )}
        </div>
      </div>
    </PhoneShell>
  );
};

const ContactSection = ({ title, contacts, onSelect, t }: { title: string, contacts: any[], onSelect: (c: any) => void, t: any }) => {
  if (contacts.length === 0) return null;

  return (
    <section className="animate-slide-up">
      <h3 className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
        {title}
      </h3>
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-card">
        {contacts.map((contact, idx) => (
          <button
            key={contact.id}
            onClick={() => onSelect(contact)}
            className={cn(
              "w-full flex items-center gap-4 p-5 hover:bg-secondary/50 transition-colors text-left",
              idx !== contacts.length - 1 && "border-b border-border"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-primary-foreground font-display font-bold shrink-0 shadow-sm",
              contact.trust === "trusted" ? "bg-gradient-primary" : "bg-destructive/10 text-destructive"
            )}>
              {contact.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold truncate">{contact.name}</p>
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1",
                  contact.trust === "trusted" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                )}>
                  {contact.trust === "trusted" ? <ShieldCheck className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                  {contact.trust === "trusted" ? t("Trusted") : t("Risky")}
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate">{contact.upi}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Send;
