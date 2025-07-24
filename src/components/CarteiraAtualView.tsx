
import { CarteiraAtual } from "@/types/stock";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { WalletIcon, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StockCard } from "./StockCard";
import { SortControls, SortField, SortDirection } from "./SortControls";

interface CarteiraAtualViewProps {
  data: CarteiraAtual[];
  isLoading: boolean;
}

export function CarteiraAtualView({ data, isLoading }: CarteiraAtualViewProps) {
  const [selectedCodigos, setSelectedCodigos] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('valor_atual');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Função de ordenação usando useMemo para otimização
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

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleDeleteSelected = async () => {
    if (selectedCodigos.size === 0) return;

    const codigosArray = Array.from(selectedCodigos);
    let deletedTables = [];
    let errors = [];

    try {
      // Excluir de todas as tabelas relacionadas
      
      // 1. Excluir negociações
      const { error: negociacoesError } = await supabase
        .from('negociacoes')
        .delete()
        .in('Codigo', codigosArray);
      
      if (negociacoesError) {
        errors.push('negociações');
        console.error('Error deleting negociacoes:', negociacoesError);
      } else {
        deletedTables.push('negociações');
      }

      // 2. Excluir posições atualizadas
      const { error: posicoesError } = await supabase
        .from('posicao_atualizada')
        .delete()
        .in('codigo', codigosArray);
      
      if (posicoesError) {
        errors.push('posições');
        console.error('Error deleting posicao_atualizada:', posicoesError);
      } else {
        deletedTables.push('posições');
      }

      // 3. Excluir ativos manuais
      const { error: ativosError } = await supabase
        .from('ativos_manuais')
        .delete()
        .in('codigo', codigosArray);
      
      if (ativosError) {
        errors.push('ativos manuais');
        console.error('Error deleting ativos_manuais:', ativosError);
      } else {
        deletedTables.push('ativos manuais');
      }

      // 4. Excluir proventos
      const { error: proventosError } = await supabase
        .from('proventos')
        .delete()
        .in('Produto', codigosArray);
      
      if (proventosError) {
        errors.push('proventos');
        console.error('Error deleting proventos:', proventosError);
      } else {
        deletedTables.push('proventos');
      }

      // Feedback para o usuário
      if (deletedTables.length > 0) {
        toast.success(`${selectedCodigos.size} código(s) excluído(s) de: ${deletedTables.join(', ')}`);
      }
      
      if (errors.length > 0) {
        toast.warning(`Erro ao excluir de: ${errors.join(', ')}`);
      }

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
    <div className="space-y-6">
      {/* Header com título e ações */}
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

      {/* Controles de ordenação */}
      <SortControls
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {/* Grid de cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedData.map((item, index) => (
          <StockCard
            key={item.codigo || index}
            item={item}
            isSelected={item.codigo ? selectedCodigos.has(item.codigo) : false}
            onSelect={handleSelectItem}
          />
        ))}
      </div>
    </div>
  );
}
