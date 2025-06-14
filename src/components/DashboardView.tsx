
import { useQuery } from "@tanstack/react-query";
import { getDashboardData, getRentabilidade } from "@/services/viewsService";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { PortfolioDistribution } from "@/components/dashboard/PortfolioDistribution";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";

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

  return (
    <main className="w-full">
      <HeroSection
        totalAtual={rentabilidade.total_atual || 0}
        totalInvestido={rentabilidade.total_investido || 0}
        rendimentoPercent={rentabilidade.rentabilidade_sem_proventos || 0}
        totalProventos={rentabilidade.total_proventos || 0}
      />

      <div className="flex flex-col gap-16 md:gap-20">
        <PortfolioDistribution data={dashboardData} />
        <PerformanceMetrics
          rentabilidadeSemProventos={rentabilidade.rentabilidade_sem_proventos || 0}
          rentabilidadeComProventos={rentabilidade.rentabilidade_com_proventos || 0}
          totalInvestido={rentabilidade.total_investido || 0}
          totalAtual={rentabilidade.total_atual || 0}
          totalProventos={rentabilidade.total_proventos || 0}
        />
      </div>
    </main>
  );
}
