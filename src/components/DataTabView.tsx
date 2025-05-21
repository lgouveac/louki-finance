
import { CarteiraAtualView } from "@/components/CarteiraAtualView";
import { useQuery } from "@tanstack/react-query";
import { getCarteiraAtual } from "@/services/viewsService";
import { Card, CardContent } from "@/components/ui/card";
import { CarteiraAtual } from "@/types/stock";

interface DataTabViewProps {
  searchQuery?: string;
  tipoFilter?: string;
}

export function DataTabView({ searchQuery = "", tipoFilter = "" }: DataTabViewProps) {
  const { 
    data: carteiraAtual = [], 
    isLoading: isLoadingCarteira 
  } = useQuery({
    queryKey: ['carteira_atual'],
    queryFn: getCarteiraAtual,
    refetchOnWindowFocus: false,
  });
  
  // Filter data based on searchQuery and tipoFilter
  const filteredData = carteiraAtual.filter((item: CarteiraAtual) => {
    // Filter by search query (case-insensitive)
    const matchesSearch = searchQuery === "" || 
      (item.codigo && item.codigo.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tipo
    const matchesTipo = tipoFilter === "" || item.Tipo === tipoFilter;
    
    return matchesSearch && matchesTipo;
  });

  return (
    <Card className="shadow-md mb-6">
      <CardContent className="p-4">
        <CarteiraAtualView data={filteredData} isLoading={isLoadingCarteira} />
      </CardContent>
    </Card>
  );
}
