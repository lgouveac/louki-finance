import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, RotateCcw, Target, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCarteiraComparativa, getCarteiraIdeal, upsertCarteiraIdeal, deleteCarteiraIdeal, inicializarCarteiraIdeal } from "@/services/viewsService";
import { CarteiraComparativa, CarteiraIdeal } from "@/types/stock";
export function CarteiraIdealManager() {
  const [carteiraComparativa, setCarteiraComparativa] = useState<CarteiraComparativa[]>([]);
  const [carteiraIdeal, setCarteiraIdeal] = useState<CarteiraIdeal[]>([]);
  const [novoTipo, setNovoTipo] = useState("");
  const [novoPercentual, setNovoPercentual] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [comparativaData, idealData] = await Promise.all([getCarteiraComparativa(), getCarteiraIdeal()]);
      setCarteiraComparativa(comparativaData);
      setCarteiraIdeal(idealData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da carteira",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleInicializar = async () => {
    try {
      const resultado = await inicializarCarteiraIdeal();
      toast({
        title: "Sucesso",
        description: resultado
      });
      fetchData();
    } catch (error) {
      console.error("Error initializing:", error);
      toast({
        title: "Erro",
        description: "Erro ao inicializar carteira ideal",
        variant: "destructive"
      });
    }
  };
  const handleSave = async (tipo: string, percentual: number) => {
    try {
      await upsertCarteiraIdeal(tipo, percentual);
      toast({
        title: "Sucesso",
        description: "Percentual atualizado com sucesso"
      });
      fetchData();
      setEditingId(null);
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar percentual",
        variant: "destructive"
      });
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await deleteCarteiraIdeal(id);
      toast({
        title: "Sucesso",
        description: "Item removido da carteira ideal"
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        title: "Erro",
        description: "Erro ao remover item",
        variant: "destructive"
      });
    }
  };
  const handleAddNew = async () => {
    if (!novoTipo || !novoPercentual) {
      toast({
        title: "Erro",
        description: "Preencha tipo e percentual",
        variant: "destructive"
      });
      return;
    }
    const percentual = parseFloat(novoPercentual);
    if (isNaN(percentual) || percentual < 0 || percentual > 100) {
      toast({
        title: "Erro",
        description: "Percentual deve ser entre 0 e 100",
        variant: "destructive"
      });
      return;
    }
    await handleSave(novoTipo, percentual);
    setNovoTipo("");
    setNovoPercentual("");
  };
  const getTotalPercentual = () => {
    return carteiraComparativa.reduce((sum, item) => sum + (item.percentual_ideal || 0), 0);
  };
  const getActionIcon = (acao: string | null) => {
    switch (acao) {
      case 'COMPRAR':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'VENDER':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-blue-600" />;
    }
  };
  const getActionColor = (acao: string | null) => {
    switch (acao) {
      case 'COMPRAR':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'VENDER':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">Carregando carteira ideal...</div>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carteira Ideal</h2>
        <Button onClick={handleInicializar} variant="outline" className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Inicializar com Atuais
        </Button>
      </div>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resumo da Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg">
            Total Alocado: <span className={getTotalPercentual() === 100 ? "text-green-600 font-semibold" : "text-orange-600 font-semibold"}>{getTotalPercentual().toFixed(1)}%</span>
          </div>
          {getTotalPercentual() !== 100 && <p className="text-sm text-muted-foreground mt-1">
              {getTotalPercentual() > 100 ? "Sobrealocação" : "Subalocação"} de {Math.abs(100 - getTotalPercentual()).toFixed(1)}%
            </p>}
        </CardContent>
      </Card>

      {/* Comparativo */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo: Atual vs Ideal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {carteiraComparativa.map((item, index) => <div key={item.tipo || index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{item.tipo}</div>
                  <div className="text-sm text-muted-foreground">
                    Atual: {(item.percentual_atual || 0).toFixed(1)}% • 
                    Ideal: {(item.percentual_ideal || 0).toFixed(1)}%
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${(item.diferenca_percentual || 0) > 0 ? 'text-green-600' : (item.diferenca_percentual || 0) < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {(item.diferenca_percentual || 0) > 0 ? '+' : ''}{(item.diferenca_percentual || 0).toFixed(1)}%
                    </div>
                  </div>
                  
                  <Badge variant="outline" className={getActionColor(item.acao_sugerida)}>
                    <div className="flex items-center gap-1">
                      {getActionIcon(item.acao_sugerida)}
                      {item.acao_sugerida}
                    </div>
                  </Badge>

                  {editingId === item.tipo ? <div className="flex items-center gap-2">
                      <Input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} className="w-20" step="0.1" min="0" max="100" />
                      <Button size="sm" onClick={() => handleSave(item.tipo!, parseFloat(editValue))}>
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancelar
                      </Button>
                    </div> : <Button size="sm" variant="outline" onClick={() => {
                setEditingId(item.tipo!);
                setEditValue((item.percentual_ideal || 0).toString());
              }}>
                      Editar
                    </Button>}
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Adicionar Novo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Novo Tipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="tipo">Tipo de Ativo</Label>
              <Input id="tipo" value={novoTipo} onChange={e => setNovoTipo(e.target.value)} placeholder="Ex: Ações, FIIs, Renda Fixa..." />
            </div>
            <div className="w-32">
              <Label htmlFor="percentual">Percentual (%)</Label>
              <Input id="percentual" type="number" value={novoPercentual} onChange={e => setNovoPercentual(e.target.value)} placeholder="0.0" step="0.1" min="0" max="100" />
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Items da Carteira Ideal */}
      {carteiraIdeal.length > 0}
    </div>;
}