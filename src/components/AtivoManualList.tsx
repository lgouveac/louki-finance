
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Plus } from 'lucide-react';
import { AtivoManualForm } from './AtivoManualForm';
import { toast } from 'sonner';

interface AtivoManual {
  id: number;
  codigo: string;
  tipo: string;
  quantidade: number;
  preco_medio: number;
  valor_atual?: number;
  proventos?: number;
  ativo?: boolean;
  data_atualizacao?: string;
}

export const AtivoManualList = () => {
  const [ativos, setAtivos] = useState<AtivoManual[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAtivo, setEditingAtivo] = useState<AtivoManual | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const { toast: useToastFn } = useToast();

  const fetchAtivos = async () => {
    try {
      const { data, error } = await supabase
        .from('ativos_manuais')
        .select('*')
        .order('codigo');

      if (error) throw error;
      setAtivos(data || []);
    } catch (error: any) {
      useToastFn({
        title: "Erro",
        description: "Erro ao carregar ativos: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAtivos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este ativo?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ativos_manuais')
        .delete()
        .eq('id', id);

      if (error) throw error;

      useToastFn({
        title: "Sucesso!",
        description: "Ativo excluído com sucesso.",
      });
      
      fetchAtivos();
    } catch (error: any) {
      useToastFn({
        title: "Erro",
        description: "Erro ao excluir ativo: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (ativo: AtivoManual) => {
    setEditingAtivo(ativo);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAtivo(null);
    fetchAtivos();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAtivo(null);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(ativos.map(ativo => ativo.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    try {
      const { error } = await supabase
        .from('ativos_manuais')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      toast.success(`${selectedIds.size} ativo(s) excluído(s) com sucesso!`);
      setSelectedIds(new Set());
      fetchAtivos();
    } catch (error) {
      console.error('Error deleting selected ativos:', error);
      toast.error('Erro ao excluir ativos selecionados');
    }
  };

  const isAllSelected = ativos.length > 0 && selectedIds.size === ativos.length;
  const isSomeSelected = selectedIds.size > 0;

  if (showForm) {
    return (
      <AtivoManualForm
        onSuccess={handleFormSuccess}
        editingAtivo={editingAtivo}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ativos Manuais</CardTitle>
        <div className="flex gap-2">
          {isSomeSelected && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Selecionados ({selectedIds.size})
            </Button>
          )}
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Ativo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Carregando ativos...</p>
          </div>
        ) : ativos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Nenhum ativo manual encontrado.</p>
            <Button onClick={() => setShowForm(true)}>
              Criar Primeiro Ativo
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Selecionar todos"
                    />
                  </TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Médio</TableHead>
                  <TableHead>Valor Atual</TableHead>
                  <TableHead>Proventos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ativos.map((ativo) => (
                  <TableRow key={ativo.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(ativo.id)}
                        onCheckedChange={(checked) => handleSelectItem(ativo.id, checked as boolean)}
                        aria-label={`Selecionar ${ativo.codigo}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{ativo.codigo}</TableCell>
                    <TableCell>{ativo.tipo}</TableCell>
                    <TableCell>{ativo.quantidade?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>R$ {ativo.preco_medio?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>R$ {ativo.valor_atual?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</TableCell>
                    <TableCell>R$ {ativo.proventos?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ativo.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {ativo.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(ativo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(ativo.id)}
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
        )}
      </CardContent>
    </Card>
  );
};
