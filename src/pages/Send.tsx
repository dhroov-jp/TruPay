import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ScanLine } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { TrustBadge } from "@/components/TrustBadge";
import { CONTACTS, Contact } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Send = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const filtered = CONTACTS.filter(
    (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.upi.toLowerCase().includes(q.toLowerCase())
  );

  const trusted = filtered.filter((c) => c.trust === "trusted");
  const others = filtered.filter((c) => c.trust !== "trusted");

  const goPay = (c: Contact) => navigate("/pay", { state: { contact: c } });

  return (
    <PhoneShell>
      <header className="px-5 pt-12 pb-4 flex items-center gap-3 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="font-display text-xl font-semibold">Send Money</h1>
      </header>

      <div className="px-5 animate-slide-up">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name, UPI ID or mobile"
            className="w-full bg-card border border-border rounded-2xl pl-10 pr-12 py-3.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-base shadow-card"
          />
          <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center">
            <ScanLine className="w-4 h-4" />
          </button>
        </div>
      </div>

      {trusted.length > 0 && (
        <Section title="Trusted contacts">
          {trusted.map((c) => <ContactRow key={c.id} c={c} onClick={() => goPay(c)} />)}
        </Section>
      )}

      {others.length > 0 && (
        <Section title="Other & flagged">
          {others.map((c) => <ContactRow key={c.id} c={c} onClick={() => goPay(c)} />)}
        </Section>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-12">No contacts match.</p>
      )}
    </PhoneShell>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="px-5 mt-5 animate-slide-up">
    <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-2 px-1">{title}</h2>
    <div className="bg-card border border-border rounded-2xl divide-y divide-border shadow-card overflow-hidden">
      {children}
    </div>
  </section>
);

const ContactRow = ({ c, onClick }: { c: Contact; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3.5 hover:bg-secondary/60 transition-base text-left"
  >
    <div
      className={cn(
        "w-11 h-11 rounded-2xl flex items-center justify-center font-display font-semibold text-sm shrink-0",
        c.trust === "risky" ? "bg-destructive/10 text-destructive" : "bg-gradient-primary text-primary-foreground"
      )}
    >
      {c.initials}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium truncate">{c.name}</p>
        <TrustBadge trust={c.trust} compact />
      </div>
      <p className="text-[11px] text-muted-foreground truncate">{c.upi}</p>
    </div>
  </button>
);

export default Send;
