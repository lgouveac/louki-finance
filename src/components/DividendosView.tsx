
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProventosMensaisView } from "@/components/ProventosMensaisView";
import { ProventosDetalhados } from "@/components/ProventosDetalhados";
import { getProventosMensais, getProventosRecebidos } from "@/services/viewsService";

export function DividendosView() {
  const { data: proventosMensais = [], isLoading: isLoadingMensais } = useQuery({
    queryKey: ['proventos-mensais'],
    queryFn: getProventosMensais,
  });

  const { data: proventosRecebidos = [], isLoading: isLoadingRecebidos } = useQuery({
    queryKey: ['proventos-recebidos'],
    queryFn: getProventosRecebidos,
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="mensais" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mensais">Proventos Mensais</TabsTrigger>
          <TabsTrigger value="detalhados">Proventos Detalhados</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
