
import { useQuery } from "@tanstack/react-query";
import { getDashboardData, getRentabilidade } from "@/services/viewsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { CoinsIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";

// Define an array of colors for the pie chart
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed'];

export function DashboardView() {
  const {
    data: dashboardData = [],
    isLoading: isDashboardLoading,
    error: dashboardError
  } = useQuery({
    queryKey: ['dashboard_data'],
    queryFn: getDashboardData,
    refetchOnWindowFocus: false,
  });

  const {
    data: rentabilidadeData = [],
    isLoading: isRentabilidadeLoading,
    error: rentabilidadeError
  } = useQuery({
    queryKey: ['rentabilidade_data'],
    queryFn: getRentabilidade,
    refetchOnWindowFocus: false,
  });

  const isLoading = isDashboardLoading || isRentabilidadeLoading;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if ((dashboardError && dashboardData.length === 0) || (rentabilidadeError && rentabilidadeData.length === 0)) {
    return (
      <div className="flex justify-center items-center h-[300px] border rounded-lg p-4">
        <p className="text-muted-foreground">Não foi possível carregar os dados do dashboard.</p>
      </div>
    );
  }

  // Prepare data for rendering
  const totalValue = dashboardData.reduce((sum, item) => sum + (item.valor_total || 0), 0);
  
  // Rentabilidade data - get the first item as it contains the summary
  const rentabilidade = rentabilidadeData[0] || {
    rentabilidade_sem_proventos: 0,
    total_atual: 0,
    total_investido: 0,
    rentabilidade_com_proventos: 0,
    total_proventos: 0
  };
  
  // Use the rentabilidade_sem_proventos_perc and rentabilidade_com_proventos_perc directly from the database
  const rendimentoSemProventosPercent = rentabilidade.rentabilidade_sem_proventos_perc || 0;
  const rendimentoComProventosPercent = rentabilidade.rentabilidade_com_proventos_perc || 0;

  // Check if rendimentos are positive or negative
  const isRendimentoSemProventosPositive = rendimentoSemProventosPercent >= 0;
  const isRendimentoComProventosPositive = rendimentoComProventosPercent >= 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-md border-border/40">
          <CardContent className="p-4 flex items-center gap-3">
            <CoinsIcon className="h-10 w-10 text-blue-400 p-2 bg-blue-400/10 rounded-full" />
            <div>
              <p className="text-muted-foreground text-sm">Valor Total</p>
              <p className="text-xl font-bold">
                R$ {(rentabilidade.total_atual || 0).toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-border/40">
          <CardContent className="p-4 flex items-center gap-3">
            {isRendimentoSemProventosPositive ? (
              <TrendingUpIcon className="h-10 w-10 text-stock-positive p-2 bg-stock-positive/10 rounded-full" />
            ) : (
              <TrendingDownIcon className="h-10 w-10 text-stock-negative p-2 bg-stock-negative/10 rounded-full" />
            )}
            <div>
              <p className="text-muted-foreground text-sm">Rendimento (%)</p>
              <div className="flex items-center gap-2">
                <p className={`text-xl font-bold ${isRendimentoSemProventosPositive ? 'text-stock-positive' : 'text-stock-negative'}`}>
                  {rendimentoSemProventosPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-border/40">
          <CardContent className="p-4 flex items-center gap-3">
            <CoinsIcon className="h-10 w-10 text-amber-400 p-2 bg-amber-400/10 rounded-full" />
            <div>
              <p className="text-muted-foreground text-sm">Proventos Recebidos</p>
              <p className="text-xl font-bold text-amber-500">
                R$ {(rentabilidade.total_proventos || 0).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border-border/40">
        <CardHeader>
          <CardTitle className="text-xl">Resumo de Rentabilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor Investido:</span>
                <span className="font-medium">
                  R$ {(rentabilidade.total_investido || 0).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor Atual:</span>
                <span className="font-medium">
                  R$ {(rentabilidade.total_atual || 0).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rendimento sem Proventos:</span>
                <span className={`font-medium ${isRendimentoSemProventosPositive ? 'text-stock-positive' : 'text-stock-negative'}`}>
                  {rendimentoSemProventosPercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de Proventos:</span>
                <span className="font-medium text-amber-500">
                  R$ {(rentabilidade.total_proventos || 0).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-muted-foreground">Rendimento com Proventos:</span>
                <span className={`font-medium ${isRendimentoComProventosPositive ? 'text-stock-positive' : 'text-stock-negative'}`}>
                  {rendimentoComProventosPercent.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between w-full bg-background/50 p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isRendimentoSemProventosPositive ? 'bg-stock-positive' : 'bg-stock-negative'}`}></div>
                  <span className="text-sm">Rendimento sem proventos</span>
                </div>
                <span className={`text-xl font-bold ${isRendimentoSemProventosPositive ? 'text-stock-positive' : 'text-stock-negative'}`}>
                  {rendimentoSemProventosPercent.toFixed(2)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between w-full bg-background/50 p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isRendimentoComProventosPositive ? 'bg-stock-positive' : 'bg-stock-negative'}`}></div>
                  <span className="text-sm">Rendimento com proventos</span>
                </div>
                <span className={`text-xl font-bold ${isRendimentoComProventosPositive ? 'text-stock-positive' : 'text-stock-negative'}`}>
                  {rendimentoComProventosPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CoinsIcon className="h-6 w-6 text-primary" />
            Distribuição de Investimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="valor_total"
                  >
                    {dashboardData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
                    labelFormatter={(index: any) => {
                      const item = dashboardData[typeof index === 'number' ? index : 0];
                      return `Tipo: ${item.Tipo || 'N/A'}`;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="space-y-3">
                {dashboardData.map((item, index) => (
                  <div key={item.Tipo || index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{item.Tipo || 'Não categorizado'}</span>
                    </div>
                    <div className="text-right">
                      <p>{(item.percentual || 0).toFixed(2)}%</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {(item.valor_total || 0).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <div className="font-medium">Total</div>
                  <div className="text-right font-medium">
                    R$ {totalValue.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
