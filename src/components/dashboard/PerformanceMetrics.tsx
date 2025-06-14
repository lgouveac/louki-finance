
import React from "react";
import { BarChartIcon } from "lucide-react";
import { DashboardInfoCard } from "./DashboardInfoCard";

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
    <section className="w-full max-w-4xl mx-auto mt-4 mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2 justify-center mb-8 text-[#e3e8f7]">
        <BarChartIcon className="h-7 w-7 text-primary" />
        Métricas da Carteira
      </h2>
      <div className="flex gap-x-6 gap-y-6 flex-wrap justify-center items-end">
        <DashboardInfoCard>
          <div className="text-2xl md:text-3xl font-bold text-blue-300 drop-shadow-sm mb-1">{rentabilidadeSemProventos.toFixed(2)}%</div>
          <span className="text-xs text-[#9498af] font-medium">Rent. s/ Proventos</span>
          <span className="text-sm text-[#C7CCE5] block mt-1">{formatCurrency(totalAtual - totalInvestido)}</span>
        </DashboardInfoCard>
        <DashboardInfoCard>
          <div className="text-2xl md:text-3xl font-bold text-green-300 drop-shadow-sm mb-1">{rentabilidadeComProventos.toFixed(2)}%</div>
          <span className="text-xs text-[#9498af] font-medium">Rent. c/ Proventos</span>
          <span className="text-sm text-[#C7CCE5] block mt-1">
            {formatCurrency((totalAtual - totalInvestido) + totalProventos)}
          </span>
        </DashboardInfoCard>
        <DashboardInfoCard>
          <div className="text-2xl md:text-3xl font-bold text-amber-300 drop-shadow-sm mb-1">{yieldOnCost.toFixed(2)}%</div>
          <span className="text-xs text-[#9498af] font-medium">Yield on Cost</span>
          <span className="text-sm text-[#C7CCE5] block mt-1">{formatCurrency(totalProventos)}</span>
        </DashboardInfoCard>
      </div>
    </section>
  );
}

