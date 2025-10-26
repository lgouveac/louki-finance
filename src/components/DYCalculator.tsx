import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Calculator, TrendingUp } from "lucide-react";
import { getDashboardData, getProventosMensais } from "@/services/viewsService";

export function DYCalculator() {
  const [targetDY, setTargetDY] = useState<number>(0);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState<number>(0);

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

    </div>
  );
}