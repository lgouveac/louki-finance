
import { useState, useMemo } from "react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, CoinsIcon } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ProventosMensais } from "@/types/stock";

interface ProventosMensaisViewProps {
  data: ProventosMensais[];
  isLoading: boolean;
}

export function ProventosMensaisView({ data, isLoading }: ProventosMensaisViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const filteredData = useMemo(() => {
    if (!selectedDate || !data) return data;
    
    const selectedMonthYear = format(selectedDate, 'MM/yyyy');
    
    return data.filter(item => {
      if (!item.mes_ano) return false;
      
      // Assumindo que mes_ano está no formato "MM/YYYY" ou similar
      const itemDate = item.mes_ano.replace('-', '/');
      return itemDate === selectedMonthYear;
    });
  }, [data, selectedDate]);

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
      <div className="flex gap-4 items-center">
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
        
        {selectedDate && (
          <Button
            variant="ghost"
            onClick={() => setSelectedDate(undefined)}
            className="h-10"
          >
            Limpar filtro
          </Button>
        )}
      </div>

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
          <CoinsIcon className="h-12 w-12 mb-2 opacity-50" />
          <p>Nenhum provento mensal encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Mês/Ano</TableHead>
                <TableHead className="text-right font-semibold">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow 
                  key={index} 
                  className="hover:bg-muted/50 transition-colors duration-200"
                >
                  <TableCell className="font-medium">{item.mes_ano || '-'}</TableCell>
                  <TableCell className="text-right font-medium">
                    {item.valor_total_mensal
                      ? `R$ ${item.valor_total_mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
