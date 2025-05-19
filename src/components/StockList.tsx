
import { Stock } from "@/types/stock";

interface StockListProps {
  stocks: Stock[];
}

export function StockList({ stocks }: StockListProps) {
  return (
    <div className="bg-card rounded-lg p-4 overflow-hidden mb-6">
      <h2 className="text-lg font-semibold mb-4">Minhas Posições</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-sm text-muted-foreground border-b border-muted">
              <th className="text-left pb-2 font-medium">Ação</th>
              <th className="text-right pb-2 font-medium">Quantidade</th>
              <th className="text-right pb-2 font-medium">Preço Médio</th>
              <th className="text-right pb-2 font-medium">Preço Atual</th>
              <th className="text-right pb-2 font-medium">Variação</th>
              <th className="text-right pb-2 font-medium">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const isPositive = stock.change >= 0;
              const stockValue = stock.price * stock.shares;
              const costValue = stock.costBasis * stock.shares;
              const result = stockValue - costValue;
              const resultPercent = (result / costValue) * 100;
              
              return (
                <tr key={stock.symbol} className="border-b border-muted hover:bg-muted/30">
                  <td className="py-3">
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-muted-foreground text-sm">{stock.name}</p>
                    </div>
                  </td>
                  <td className="text-right py-3">{stock.shares}</td>
                  <td className="text-right py-3">
                    R$ {stock.costBasis.toFixed(2)}
                  </td>
                  <td className="text-right py-3">
                    R$ {stock.price.toFixed(2)}
                  </td>
                  <td className="text-right py-3">
                    <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-stock-positive' : 'text-stock-negative'}`}>
                      <span>{stock.change.toFixed(2)}</span>
                      <span>({stock.changePercent.toFixed(2)}%)</span>
                    </div>
                  </td>
                  <td className="text-right py-3">
                    <div className={`flex flex-col items-end ${result >= 0 ? 'text-stock-positive' : 'text-stock-negative'}`}>
                      <span>R$ {result.toFixed(2)}</span>
                      <span className="text-sm">({resultPercent.toFixed(2)}%)</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
