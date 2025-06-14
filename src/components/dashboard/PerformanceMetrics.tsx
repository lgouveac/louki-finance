
import React from "react";
import { BarChartIcon } from "lucide-react";

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
  const yieldOnCost = totalInvestido > 0 ? (totalProventos / totalInvestido) * 100 : 0;

  const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  return (
    <section className="w-full max-w-3xl mx-auto my-10 px-2">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-8 justify-center">
        <BarChartIcon className="h-7 w-7 text-primary" />
        Análise de Performance da Carteira
      </h2>
      <div className="flex gap-8 flex-wrap justify-center items-end">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-blue-500">{rentabilidadeSemProventos.toFixed(2)}%</div>
          <span className="text-xs text-foreground/60">Rent. s/ Proventos</span>
          <span className="text-sm">{formatCurrency(totalAtual - totalInvestido)}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-green-500">{rentabilidadeComProventos.toFixed(2)}%</div>
          <span className="text-xs text-foreground/60">Rent. c/ Proventos</span>
          <span className="text-sm">
            {formatCurrency((totalAtual - totalInvestido) + totalProventos)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-amber-500">{yieldOnCost.toFixed(2)}%</div>
          <span className="text-xs text-foreground/60">Yield on Cost</span>
          <span className="text-sm">{formatCurrency(totalProventos)}</span>
        </div>
      </div>
    </section>
  );
}
