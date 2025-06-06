
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { AtivoManualForm } from './AtivoManualForm';

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
  const { toast } = useToast();

  const fetchAtivos = async () => {
    try {
      const { data, error } = await supabase
        .from('ativos_manuais')
        .select('*')
        .order('codigo');

      if (error) throw error;
      setAtivos(data || []);
    } catch (error: any) {
      toast({
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

      toast({
        title: "Sucesso!",
        description: "Ativo excluído com sucesso.",
      });
      
      fetchAtivos();
    } catch (error: any) {
      toast({
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
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Ativo
        </Button>
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
