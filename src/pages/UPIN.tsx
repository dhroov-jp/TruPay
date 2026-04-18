import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, ChevronRight, Info, Check } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { Contact } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface UPINState {
  contact: Contact;
  amount: number;
  score: number;
}

const UPIN = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contact, amount, score } = (location.state || {}) as UPINState;

  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!contact) navigate("/", { replace: true });
  }, [contact, navigate]);

  const handleKeyPress = (key: string) => {
    if (key === "del") {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < 4) {
      setPin(prev => prev + key);
    }
  };

  const handlePay = () => {
    if (pin.length === 4) {
      setIsVerifying(true);
      // We will trigger the biometric check from the Pay page before coming here 
      // or right after this. User requested biometrics AFTER the PIN entry flow.
      setTimeout(() => {
        navigate("/success", { state: { contact, amount, score } });
      }, 1000);
    }
  };

  if (!contact) return null;

  return (
    <PhoneShell hideNav>
      <div className="flex flex-col h-full bg-[#F5F5F7]">
        {/* Header */}
        <div className="px-4 pt-10 pb-4 flex items-center justify-between border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#4B4B4B] flex items-center gap-1 italic">
                UPI<span className="text-orange-500 font-black">▶</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium">UNIFIED PAYMENTS INTERFACE</span>
            </div>
          </div>
          <button onClick={() => navigate(-1)}><X className="w-5 h-5 text-gray-600" /></button>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
          <span className="text-[12px] font-semibold text-gray-700">SAVINGS : ICICI Bank - XXXXXXXXXX97</span>
        </div>

        {/* Amount Box */}
        <div className="px-4 py-4">
          <div className="bg-[#FFF3E6] rounded-xl p-4 flex items-center justify-between border border-orange-100">
            <div>
              <p className="text-[14px] font-bold text-gray-800">Pay ₹{amount.toLocaleString("en-IN")}.00</p>
              <p className="text-[11px] text-gray-600 mt-0.5">To {contact.name.toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-display text-lg italic">₹ →</span>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                {contact.initials}
              </div>
            </div>
          </div>
        </div>

        {/* PIN Entry */}
        <div className="flex-1 flex flex-col items-center pt-12">
          <h2 className="text-lg font-bold text-gray-800 mb-8">Enter your PIN</h2>
          <div className="flex gap-6 mb-20">
            {[1, 2, 3, 4].map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-4 h-4 rounded-full border-2 border-gray-400 transition-all duration-200",
                  pin.length > i ? "bg-gray-800 border-gray-800 scale-110" : "bg-transparent"
                )} 
              />
            ))}
          </div>

          <p className="text-[11px] text-gray-500 flex items-center gap-1.5 px-6 text-center leading-tight">
            <Info className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            Never enter your UPI PIN to receive money
          </p>
        </div>

        {/* Numeric Keypad */}
        <div className="bg-[#EAEBED] grid grid-cols-3 gap-px border-t border-gray-300">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "del", 0, "pay"].map((key) => {
            if (key === "del") {
              return (
                <button 
                  key="del" 
                  onClick={() => handleKeyPress("del")}
                  className="h-16 flex items-center justify-center bg-white/60 active:bg-gray-200 transition-colors"
                >
                  <span className="text-xl">⌫</span>
                </button>
              );
            }
            if (key === "pay") {
              return (
                <button 
                  key="pay" 
                  onClick={handlePay}
                  disabled={pin.length < 4 || isVerifying}
                  className={cn(
                    "h-16 flex items-center justify-center transition-colors",
                    pin.length === 4 ? "bg-blue-800 text-white" : "bg-white/60 text-gray-400"
                  )}
                >
                  {isVerifying ? <span className="animate-spin text-lg">◌</span> : <span className="font-bold text-sm">Pay</span>}
                </button>
              );
            }
            return (
              <button 
                key={key} 
                onClick={() => handleKeyPress(key.toString())}
                className="h-16 bg-white flex items-center justify-center text-2xl font-medium active:bg-gray-100 transition-colors"
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    </PhoneShell>
  );
};

export default UPIN;
