import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type SortField = 
  | 'codigo'
  | 'valor_atual'
  | 'valor_investido'
  | 'rentabilidade_perc'
  | 'rentabilidade_com_proventos_perc'
  | 'proventos_recebidos'
  | 'quantidade_total';

export type SortDirection = 'asc' | 'desc';

interface SortControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

export function SortControls({ sortField, sortDirection, onSortChange }: SortControlsProps) {
  const sortOptions = [
    { value: 'codigo', label: 'Código' },
    { value: 'valor_atual', label: 'Maior Posição (Valor)' },
    { value: 'quantidade_total', label: 'Maior Quantidade' },
    { value: 'rentabilidade_perc', label: 'Rentabilidade' },
    { value: 'rentabilidade_com_proventos_perc', label: 'Rentabilidade c/ Proventos' },
    { value: 'proventos_recebidos', label: 'Proventos Recebidos' },
    { value: 'valor_investido', label: 'Valor Investido' },
  ];

  const handleSortFieldChange = (field: SortField) => {
    onSortChange(field, sortDirection);
  };

  const toggleSortDirection = () => {
    onSortChange(sortField, sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = () => {
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    } else {
      return <ArrowDown className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium">Ordenar por:</span>
      
      <Select value={sortField} onValueChange={handleSortFieldChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleSortDirection}
        className="flex items-center gap-2"
      >
        {getSortIcon()}
        {sortDirection === 'asc' ? 'Crescente' : 'Decrescente'}
      </Button>
    </div>
  );
}