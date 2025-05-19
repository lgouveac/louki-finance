
import { useEffect, useState } from "react";
import { Stock, PortfolioSummary, SectorAllocation, Provento } from "@/types/stock";
import { getStocks, getPortfolioSummary, getSectorAllocation, getProventos } from "@/services/stockService";
import { StockHeader } from "@/components/StockHeader";
import { StockList } from "@/components/StockList";
import { SectorChart } from "@/components/SectorChart";
import { ProventosList } from "@/components/ProventosList";

const Index = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [proventos, setProventos] = useState<Provento[]>([]);
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
        
        // Fetch all data in parallel
        const [stocksData, summaryData, sectorData, proventosData] = await Promise.all([
          getStocks(),
          getPortfolioSummary(),
          getSectorAllocation(),
          getProventos()
        ]);
        
        setStocks(stocksData);
        setSummary(summaryData);
        setSectorAllocation(sectorData);
        setProventos(proventosData);
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
        
        <StockList stocks={stocks} />
        
        <ProventosList proventos={proventos} />
        
        <SectorChart data={sectorAllocation} />
      </div>
    </div>
  );
};

export default Index;
