import { CarteiraAtual } from "@/types/stock";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { WalletIcon, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortField, SortDirection } from "./SortControls";

interface CarteiraAtualTableViewProps {
  data: CarteiraAtual[];
  isLoading: boolean;
}

export function CarteiraAtualTableView({ data, isLoading }: CarteiraAtualTableViewProps) {
  const [selectedCodigos, setSelectedCodigos] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('valor_atual');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedData = useMemo(() => {
    if (!data) return [];

    const sorted = [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'codigo':
          aValue = a.codigo || '';
          bValue = b.codigo || '';
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        
        case 'valor_atual':
          aValue = a.valor_atual || 0;
          bValue = b.valor_atual || 0;
          break;
        
        case 'valor_investido':
          aValue = a.valor_investido || 0;
          bValue = b.valor_investido || 0;
          break;
        
        case 'rentabilidade_perc':
          aValue = a.rentabilidade_perc || -Infinity;
          bValue = b.rentabilidade_perc || -Infinity;
          break;
        
        case 'rentabilidade_com_proventos_perc':
          aValue = a.rentabilidade_com_proventos_perc || -Infinity;
          bValue = b.rentabilidade_com_proventos_perc || -Infinity;
          break;
        
        case 'proventos_recebidos':
          aValue = a.proventos_recebidos || 0;
          bValue = b.proventos_recebidos || 0;
          break;
        
        case 'quantidade_total':
          aValue = a.quantidade_total || 0;
          bValue = b.quantidade_total || 0;
          break;
        
        default:
          aValue = 0;
          bValue = 0;
      }

      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return sorted;
  }, [data, sortField, sortDirection]);

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const handleDeleteSelected = async () => {
    if (selectedCodigos.size === 0) return;

    const codigosArray = Array.from(selectedCodigos);
    let deletedTables = [];
    let errors = [];

    try {
      const { error: negociacoesError } = await supabase
        .from('negociacoes')
        .delete()
        .in('Codigo', codigosArray);
      
      if (negociacoesError) {
        errors.push('negociações');
      } else {
        deletedTables.push('negociações');
      }

      const { error: posicoesError } = await supabase
        .from('posicao_atualizada')
        .delete()
        .in('codigo', codigosArray);
      
      if (posicoesError) {
        errors.push('posições');
      } else {
        deletedTables.push('posições');
      }

      const { error: ativosError } = await supabase
        .from('ativos_manuais')
        .delete()
        .in('codigo', codigosArray);
      
      if (ativosError) {
        errors.push('ativos manuais');
      } else {
        deletedTables.push('ativos manuais');
      }

      const { error: proventosError } = await supabase
        .from('proventos')
        .delete()
        .in('Produto', codigosArray);
      
      if (proventosError) {
        errors.push('proventos');
      } else {
        deletedTables.push('proventos');
      }

      if (deletedTables.length > 0) {
        toast.success(`${selectedCodigos.size} código(s) excluído(s) de: ${deletedTables.join(', ')}`);
      }
      
      if (errors.length > 0) {
        toast.warning(`Erro ao excluir de: ${errors.join(', ')}`);
      }

      setSelectedCodigos(new Set());
      window.location.reload();
    } catch (error) {
      console.error('Error deleting selected items:', error);
      toast.error('Erro ao excluir itens selecionados');
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-2xl font-bold">Carteira Consolidada</h3>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Selecionar todos"
          />
          <span className="text-sm text-muted-foreground">Selecionar todos</span>
          {isSomeSelected && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteSelected}
              className="ml-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir ({selectedCodigos.size})
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('codigo')} className="flex items-center">
                  Código
                  {getSortIcon('codigo')}
                </Button>
              </TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('quantidade_total')} className="flex items-center ml-auto">
                  Qtd
                  {getSortIcon('quantidade_total')}
                </Button>
              </TableHead>
              <TableHead className="text-right">PM</TableHead>
              <TableHead className="text-right">Cotação</TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('valor_investido')} className="flex items-center ml-auto">
                  Investido
                  {getSortIcon('valor_investido')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('valor_atual')} className="flex items-center ml-auto">
                  Valor Atual
                  {getSortIcon('valor_atual')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('proventos_recebidos')} className="flex items-center ml-auto">
                  Proventos
                  {getSortIcon('proventos_recebidos')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('rentabilidade_perc')} className="flex items-center ml-auto">
                  Rent. %
                  {getSortIcon('rentabilidade_perc')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('rentabilidade_com_proventos_perc')} className="flex items-center ml-auto">
                  Rent. c/ Prov. %
                  {getSortIcon('rentabilidade_com_proventos_perc')}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => {
              const isSelected = item.codigo ? selectedCodigos.has(item.codigo) : false;
              const rentabilidade = item.rentabilidade_perc || 0;
              const rentabilidadeComProventos = item.rentabilidade_com_proventos_perc || 0;
              
              return (
                <TableRow key={item.codigo || index} className={isSelected ? "bg-muted/50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => item.codigo && handleSelectItem(item.codigo, checked as boolean)}
                      aria-label={`Selecionar ${item.codigo}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.Tipo}</TableCell>
                  <TableCell className="text-right">{item.quantidade_total}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.preco_medio)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.preco_atual)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.valor_investido)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.valor_atual)}</TableCell>
                  <TableCell className="text-right text-green-600">{formatCurrency(item.proventos_recebidos)}</TableCell>
                  <TableCell className={`text-right ${rentabilidade >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {rentabilidade.toFixed(2)}%
                  </TableCell>
                  <TableCell className={`text-right font-medium ${rentabilidadeComProventos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {rentabilidadeComProventos.toFixed(2)}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
