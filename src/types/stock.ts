
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
  Codigo: string; // Changed from "Código de Negociação" to match DB column
  Preço: number;
  Valor: number;
  criado_em?: string;
  "Data do Negócio"?: string;
}

export interface Provento {
  id: string;
  Movimentação?: string;
  Data?: string;
  Quantidade?: number;
  "Preço unitário"?: number;
  "Valor da Operação"?: number;
  Produto?: string;
  "Entrada/Saída"?: string;
  Instituição?: string;
  criado_em?: string;
}

// Interface for carteira_consolidada view
export interface CarteiraAtual {
  codigo: string | null;
  quantidade_total: number | null;
  preco_medio: number | null;
  preco_atual: number | null;
  valor_investido: number | null;
  valor_atual: number | null;
  rentabilidade_perc: number | null;
  rentabilidade_com_proventos_perc: number | null;
  proventos_recebidos: number | null;
  Tipo: string | null;
}

// Interface for proventos_recebidos view
export interface ProventosRecebidos {
  codigo: string | null;
  Data: string | null;
  Quantidade: number | null;
  tipo: string | null;
  valor: number | null;
}

// Interface for dashboard view
export interface DashboardData {
  Tipo: string | null;
  percentual: number | null;
  valor_total: number | null;
}

// Interface for rentabilidade view
export interface Rentabilidade {
  rentabilidade_sem_proventos: number | null;
  total_atual: number | null;
  total_investido: number | null;
  rentabilidade_com_proventos: number | null;
  total_proventos: number | null;
}
