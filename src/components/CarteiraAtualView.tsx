
import { CarteiraAtual } from "@/types/stock";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { WalletIcon, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CarteiraAtualViewProps {
  data: CarteiraAtual[];
  isLoading: boolean;
}

export function CarteiraAtualView({ data, isLoading }: CarteiraAtualViewProps) {
  const [selectedCodigos, setSelectedCodigos] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCodigos(new Set(data.map(item => item.codigo).filter(Boolean) as string[]));
    } else {
      setSelectedCodigos(new Set());
    }
  };

  const handleSelectItem = (codigo: string, checked: boolean) => {
    const newSelectedCodigos = new Set(selectedCodigos);
    if (checked) {
      newSelectedCodigos.add(codigo);
    } else {
      newSelectedCodigos.delete(codigo);
    }
    setSelectedCodigos(newSelectedCodigos);
  };

  const handleDeleteSelected = async () => {
    if (selectedCodigos.size === 0) return;

    try {
      // Excluir todas as negociações dos códigos selecionados
      const { error } = await supabase
        .from('negociacoes')
        .delete()
        .in('Codigo', Array.from(selectedCodigos));

      if (error) throw error;

      toast.success(`${selectedCodigos.size} código(s) excluído(s) com sucesso!`);
      setSelectedCodigos(new Set());
      
      // Refresh da página para atualizar os dados
      window.location.reload();
    } catch (error) {
      console.error('Error deleting selected items:', error);
      toast.error('Erro ao excluir itens selecionados');
    }
  };

  const isAllSelected = data.length > 0 && selectedCodigos.size === data.length;
  const isSomeSelected = selectedCodigos.size > 0;
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
    <div className="-mx-4 sm:mx-0">
      <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
        <h3 className="text-xl font-bold">Carteira Consolidada</h3>
        {isSomeSelected && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDeleteSelected}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Selecionados ({selectedCodigos.size})
          </Button>
        )}
      </div>
      
      {/* Versão para mobile - cards em vez de tabela */}
      <div className="sm:hidden space-y-4 px-4">
        {data.map((item, index) => {
          const isRentabilidadePositive = item.rentabilidade_perc && item.rentabilidade_perc > 0;
          const isRentabilidadeComProventosPositive = item.rentabilidade_com_proventos_perc && item.rentabilidade_com_proventos_perc > 0;
          
          return (
            <div key={index} className="bg-card border rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {item.codigo && (
                    <Checkbox
                      checked={selectedCodigos.has(item.codigo)}
                      onCheckedChange={(checked) => item.codigo && handleSelectItem(item.codigo, checked as boolean)}
                      aria-label={`Selecionar ${item.codigo}`}
                    />
                  )}
                  <h4 className="font-semibold text-lg">{item.codigo || '-'}</h4>
                </div>
                <span className="text-sm px-2 py-0.5 rounded bg-muted">{item.Tipo || '-'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Quantidade</p>
                  <p className="font-medium">{item.quantidade_total?.toLocaleString('pt-BR') || '-'}</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Preço Médio</p>
                  <p className="font-medium">{item.preco_medio ? formatCurrency(item.preco_medio) : '-'}</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Preço Atual</p>
                  <p className="font-medium">{item.preco_atual ? formatCurrency(item.preco_atual) : '-'}</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Valor Investido</p>
                  <p className="font-medium">{item.valor_investido ? formatCurrency(item.valor_investido) : '-'}</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Valor Atual</p>
                  <p className="font-medium">{item.valor_atual ? formatCurrency(item.valor_atual) : '-'}</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Rentabilidade</p>
                  <p className={`font-medium ${isRentabilidadePositive ? 'text-stock-positive' : item.rentabilidade_perc && item.rentabilidade_perc < 0 ? 'text-stock-negative' : ''}`}>
                    {item.rentabilidade_perc ? `${item.rentabilidade_perc.toFixed(2)}%` : '-'}
                  </p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Com Proventos</p>
                  <p className={`font-medium ${isRentabilidadeComProventosPositive ? 'text-stock-positive' : item.rentabilidade_com_proventos_perc && item.rentabilidade_com_proventos_perc < 0 ? 'text-stock-negative' : ''}`}>
                    {item.rentabilidade_com_proventos_perc ? `${item.rentabilidade_com_proventos_perc.toFixed(2)}%` : '-'}
                  </p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Proventos</p>
                  <p className="font-medium text-amber-500">{item.proventos_recebidos ? formatCurrency(item.proventos_recebidos) : '-'}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Versão para desktop - tabela tradicional */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead className="font-semibold">Código</TableHead>
              <TableHead className="font-semibold">Tipo</TableHead>
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
                <TableCell>
                  {item.codigo && (
                    <Checkbox
                      checked={selectedCodigos.has(item.codigo)}
                      onCheckedChange={(checked) => item.codigo && handleSelectItem(item.codigo, checked as boolean)}
                      aria-label={`Selecionar ${item.codigo}`}
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.codigo || '-'}</TableCell>
                <TableCell>{item.Tipo || '-'}</TableCell>
                <TableCell className="text-right">
                  {item.quantidade_total?.toLocaleString('pt-BR') || '-'}
                </TableCell>
                <TableCell className="text-right">
                  {item.preco_medio ? formatCurrency(item.preco_medio) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {item.preco_atual ? formatCurrency(item.preco_atual) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {item.valor_investido ? formatCurrency(item.valor_investido) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {item.valor_atual ? formatCurrency(item.valor_atual) : '-'}
                </TableCell>
                <TableCell className={`text-right ${item.rentabilidade_perc && item.rentabilidade_perc > 0 ? 'text-stock-positive' : item.rentabilidade_perc && item.rentabilidade_perc < 0 ? 'text-stock-negative' : ''}`}>
                  {item.rentabilidade_perc
                    ? `${item.rentabilidade_perc.toFixed(2)}%`
                    : '-'}
                </TableCell>
                <TableCell className={`text-right ${item.rentabilidade_com_proventos_perc && item.rentabilidade_com_proventos_perc > 0 ? 'text-stock-positive' : item.rentabilidade_com_proventos_perc && item.rentabilidade_com_proventos_perc < 0 ? 'text-stock-negative' : ''}`}>
                  {item.rentabilidade_com_proventos_perc
                    ? `${item.rentabilidade_com_proventos_perc.toFixed(2)}%`
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {item.proventos_recebidos ? formatCurrency(item.proventos_recebidos) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
