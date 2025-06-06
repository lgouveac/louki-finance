
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface AtivoManualFormData {
  codigo: string;
  tipo: string;
  quantidade: number;
  preco_medio: number;
  valor_atual?: number;
  proventos?: number;
  ativo?: boolean;
}

interface AtivoManualFormProps {
  onSuccess: () => void;
  editingAtivo?: any;
  onCancel?: () => void;
}

export const AtivoManualForm = ({ onSuccess, editingAtivo, onCancel }: AtivoManualFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<AtivoManualFormData>({
    defaultValues: editingAtivo ? {
      codigo: editingAtivo.codigo || '',
      tipo: editingAtivo.tipo || '',
      quantidade: editingAtivo.quantidade || 0,
      preco_medio: editingAtivo.preco_medio || 0,
      valor_atual: editingAtivo.valor_atual || 0,
      proventos: editingAtivo.proventos || 0,
      ativo: editingAtivo.ativo ?? true,
    } : {
      codigo: '',
      tipo: '',
      quantidade: 0,
      preco_medio: 0,
      valor_atual: 0,
      proventos: 0,
      ativo: true,
    }
  });

  const onSubmit = async (data: AtivoManualFormData) => {
    setLoading(true);
    try {
      if (editingAtivo) {
        // Update existing
        const { error } = await supabase
          .from('ativos_manuais')
          .update({
            ...data,
            data_atualizacao: new Date().toISOString()
          })
          .eq('id', editingAtivo.id);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Ativo atualizado com sucesso.",
        });
      } else {
        // Create new
        const { error } = await supabase
          .from('ativos_manuais')
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Ativo criado com sucesso.",
        });
      }

      form.reset();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar ativo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingAtivo ? 'Editar Ativo' : 'Novo Ativo Manual'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: PETR4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ação">Ação</SelectItem>
                        <SelectItem value="FII">FII</SelectItem>
                        <SelectItem value="ETF">ETF</SelectItem>
                        <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                        <SelectItem value="Criptomoeda">Criptomoeda</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preco_medio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Médio</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_atual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Atual</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proventos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proventos</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Ativo</SelectItem>
                      <SelectItem value="false">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : (editingAtivo ? 'Atualizar' : 'Criar Ativo')}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
