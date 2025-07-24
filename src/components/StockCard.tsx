import { CarteiraAtual } from "@/types/stock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, DollarSign } from "lucide-react";

interface StockCardProps {
  item: CarteiraAtual;
  isSelected: boolean;
  onSelect: (codigo: string, checked: boolean) => void;
}

export function StockCard({ item, isSelected, onSelect }: StockCardProps) {
  const isRentabilidadePositive = item.rentabilidade_perc && item.rentabilidade_perc > 0;
  const isRentabilidadeComProventosPositive = item.rentabilidade_com_proventos_perc && item.rentabilidade_com_proventos_perc > 0;

  const getRentabilidadeIcon = (rentabilidade: number | null) => {
    if (!rentabilidade) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (rentabilidade > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getRentabilidadeColor = (rentabilidade: number | null) => {
    if (!rentabilidade) return "text-muted-foreground";
    return rentabilidade > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header com código, tipo e checkbox */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {item.codigo && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => item.codigo && onSelect(item.codigo, checked as boolean)}
                aria-label={`Selecionar ${item.codigo}`}
              />
            )}
            <div>
              <h3 className="text-xl font-bold">{item.codigo || '-'}</h3>
              <Badge variant="outline" className="mt-1">
                {item.Tipo || '-'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Grid com informações principais */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Quantidade</p>
            <p className="font-semibold">{item.quantidade_total?.toLocaleString('pt-BR') || '-'}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Preço Médio</p>
            <p className="font-semibold">{item.preco_medio ? formatCurrency(item.preco_medio) : '-'}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Preço Atual</p>
            <p className="font-semibold">{item.preco_atual ? formatCurrency(item.preco_atual) : '-'}</p>
          </div>
        </div>

        {/* Valores investido e atual */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground mb-1">Valor Investido</p>
            <p className="font-bold text-lg">{item.valor_investido ? formatCurrency(item.valor_investido) : '-'}</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground mb-1">Valor Atual</p>
            <p className="font-bold text-lg">{item.valor_atual ? formatCurrency(item.valor_atual) : '-'}</p>
          </div>
        </div>

        {/* Rentabilidades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rentabilidade</p>
              <p className={`font-bold text-lg ${getRentabilidadeColor(item.rentabilidade_perc)}`}>
                {item.rentabilidade_perc ? `${item.rentabilidade_perc.toFixed(2)}%` : '-'}
              </p>
            </div>
            {getRentabilidadeIcon(item.rentabilidade_perc)}
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Com Proventos</p>
              <p className={`font-bold text-lg ${getRentabilidadeColor(item.rentabilidade_com_proventos_perc)}`}>
                {item.rentabilidade_com_proventos_perc ? `${item.rentabilidade_com_proventos_perc.toFixed(2)}%` : '-'}
              </p>
            </div>
            {getRentabilidadeIcon(item.rentabilidade_com_proventos_perc)}
          </div>
        </div>

        {/* Proventos recebidos */}
        <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Proventos Recebidos</p>
            <p className="font-bold text-lg text-amber-600">
              {item.proventos_recebidos ? formatCurrency(item.proventos_recebidos) : '-'}
            </p>
          </div>
          <DollarSign className="h-5 w-5 text-amber-600" />
        </div>
      </CardContent>
    </Card>
  );
}