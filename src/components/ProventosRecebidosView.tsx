
import { ProventosRecebidos } from "@/types/stock";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CoinsIcon } from "lucide-react";

interface ProventosRecebidosViewProps {
  data: ProventosRecebidos[];
  isLoading: boolean;
}

export function ProventosRecebidosView({ data, isLoading }: ProventosRecebidosViewProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
        <CoinsIcon className="h-12 w-12 mb-2 opacity-50" />
        <p>Nenhum provento recebido encontrado.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Código</TableHead>
            <TableHead className="font-semibold">Data</TableHead>
            <TableHead className="font-semibold">Tipo</TableHead>
            <TableHead className="text-right font-semibold">Quantidade</TableHead>
            <TableHead className="text-right font-semibold">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow 
              key={index} 
              className="hover:bg-muted/50 transition-colors duration-200"
            >
              <TableCell className="font-medium">{item.codigo || '-'}</TableCell>
              <TableCell>
                {item.Data ? format(new Date(item.Data), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                  {item.tipo || '-'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {item.Quantidade?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '-'}
              </TableCell>
              <TableCell className="text-right font-medium">
                {item.valor
                  ? `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
