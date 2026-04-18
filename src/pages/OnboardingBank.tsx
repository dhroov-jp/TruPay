import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, Plus, Building2, CheckCircle2 } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { cn } from "@/lib/utils";
import { addBankAccount } from "@/lib/bankAccounts";
import { toast } from "sonner";

const POPULAR_BANKS = [
  { name: "HDFC Bank", logo: "https://www.hdfcbank.com/favicon.ico" },
  { name: "ICICI Bank", logo: "https://www.icicibank.com/favicon.ico" },
  { name: "SBI", logo: "https://www.sbi.co.in/favicon.ico" },
  { name: "Axis Bank", logo: "https://www.axisbank.com/favicon.ico" },
  { name: "KOTAK Bank", logo: "https://www.kotak.com/favicon.ico" },
  { name: "PNB", logo: "https://www.pnbindia.in/favicon.ico" },
];

const ALL_BANKS = [
  "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank",
  "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Union Bank of India",
  "IDFC FIRST Bank", "IndusInd Bank", "Yes Bank", "Federal Bank", "Standard Chartered"
];

const OnboardingBank = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isLinking, setIsLinking] = useState<string | null>(null);

  const handleLinkBank = (bankName: string) => {
    setIsLinking(bankName);
    
    // Simulate bank discovery and linking
    setTimeout(() => {
      addBankAccount({
        bankName,
        accountNumber: `XXXX ${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Savings',
        logo: `https://logo.clearbit.com/${bankName.toLowerCase().replace(/\s+/g, '')}.com`
      });
      
      toast.success(`${bankName} linked successfully!`);
      setIsLinking(null);
      navigate("/home");
    }, 2000);
  };

  const filteredBanks = ALL_BANKS.filter(bank => 
    bank.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PhoneShell hideNav>
      <div className="h-full flex flex-col bg-background">
        <div className="px-6 pt-16 pb-6">
          <h1 className="text-3xl font-display font-bold mb-2">Link Bank Account</h1>
          <p className="text-muted-foreground text-sm">Select your bank to fetch and link your accounts via UPI.</p>
        </div>

        <div className="px-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search your bank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-secondary/50 border-none focus:ring-2 focus:ring-primary transition-all font-medium"
            />
          </div>
        </div>

        {!search && (
          <div className="px-6 mb-8">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-4">Popular Banks</p>
            <div className="grid grid-cols-3 gap-4">
              {POPULAR_BANKS.map((bank) => (
                <button 
                  key={bank.name}
                  onClick={() => handleLinkBank(bank.name)}
                  className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] font-bold text-center">{bank.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-4">
            {search ? 'Search Results' : 'All Banks'}
          </p>
          <div className="space-y-2 pb-12">
            {filteredBanks.map((bank) => (
              <button 
                key={bank}
                onClick={() => handleLinkBank(bank)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:bg-secondary transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-semibold text-sm">{bank}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {isLinking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="flex flex-col items-center text-center px-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Linking {isLinking}</h2>
              <p className="text-sm text-muted-foreground">Finding accounts linked to your phone number...</p>
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
};

export default OnboardingBank;
