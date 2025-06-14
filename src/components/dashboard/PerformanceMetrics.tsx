
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChartIcon, TrendingUpIcon, TargetIcon } from "lucide-react";

interface PerformanceMetricsProps {
  rentabilidadeSemProventos: number;
  rentabilidadeComProventos: number;
  totalInvestido: number;
  totalAtual: number;
  totalProventos: number;
}

export function PerformanceMetrics({
  rentabilidadeSemProventos,
  rentabilidadeComProventos,
  totalInvestido,
  totalAtual,
  totalProventos
}: PerformanceMetricsProps) {
  // Calculate additional metrics
  const yieldOnCost = totalInvestido > 0 ? (totalProventos / totalInvestido) * 100 : 0;
  const progressToTarget = Math.min((rentabilidadeComProventos / 15) * 100, 100); // Assuming 15% as target
  
  const formatCurrency = (value: number) => 
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card className="glass-card hover-glass">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <BarChartIcon className="h-6 w-6 text-primary" />
          Análise de Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Sem Proventos</span>
                <TrendingUpIcon className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-500">
                {rentabilidadeSemProventos.toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(totalAtual - totalInvestido)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Com Proventos</span>
                <TargetIcon className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-500">
                {rentabilidadeComProventos.toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency((totalAtual - totalInvestido) + totalProventos)}
              </div>
            </div>
          </div>
        </div>

        {/* Yield on Cost */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Yield on Cost</span>
            <span className="text-sm font-bold text-amber-500">{yieldOnCost.toFixed(2)}%</span>
          </div>
          <Progress value={Math.min(yieldOnCost * 10, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Rendimento anual dos proventos sobre o capital investido
          </p>
        </div>

        {/* Progress to Target */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Meta de Rentabilidade (15%)</span>
            <span className="text-sm font-bold text-primary">{progressToTarget.toFixed(1)}%</span>
          </div>
          <Progress value={progressToTarget} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Progresso em direção à meta de rentabilidade anual
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {((totalAtual / totalInvestido - 1) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">Valorização</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-500">
              {yieldOnCost.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">Yield</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              {rentabilidadeComProventos.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
