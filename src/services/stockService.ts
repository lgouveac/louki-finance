
import { Stock, PortfolioSummary, SectorAllocation, Negociacao, Provento } from "@/types/stock";
import { supabase } from "@/integrations/supabase/client";

// Map Supabase data to Stock interface
const mapNegociacaoToStock = (negociacao: Negociacao): Stock => {
  // Use data from negociacao to create a stock object
  // This is a simplified mapping, you may need to adjust based on your data
  return {
    symbol: negociacao.Codigo,
    name: negociacao.Codigo, // Using the code as name since there's no separate name field
    price: negociacao.Preço,
    change: 0, // These values are not in the negociacao table
    changePercent: 0, // Would need additional calculation or data source
    sector: "N/A", // Sector information not available in current data
    shares: negociacao.Quantidade,
    costBasis: negociacao.Preço
  };
};

// Function to group stocks by symbol
const groupStocksBySymbol = (stocks: Stock[]): Stock[] => {
  const stockMap = new Map<string, Stock>();
  
  stocks.forEach(stock => {
    const existingStock = stockMap.get(stock.symbol);
    
    if (existingStock) {
      // Calculate weighted average cost basis
      const totalShares = existingStock.shares + stock.shares;
      const newCostBasis = ((existingStock.costBasis * existingStock.shares) + 
                           (stock.costBasis * stock.shares)) / totalShares;
      
      stockMap.set(stock.symbol, {
        ...existingStock,
        shares: totalShares,
        costBasis: newCostBasis
      });
    } else {
      stockMap.set(stock.symbol, { ...stock });
    }
  });
  
  return Array.from(stockMap.values());
};

export async function getStocks(): Promise<Stock[]> {
  try {
    const { data: negociacoes, error } = await supabase
      .from('negociacoes')
      .select('*');
    
    if (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
    
    if (!negociacoes || negociacoes.length === 0) {
      console.log('No stock data found');
      return [];
    }
    
    // Explicitly cast the data to match our Negociacao type
    const typedNegociacoes = negociacoes as unknown as Negociacao[];
    const stocks = typedNegociacoes.map(mapNegociacaoToStock);
    return groupStocksBySymbol(stocks);
  } catch (err) {
    console.error('Unexpected error in getStocks:', err);
    return [];
  }
}

export async function getProventos(): Promise<Provento[]> {
  try {
    const { data: proventos, error } = await supabase
      .from('proventos')
      .select('*');
    
    if (error) {
      console.error('Error fetching proventos data:', error);
      return [];
    }
    
    // Explicitly cast the data to match our Provento type
    return proventos as Provento[] || [];
  } catch (err) {
    console.error('Unexpected error in getProventos:', err);
    return [];
  }
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const stocks = await getStocks();
  
  const totalValue = stocks.reduce((sum, stock) => sum + (stock.price * stock.shares), 0);
  const totalInvested = stocks.reduce((sum, stock) => sum + (stock.costBasis * stock.shares), 0);
  const totalGain = totalValue - totalInvested;
  const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  
  return {
    totalValue,
    totalGain,
    totalGainPercent,
    totalInvested
  };
}

export async function getSectorAllocation(): Promise<SectorAllocation[]> {
  const stocks = await getStocks();
  
  // Calcular o valor total da carteira
  const totalValue = stocks.reduce((sum, stock) => sum + (stock.price * stock.shares), 0);
  
  // Agrupar por setor
  const sectorMap = new Map<string, number>();
  
  stocks.forEach(stock => {
    const stockValue = stock.price * stock.shares;
    const currentValue = sectorMap.get(stock.sector) || 0;
    sectorMap.set(stock.sector, currentValue + stockValue);
  });
  
  // Converter para o formato de retorno
  const sectorAllocation: SectorAllocation[] = Array.from(sectorMap.entries()).map(([sector, value]) => ({
    sector,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
  }));
  
  // Ordenar do maior para o menor
  return sectorAllocation.sort((a, b) => b.value - a.value);
}
