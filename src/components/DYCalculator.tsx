import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";
import { Calculator, TrendingUp, Target } from "lucide-react";
import { getDashboardData, getProventosMensais } from "@/services/viewsService";

export function DYCalculator() {
  const [targetDY, setTargetDY] = useState<number>(0);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState<number>(0);

  // Nova calculadora dinâmica
  const [metaMensal, setMetaMensal] = useState<number>(0);
  const [estrategia, setEstrategia] = useState<number[]>([50]); // 0-100: aportar mais ← → melhorar DY

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: getDashboardData,
  });

  const { data: proventosMensais = [] } = useQuery({
    queryKey: ['proventos-mensais'],
    queryFn: getProventosMensais,
  });

  const totalPortfolioValue = dashboardData?.reduce((sum, item) => sum + (item.valor_total || 0), 0) || 0;

  const calculateAnnualEarnings = () => {
    return (investmentAmount * targetDY) / 100;
  };

  const calculateRequiredInvestment = () => {
    if (targetDY === 0) return 0;
    return (desiredAnnualIncome * 100) / targetDY;
  };

  const calculateMonthlyEarnings = () => {
    return calculateAnnualEarnings() / 12;
  };

  const calculateMonthlyIncome = () => {
    return desiredAnnualIncome / 12;
  };

  const useCurrentPortfolioValue = () => {
    setInvestmentAmount(totalPortfolioValue);
  };

  // Calcular DY atual baseado nos últimos 12 meses
  const calculateCurrentDY = () => {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, 1);
    
    let totalProventosRecentes = 0;

    proventosMensais.forEach(item => {
      if (!item.mes_ano || !item.valor_total_mensal) return;

      // Parse mes_ano corretamente baseado no formato
      let ano: number, mes: number;
      
      if (item.mes_ano.includes('-')) {
        // Formato YYYY-MM (como vem do banco)
        const [anoStr, mesStr] = item.mes_ano.split('-');
        ano = parseInt(anoStr);
        mes = parseInt(mesStr);
      } else if (item.mes_ano.includes('/')) {
        // Formato MM/YYYY 
        const [mesStr, anoStr] = item.mes_ano.split('/');
        mes = parseInt(mesStr);
        ano = parseInt(anoStr);
      } else {
        return;
      }

      // Para últimos 12 meses
      const itemDate = new Date(ano, mes - 1, 1);
      if (itemDate >= twelveMonthsAgo) {
        totalProventosRecentes += item.valor_total_mensal;
      }
    });
    
    // Calcular DY atual
    const dyAtual = totalPortfolioValue > 0 ? (totalProventosRecentes / totalPortfolioValue) * 100 : 0;
    
    return dyAtual;
  };

  const useCurrentDY = () => {
    const dy = calculateCurrentDY();
    setTargetDY(dy);
  };

  // Lógica da nova calculadora dinâmica
  const calcularCenariosDinamicos = () => {
    const dyAtual = calculateCurrentDY();
    const capitalAtual = totalPortfolioValue;
    const rendimentoAtualMensal = (capitalAtual * dyAtual / 100) / 12;
    const metaAnual = metaMensal * 12;

    if (metaMensal === 0 || dyAtual === 0 || capitalAtual === 0) {
      return {
        cenarioAportar: { dy: 0, capital: 0, aporte: 0, rendimentoMensal: 0 },
        cenarioMix: { dy: 0, capital: 0, aporte: 0, rendimentoMensal: 0 },
        cenarioDY: { dy: 0, capital: 0, aporte: 0, rendimentoMensal: 0 }
      };
    }

    // Cenário 1: Só aportar (manter DY atual)
    const capitalNecessarioAportar = metaAnual / (dyAtual / 100);
    const aporteNecessario = Math.max(0, capitalNecessarioAportar - capitalAtual);

    // Cenário 3: Só melhorar DY (manter capital atual)
    const dyNecessario = (metaAnual / capitalAtual) * 100;

    // Cenário 2: Mix baseado no slider (interpolação)
    const peso = estrategia[0] / 100; // 0 = só aportar, 1 = só DY
    const dyMix = dyAtual + ((dyNecessario - dyAtual) * peso);
    const capitalMix = capitalAtual + (aporteNecessario * (1 - peso));
    const aporteMix = capitalMix - capitalAtual;

    return {
      cenarioAportar: {
        dy: dyAtual,
        capital: capitalNecessarioAportar,
        aporte: aporteNecessario,
        rendimentoMensal: metaMensal
      },
      cenarioMix: {
        dy: dyMix,
        capital: capitalMix,
        aporte: Math.max(0, aporteMix),
        rendimentoMensal: (capitalMix * dyMix / 100) / 12
      },
      cenarioDY: {
        dy: dyNecessario,
        capital: capitalAtual,
        aporte: 0,
        rendimentoMensal: metaMensal
      }
    };
  };

  const cenarios = calcularCenariosDinamicos();
  const estrategiaValue = estrategia[0];

  const getEstrategiaLabel = () => {
    if (estrategiaValue <= 25) return "Foco em Aportes";
    if (estrategiaValue <= 75) return "Estratégia Mista";
    return "Foco em DY";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Calculator */}
        <Card className="glass-card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculadora de Rendimentos
            </CardTitle>
            <CardDescription>
              Calcule quanto você ganhará anualmente com seus investimentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-dy">DY Alvo Anual (%)</Label>
              <div className="flex gap-2">
                <Input
                  id="target-dy"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 6.5"
                  value={targetDY || ""}
                  onChange={(e) => setTargetDY(Number(e.target.value))}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={useCurrentDY}
                  className="whitespace-nowrap glass-button-secondary"
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Usar Atual
                </Button>
              </div>
              {calculateCurrentDY() > 0 && (
                <p className="text-xs text-muted-foreground">
                  DY atual (últimos 12 meses): {calculateCurrentDY().toFixed(2)}%
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment">Valor do Investimento</Label>
              <div className="flex gap-2">
                <Input
                  id="investment"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 100000"
                  value={investmentAmount || ""}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={useCurrentPortfolioValue}
                  className="whitespace-nowrap glass-button-secondary"
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Usar Atual
                </Button>
              </div>
              {totalPortfolioValue > 0 && (
                <p className="text-xs text-muted-foreground">
                  Valor atual da carteira: {formatCurrency(totalPortfolioValue)}
                </p>
              )}
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rendimento Anual:</span>
                <span className="font-medium text-lg">
                  {formatCurrency(calculateAnnualEarnings())}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rendimento Mensal:</span>
                <span className="font-medium">
                  {formatCurrency(calculateMonthlyEarnings())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Investment Calculator */}
        <Card className="glass-card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculadora de Investimento Necessário
            </CardTitle>
            <CardDescription>
              Calcule quanto você precisa investir para atingir sua meta de renda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-dy-2">DY Esperado (%)</Label>
              <div className="flex gap-2">
                <Input
                  id="target-dy-2"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 6.5"
                  value={targetDY || ""}
                  onChange={(e) => setTargetDY(Number(e.target.value))}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={useCurrentDY}
                  className="whitespace-nowrap glass-button-secondary"
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Usar Atual
                </Button>
              </div>
              {calculateCurrentDY() > 0 && (
                <p className="text-xs text-muted-foreground">
                  DY atual (últimos 12 meses): {calculateCurrentDY().toFixed(2)}%
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="desired-income">Renda Anual Desejada</Label>
              <Input
                id="desired-income"
                type="number"
                step="0.01"
                placeholder="Ex: 12000"
                value={desiredAnnualIncome || ""}
                onChange={(e) => setDesiredAnnualIncome(Number(e.target.value))}
              />
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Investimento Necessário:</span>
                <span className="font-medium text-lg">
                  {formatCurrency(calculateRequiredInvestment())}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Renda Mensal:</span>
                <span className="font-medium">
                  {formatCurrency(calculateMonthlyIncome())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nova Calculadora Dinâmica */}
      <Card className="glass-card-elevated border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Calculadora Dinâmica de Meta Mensal
          </CardTitle>
          <CardDescription>
            Descubra diferentes estratégias para atingir sua meta mensal de proventos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input da Meta Mensal */}
          <div className="space-y-2">
            <Label htmlFor="meta-mensal">Meta Mensal de Proventos</Label>
            <Input
              id="meta-mensal"
              type="number"
              step="0.01"
              placeholder="Ex: 1000"
              value={metaMensal || ""}
              onChange={(e) => setMetaMensal(Number(e.target.value))}
              className="text-lg"
            />
          </div>

          {/* Slider de Estratégia */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Estratégia: {getEstrategiaLabel()}</Label>
              <span className="text-sm text-muted-foreground">
                {estrategiaValue}% mix
              </span>
            </div>
            <Slider
              value={estrategia}
              onValueChange={setEstrategia}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Aportar Mais</span>
              <span>Mix</span>
              <span>Melhorar DY</span>
            </div>
          </div>

          {/* Cards dos Cenários */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cenário Aportar */}
            <Card className={`transition-all ${estrategiaValue <= 33 ? 'ring-2 ring-primary' : 'opacity-75'}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Só Aportar</CardTitle>
                <CardDescription className="text-xs">Manter DY atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {metaMensal > 0 ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>DY:</span>
                      <span className="font-medium">{cenarios.cenarioAportar.dy.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Capital:</span>
                      <span className="font-medium">{formatCurrency(cenarios.cenarioAportar.capital)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-primary">
                      <span>Aporte:</span>
                      <span className="font-bold">{formatCurrency(cenarios.cenarioAportar.aporte)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-muted-foreground py-4">
                    Digite uma meta mensal para ver os cenários
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cenário Mix */}
            <Card className={`transition-all ${estrategiaValue > 33 && estrategiaValue < 67 ? 'ring-2 ring-primary' : 'opacity-75'}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Estratégia Mista</CardTitle>
                <CardDescription className="text-xs">Aportar + Melhorar DY</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {metaMensal > 0 ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>DY:</span>
                      <span className="font-medium text-orange-600">{cenarios.cenarioMix.dy.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Capital:</span>
                      <span className="font-medium">{formatCurrency(cenarios.cenarioMix.capital)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-primary">
                      <span>Aporte:</span>
                      <span className="font-bold">{formatCurrency(cenarios.cenarioMix.aporte)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-muted-foreground py-4">
                    Digite uma meta mensal para ver os cenários
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cenário DY */}
            <Card className={`transition-all ${estrategiaValue >= 67 ? 'ring-2 ring-primary' : 'opacity-75'}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Só Melhorar DY</CardTitle>
                <CardDescription className="text-xs">Manter capital atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {metaMensal > 0 ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>DY:</span>
                      <span className="font-medium text-green-600">{cenarios.cenarioDY.dy.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Capital:</span>
                      <span className="font-medium">{formatCurrency(cenarios.cenarioDY.capital)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Aporte:</span>
                      <span className="font-bold text-green-600">R$ 0</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-muted-foreground py-4">
                    Digite uma meta mensal para ver os cenários
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumo Atual */}
          {totalPortfolioValue > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Situação Atual:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capital:</span>
                  <span className="font-medium">{formatCurrency(totalPortfolioValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DY:</span>
                  <span className="font-medium">{calculateCurrentDY().toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rendimento Mensal:</span>
                  <span className="font-medium">{formatCurrency((totalPortfolioValue * calculateCurrentDY() / 100) / 12)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meta:</span>
                  <span className="font-medium text-primary">{formatCurrency(metaMensal)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}