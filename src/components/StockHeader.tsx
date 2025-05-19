
import { PortfolioSummary } from "@/types/stock";

interface StockHeaderProps {
  summary: PortfolioSummary;
}

export function StockHeader({ summary }: StockHeaderProps) {
  const isPositive = summary.totalGain >= 0;
  
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Carteira de Ações</h1>
        <p className="text-muted-foreground">Acompanhe seus investimentos</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        <div className="bg-card p-4 rounded-lg flex-1">
          <p className="text-muted-foreground text-sm">Valor Total</p>
          <p className="text-xl font-bold">
            R$ {summary.totalValue.toLocaleString('pt-BR', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-lg flex-1">
          <p className="text-muted-foreground text-sm">Rendimento</p>
          <div className="flex items-center gap-2">
            <p className={`text-xl font-bold ${isPositive ? 'text-stock-positive' : 'text-stock-negative'}`}>
              R$ {summary.totalGain.toLocaleString('pt-BR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2, 
                signDisplay: 'exceptZero'
              })}
            </p>
            <span className={`text-sm ${isPositive ? 'text-stock-positive' : 'text-stock-negative'}`}>
              ({summary.totalGainPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
