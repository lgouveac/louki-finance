
import { useEffect, useState } from "react";
import { PortfolioSummary, SectorAllocation } from "@/types/stock";
import { getPortfolioSummary, getSectorAllocation } from "@/services/stockService";
import { StockHeader } from "@/components/StockHeader";
import { DataTabView } from "@/components/DataTabView";

const Index = () => {
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalGain: 0,
    totalGainPercent: 0,
    totalInvested: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch summary data
        const summaryData = await getPortfolioSummary();
        setSummary(summaryData);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-pulse h-16 w-16 mb-4 rounded-full bg-muted"></div>
          <p className="text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <StockHeader summary={summary} />
        <DataTabView />
      </div>
    </div>
  );
};

export default Index;
