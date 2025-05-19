
import { Provento } from "@/types/stock";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProventosListProps {
  proventos: Provento[];
}

export function ProventosList({ proventos }: ProventosListProps) {
  if (!proventos || proventos.length === 0) {
    return (
      <div className="bg-card rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Proventos</h2>
        <p className="text-muted-foreground">Nenhum provento encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-4 overflow-hidden mb-6">
      <h2 className="text-lg font-semibold mb-4">Proventos</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-sm text-muted-foreground border-b border-muted">
              <th className="text-left pb-2 font-medium">Data</th>
              <th className="text-left pb-2 font-medium">Produto</th>
              <th className="text-left pb-2 font-medium">Movimentação</th>
              <th className="text-right pb-2 font-medium">Quantidade</th>
              <th className="text-right pb-2 font-medium">Preço Unitário</th>
              <th className="text-right pb-2 font-medium">Valor da Operação</th>
            </tr>
          </thead>
          <tbody>
            {proventos.map((provento) => (
              <tr key={provento.id} className="border-b border-muted hover:bg-muted/30">
                <td className="py-3">
                  {provento.Data ? format(new Date(provento.Data), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                </td>
                <td className="py-3">{provento.Produto || '-'}</td>
                <td className="py-3">{provento.Movimentação || '-'}</td>
                <td className="text-right py-3">{provento.Quantidade?.toFixed(2) || '-'}</td>
                <td className="text-right py-3">
                  {provento["Preço unitário"] 
                    ? `R$ ${provento["Preço unitário"].toFixed(2)}` 
                    : '-'}
                </td>
                <td className="text-right py-3">
                  {provento["Valor da Operação"] 
                    ? `R$ ${provento["Valor da Operação"].toFixed(2)}` 
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
