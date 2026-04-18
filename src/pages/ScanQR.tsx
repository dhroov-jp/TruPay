import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { ArrowLeft, Flashlight, Image as ImageIcon, X, Loader2, AlertCircle } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const ScanQR = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  
  const qrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Timeout to ensure the DOM is painted
    const timer = setTimeout(() => {
      initScanner();
    }, 500);

    return () => {
      clearTimeout(timer);
      if (qrCodeRef.current?.isScanning) {
        qrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const initScanner = async () => {
    try {
      const element = document.getElementById("reader");
      if (!element) return;

      qrCodeRef.current = new Html5Qrcode("reader");
      
      await qrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (text) => handleSuccess(text),
        () => {} // silent error for frames without QR
      );
      
      setIsReady(true);
      setError(null);
    } catch (err: any) {
      console.error("Camera Error:", err);
      setError(err?.message || "Could not access camera.");
    }
  };

  const handleSuccess = (decodedText: string) => {
    // Parse UPI
    const url = new URL(decodedText.replace("upi://pay", "http://upi"));
    const pa = url.searchParams.get("pa") || "unknown@upi";
    const pn = url.searchParams.get("pn") || pa.split("@")[0];
    
    const contact = {
      id: "scanned-" + Date.now(),
      name: pn,
      upi: pa,
      trust: "new",
      balance: "₹ 0",
      shielded: true
    };

    if (qrCodeRef.current?.isScanning) {
      qrCodeRef.current.stop().then(() => {
        navigate("/pay", { state: { contact } });
      });
    } else {
      navigate("/pay", { state: { contact } });
    }
  };

  const toggleTorch = async () => {
    if (qrCodeRef.current?.isScanning) {
      const nextState = !isTorchOn;
      try {
        // @ts-ignore
        await qrCodeRef.current.applyVideoConstraints({ advanced: [{ torch: nextState }] });
        setIsTorchOn(nextState);
      } catch (e) {
        console.warn("Torch not supported");
      }
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const result = await qrCodeRef.current?.scanFile(e.target.files[0], true);
        if (result) handleSuccess(result);
      } catch (err) {
        setShowErrorDialog(true);
      }
    }
  };

  return (
    <PhoneShell hideNav>
      {/* ... previous content ... */}
      
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className="w-[85%] max-w-[320px] rounded-[32px] border-none p-6 text-center animate-in zoom-in-95 duration-300">
          <AlertDialogHeader className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
              <AlertCircle className="w-8 h-8" />
            </div>
            <AlertDialogTitle className="text-xl font-display font-bold">No QR Code Found</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              We couldn't detect a valid UPI QR code in the image you selected. Please try a clearer photo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex-row gap-0 sm:flex-col">
            <AlertDialogAction className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-display font-bold shadow-glow hover:opacity-90 transition-opacity">
              Okay, Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="relative h-[100dvh] flex flex-col bg-black overflow-hidden selection:bg-primary/30">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-[100] px-5 pt-12 pb-4 flex items-center justify-between text-white bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-semibold">Scan QR Code</h1>
          <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ImageIcon className="w-5 h-5" />
          </button>
        </header>

        <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />

        {/* Content */}
        <div className="flex-1 relative flex flex-col items-center justify-center">
          {/* Always have the reader div in DOM */}
          <div id="reader" className="absolute inset-0 w-full h-full [&>div]:!border-none [&>div>video]:!object-cover bg-black" />
          
          {!isReady && !error && (
            <div className="z-10 flex flex-col items-center gap-4 text-white/60 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Starting camera...</p>
            </div>
          )}

          {error && (
            <div className="z-20 px-10 text-center animate-fade-in flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <X className="w-8 h-8" />
              </div>
              <p className="text-sm text-white/60">{error}</p>
              <button onClick={() => window.location.reload()} className="px-6 py-2 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">
                Retry Camera
              </button>
            </div>
          )}

          {/* Overlay */}
          {isReady && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
              <div className="relative w-64 h-64">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl" />
                <div className="absolute top-0 left-2 right-2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line shadow-[0_0_15px_rgba(14,165,233,0.8)]" />
              </div>
              <p className="mt-12 text-white/80 text-sm font-medium px-8 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                Scan any UPI QR to pay
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-10 flex justify-center gap-12 bg-black z-50">
          <button onClick={toggleTorch} className="flex flex-col items-center gap-2">
            <div className={cn("w-14 h-14 rounded-full border flex items-center justify-center transition-all", isTorchOn ? "bg-primary border-primary shadow-glow text-white" : "bg-white/10 border-white/20 text-white/60")}>
              <Flashlight className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{isTorchOn ? "On" : "Torch"}</span>
          </button>
          <button onClick={() => navigate("/send")} className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-display font-bold">₹</div>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">ID</span>
          </button>
        </div>

        <style>{`
          #reader video { object-fit: cover !important; width: 100% !important; height: 100% !important; }
          @keyframes scan-line { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
          .animate-scan-line { animation: scan-line 2.5s ease-in-out infinite; }
        `}</style>
      </div>
    </PhoneShell>
  );
};

export default ScanQR;
