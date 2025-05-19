
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarteiraAtualView } from "@/components/CarteiraAtualView";
import { ProventosRecebidosView } from "@/components/ProventosRecebidosView";
import { useQuery } from "@tanstack/react-query";
import { getCarteiraAtual, getProventosRecebidos } from "@/services/viewsService";

export function DataTabView() {
  const { 
    data: carteiraAtual = [], 
    isLoading: isLoadingCarteira 
  } = useQuery({
    queryKey: ['carteira_atual'],
    queryFn: getCarteiraAtual,
    refetchOnWindowFocus: false,
  });

  const { 
    data: proventosRecebidos = [], 
    isLoading: isLoadingProventos 
  } = useQuery({
    queryKey: ['proventos_recebidos'],
    queryFn: getProventosRecebidos,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="bg-card rounded-lg p-4 mb-6">
      <Tabs defaultValue="carteira">
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
