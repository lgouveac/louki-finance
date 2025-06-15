
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { AuthProvider } from "@/hooks/useAuth";

// Pages
import Index from "./pages/Index";
import CarteiraConsolidada from "./pages/CarteiraConsolidada";
import CarteiraIdeal from "./pages/CarteiraIdeal";
import Dividendos from "./pages/Dividendos";
import Importacao from "./pages/Importacao";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AtivosManuais from "./pages/AtivosManuais";
import AlteracaoPM from "./pages/AlteracaoPM";
import AnaliseEconomica from "./pages/AnaliseEconomica";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
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
            <Route path="/carteira-ideal" element={
              <ProtectedRoute>
                <CarteiraIdeal />
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
            <Route path="/alteracao-pm" element={
              <ProtectedRoute>
                <AlteracaoPM />
              </ProtectedRoute>
            } />
            <Route path="/analise-economica" element={
              <ProtectedRoute>
                <AnaliseEconomica />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
