
import { PortfolioSummary } from "@/types/stock";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon, WalletIcon, CoinsIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StockHeaderProps {
  summary: PortfolioSummary;
}

export function StockHeader({
  summary
}: StockHeaderProps) {
  const isPositive = summary.totalGain >= 0;
  
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <WalletIcon className="h-6 w-6 text-primary" />
            Carteira de Ações
          </h1>
          <p className="text-muted-foreground">Acompanhe seus investimentos</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-md border-border/40">
          <CardContent className="p-4 flex items-center gap-3">
            <CoinsIcon className="h-10 w-10 text-blue-400 p-2 bg-blue-400/10 rounded-full flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-muted-foreground text-sm">Valor Total</p>
              <p className="text-xl font-bold truncate">
                {formatCurrency(summary.totalValue)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-border/40">
          <CardContent className="p-4 flex items-center gap-3">
            <CoinsIcon className="h-10 w-10 text-amber-400 p-2 bg-amber-400/10 rounded-full flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-muted-foreground text-sm">Valor Investido</p>
              <p className="text-xl font-bold truncate">
                {formatCurrency(summary.totalInvested)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-border/40">
          <CardContent className="p-4 flex items-center gap-3">
            {isPositive ? (
              <TrendingUpIcon className="h-10 w-10 text-stock-positive p-2 bg-stock-positive/10 rounded-full flex-shrink-0" />
            ) : (
              <TrendingDownIcon className="h-10 w-10 text-stock-negative p-2 bg-stock-negative/10 rounded-full flex-shrink-0" />
            )}
            <div className="overflow-hidden">
              <p className="text-muted-foreground text-sm">Ganho/Perda</p>
              <p className={`text-xl font-bold truncate ${isPositive ? 'text-stock-positive' : 'text-stock-negative'}`}>
                {formatCurrency(summary.totalGain)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-border/40">
          <CardContent className="p-4 flex items-center gap-3">
            {isPositive ? (
              <TrendingUpIcon className="h-10 w-10 text-stock-positive p-2 bg-stock-positive/10 rounded-full flex-shrink-0" />
            ) : (
              <TrendingDownIcon className="h-10 w-10 text-stock-negative p-2 bg-stock-negative/10 rounded-full flex-shrink-0" />
            )}
            <div className="overflow-hidden">
              <p className="text-muted-foreground text-sm">Rendimento (%)</p>
              <p className={`text-xl font-bold truncate ${isPositive ? 'text-stock-positive' : 'text-stock-negative'}`}>
                {summary.totalGainPercent.toFixed(2)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
