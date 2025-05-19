
import { ProventosRecebidos } from "@/types/stock";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProventosRecebidosViewProps {
  data: ProventosRecebidos[];
  isLoading: boolean;
}

export function ProventosRecebidosView({ data, isLoading }: ProventosRecebidosViewProps) {
  if (isLoading) {
    return <div className="flex justify-center p-4">Carregando...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-muted-foreground p-4">Nenhum provento recebido encontrado.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="text-sm text-muted-foreground border-b border-muted">
            <th className="text-left pb-2 font-medium">Código</th>
            <th className="text-left pb-2 font-medium">Data</th>
            <th className="text-left pb-2 font-medium">Tipo</th>
            <th className="text-right pb-2 font-medium">Quantidade</th>
            <th className="text-right pb-2 font-medium">Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-muted hover:bg-muted/30">
              <td className="py-3">{item.codigo || '-'}</td>
              <td className="py-3">
                {item.Data ? format(new Date(item.Data), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
              </td>
              <td className="py-3">{item.tipo || '-'}</td>
              <td className="text-right py-3">{item.Quantidade?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '-'}</td>
              <td className="text-right py-3">
                {item.valor
                  ? `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
