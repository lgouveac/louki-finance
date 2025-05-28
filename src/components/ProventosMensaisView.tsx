
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
import { ProventosDashboard } from "@/components/ProventosDashboard";

interface ProventosMensaisViewProps {
  data: ProventosMensais[];
  isLoading: boolean;
}

export function ProventosMensaisView({ data, isLoading }: ProventosMensaisViewProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const filteredData = useMemo(() => {
    if (!data) return [];
    
    if (!dateFrom && !dateTo) return data;
    
    return data.filter(item => {
      if (!item.mes_ano) return false;
      
      // Parse mes_ano (formato esperado: "MM/YYYY" ou "MM-YYYY")
      const [mes, ano] = item.mes_ano.split(/[-/]/).map(Number);
      const itemDate = new Date(ano, mes - 1, 1);
      
      if (dateFrom && itemDate < new Date(dateFrom.getFullYear(), dateFrom.getMonth(), 1)) {
        return false;
      }
      
      if (dateTo && itemDate > new Date(dateTo.getFullYear(), dateTo.getMonth(), 1)) {
        return false;
      }
      
      return true;
    });
  }, [data, dateFrom, dateTo]);

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ProventosDashboard data={[]} isLoading={true} />
        <div className="flex justify-center items-center p-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProventosDashboard data={data} isLoading={isLoading} />
      
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">De:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "MM/yyyy") : "Selecionar"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Até:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "MM/yyyy") : "Selecionar"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {(dateFrom || dateTo) && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-10"
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
          <CoinsIcon className="h-12 w-12 mb-2 opacity-50" />
          <p>Nenhum provento mensal encontrado para o período selecionado.</p>
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
