
import { useEffect, useState } from "react";
import { PortfolioSummary, CarteiraAtual } from "@/types/stock";
import { getPortfolioSummary } from "@/services/stockService";
import { getCarteiraAtual } from "@/services/viewsService";
import { StockHeader } from "@/components/StockHeader";
import { DataTabView } from "@/components/DataTabView";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search } from "lucide-react";

const CarteiraConsolidada = () => {
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalGain: 0,
    totalGainPercent: 0,
    totalInvested: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("");
  const [tipoOptions, setTipoOptions] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch summary data
        const summaryData = await getPortfolioSummary();
        setSummary(summaryData);
        
        // Fetch carteira data to get all unique Tipo values for the filter
        const carteiraData = await getCarteiraAtual();
        const uniqueTipos = Array.from(
          new Set(
            carteiraData
              .map(item => item.Tipo)
              .filter(tipo => tipo !== null) as string[]
          )
        ).sort();
        
        setTipoOptions(uniqueTipos);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center">
            <div className="animate-pulse h-16 w-16 mb-4 rounded-full bg-muted"></div>
            <p className="text-lg">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-3 md:p-6">
        <div className="mx-auto max-w-7xl">
          <StockHeader summary={summary} />
          
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar por código..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="w-full sm:w-64 sm:flex-shrink-0">
              <Select 
                value={tipoFilter} 
                onValueChange={setTipoFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="_all">Todos os tipos</SelectItem>
                  {tipoOptions.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DataTabView searchQuery={searchQuery} tipoFilter={tipoFilter === "_all" ? "" : tipoFilter} />
        </div>
      </div>
    </div>
  );
}

export default CarteiraConsolidada;
