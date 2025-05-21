
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarteiraAtualView } from "@/components/CarteiraAtualView";
import { useQuery } from "@tanstack/react-query";
import { getCarteiraAtual } from "@/services/viewsService";
import { Card, CardContent } from "@/components/ui/card";

export function DataTabView() {
  const { 
    data: carteiraAtual = [], 
    isLoading: isLoadingCarteira 
  } = useQuery({
    queryKey: ['carteira_atual'],
    queryFn: getCarteiraAtual,
    refetchOnWindowFocus: false,
  });

  return (
    <Card className="shadow-md mb-6">
      <CardContent className="p-4">
        <CarteiraAtualView data={carteiraAtual} isLoading={isLoadingCarteira} />
      </CardContent>
    </Card>
  );
}
