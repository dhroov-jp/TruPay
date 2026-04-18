import { ArrowDownLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { TRANSACTIONS } from "@/data/mockData";
import { cn } from "@/lib/utils";

const History = () => (
  <PhoneShell>
    <header className="px-5 pt-12 pb-4 animate-fade-in">
      <h1 className="font-display text-2xl font-semibold">History</h1>
      <p className="text-xs text-muted-foreground">All transactions, AI-shielded</p>
    </header>

    <section className="px-5 space-y-2 animate-slide-up">
      {TRANSACTIONS.map((t) => {
        const isSent = t.type === "sent";
        return (
          <div
            key={t.id}
            className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3.5 shadow-card"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                isSent ? "bg-secondary text-foreground" : "bg-success/10 text-success"
              )}
            >
              {isSent ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate flex items-center gap-1.5">
                {t.name}
                {t.shielded && <ShieldCheck className="w-3 h-3 text-primary shrink-0" strokeWidth={2.5} />}
              </p>
              <p className="text-[11px] text-muted-foreground">{t.time}</p>
            </div>
            <p
              className={cn(
                "text-sm font-display font-semibold tabular-nums",
                isSent ? "text-foreground" : "text-success"
              )}
            >
              {isSent ? "−" : "+"} ₹{t.amount.toLocaleString("en-IN")}
            </p>
          </div>
        );
      })}
    </section>
  </PhoneShell>
);

export default History;
