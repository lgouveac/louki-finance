
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Recomendações Econômicas
        </h2>
        <p className="text-sm text-gray-400">
          Consolidação de recomendações baseadas em sinais econômicos
        </p>
      </div>

      {/* Filters */}
      <Card className="glass-card border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <Label htmlFor="search" className="text-gray-300 text-sm">Buscar</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por evento, categoria ou ação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-400"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category-filter" className="text-gray-300 text-sm">Categoria</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white hover:bg-gray-700">Todas as categorias</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="action-filter" className="text-gray-300 text-sm">Ação</Label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue placeholder="Todas as ações" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white hover:bg-gray-700">Todas as ações</SelectItem>
                    {uniqueActions.map((action) => (
                      <SelectItem key={action} value={action} className="text-white hover:bg-gray-700">
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="glass-card border-gray-700">
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block md:hidden">
            {filteredRecommendations?.length === 0 ? (
              <div className="text-center py-8 text-gray-400 px-4">
                Nenhuma recomendação encontrada com os filtros aplicados.
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {filteredRecommendations?.map((rec, index) => (
                  <div key={`${rec.sinal_id}-${rec.impacto_id}-${index}`} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white text-sm truncate">
                            {rec.nome_evento || '-'}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {rec.data ? new Date(rec.data).toLocaleDateString('pt-BR') : '-'}
                          </div>
                        </div>
                        <Badge variant={getActionBadgeVariant(rec.acao_recomendada)} className="text-xs">
                          {rec.acao_recomendada || '-'}
                        </Badge>
                      </div>
                      
                      <div>
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {rec.categoria_afetada || '-'}
                        </Badge>
                      </div>
                      
                      {rec.descricao_evento && (
                        <div className="text-xs text-gray-400 line-clamp-2">
                          {rec.descricao_evento}
                        </div>
                      )}
                      
                      {rec.justificativa && (
                        <div className="text-xs text-gray-300 bg-gray-800/30 rounded p-2">
                          <span className="font-medium">Justificativa: </span>
                          {rec.justificativa}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-transparent">
                  <TableHead className="text-gray-300 font-medium">Data</TableHead>
                  <TableHead className="text-gray-300 font-medium">Evento Econômico</TableHead>
                  <TableHead className="text-gray-300 font-medium">Categoria</TableHead>
                  <TableHead className="text-gray-300 font-medium">Ação</TableHead>
                  <TableHead className="text-gray-300 font-medium">Justificativa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecommendations?.map((rec, index) => (
                  <TableRow key={`${rec.sinal_id}-${rec.impacto_id}-${index}`} className="border-gray-700 hover:bg-white/5">
                    <TableCell className="text-gray-300">
                      {rec.data ? new Date(rec.data).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-white">{rec.nome_evento || '-'}</div>
                        {rec.descricao_evento && (
                          <div className="text-sm text-gray-400 line-clamp-2">
                            {rec.descricao_evento}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {rec.categoria_afetada || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(rec.acao_recomendada)}>
                        {rec.acao_recomendada || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs text-gray-300 text-sm" title={rec.justificativa || ""}>
                        {rec.justificativa ? (
                          <div className="line-clamp-2">{rec.justificativa}</div>
                        ) : (
                          '-'
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredRecommendations?.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Nenhuma recomendação encontrada com os filtros aplicados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
