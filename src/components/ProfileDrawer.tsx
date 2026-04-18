import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, User, Shield, CreditCard, Settings, LogOut, ChevronRight, Share2, BadgeCheck, Fingerprint, ScanFace } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose }) => {
  const [showQR, setShowQR] = useState(false);
  const [showEnroll, setShowEnroll] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [bioEnabled, setBioEnabled] = useState(true);
  const [bioType, setBioType] = useState<"face" | "finger">("face");

  const upiId = "arjun.patel@upi";

  const handleEnroll = () => {
    setIsEnrolling(true);
    setTimeout(() => {
      setIsEnrolling(false);
      setBioEnabled(true);
      setTimeout(() => setShowEnroll(false), 1200);
    }, 2800);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-[160] w-[85%] max-w-[360px] bg-background shadow-2xl transition-transform duration-500 transform ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="p-6 pb-4 flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Profile</h2>
            <button onClick={onClose} className="p-2 rounded-full bg-secondary text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-display font-bold shadow-glow">
                AP
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-success border-4 border-background flex items-center justify-center">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold">Arjun Patel</h3>
            <p className="text-sm text-muted-foreground font-medium">{upiId}</p>
            <button 
              onClick={() => setShowQR(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share QR Code
            </button>
          </div>

          {/* Menu Sections */}
          <div className="flex-1 px-4 py-6 space-y-6">
            <section>
              <p className="px-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Security</p>
              <div className="space-y-1">
                <MenuItem icon={Shield} label="AI Shield Settings" sub="Active & Protecting" />
                <MenuItem 
                  onClick={() => setShowEnroll(true)}
                  icon={bioType === "face" ? ScanFace : Fingerprint} 
                  label="Biometric Lock" 
                  sub={bioEnabled ? `${bioType === "face" ? "Face ID" : "Fingerprint"} Active` : "Not Setup"}
                  right={
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setBioEnabled(!bioEnabled);
                        }}
                        className={cn(
                          "w-10 h-5 rounded-full transition-colors relative",
                          bioEnabled ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-3 h-3 rounded-full bg-white transition-transform",
                          bioEnabled ? "right-1" : "left-1"
                        )} />
                      </div>
                    </div>
                  }
                />
              </div>
            </section>

            <section>
              <p className="px-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Payments</p>
              <div className="space-y-1">
                <MenuItem icon={CreditCard} label="Linked Bank Accounts" sub="2 Accounts Connected" />
                <MenuItem icon={Settings} label="Transaction Limits" sub="₹1,00,000 daily" />
              </div>
            </section>
          </div>

          {/* Logout */}
          <div className="p-6 border-t border-border">
            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-destructive/5 text-destructive font-semibold hover:bg-destructive/10 transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnroll && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="w-full max-w-[340px] flex flex-col items-center text-center">
            
            {/* Selection UI (Only show if not currently scanning) */}
            {!isEnrolling && (
              <div className="flex gap-4 mb-10">
                <button 
                  onClick={() => setBioType("face")}
                  className={cn(
                    "w-20 h-20 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all border-2",
                    bioType === "face" ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-white/40"
                  )}
                >
                  <ScanFace className="w-8 h-8" />
                  <span className="text-[10px] font-bold">Face ID</span>
                </button>
                <button 
                  onClick={() => setBioType("finger")}
                  className={cn(
                    "w-20 h-20 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all border-2",
                    bioType === "finger" ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-white/40"
                  )}
                >
                  <Fingerprint className="w-8 h-8" />
                  <span className="text-[10px] font-bold">Fingerprint</span>
                </button>
              </div>
            )}

            <div className="relative mb-12">
              <div className="w-32 h-32 rounded-full border-2 border-white/20 flex items-center justify-center relative overflow-hidden">
                {isEnrolling ? (
                  <>
                    {bioType === "face" ? (
                      <ScanFace className="w-16 h-16 text-primary animate-pulse" />
                    ) : (
                      <Fingerprint className="w-16 h-16 text-primary animate-pulse" />
                    )}
                    <div className="absolute inset-0 border-2 border-primary rounded-full animate-ping opacity-20" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-scan-line shadow-glow" />
                  </>
                ) : (
                  bioType === "face" ? <ScanFace className="w-16 h-16 text-white/40" /> : <Fingerprint className="w-16 h-16 text-white/40" />
                )}
              </div>
            </div>
            
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              {isEnrolling ? "Registering..." : `Setup ${bioType === "face" ? "Face ID" : "Fingerprint"}`}
            </h2>
            <p className="text-white/60 text-sm mb-10 px-6">
              {isEnrolling 
                ? "Please hold still while we register your biometric identity." 
                : `Protect your account with ${bioType === "face" ? "Face ID" : "Fingerprint"} for faster payments.`}
            </p>

            {!isEnrolling && (
              <div className="w-full space-y-3">
                <button 
                  onClick={handleEnroll}
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-glow"
                >
                  {bioEnabled ? "Re-enroll Data" : "Start Setup"}
                </button>
                <button 
                  onClick={() => setShowEnroll(false)}
                  className="w-full py-4 rounded-2xl bg-white/5 text-white/60 font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
            
            {isEnrolling && (
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-progress-fill" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-[320px] flex flex-col items-center text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-full flex justify-end mb-2">
              <button onClick={() => setShowQR(false)} className="p-2 rounded-full bg-gray-100 text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-bold mb-6">TRUPAY SHIELD</div>
            <div className="p-4 bg-gray-50 rounded-3xl border-4 border-gray-100 mb-6">
              <QRCodeSVG value={`upi://pay?pa=${upiId}&pn=Arjun Patel&cu=INR`} size={180} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Arjun Patel</h3>
            <p className="text-sm text-gray-500 mb-6">{upiId}</p>
            <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-glow">
              Download QR
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const MenuItem = ({ icon: Icon, label, sub, right, onClick }: { icon: any, label: string, sub: string, right?: React.ReactNode, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary transition-colors group"
  >
    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 text-left">
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
    {right ? right : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
  </button>
);
