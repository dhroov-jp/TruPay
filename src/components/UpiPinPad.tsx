import React, { useState } from "react";
import { Check, Delete, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpiPinPadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
  payeeName: string;
  amount: number;
}

export const UpiPinPad: React.FC<UpiPinPadProps> = ({
  isOpen,
  onClose,
  onSuccess,
  payeeName,
  amount,
}) => {
  const [pin, setPin] = useState("");
  const pinLength = 4; // Standard 4-digit PIN

  const handlePress = (num: string) => {
    if (pin.length < pinLength) {
      setPin((p) => p + num);
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length === pinLength) {
      onSuccess(pin);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            BHIM
          </div>
          <span className="text-sm font-semibold text-gray-700">UPI PIN Entry</span>
        </div>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Payee Details */}
      <div className="bg-gray-50 p-6 flex flex-col items-center border-b border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Paying to</p>
        <p className="text-lg font-bold text-gray-800">{payeeName}</p>
        <p className="text-2xl font-display font-bold mt-2">
          ₹{amount.toLocaleString("en-IN")}
        </p>
      </div>

      {/* PIN Input Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <p className="text-sm font-semibold text-gray-600 mb-6 tracking-wide">
          ENTER 4-DIGIT UPI PIN
        </p>
        
        <div className="flex gap-4">
          {[...Array(pinLength)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all duration-200",
                i < pin.length ? "bg-gray-800 border-gray-800" : "bg-transparent border-gray-300"
              )}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2 text-primary font-medium text-xs bg-primary/5 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secured by AI Shield
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 bg-gray-50/50">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => handlePress(n.toString())}
            className="py-6 text-2xl font-display font-medium border-t border-r border-gray-100 active:bg-gray-200 transition-colors"
          >
            {n}
          </button>
        ))}
        <button
          onClick={handleDelete}
          className="py-6 flex items-center justify-center border-t border-r border-gray-100 active:bg-gray-200"
        >
          <Delete className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={() => handlePress("0")}
          className="py-6 text-2xl font-display font-medium border-t border-r border-gray-100 active:bg-gray-200"
        >
          0
        </button>
        <button
          onClick={handleSubmit}
          className={cn(
            "py-6 flex items-center justify-center border-t border-gray-100 transition-colors",
            pin.length === pinLength ? "bg-blue-600 text-white" : "text-gray-300 pointer-events-none"
          )}
        >
          <Check className="w-8 h-8" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
