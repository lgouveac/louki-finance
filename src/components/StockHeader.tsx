
import { PortfolioSummary } from "@/types/stock";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon, WalletIcon, CoinsIcon } from "lucide-react";

interface StockHeaderProps {
  summary: PortfolioSummary;
}

export function StockHeader({ summary }: StockHeaderProps) {
  const isPositive = summary.totalGain >= 0;
  
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <WalletIcon className="h-6 w-6 text-primary" />
          Carteira de Ações
        </h1>
        <p className="text-muted-foreground">Acompanhe seus investimentos</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        <Card className="flex-1 shadow-md border-border/40">
          <CardContent className="p-4 flex items-center gap-3">
            <CoinsIcon className="h-10 w-10 text-blue-400 p-2 bg-blue-400/10 rounded-full" />
            <div>
              <p className="text-muted-foreground text-sm">Valor Total</p>
              <p className="text-xl font-bold">
                R$ {summary.totalValue.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1 shadow-md border-border/40">
          <CardContent className="p-4 flex items-center gap-3">
            {isPositive ? (
              <TrendingUpIcon className="h-10 w-10 text-stock-positive p-2 bg-stock-positive/10 rounded-full" />
            ) : (
              <TrendingDownIcon className="h-10 w-10 text-stock-negative p-2 bg-stock-negative/10 rounded-full" />
            )}
            <div>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
