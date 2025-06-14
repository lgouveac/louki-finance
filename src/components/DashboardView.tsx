import { useQuery } from "@tanstack/react-query";
import { getDashboardData, getRentabilidade } from "@/services/viewsService";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { PortfolioDistribution } from "@/components/dashboard/PortfolioDistribution";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useMemo } from "react";

// Novo componente para o Resumo de Rentabilidade tipo tabela-card
function RentabilidadeResumo({
  totalInvestido,
  totalAtual,
  rentabilidadeSemProventos,
  totalProventos,
  rentabilidadeComProventos,
}: {
  totalInvestido: number,
  totalAtual: number,
  rentabilidadeSemProventos: number,
  totalProventos: number,
  rentabilidadeComProventos: number,
}) {
  return (
    <Card className="bg-[#181a20] border-none rounded-2xl shadow-lg mt-8 max-w-xl mx-auto">
      <CardContent className="pt-7 pb-6 px-6">
        <h3 className="text-white text-lg font-bold mb-4">Resumo de Rentabilidade</h3>
        <div className="flex flex-col gap-1.5 text-base">
          <div className="flex justify-between">
            <span className="text-[#C7CCE5]">Valor Investido:</span>
            <span className="text-white">R$ {totalInvestido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#C7CCE5]">Valor Atual:</span>
            <span className="text-white">R$ {totalAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#C7CCE5]">Rendimento sem Proventos:</span>
            <span className="font-semibold text-green-400">{rentabilidadeSemProventos.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#C7CCE5]">Total de Proventos:</span>
            <span className="font-semibold text-amber-400">R$ {totalProventos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="border-t border-[#232634] my-2" />
          <div className="flex justify-between">
            <span className="text-[#C7CCE5]">Rendimento com Proventos:</span>
            <span className="font-semibold text-green-400">{rentabilidadeComProventos.toFixed(2)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardView() {
  const {
    data: dashboardData = [],
    isLoading: isDashboardLoading,
    error: dashboardError
  } = useQuery({
    queryKey: ['dashboard_data'],
    queryFn: getDashboardData,
    refetchOnWindowFocus: false
  });

  const {
    data: rentabilidadeData = [],
    isLoading: isRentabilidadeLoading,
    error: rentabilidadeError
  } = useQuery({
    queryKey: ['rentabilidade_data'],
    queryFn: getRentabilidade,
    refetchOnWindowFocus: false
  });

  const isLoading = isDashboardLoading || isRentabilidadeLoading;

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="flex flex-col items-center space-y-8">
          <Skeleton className="h-16 w-1/2 md:w-1/4" />
          <Skeleton className="h-10 w-2/3 md:w-1/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if ((dashboardError && dashboardData.length === 0) || (rentabilidadeError && rentabilidadeData.length === 0)) {
    return (
      <div className="flex justify-center items-center h-[400px] rounded-lg p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">📊</div>
          <p className="text-lg font-medium">Não foi possível carregar os dados</p>
          <p className="text-muted-foreground">Verifique sua conexão e tente novamente</p>
        </div>
      </div>
    );
  }

  // Dados reais da API
  const rentabilidade = rentabilidadeData[0] || {
    rentabilidade_sem_proventos: 0,
    total_atual: 0,
    total_investido: 0,
    rentabilidade_com_proventos: 0,
    total_proventos: 0
  };

  // Usar useMemo para formatação otimizada
  const cards = useMemo(() => [
    {
      label: "Valor Total",
      value: "R$ " + (rentabilidade.total_atual || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      icon: (
        <span className="bg-gradient-to-br from-blue-600 via-blue-400 to-blue-700 p-2 rounded-full">
          <ArrowUp className="w-7 h-7 text-white" />
        </span>
      ),
      cardClass: "bg-[#16181e]",
      valueClass: "text-white"
    },
    {
      label: "Rendimento (%)",
      value: `${(rentabilidade.rentabilidade_sem_proventos || 0).toFixed(2)}%`,
      icon: (
        <span className="bg-gradient-to-br from-green-800 via-green-600 to-green-400 p-2 rounded-full">
          <ArrowUp className="w-7 h-7 text-green-300" />
        </span>
      ),
      cardClass: "bg-[#18221B]",
      valueClass: "text-green-400"
    },
    {
      label: "Proventos Recebidos",
      value: "R$ " + (rentabilidade.total_proventos || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      icon: (
        <span className="bg-gradient-to-br from-amber-700 via-yellow-500 to-amber-400 p-2 rounded-full">
          <ArrowUp className="w-7 h-7 text-amber-200" />
        </span>
      ),
      cardClass: "bg-[#231e18]",
      valueClass: "text-amber-400"
    }
  ], [rentabilidade]);

  return (
    <main className="w-full">

      {/* Cards principais bonitos */}
      <section className="flex flex-col gap-3 w-full max-w-xl mx-auto">
        {cards.map((item, idx) => (
          <Card key={idx} className={`flex flex-row items-center gap-4 px-5 py-6 rounded-2xl shadow-lg border-none ${item.cardClass}`}>
            <div>{item.icon}</div>
            <div className="flex flex-col">
              <span className="text-[#C7CCE5] text-base font-medium mb-0.5">{item.label}</span>
              <span className={`text-2xl font-bold ${item.valueClass}`}>{item.value}</span>
            </div>
          </Card>
        ))}
      </section>

      {/* Resumo de Rentabilidade */}
      <RentabilidadeResumo
        totalInvestido={rentabilidade.total_investido ?? 0}
        totalAtual={rentabilidade.total_atual ?? 0}
        rentabilidadeSemProventos={rentabilidade.rentabilidade_sem_proventos ?? 0}
        totalProventos={rentabilidade.total_proventos ?? 0}
        rentabilidadeComProventos={rentabilidade.rentabilidade_com_proventos ?? 0}
      />

      {/* Distribuição Gráfica com degrade e paleta nova */}
      <div className="mt-12">
        <PortfolioDistribution data={dashboardData} />
      </div>
    </main>
  );
}
