import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function InserirProventoForm() {
  const [open, setOpen] = useState(false);
  const [produto, setProduto] = useState<string>("");
  const [movimentacao, setMovimentacao] = useState<string>("");
  const [data, setData] = useState<Date>();
  const [quantidade, setQuantidade] = useState<string>("");
  const [precoUnitario, setPrecoUnitario] = useState<string>("");
  const queryClient = useQueryClient();

  // Buscar produtos únicos
  const { data: produtos = [] } = useQuery({
    queryKey: ['produtos-unicos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proventos')
        .select('Produto')
        .not('Produto', 'is', null)
        .order('Produto');
      
      if (error) throw error;
      
      const unique = [...new Set(data.map(item => item.Produto))].filter(Boolean);
      return unique as string[];
    },
  });

  // Buscar movimentações únicas
  const { data: movimentacoes = [] } = useQuery({
    queryKey: ['movimentacoes-unicas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proventos')
        .select('Movimentação')
        .not('Movimentação', 'is', null)
        .order('Movimentação');
      
      if (error) throw error;
      
      const unique = [...new Set(data.map(item => item['Movimentação']))].filter(Boolean);
      return unique as string[];
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const qtd = parseFloat(quantidade) || 0;
      const preco = parseFloat(precoUnitario) || 0;
      const valorOperacao = qtd * preco;

      const { error } = await supabase
        .from('proventos')
        .insert({
          Produto: produto,
          Movimentação: movimentacao,
          Data: data ? format(data, 'yyyy-MM-dd') : null,
          Quantidade: qtd,
          'Preço unitário': preco,
          'Valor da Operação': valorOperacao,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Provento inserido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['proventos-mensais'] });
      queryClient.invalidateQueries({ queryKey: ['proventos-recebidos'] });
      queryClient.invalidateQueries({ queryKey: ['dividend-yield-anual'] });
      setOpen(false);
      // Limpar formulário
      setProduto("");
      setMovimentacao("");
      setData(undefined);
      setQuantidade("");
      setPrecoUnitario("");
    },
    onError: (error) => {
      toast.error("Erro ao inserir provento: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!produto || !movimentacao || !data) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Inserir Provento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inserir Novo Provento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="produto">Produto *</Label>
            <Select value={produto} onValueChange={setProduto}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="movimentacao">Movimentação *</Label>
            <Select value={movimentacao} onValueChange={setMovimentacao}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a movimentação" />
              </SelectTrigger>
              <SelectContent>
                {movimentacoes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data ? format(data, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data}
                  onSelect={setData}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              step="0.01"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="precoUnitario">Preço Unitário</Label>
            <Input
              id="precoUnitario"
              type="number"
              step="0.01"
              value={precoUnitario}
              onChange={(e) => setPrecoUnitario(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Inserindo..." : "Inserir"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
