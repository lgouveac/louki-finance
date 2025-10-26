import { useEffect, useState } from "react";
import { PortfolioSummary, CarteiraAtual } from "@/types/stock";
import { getPortfolioSummary } from "@/services/stockService";
import { getCarteiraAtual } from "@/services/viewsService";
import { StockHeader } from "@/components/StockHeader";
import { DataTabView } from "@/components/DataTabView";

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, X, LayoutGrid, List } from "lucide-react";
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
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch summary data
        const summaryData = await getPortfolioSummary();
        setSummary(summaryData);

        // Fetch carteira data to get all unique Tipo values for the filter
        const carteiraData = await getCarteiraAtual();
        const uniqueTipos = Array.from(new Set(carteiraData.map(item => item.Tipo).filter(tipo => tipo !== null) as string[])).sort();
        setTipoOptions(uniqueTipos);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  const clearFilters = () => {
    setSearchQuery("");
    setTipoFilter("");
  };
  
  const hasActiveFilters = searchQuery !== "" || tipoFilter !== "";
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="animate-pulse h-16 w-16 mb-4 rounded-full bg-muted"></div>
          <p className="text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <StockHeader summary={summary} />
      
      {/* Ícones de busca, filtro e visualização */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button 
            variant={searchQuery ? "default" : "outline"} 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)} 
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Buscar
          </Button>

          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters} 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>

        {/* Toggle de visualização */}
        <div className="flex items-center gap-2 border rounded-md p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 px-3"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="h-8 px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Box expansível de filtros */}
      {showFilters && (
        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Busca e Filtros
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilters(false)} 
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Buscar por código..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="pl-10" 
                />
              </div>
              
              <div className="w-full sm:w-64 sm:flex-shrink-0">
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="_all">Todos os tipos</SelectItem>
                    {tipoOptions.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <div className="mt-3 pt-3 border-t border-muted">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Filtros ativos:</span>
                  {searchQuery && (
                    <span className="px-2 py-1 bg-muted rounded text-xs">
                      Busca: "{searchQuery}"
                    </span>
                  )}
                  {tipoFilter && tipoFilter !== "_all" && (
                    <span className="px-2 py-1 bg-muted rounded text-xs">
                      Tipo: {tipoFilter}
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <DataTabView 
        searchQuery={searchQuery} 
        tipoFilter={tipoFilter === "_all" ? "" : tipoFilter}
        viewMode={viewMode}
      />
    </div>
  );
};

export default CarteiraConsolidada;