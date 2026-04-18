import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Ticket, Gift, Sparkles, TrendingUp, Zap } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { cn } from "@/lib/utils";

const Rewards = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 'vouchers', label: 'Vouchers', icon: Ticket, count: 4 },
    { id: 'cashback', label: 'Cashback', icon: Zap, count: 12 },
    { id: 'gifts', label: 'Gift Cards', icon: Gift, count: 2 },
  ];

  const coupons = [
    { id: 1, brand: "Zomato", discount: "20% OFF", type: "Food", code: "TRUPAY20", color: "bg-red-500" },
    { id: 2, brand: "Amazon", discount: "₹100 Gift Card", type: "Shopping", code: "TRUAMZ100", color: "bg-orange-500" },
    { id: 3, brand: "Uber", discount: "Flat ₹50 OFF", type: "Travel", code: "TRUUBER50", color: "bg-black" },
  ];

  return (
    <PhoneShell hideNav>
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <header className="px-5 pt-8 pb-6 flex items-center justify-between animate-fade-in">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-xl font-bold">Rewards Store</h1>
          <div className="w-9" /> {/* Spacer */}
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-10 no-scrollbar">
          {/* Points Card */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 text-white mb-8 shadow-glow animate-slide-up">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Trophy className="w-32 h-32 rotate-12" />
            </div>
            <div className="relative z-10">
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Total TruCoins</p>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-display font-bold">2,850</span>
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold">
                  Top 5% Users
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-300">
                  <TrendingUp className="w-3 h-3" />
                  +12% this month
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {categories.map((cat) => (
              <div key={cat.id} className="bg-card border border-border rounded-2xl p-3 flex flex-col items-center gap-2 text-center shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <cat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium leading-none mb-1">{cat.label}</p>
                  <p className="text-sm font-bold">{cat.count}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Active Vouchers */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="font-display font-bold text-lg mb-4">Active Vouchers</h2>
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="relative bg-card border border-border rounded-2xl overflow-hidden flex shadow-sm group hover:border-primary/30 transition-all cursor-pointer">
                  {/* Coupon Left Side */}
                  <div className={cn("w-4 flex flex-col items-center justify-center gap-1 py-4", coupon.color)}>
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                  </div>
                  
                  {/* Coupon Content */}
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">{coupon.type}</p>
                      <p className="font-bold text-lg leading-tight">{coupon.brand}</p>
                      <p className="text-sm font-bold text-primary mt-1">{coupon.discount}</p>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1.5 rounded-lg bg-secondary font-mono text-xs font-bold border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {coupon.code}
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-2">Expires in 2 days</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
};

export default Rewards;
