
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/services/viewsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { CoinsIcon } from "lucide-react";

// Define an array of colors for the pie chart
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed'];

export function DashboardView() {
  const {
    data: dashboardData = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['dashboard_data'],
    queryFn: getDashboardData,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (error || dashboardData.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px] border rounded-lg p-4">
        <p className="text-muted-foreground">Não foi possível carregar os dados do dashboard.</p>
      </div>
    );
  }

  // Prepare data for rendering
  const totalValue = dashboardData.reduce((sum, item) => sum + (item.valor_total || 0), 0);

  return (
    <div className="space-y-6">
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
