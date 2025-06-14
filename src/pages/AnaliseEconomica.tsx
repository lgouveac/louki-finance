
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
          
          <div className="space-y-6">
            <Tabs defaultValue="signals" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto glass-card p-1 border-gray-700">
                <TabsTrigger 
                  value="signals" 
                  className="text-xs md:text-sm px-2 py-3 rounded-md transition-all duration-300 data-[state=active]:glass-button data-[state=active]:text-white data-[state=active]:border-white/20 hover:bg-white/10 hover:backdrop-blur-md text-gray-300"
                >
                  <span className="hidden sm:inline">Sinais Econômicos</span>
                  <span className="sm:hidden">Sinais</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="impacts"
                  className="text-xs md:text-sm px-2 py-3 rounded-md transition-all duration-300 data-[state=active]:glass-button data-[state=active]:text-white data-[state=active]:border-white/20 hover:bg-white/10 hover:backdrop-blur-md text-gray-300"
                >
                  Impactos
                </TabsTrigger>
                <TabsTrigger 
                  value="recommendations"
                  className="text-xs md:text-sm px-2 py-3 rounded-md transition-all duration-300 data-[state=active]:glass-button data-[state=active]:text-white data-[state=active]:border-white/20 hover:bg-white/10 hover:backdrop-blur-md text-gray-300"
                >
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
        </div>
      </div>
    </div>
  );
};

export default AnaliseEconomica;
