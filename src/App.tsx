import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "./pages/Home.tsx";
import SendPage from "./pages/Send.tsx";
import Pay from "./pages/Pay.tsx";
import Risk from "./pages/Risk.tsx";
import Success from "./pages/Success.tsx";
import History from "./pages/History.tsx";
import Shield from "./pages/Shield.tsx";
import ScanQR from "./pages/ScanQR.tsx";
import Login from "./pages/Login.tsx";
import OnboardingBiometric from "./pages/OnboardingBiometric.tsx";
import OnboardingBank from "./pages/OnboardingBank.tsx";
import NotFound from "./pages/NotFound.tsx";

import { AppLock } from "./components/AppLock.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Onboarding Flow */}
          <Route path="/" element={<Login />} />
          <Route path="/onboarding/biometric" element={<OnboardingBiometric />} />
          <Route path="/onboarding/bank" element={<OnboardingBank />} />

          {/* Protected Routes (Require Biometric Lock if enabled) */}
          <Route 
            path="/home" 
            element={
              <AppLock>
                <Home />
              </AppLock>
            } 
          />
          <Route path="/send" element={<AppLock><SendPage /></AppLock>} />
          <Route path="/pay" element={<AppLock><Pay /></AppLock>} />
          <Route path="/risk" element={<AppLock><Risk /></AppLock>} />
          <Route path="/success" element={<AppLock><Success /></AppLock>} />
          <Route path="/history" element={<AppLock><History /></AppLock>} />
          <Route path="/shield" element={<AppLock><Shield /></AppLock>} />
          <Route path="/scan" element={<AppLock><ScanQR /></AppLock>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
