
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarteiraAtualView } from "@/components/CarteiraAtualView";
import { ProventosRecebidosView } from "@/components/ProventosRecebidosView";
import { CarteiraAtual, ProventosRecebidos } from "@/types/stock";
import { getCarteiraAtual, getProventosRecebidos } from "@/services/viewsService";

export function DataTabView() {
  const [carteiraAtual, setCarteiraAtual] = useState<CarteiraAtual[]>([]);
  const [proventosRecebidos, setProventosRecebidos] = useState<ProventosRecebidos[]>([]);
  const [isLoadingCarteira, setIsLoadingCarteira] = useState(true);
  const [isLoadingProventos, setIsLoadingProventos] = useState(true);
  const [activeTab, setActiveTab] = useState("carteira");

  useEffect(() => {
    async function loadCarteiraAtual() {
      setIsLoadingCarteira(true);
      const data = await getCarteiraAtual();
      setCarteiraAtual(data);
      setIsLoadingCarteira(false);
    }

    async function loadProventosRecebidos() {
      setIsLoadingProventos(true);
      const data = await getProventosRecebidos();
      setProventosRecebidos(data);
      setIsLoadingProventos(false);
    }

    // Load data for the active tab
    if (activeTab === "carteira") {
      loadCarteiraAtual();
    } else if (activeTab === "proventos") {
      loadProventosRecebidos();
    }
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6">
      <Tabs defaultValue="carteira" onValueChange={handleTabChange}>
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="carteira">Carteira Atual</TabsTrigger>
          <TabsTrigger value="proventos">Proventos Recebidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="carteira">
          <CarteiraAtualView data={carteiraAtual} isLoading={isLoadingCarteira} />
        </TabsContent>
        
        <TabsContent value="proventos">
          <ProventosRecebidosView data={proventosRecebidos} isLoading={isLoadingProventos} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
