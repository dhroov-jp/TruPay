import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck,
  Calendar,
  Download
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PhoneShell } from "@/components/PhoneShell";
import { getTransactions } from "@/lib/transactions";
import { cn } from "@/lib/utils";

const History = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState(getTransactions());

  useEffect(() => {
    // Refresh history data
    setTransactions(getTransactions());
  }, []);

  const filtered = transactions.filter(tx => 
    tx.name.toLowerCase().includes(search.toLowerCase()) || 
    tx.amount.toString().includes(search)
  );

  return (
    <PhoneShell>
      <div className="px-5 pt-8 pb-24">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-display font-bold">{t("Transaction History")}</h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all">
            <Download className="w-4 h-4" />
          </button>
        </header>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 inset-y-0 my-auto w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={t("Search by name or amount")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-card"
            />
          </div>
          <button className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Transactions List */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
            <Calendar className="w-3 h-3" />
            {t("Recent Activity")}
          </div>

          <div className="space-y-3">
            {filtered.length > 0 ? (
              filtered.map((tx) => (
                <div 
                  key={tx.id}
                  className="flex items-center gap-4 p-4 rounded-3xl bg-card border border-border hover:border-primary/20 transition-all shadow-card group"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                    tx.type === "sent" ? "bg-secondary text-foreground group-hover:bg-primary/5" : "bg-success/5 text-success"
                  )}>
                    {tx.type === "sent" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{tx.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{tx.time}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-base font-display font-bold tabular-nums",
                      tx.type === "sent" ? "text-foreground" : "text-success"
                    )}>
                      {tx.type === "sent" ? "−" : "+"} ₹{tx.amount.toLocaleString("en-IN")}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      {tx.shielded && <ShieldCheck className="w-2 h-2 text-primary" />}
                      <p className="text-[8px] font-black uppercase tracking-[0.15em] text-muted-foreground opacity-60">{tx.status || "Success"}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-secondary/30 rounded-[32px] border-2 border-dashed border-border animate-in fade-in duration-500">
                <History className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-sm font-bold text-muted-foreground">No transactions found</p>
                <p className="text-[10px] text-muted-foreground opacity-60 mt-1">Your recent payments will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
};

export default History;
