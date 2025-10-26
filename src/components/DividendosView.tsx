
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProventosMensaisView } from "@/components/ProventosMensaisView";
import { ProventosDetalhados } from "@/components/ProventosDetalhados";
import { ProventosPorAnoView } from "@/components/ProventosPorAnoView";
import { DYCalculator } from "@/components/DYCalculator";
import { InserirProventoForm } from "@/components/InserirProventoForm";
import { getProventosMensais, getProventosRecebidos, getDividendYieldAnual } from "@/services/viewsService";

export function DividendosView() {
  const { data: proventosMensais = [], isLoading: isLoadingMensais } = useQuery({
    queryKey: ['proventos-mensais'],
    queryFn: getProventosMensais,
  });

  const { data: proventosRecebidos = [], isLoading: isLoadingRecebidos } = useQuery({
    queryKey: ['proventos-recebidos'],
    queryFn: getProventosRecebidos,
  });

  const { data: dividendYieldAnual = [], isLoading: isLoadingDY } = useQuery({
    queryKey: ['dividend-yield-anual'],
    queryFn: getDividendYieldAnual,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <InserirProventoForm />
      </div>
      <Tabs defaultValue="mensais" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="mensais" className="text-xs md:text-sm px-2 py-2">
            Proventos Mensais
          </TabsTrigger>
          <TabsTrigger value="detalhados" className="text-xs md:text-sm px-2 py-2">
            Proventos Detalhados
          </TabsTrigger>
          <TabsTrigger value="dy-anual" className="text-xs md:text-sm px-2 py-2">
            DY por Ano
          </TabsTrigger>
          <TabsTrigger value="calculadora" className="text-xs md:text-sm px-2 py-2">
            Calculadora DY
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="mensais" className="space-y-4">
          <ProventosMensaisView 
            data={proventosMensais} 
            isLoading={isLoadingMensais} 
          />
        </TabsContent>
        
        <TabsContent value="detalhados" className="space-y-4">
          <ProventosDetalhados 
            data={proventosRecebidos} 
            isLoading={isLoadingRecebidos} 
          />
        </TabsContent>
        
        <TabsContent value="dy-anual" className="space-y-4">
          <ProventosPorAnoView 
            data={dividendYieldAnual} 
            isLoading={isLoadingDY} 
          />
        </TabsContent>
        
        <TabsContent value="calculadora" className="space-y-4">
          <DYCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
