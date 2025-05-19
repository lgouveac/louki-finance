
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarteiraAtualView } from "@/components/CarteiraAtualView";
import { ProventosRecebidosView } from "@/components/ProventosRecebidosView";
import { useQuery } from "@tanstack/react-query";
import { getCarteiraAtual, getProventosRecebidos } from "@/services/viewsService";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="shadow-md mb-6">
      <CardContent className="p-0">
        <Tabs defaultValue="carteira" className="w-full">
          <div className="border-b border-border/40 px-4 pt-4">
            <TabsList className="mb-0 w-full sm:w-auto bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="carteira" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-3 text-base font-medium"
              >
                Carteira Atual
              </TabsTrigger>
              <TabsTrigger 
                value="proventos" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-3 text-base font-medium"
              >
                Proventos Recebidos
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="carteira" className="p-4">
            <CarteiraAtualView data={carteiraAtual} isLoading={isLoadingCarteira} />
          </TabsContent>
          
          <TabsContent value="proventos" className="p-4">
            <ProventosRecebidosView data={proventosRecebidos} isLoading={isLoadingProventos} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
