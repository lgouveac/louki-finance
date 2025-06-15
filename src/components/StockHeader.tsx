import { PortfolioSummary } from "@/types/stock";
import { WalletIcon } from "lucide-react";
interface StockHeaderProps {
  summary: PortfolioSummary;
}
export function StockHeader({
  summary
}: StockHeaderProps) {
  return <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-left w-full">
            
            Carteira de Ações
          </h1>
          <p className="text-muted-foreground">Acompanhe seus investimentos</p>
        </div>
      </div>
    </div>;
}