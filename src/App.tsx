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
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<SendPage />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/risk" element={<Risk />} />
          <Route path="/success" element={<Success />} />
          <Route path="/history" element={<History />} />
          <Route path="/shield" element={<Shield />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
