
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, TrendingUpIcon, CoinsIcon } from "lucide-react";
import { ProventosMensais } from "@/types/stock";
import { useMemo } from "react";

interface ProventosDashboardProps {
  data: ProventosMensais[];
  isLoading: boolean;
}

export function ProventosDashboard({ data, isLoading }: ProventosDashboardProps) {
  const metrics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        ultimoAno: 0,
        ultimos12Meses: 0,
        total: 0
      };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, 1);

    let ultimoAno = 0;
    let ultimos12Meses = 0;
    let total = 0;

    data.forEach(item => {
      if (!item.mes_ano || !item.valor_total_mensal) return;

      const valor = item.valor_total_mensal;
      total += valor;

      // Parse mes_ano (formato esperado: "MM/YYYY" ou "MM-YYYY")
      const [mes, ano] = item.mes_ano.split(/[-/]/).map(Number);
      
      if (ano === currentYear) {
        ultimoAno += valor;
      }

      // Para últimos 12 meses
      const itemDate = new Date(ano, mes - 1, 1);
      if (itemDate >= twelveMonthsAgo) {
        ultimos12Meses += valor;
      }
    });

    return { ultimoAno, ultimos12Meses, total };
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Último Ano</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.ultimoAno)}</div>
          <p className="text-xs text-muted-foreground">
            Proventos recebidos em {new Date().getFullYear()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Últimos 12 Meses</CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.ultimos12Meses)}</div>
          <p className="text-xs text-muted-foreground">
            Proventos dos últimos 12 meses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <CoinsIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.total)}</div>
          <p className="text-xs text-muted-foreground">
            Total de proventos recebidos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
