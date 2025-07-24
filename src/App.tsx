
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";

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
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <Header />
                      <main className="flex-1 p-6">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/carteira" element={<CarteiraConsolidada />} />
                          <Route path="/carteira-ideal" element={<CarteiraIdeal />} />
                          <Route path="/dividendos" element={<Dividendos />} />
                          <Route path="/importacao" element={<Importacao />} />
                          <Route path="/ativos-manuais" element={<AtivosManuais />} />
                          <Route path="/alteracao-pm" element={<AlteracaoPM />} />
                          <Route path="/analise-economica" element={<AnaliseEconomica />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
