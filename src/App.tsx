
import React, { StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { usePWA } from "@/hooks/usePWA";
import Index from "./pages/Index";
import CarteiraConsolidada from "./pages/CarteiraConsolidada";
import AlteracaoPM from "./pages/AlteracaoPM";
import Dividendos from "./pages/Dividendos";
import NotFound from "./pages/NotFound";

// Create a client outside of the render function
const queryClient = new QueryClient();

const AppContent = () => {
  usePWA();
  
  return (
    <>
      <Toaster />
      <Sonner />
      <PWAInstallPrompt />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/carteira" element={<CarteiraConsolidada />} />
          <Route path="/alteracao-pm" element={<AlteracaoPM />} />
          <Route path="/dividendos" element={<Dividendos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
