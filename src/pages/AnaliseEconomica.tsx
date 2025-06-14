
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EconomicSignalsManager } from "@/components/EconomicSignalsManager";
import { EconomicImpactsManager } from "@/components/EconomicImpactsManager";
import { EconomicRecommendationsView } from "@/components/EconomicRecommendationsView";

const AnaliseEconomica = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />
      <div className="p-3 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
              Análise Econômica
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Gerencie sinais econômicos, impactos e recomendações
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-4 md:p-6">
            <Tabs defaultValue="signals" className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass-button rounded-lg p-1 mb-6">
                <TabsTrigger 
                  value="signals" 
                  className="text-xs md:text-sm rounded-md transition-all data-[state=active]:bg-white/20 data-[state=active]:text-white hover:bg-white/10"
                >
                  <span className="hidden sm:inline">Sinais Econômicos</span>
                  <span className="sm:hidden">Sinais</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="impacts"
                  className="text-xs md:text-sm rounded-md transition-all data-[state=active]:bg-white/20 data-[state=active]:text-white hover:bg-white/10"
                >
                  Impactos
                </TabsTrigger>
                <TabsTrigger 
                  value="recommendations"
                  className="text-xs md:text-sm rounded-md transition-all data-[state=active]:bg-white/20 data-[state=active]:text-white hover:bg-white/10"
                >
                  <span className="hidden sm:inline">Recomendações</span>
                  <span className="sm:hidden">Recom.</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signals" className="mt-0 focus-visible:outline-none">
                <EconomicSignalsManager />
              </TabsContent>
              
              <TabsContent value="impacts" className="mt-0 focus-visible:outline-none">
                <EconomicImpactsManager />
              </TabsContent>
              
              <TabsContent value="recommendations" className="mt-0 focus-visible:outline-none">
                <EconomicRecommendationsView />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnaliseEconomica;
