
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
        <p>Nenhum dado encontrado na carteira.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <h3 className="text-xl font-bold mb-4">Carteira Consolidada</h3>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Código</TableHead>
            <TableHead className="text-right font-semibold">Quantidade</TableHead>
            <TableHead className="text-right font-semibold">Preço Médio</TableHead>
            <TableHead className="text-right font-semibold">Preço Atual</TableHead>
            <TableHead className="text-right font-semibold">Valor Investido</TableHead>
            <TableHead className="text-right font-semibold">Valor Atual</TableHead>
            <TableHead className="text-right font-semibold">Rentabilidade (%)</TableHead>
            <TableHead className="text-right font-semibold">Rentabilidade c/ Proventos (%)</TableHead>
            <TableHead className="text-right font-semibold">Proventos Recebidos</TableHead>
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
              <TableCell className="text-right">
                {item.preco_atual
                  ? `R$ ${item.preco_atual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                {item.valor_investido
                  ? `R$ ${item.valor_investido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                {item.valor_atual
                  ? `R$ ${item.valor_atual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '-'}
              </TableCell>
              <TableCell className={`text-right ${item.rentabilidade_perc && item.rentabilidade_perc > 0 ? 'text-green-600' : item.rentabilidade_perc && item.rentabilidade_perc < 0 ? 'text-red-600' : ''}`}>
                {item.rentabilidade_perc
                  ? `${item.rentabilidade_perc.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                  : '-'}
              </TableCell>
              <TableCell className={`text-right ${item.rentabilidade_com_proventos_perc && item.rentabilidade_com_proventos_perc > 0 ? 'text-green-600' : item.rentabilidade_com_proventos_perc && item.rentabilidade_com_proventos_perc < 0 ? 'text-red-600' : ''}`}>
                {item.rentabilidade_com_proventos_perc
                  ? `${item.rentabilidade_com_proventos_perc.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                {item.proventos_recebidos
                  ? `R$ ${item.proventos_recebidos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
