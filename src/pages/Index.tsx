
import { useEffect, useState } from "react";
import { PortfolioSummary, SectorAllocation } from "@/types/stock";
import { getPortfolioSummary, getSectorAllocation } from "@/services/stockService";
import { StockHeader } from "@/components/StockHeader";
import { SectorChart } from "@/components/SectorChart";
import { DataTabView } from "@/components/DataTabView";

const Index = () => {
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalGain: 0,
    totalGainPercent: 0,
    totalInvested: 0
  });
  const [sectorAllocation, setSectorAllocation] = useState<SectorAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch summary and sector data
        const [summaryData, sectorData] = await Promise.all([
          getPortfolioSummary(),
          getSectorAllocation()
        ]);
        
        setSummary(summaryData);
        setSectorAllocation(sectorData);
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
        <p className="text-lg">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <StockHeader summary={summary} />
        
        <DataTabView />
        
        <SectorChart data={sectorAllocation} />
      </div>
    </div>
  );
};

export default Index;
