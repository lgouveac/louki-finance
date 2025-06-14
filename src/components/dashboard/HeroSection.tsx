
import React from 'react';

interface HeroSectionProps {
  totalAtual: number;
  totalInvestido: number;
  rendimentoPercent: number;
  totalProventos: number;
}

// Dashboard super minimalista, valorizando números, sem boxes/fundos opacos
export function HeroSection({
  totalAtual,
  totalInvestido,
  rendimentoPercent,
  totalProventos
}: HeroSectionProps) {
  const isPositive = rendimentoPercent >= 0;
  const rendimentoAbsoluto = totalAtual - totalInvestido;

  return (
    <section
      className="w-full mb-20 md:mb-32 text-center flex flex-col items-center space-y-10"
    >
      <div>
        <h1 className="text-6xl md:text-7xl font-extrabold mb-3 bg-gradient-to-r from-primary to-[#C7CCE5] bg-clip-text text-transparent tracking-tight drop-shadow-[0_2px_8px_rgba(50,60,110,0.13)] flex justify-center items-end gap-2">
          {/* Pequeno cifrão */}
          <span className="text-lg md:text-xl font-bold mb-0.5 text-[#C7CCE5] inline-block align-baseline" style={{marginRight: "0.1em"}}>R$</span>
          <span className="leading-none">
            {totalAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-[#C7CCE5] font-light">
          Valor atual da carteira
        </p>
      </div>
      <div className="flex flex-wrap gap-x-20 gap-y-9 justify-center items-center md:gap-x-32">
        <div>
          <div className={`text-3xl md:text-4xl font-bold mb-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {rendimentoPercent > 0 ? '+' : ''}{rendimentoPercent.toFixed(2)}%
          </div>
          <div className="text-sm text-[#B0B4C2] font-medium tracking-wide">Rentabilidade</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-bold mb-1 text-blue-400 flex items-baseline gap-1">
            <span className="text-base md:text-lg font-bold text-[#B2B7E3]">R$</span>
            <span>
              {totalInvestido.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="text-sm text-[#B0B4C2] font-medium tracking-wide">Total Investido</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-bold mb-1 text-amber-400 flex items-baseline gap-1">
            <span className="text-base md:text-lg font-bold text-[#FFE6A7]">R$</span>
            <span>
              {totalProventos.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="text-sm text-[#B0B4C2] font-medium tracking-wide">Proventos</div>
        </div>
        <div>
          <div className={`text-3xl md:text-4xl font-bold mb-1 flex items-baseline gap-1 ${rendimentoAbsoluto >= 0 ? "text-green-400" : "text-red-400"}`}>
            <span className="text-base md:text-lg font-bold text-[#C7CCE5]">{rendimentoAbsoluto >= 0 ? '+' : ''}R$</span>
            <span>
              {rendimentoAbsoluto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-sm text-[#B0B4C2] font-medium tracking-wide">Lucro/Prejuízo</div>
        </div>
      </div>
    </section>
  );
}
