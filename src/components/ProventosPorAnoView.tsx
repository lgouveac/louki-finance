
import { useQuery } from "@tanstack/react-query";
import { getDividendYieldAnual, DividendYieldAnual, getProventosRecebidos, getDashboardData } from "@/services/viewsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ProventosPorAnoViewProps {
  data: DividendYieldAnual[];
  isLoading: boolean;
}

export function ProventosPorAnoView({ data, isLoading }: ProventosPorAnoViewProps) {
  // Buscar dados para o DY atual
  const { data: proventosRecebidos = [] } = useQuery({
    queryKey: ['proventos-recebidos'],
    queryFn: getProventosRecebidos,
  });

  const { data: dashboardData = [] } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: getDashboardData,
  });

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return '0,00%';
    return `${value.toFixed(2)}%`;
  };

  // Calcular DY atual baseado nos últimos 12 meses
  const calculateCurrentDY = () => {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    // Filtrar proventos dos últimos 12 meses
    const recentProventos = proventosRecebidos.filter(provento => {
      const proventoDate = new Date(provento.Data);
      return proventoDate >= twelveMonthsAgo && proventoDate <= now;
    });

    // Somar proventos dos últimos 12 meses
    const totalProventosRecentes = recentProventos.reduce((sum, provento) => sum + (provento.valor || 0), 0);
    
    // Buscar valor total atual da carteira
    const valorTotalAtual = dashboardData.reduce((sum, item) => sum + (item.valor_total || 0), 0);
    
    // Calcular DY atual
    const dyAtual = valorTotalAtual > 0 ? (totalProventosRecentes / valorTotalAtual) * 100 : 0;
    
    return {
      proventosUltimos12Meses: totalProventosRecentes,
      valorAtual: valorTotalAtual,
      dyPercent: dyAtual
    };
  };

  const currentDY = calculateCurrentDY();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dividend Yield por Ano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dividend Yield por Ano</CardTitle>
      </CardHeader>
      <CardContent>
        {/* DY Atual - Destaque */}
        <div className="glass-card-elevated p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">DY Atual</h3>
            <Badge variant="secondary" className="text-xs">
              Últimos 12 meses
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Proventos Recebidos</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(currentDY.proventosUltimos12Meses)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Valor Atual da Carteira</p>
              <p className="text-xl font-bold">
                {formatCurrency(currentDY.valorAtual)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Dividend Yield Atual</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPercentage(currentDY.dyPercent)}
              </p>
            </div>
          </div>
        </div>

        {data.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum dado de dividend yield encontrado.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Ano</TableHead>
                  <TableHead className="text-right">Total Dividendos</TableHead>
                  <TableHead className="text-right">Capital Acumulado</TableHead>
                  <TableHead className="text-right">Dividend Yield %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.ano}>
                    <TableCell className="text-center font-medium">
                      {item.ano}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.total_dividendos)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.capital_acumulado)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPercentage(item.dividend_yield_percent)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
