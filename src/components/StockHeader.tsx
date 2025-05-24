import { PortfolioSummary } from "@/types/stock";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon, WalletIcon, CoinsIcon } from "lucide-react";
interface StockHeaderProps {
  summary: PortfolioSummary;
}
export function StockHeader({
  summary
}: StockHeaderProps) {
  const isPositive = summary.totalGain >= 0;
  return <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <WalletIcon className="h-6 w-6 text-primary" />
          Carteira de Ações
        </h1>
        <p className="text-muted-foreground">Acompanhe seus investimentos</p>
      </div>
      
      
    </div>;
}