import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { Calculator } from "lucide-react";

export function DYCalculator() {
  const [targetDY, setTargetDY] = useState<number>(0);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState<number>(0);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Calculator */}
        <Card>
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
              <Input
                id="target-dy"
                type="number"
                step="0.01"
                placeholder="Ex: 6.5"
                value={targetDY || ""}
                onChange={(e) => setTargetDY(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment">Valor do Investimento</Label>
              <Input
                id="investment"
                type="number"
                step="0.01"
                placeholder="Ex: 100000"
                value={investmentAmount || ""}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              />
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
        <Card>
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
              <Input
                id="target-dy-2"
                type="number"
                step="0.01"
                placeholder="Ex: 6.5"
                value={targetDY || ""}
                onChange={(e) => setTargetDY(Number(e.target.value))}
              />
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

      {/* Summary Card */}
      {(investmentAmount > 0 || desiredAnnualIncome > 0) && targetDY > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Resumo dos Cálculos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {investmentAmount > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Cenário 1: Investimento de {formatCurrency(investmentAmount)}</h4>
                  <div className="text-sm space-y-1">
                    <div>• DY: {targetDY}%</div>
                    <div>• Rendimento anual: {formatCurrency(calculateAnnualEarnings())}</div>
                    <div>• Rendimento mensal: {formatCurrency(calculateMonthlyEarnings())}</div>
                  </div>
                </div>
              )}
              
              {desiredAnnualIncome > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Cenário 2: Meta de {formatCurrency(desiredAnnualIncome)}/ano</h4>
                  <div className="text-sm space-y-1">
                    <div>• DY necessário: {targetDY}%</div>
                    <div>• Investimento necessário: {formatCurrency(calculateRequiredInvestment())}</div>
                    <div>• Renda mensal: {formatCurrency(calculateMonthlyIncome())}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}