
import { useQuery } from "@tanstack/react-query";
import { getAnomaliasCorrigidas } from "@/services/viewsService";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function AnomaliasCorrigidasView() {
  const { data: anomalias = [], isLoading, error } = useQuery({
    queryKey: ["anomalias_corrigidas"],
    queryFn: getAnomaliasCorrigidas,
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando dados...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Erro ao carregar dados de anomalias corrigidas.</div>;
  }

  if (anomalias.length === 0) {
    return <div className="p-4">Nenhuma anomalia de preço médio encontrada.</div>;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Qtd. Atual</TableHead>
              <TableHead>Qtd. Comprada</TableHead>
              <TableHead>Delta Qtd.</TableHead>
              <TableHead>PM Original</TableHead>
              <TableHead>PM Corrigido</TableHead>
              <TableHead>Valor Investido</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anomalias.map((item, index) => (
              <TableRow key={`${item.codigo}-${index}`}>
                <TableCell className="font-medium">{item.codigo}</TableCell>
                <TableCell>{item.qtd_atual?.toFixed(2) || '-'}</TableCell>
                <TableCell>{item.qtd_comprada?.toFixed(0) || '-'}</TableCell>
                <TableCell>{item.delta_qtd?.toFixed(2) || '-'}</TableCell>
                <TableCell>{item.preco_medio_original ? formatCurrency(item.preco_medio_original) : '-'}</TableCell>
                <TableCell>{item.preco_medio_corrigido ? formatCurrency(item.preco_medio_corrigido) : '-'}</TableCell>
                <TableCell>{item.valor_investido ? formatCurrency(item.valor_investido) : '-'}</TableCell>
                <TableCell>
                  {item.sem_evento_registrado ? 
                    <Badge variant="destructive">Sem evento</Badge> : 
                    <Badge variant="outline">Registrado</Badge>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
