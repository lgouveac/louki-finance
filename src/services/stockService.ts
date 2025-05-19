
import { Stock, PortfolioSummary, SectorAllocation } from "@/types/stock";

// Dados mockados para a demonstração
const mockStocks: Stock[] = [
  {
    symbol: "PETR4",
    name: "Petrobras",
    price: 38.42,
    change: 0.68,
    changePercent: 1.80,
    sector: "Petróleo",
    shares: 100,
    costBasis: 35.20
  },
  {
    symbol: "VALE3",
    name: "Vale",
    price: 67.35,
    change: -1.25,
    changePercent: -1.82,
    sector: "Mineração",
    shares: 50,
    costBasis: 72.18
  },
  {
    symbol: "ITUB4",
    name: "Itaú Unibanco",
    price: 34.78,
    change: 0.36,
    changePercent: 1.05,
    sector: "Financeiro",
    shares: 200,
    costBasis: 30.15
  },
  {
    symbol: "BBDC4",
    name: "Bradesco",
    price: 14.92,
    change: -0.23,
    changePercent: -1.52,
    sector: "Financeiro",
    shares: 150,
    costBasis: 16.35
  },
  {
    symbol: "MGLU3",
    name: "Magazine Luiza",
    price: 1.92,
    change: 0.05,
    changePercent: 2.67,
    sector: "Varejo",
    shares: 500,
    costBasis: 3.45
  },
  {
    symbol: "WEGE3",
    name: "WEG",
    price: 37.81,
    change: 0.57,
    changePercent: 1.53,
    sector: "Bens Industriais",
    shares: 80,
    costBasis: 32.40
  },
  {
    symbol: "ABEV3",
    name: "Ambev",
    price: 14.12,
    change: -0.18,
    changePercent: -1.26,
    sector: "Consumo",
    shares: 300,
    costBasis: 13.20
  }
];

export function getStocks(): Stock[] {
  return mockStocks;
}

export function getPortfolioSummary(): PortfolioSummary {
  const stocks = getStocks();
  
  const totalValue = stocks.reduce((sum, stock) => sum + (stock.price * stock.shares), 0);
  const totalInvested = stocks.reduce((sum, stock) => sum + (stock.costBasis * stock.shares), 0);
  const totalGain = totalValue - totalInvested;
  const totalGainPercent = (totalGain / totalInvested) * 100;
  
  return {
    totalValue,
    totalGain,
    totalGainPercent,
    totalInvested
  };
}

export function getSectorAllocation(): SectorAllocation[] {
  const stocks = getStocks();
  
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
    percentage: (value / totalValue) * 100
  }));
  
  // Ordenar do maior para o menor
  return sectorAllocation.sort((a, b) => b.value - a.value);
}
