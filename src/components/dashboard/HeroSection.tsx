
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon, CoinsIcon, WalletIcon } from "lucide-react";

interface HeroSectionProps {
  totalAtual: number;
  totalInvestido: number;
  rendimentoPercent: number;
  totalProventos: number;
}

export function HeroSection({ 
  totalAtual, 
  totalInvestido, 
  rendimentoPercent, 
  totalProventos 
}: HeroSectionProps) {
  const isPositive = rendimentoPercent >= 0;
  const rendimentoAbsoluto = totalAtual - totalInvestido;

  return (
    <div className="mb-8">
      {/* Main Portfolio Value */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          R$ {totalAtual.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </h1>
        <p className="text-muted-foreground text-lg">Valor Total da Carteira</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card hover-glass glow-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${isPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {isPositive ? (
                  <TrendingUpIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <TrendingDownIcon className="h-6 w-6 text-red-500" />
                )}
              </div>
              <div className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {rendimentoPercent > 0 ? '+' : ''}{rendimentoPercent.toFixed(2)}%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rentabilidade</p>
              <p className={`text-lg font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {rendimentoAbsoluto > 0 ? '+' : ''}R$ {rendimentoAbsoluto.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glass glow-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <WalletIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-500">
                R$ {totalInvestido.toLocaleString('pt-BR', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Investido</p>
              <p className="text-lg font-semibold text-blue-500">Capital Aplicado</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glass glow-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-amber-500/10">
                <CoinsIcon className="h-6 w-6 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-500">
                R$ {totalProventos.toLocaleString('pt-BR', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total de Proventos</p>
              <p className="text-lg font-semibold text-amber-500">Renda Passiva</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
