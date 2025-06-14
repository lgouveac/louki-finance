
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
      <div className="space-y-8">
        {/* Hero Section Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-16 w-80 mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
        
        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if ((dashboardError && dashboardData.length === 0) || (rentabilidadeError && rentabilidadeData.length === 0)) {
    return (
      <div className="flex justify-center items-center h-[400px] glass-card rounded-lg p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">📊</div>
          <p className="text-lg font-medium">Não foi possível carregar os dados</p>
          <p className="text-muted-foreground">Verifique sua conexão e tente novamente</p>
        </div>
      </div>
    );
  }

  // Prepare data for rendering
  const rentabilidade = rentabilidadeData[0] || {
    rentabilidade_sem_proventos: 0,
    total_atual: 0,
    total_investido: 0,
    rentabilidade_com_proventos: 0,
    total_proventos: 0
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection
        totalAtual={rentabilidade.total_atual || 0}
        totalInvestido={rentabilidade.total_investido || 0}
        rendimentoPercent={rentabilidade.rentabilidade_sem_proventos || 0}
        totalProventos={rentabilidade.total_proventos || 0}
      />

      {/* Performance and Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceMetrics
          rentabilidadeSemProventos={rentabilidade.rentabilidade_sem_proventos || 0}
          rentabilidadeComProventos={rentabilidade.rentabilidade_com_proventos || 0}
          totalInvestido={rentabilidade.total_investido || 0}
          totalAtual={rentabilidade.total_atual || 0}
          totalProventos={rentabilidade.total_proventos || 0}
        />
        
        <PortfolioDistribution data={dashboardData} />
      </div>
    </div>
  );
}
