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
import { PublicOnlyRoute, RequireAuth } from "./components/AuthRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Onboarding Flow */}
          <Route path="/" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/onboarding/biometric" element={<RequireAuth><OnboardingBiometric /></RequireAuth>} />
          <Route path="/onboarding/bank" element={<RequireAuth><OnboardingBank /></RequireAuth>} />

          {/* Protected Routes (Require Biometric Lock if enabled) */}
          <Route 
            path="/home" 
            element={
              <RequireAuth>
                <AppLock>
                  <Home />
                </AppLock>
              </RequireAuth>
            } 
          />
          <Route path="/send" element={<RequireAuth><AppLock><SendPage /></AppLock></RequireAuth>} />
          <Route path="/pay" element={<RequireAuth><AppLock><Pay /></AppLock></RequireAuth>} />
          <Route path="/risk" element={<RequireAuth><AppLock><Risk /></AppLock></RequireAuth>} />
          <Route path="/success" element={<RequireAuth><AppLock><Success /></AppLock></RequireAuth>} />
          <Route path="/history" element={<RequireAuth><AppLock><History /></AppLock></RequireAuth>} />
          <Route path="/shield" element={<RequireAuth><AppLock><Shield /></AppLock></RequireAuth>} />
          <Route path="/scan" element={<RequireAuth><AppLock><ScanQR /></AppLock></RequireAuth>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
