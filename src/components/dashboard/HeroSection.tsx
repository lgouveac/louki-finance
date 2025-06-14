
import React from 'react';

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
    <section className="w-full mb-12 text-center flex flex-col items-center space-y-8">
      {/* Valor Total */}
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          R$ {totalAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h1>
        <p className="text-lg text-primary font-medium tracking-wide">
          Valor Total da Carteira
        </p>
      </div>
      {/* Métricas principais em linha */}
      <div className="flex gap-8 flex-wrap justify-center">
        <div>
          <div className={`text-2xl md:text-3xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {rendimentoPercent > 0 ? '+' : ''}{rendimentoPercent.toFixed(2)}%
          </div>
          <div className="text-xs text-foreground/60">Rentabilidade</div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-blue-500">
            R$ {totalInvestido.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-foreground/60">Total Investido</div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-amber-500">
            R$ {totalProventos.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-foreground/60">Proventos Acumulados</div>
        </div>
        <div>
          <div className={`text-2xl md:text-3xl font-bold ${rendimentoAbsoluto >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {rendimentoAbsoluto >= 0 ? '+' : ''}R$ {rendimentoAbsoluto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-foreground/60">Lucro/Prejuízo</div>
        </div>
      </div>
    </section>
  );
}
