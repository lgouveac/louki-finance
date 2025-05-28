
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, CoinsIcon, Search } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProventosRecebidos } from "@/types/stock";

interface ProventosDetalhadosProps {
  data: ProventosRecebidos[];
  isLoading: boolean;
}

export function ProventosDetalhados({ data, isLoading }: ProventosDetalhadosProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    
    let filtered = data;
    
    // Filtro por data
    if (selectedDate) {
      const selectedMonthYear = format(selectedDate, 'MM/yyyy');
      filtered = filtered.filter(item => {
        if (!item.Data) return false;
        const itemDate = format(new Date(item.Data), 'MM/yyyy');
        return itemDate === selectedMonthYear;
      });
    }
    
    // Filtro por código do ativo
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [data, selectedDate, searchTerm]);

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

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR }) : "Selecionar mês/ano"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        <div className="relative w-[240px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ativo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {(selectedDate || searchTerm) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedDate(undefined);
              setSearchTerm("");
            }}
            className="h-10"
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
          <CoinsIcon className="h-12 w-12 mb-2 opacity-50" />
          <p>Nenhum provento encontrado.</p>
        </div>
      ) : (
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
              {filteredData.map((item, index) => (
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
      )}
    </div>
  );
}
