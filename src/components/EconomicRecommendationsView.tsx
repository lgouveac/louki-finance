
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface EconomicRecommendation {
  sinal_id: string | null;
  nome_evento: string | null;
  descricao_evento: string | null;
  data: string | null;
  impacto_id: string | null;
  categoria_afetada: string | null;
  acao_recomendada: string | null;
  justificativa: string | null;
}

export function EconomicRecommendationsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['economic-recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('economic_recommendations')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) throw error;
      return data as EconomicRecommendation[];
    }
  });

  const filteredRecommendations = recommendations?.filter((rec) => {
    const matchesSearch = 
      rec.nome_evento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.categoria_afetada?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.acao_recomendada?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || rec.categoria_afetada === categoryFilter;
    const matchesAction = actionFilter === "all" || rec.acao_recomendada === actionFilter;
    
    return matchesSearch && matchesCategory && matchesAction;
  });

  const uniqueCategories = [...new Set(recommendations?.map(r => r.categoria_afetada).filter(Boolean))];
  const uniqueActions = [...new Set(recommendations?.map(r => r.acao_recomendada).filter(Boolean))];

  const getActionBadgeVariant = (action: string | null) => {
    switch (action?.toLowerCase()) {
      case 'comprar': return 'default';
      case 'vender': return 'destructive';
      case 'manter': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recomendações Econômicas Consolidadas</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Buscar por evento, categoria ou ação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="category-filter">Filtrar por Categoria</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="action-filter">Filtrar por Ação</Label>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as ações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Evento Econômico</TableHead>
              <TableHead>Categoria Afetada</TableHead>
              <TableHead>Ação Recomendada</TableHead>
              <TableHead>Justificativa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecommendations?.map((rec, index) => (
              <TableRow key={`${rec.sinal_id}-${rec.impacto_id}-${index}`}>
                <TableCell>
                  {rec.data ? new Date(rec.data).toLocaleDateString('pt-BR') : '-'}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{rec.nome_evento || '-'}</div>
                    {rec.descricao_evento && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {rec.descricao_evento}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{rec.categoria_afetada || '-'}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getActionBadgeVariant(rec.acao_recomendada)}>
                    {rec.acao_recomendada || '-'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={rec.justificativa || ""}>
                    {rec.justificativa || '-'}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredRecommendations?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma recomendação encontrada com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
