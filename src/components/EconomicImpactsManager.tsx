import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EconomicImpact {
  id: string;
  signal_id: string | null;
  categoria_afetada: string;
  acao_recomendada: string;
  justificativa: string | null;
}

interface EconomicSignal {
  id: string;
  nome_evento: string;
}

export function EconomicImpactsManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newImpact, setNewImpact] = useState({
    signal_id: "",
    categoria_afetada: "",
    acao_recomendada: "",
    justificativa: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: impacts, isLoading } = useQuery({
    queryKey: ['economic-impacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('economic_signal_impacts')
        .select('*')
        .order('categoria_afetada');
      
      if (error) throw error;
      return data as EconomicImpact[];
    }
  });

  const { data: signals } = useQuery({
    queryKey: ['economic-signals-for-impacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('economic_signals')
        .select('id, nome_evento')
        .order('nome_evento');
      
      if (error) throw error;
      return data as EconomicSignal[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (impact: Omit<EconomicImpact, 'id'>) => {
      const { data, error } = await supabase
        .from('economic_signal_impacts')
        .insert([impact])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['economic-impacts'] });
      setNewImpact({ signal_id: "", categoria_afetada: "", acao_recomendada: "", justificativa: "" });
      setShowAddForm(false);
      toast({ title: "Impacto econômico criado com sucesso!" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...impact }: Partial<EconomicImpact> & { id: string }) => {
      const { data, error } = await supabase
        .from('economic_signal_impacts')
        .update(impact)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['economic-impacts'] });
      setEditingId(null);
      toast({ title: "Impacto econômico atualizado com sucesso!" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('economic_signal_impacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['economic-impacts'] });
      toast({ title: "Impacto econômico deletado com sucesso!" });
    }
  });

  const handleCreate = () => {
    if (!newImpact.categoria_afetada.trim() || !newImpact.acao_recomendada.trim()) return;
    createMutation.mutate(newImpact);
  };

  const handleUpdate = (id: string, field: keyof EconomicImpact, value: string) => {
    updateMutation.mutate({ id, [field]: value });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este impacto econômico?")) {
      deleteMutation.mutate(id);
    }
  };

  const getSignalName = (signalId: string | null) => {
    return signals?.find(s => s.id === signalId)?.nome_evento || '-';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <Card className="glass-card border-gray-700">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-white">
          Impactos dos Sinais Econômicos
          <Button onClick={() => setShowAddForm(!showAddForm)} className="glass-button hover:bg-white/20 text-white border-white/20">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Impacto
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-6 p-4 glass-card border-gray-600 rounded-lg space-y-4">
            <div>
              <Label htmlFor="signal_id" className="text-gray-300">Sinal Econômico</Label>
              <Select onValueChange={(value) => setNewImpact({ ...newImpact, signal_id: value })}>
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione um sinal econômico" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {signals?.map((signal) => (
                    <SelectItem key={signal.id} value={signal.id} className="text-white hover:bg-gray-700">
                      {signal.nome_evento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="categoria_afetada" className="text-gray-300">Categoria Afetada</Label>
              <Input
                id="categoria_afetada"
                value={newImpact.categoria_afetada}
                onChange={(e) => setNewImpact({ ...newImpact, categoria_afetada: e.target.value })}
                placeholder="Ex: Ações, Renda Fixa, Commodities"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="acao_recomendada" className="text-gray-300">Ação Recomendada</Label>
              <Input
                id="acao_recomendada"
                value={newImpact.acao_recomendada}
                onChange={(e) => setNewImpact({ ...newImpact, acao_recomendada: e.target.value })}
                placeholder="Ex: Comprar, Vender, Manter"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="justificativa" className="text-gray-300">Justificativa</Label>
              <Textarea
                id="justificativa"
                value={newImpact.justificativa}
                onChange={(e) => setNewImpact({ ...newImpact, justificativa: e.target.value })}
                placeholder="Justificativa para a recomendação"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={createMutation.isPending} className="glass-button hover:bg-white/20 text-white border-white/20">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-gray-600 text-gray-300 hover:bg-white/10 hover:border-gray-400">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <div className="glass-card border-gray-700 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="text-gray-300">Sinal Econômico</TableHead>
                <TableHead className="text-gray-300">Categoria Afetada</TableHead>
                <TableHead className="text-gray-300">Ação Recomendada</TableHead>
                <TableHead className="text-gray-300">Justificativa</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {impacts?.map((impact) => (
                <TableRow key={impact.id} className="border-gray-700 hover:bg-white/5">
                  <TableCell className="text-white">{getSignalName(impact.signal_id)}</TableCell>
                  <TableCell className="text-gray-300">
                    {editingId === impact.id ? (
                      <Input
                        defaultValue={impact.categoria_afetada}
                        onBlur={(e) => handleUpdate(impact.id, 'categoria_afetada', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      impact.categoria_afetada
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {editingId === impact.id ? (
                      <Input
                        defaultValue={impact.acao_recomendada}
                        onBlur={(e) => handleUpdate(impact.id, 'acao_recomendada', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      impact.acao_recomendada
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {editingId === impact.id ? (
                      <Textarea
                        defaultValue={impact.justificativa || ""}
                        onBlur={(e) => handleUpdate(impact.id, 'justificativa', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      impact.justificativa
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(editingId === impact.id ? null : impact.id)}
                        className="border-gray-600 text-gray-300 hover:bg-white/10 hover:border-gray-400"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(impact.id)}
                        className="bg-red-900/50 border-red-700 text-red-300 hover:bg-red-800/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
