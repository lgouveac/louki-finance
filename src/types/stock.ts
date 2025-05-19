
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

export interface Negociacao {
  id: string;
  Quantidade: number;
  "Tipo de Movimentação"?: string;
  Mercado?: string;
  "Prazo/Vencimento"?: string;
  Instituição?: string;
  "Código de Negociação": string;
  Preço: number;
  Valor: number;
  criado_em?: string;
  "Data do Negócio"?: string; // Changed from Date to string to match Supabase
}

export interface Provento {
  id: string;
  Movimentação?: string;
  Data?: string; // Changed from Date to string to match Supabase
  Quantidade?: number;
  "Preço unitário"?: number;
  "Valor da Operação"?: number;
  Produto?: string;
  "Entrada/Saída"?: string;
  Instituição?: string;
  criado_em?: string;
}
