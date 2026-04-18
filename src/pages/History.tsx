import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, ShieldCheck, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PhoneShell } from "@/components/PhoneShell";
import { getTransactions } from "@/lib/transactions";
import { cn } from "@/lib/utils";

const History = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const transactions = getTransactions();

  return (
    <PhoneShell>
      <header className="px-5 pt-8 pb-4 animate-fade-in">
        <h1 className="font-display text-2xl font-semibold">{t("History")}</h1>
        <p className="text-xs text-muted-foreground">{t("All transactions, AI-shielded")}</p>
      </header>

      <div className="px-5 pb-20 space-y-3 animate-slide-up">
        {transactions.length > 0 ? (
          transactions.map((t_item) => {
            const isSent = t_item.type === "sent";
            return (
              <div
                key={t_item.id}
                className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 shadow-card hover:border-primary/20 transition-all"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  isSent ? "bg-secondary text-foreground" : "bg-success/10 text-success"
                )}>
                  {isSent ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold truncate">{t_item.name}</p>
                    {t_item.shielded && <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2.5} />}
                  </div>
                  <p className="text-xs text-muted-foreground">{t_item.time}</p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-base font-display font-bold tabular-nums",
                    isSent ? "text-foreground" : "text-success"
                  )}>
                    {isSent ? "−" : "+"} ₹{t_item.amount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{t_item.status}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">{t("No history yet")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("When you make a payment, it will show up here.")}
            </p>
            <button 
              onClick={() => navigate("/send")}
              className="mt-8 px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-glow"
            >
              {t("Send Money")}
            </button>
          </div>
        )}
      </div>
    </PhoneShell>
  );
};

export default History;
