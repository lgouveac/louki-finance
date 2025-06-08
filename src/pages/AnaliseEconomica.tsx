
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EconomicSignalsManager } from "@/components/EconomicSignalsManager";
import { EconomicImpactsManager } from "@/components/EconomicImpactsManager";
import { EconomicRecommendationsView } from "@/components/EconomicRecommendationsView";

const AnaliseEconomica = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold mb-6">Análise Econômica</h1>
          
          <Tabs defaultValue="signals" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signals">Sinais Econômicos</TabsTrigger>
              <TabsTrigger value="impacts">Impactos</TabsTrigger>
              <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signals" className="mt-6">
              <EconomicSignalsManager />
            </TabsContent>
            
            <TabsContent value="impacts" className="mt-6">
              <EconomicImpactsManager />
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-6">
              <EconomicRecommendationsView />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AnaliseEconomica;
