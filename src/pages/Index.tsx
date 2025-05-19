
import { useEffect, useState } from "react";
import { Stock, PortfolioSummary, SectorAllocation } from "@/types/stock";
import { getStocks, getPortfolioSummary, getSectorAllocation } from "@/services/stockService";
import { StockHeader } from "@/components/StockHeader";
import { StockList } from "@/components/StockList";
import { SectorChart } from "@/components/SectorChart";

const Index = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalGain: 0,
    totalGainPercent: 0,
    totalInvested: 0
  });
  const [sectorAllocation, setSectorAllocation] = useState<SectorAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar dados mockados (serão substituídos pelo Supabase posteriormente)
    setStocks(getStocks());
    setSummary(getPortfolioSummary());
    setSectorAllocation(getSectorAllocation());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <StockHeader summary={summary} />
        
        <StockList stocks={stocks} />
        
        <SectorChart data={sectorAllocation} />
      </div>
    </div>
  );
};

export default Index;
