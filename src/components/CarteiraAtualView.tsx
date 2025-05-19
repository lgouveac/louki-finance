
import { CarteiraAtual } from "@/types/stock";

interface CarteiraAtualViewProps {
  data: CarteiraAtual[];
  isLoading: boolean;
}

export function CarteiraAtualView({ data, isLoading }: CarteiraAtualViewProps) {
  if (isLoading) {
    return <div className="flex justify-center p-4">Carregando...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-muted-foreground p-4">Nenhum dado encontrado na carteira atual.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="text-sm text-muted-foreground border-b border-muted">
            <th className="text-left pb-2 font-medium">Código</th>
            <th className="text-right pb-2 font-medium">Quantidade</th>
            <th className="text-right pb-2 font-medium">Preço Médio</th>
            <th className="text-right pb-2 font-medium">Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-muted hover:bg-muted/30">
              <td className="py-3">{item.codigo || '-'}</td>
              <td className="text-right py-3">{item.quantidade_total?.toLocaleString('pt-BR') || '-'}</td>
              <td className="text-right py-3">
                {item.preco_medio
                  ? `R$ ${item.preco_medio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '-'}
              </td>
              <td className="text-right py-3">
                {item.valor_total
                  ? `R$ ${item.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
