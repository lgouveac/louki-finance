import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EconomicSignal {
  id: string;
  nome_evento: string;
  descricao: string | null;
  data: string | null;
  criado_por: string | null;
}

export function EconomicSignalsManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSignal, setNewSignal] = useState({ nome_evento: "", descricao: "", data: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: signals, isLoading } = useQuery({
    queryKey: ['economic-signals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('economic_signals')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) throw error;
      return data as EconomicSignal[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (signal: Omit<EconomicSignal, 'id' | 'criado_por'>) => {
      const { data, error } = await supabase
        .from('economic_signals')
        .insert([signal])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['economic-signals'] });
      setNewSignal({ nome_evento: "", descricao: "", data: "" });
      setShowAddForm(false);
      toast({ title: "Sinal econômico criado com sucesso!" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...signal }: Partial<EconomicSignal> & { id: string }) => {
      const { data, error } = await supabase
        .from('economic_signals')
        .update(signal)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['economic-signals'] });
      setEditingId(null);
      toast({ title: "Sinal econômico atualizado com sucesso!" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('economic_signals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['economic-signals'] });
      toast({ title: "Sinal econômico deletado com sucesso!" });
    }
  });

  const handleCreate = () => {
    if (!newSignal.nome_evento.trim()) return;
    createMutation.mutate(newSignal);
  };

  const handleUpdate = (id: string, field: keyof EconomicSignal, value: string) => {
    updateMutation.mutate({ id, [field]: value });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este sinal econômico?")) {
      deleteMutation.mutate(id);
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
    <Card className="glass-card border-gray-700">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-white">
          Sinais Econômicos
          <Button onClick={() => setShowAddForm(!showAddForm)} className="glass-button hover:bg-white/20 text-white border-white/20">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Sinal
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-6 p-4 glass-card border-gray-600 rounded-lg space-y-4">
            <div>
              <Label htmlFor="nome_evento" className="text-gray-300">Nome do Evento</Label>
              <Input
                id="nome_evento"
                value={newSignal.nome_evento}
                onChange={(e) => setNewSignal({ ...newSignal, nome_evento: e.target.value })}
                placeholder="Nome do evento econômico"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="descricao" className="text-gray-300">Descrição</Label>
              <Textarea
                id="descricao"
                value={newSignal.descricao}
                onChange={(e) => setNewSignal({ ...newSignal, descricao: e.target.value })}
                placeholder="Descrição do evento"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="data" className="text-gray-300">Data</Label>
              <Input
                id="data"
                type="date"
                value={newSignal.data}
                onChange={(e) => setNewSignal({ ...newSignal, data: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white focus:border-gray-400"
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
                <TableHead className="text-gray-300">Nome do Evento</TableHead>
                <TableHead className="text-gray-300">Descrição</TableHead>
                <TableHead className="text-gray-300">Data</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signals?.map((signal) => (
                <TableRow key={signal.id} className="border-gray-700 hover:bg-white/5">
                  <TableCell className="text-white">
                    {editingId === signal.id ? (
                      <Input
                        defaultValue={signal.nome_evento}
                        onBlur={(e) => handleUpdate(signal.id, 'nome_evento', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      signal.nome_evento
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {editingId === signal.id ? (
                      <Textarea
                        defaultValue={signal.descricao || ""}
                        onBlur={(e) => handleUpdate(signal.id, 'descricao', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      signal.descricao
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {editingId === signal.id ? (
                      <Input
                        type="date"
                        defaultValue={signal.data || ""}
                        onBlur={(e) => handleUpdate(signal.id, 'data', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      signal.data ? new Date(signal.data).toLocaleDateString('pt-BR') : '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(editingId === signal.id ? null : signal.id)}
                        className="border-gray-600 text-gray-300 hover:bg-white/10 hover:border-gray-400"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(signal.id)}
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
