
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EconomicSignalsManager } from "@/components/EconomicSignalsManager";
import { EconomicImpactsManager } from "@/components/EconomicImpactsManager";
import { EconomicRecommendationsView } from "@/components/EconomicRecommendationsView";

const AnaliseEconomica = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Análise Econômica</h1>
        <p className="text-muted-foreground">Gerencie sinais econômicos, impactos e recomendações</p>
      </div>
      
      <Tabs defaultValue="signals" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
          <TabsTrigger value="signals" className="text-xs md:text-sm px-2 py-2">
            <span className="hidden sm:inline">Sinais Econômicos</span>
            <span className="sm:hidden">Sinais</span>
          </TabsTrigger>
          <TabsTrigger value="impacts" className="text-xs md:text-sm px-2 py-2">
            Impactos
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="text-xs md:text-sm px-2 py-2">
            <span className="hidden sm:inline">Recomendações</span>
            <span className="sm:hidden">Recom.</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="signals" className="space-y-4 mt-6">
          <EconomicSignalsManager />
        </TabsContent>
        
        <TabsContent value="impacts" className="space-y-4 mt-6">
          <EconomicImpactsManager />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4 mt-6">
          <EconomicRecommendationsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnaliseEconomica;
