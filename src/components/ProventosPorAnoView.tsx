
import { useQuery } from "@tanstack/react-query";
import { getDividendYieldAnual, DividendYieldAnual } from "@/services/viewsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface ProventosPorAnoViewProps {
  data: DividendYieldAnual[];
  isLoading: boolean;
}

export function ProventosPorAnoView({ data, isLoading }: ProventosPorAnoViewProps) {
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
