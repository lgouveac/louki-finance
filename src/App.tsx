
import React, { StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { usePWA } from "@/hooks/usePWA";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import CarteiraConsolidada from "./pages/CarteiraConsolidada";
import AlteracaoPM from "./pages/AlteracaoPM";
import Dividendos from "./pages/Dividendos";
import Importacao from "./pages/Importacao";
import AtivosManuais from "./pages/AtivosManuais";
import AnaliseEconomica from "./pages/AnaliseEconomica";
import Auth from "./pages/Auth";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/carteira" element={
            <ProtectedRoute>
              <CarteiraConsolidada />
            </ProtectedRoute>
          } />
          <Route path="/alteracao-pm" element={
            <ProtectedRoute>
              <AlteracaoPM />
            </ProtectedRoute>
          } />
          <Route path="/dividendos" element={
            <ProtectedRoute>
              <Dividendos />
            </ProtectedRoute>
          } />
          <Route path="/importacao" element={
            <ProtectedRoute>
              <Importacao />
            </ProtectedRoute>
          } />
          <Route path="/ativos-manuais" element={
            <ProtectedRoute>
              <AtivosManuais />
            </ProtectedRoute>
          } />
          <Route path="/analise-economica" element={
            <ProtectedRoute>
              <AnaliseEconomica />
            </ProtectedRoute>
          } />
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
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
