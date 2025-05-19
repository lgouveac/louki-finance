
import { CarteiraAtual } from "@/types/stock";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { WalletIcon } from "lucide-react";

interface CarteiraAtualViewProps {
  data: CarteiraAtual[];
  isLoading: boolean;
}

export function CarteiraAtualView({ data, isLoading }: CarteiraAtualViewProps) {
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
        <WalletIcon className="h-12 w-12 mb-2 opacity-50" />
        <p>Nenhum dado encontrado na carteira atual.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Código</TableHead>
            <TableHead className="text-right font-semibold">Quantidade</TableHead>
            <TableHead className="text-right font-semibold">Preço Médio</TableHead>
            <TableHead className="text-right font-semibold">Valor Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow 
              key={index} 
              className="hover:bg-muted/50 transition-colors duration-200"
            >
              <TableCell className="font-medium">{item.codigo || '-'}</TableCell>
              <TableCell className="text-right">
                {item.quantidade_total?.toLocaleString('pt-BR') || '-'}
              </TableCell>
              <TableCell className="text-right">
                {item.preco_medio
                  ? `R$ ${item.preco_medio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '-'}
              </TableCell>
              <TableCell className="text-right font-medium">
                {item.valor_total
                  ? `R$ ${item.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
