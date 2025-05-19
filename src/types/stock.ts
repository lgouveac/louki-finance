
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  shares: number;
  costBasis: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  totalInvested: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
}
