
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CoinsIcon } from "lucide-react";
import { useState } from "react";

// Nova paleta moderna/escura harmônica com degrade de azul, verde e roxo
const COLORS = [
  "url(#dashboardBlueGreen)", "url(#dashboardGreen)", "url(#dashboardAmber)", "url(#dashboardRed)",
  "url(#dashboardSoftBlue)", "url(#dashboardYellow)", "url(#dashboardPurple)", "url(#dashboardWater)"
];

interface DistributionItem {
  Tipo: string;
  valor_total: number;
  percentual: number;
}

interface PortfolioDistributionProps {
  data: DistributionItem[];
}

export function PortfolioDistribution({ data }: PortfolioDistributionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const totalValue = data.reduce((sum, item) => sum + (item.valor_total || 0), 0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[#232634]/90 text-white rounded-md px-4 py-2 shadow-xl">
          <div className="font-semibold">{d.Tipo}</div>
          <div>R$ {d.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div className="font-bold">{d.percentual.toFixed(2)}%</div>
        </div>
      );
    }
    return null;
  };

  // proporção melhorada
  return (
    <section className="w-full max-w-3xl mx-auto px-2 mb-14 flex flex-col gap-5 items-center">
      <h2 className="text-xl font-semibold flex items-center justify-center gap-2 mb-2 text-[#e3e8f7]">
        <CoinsIcon className="h-7 w-7 text-primary" />
        Distribuição dos Investimentos
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full">
        {/* Gráfico pizza fundo transparente, degrade nas fatias */}
        <div className="h-[224px] w-full max-w-[252px] flex-shrink-0 bg-transparent relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {/* Degradê harmônico para cada cor */}
                <linearGradient id="dashboardBlueGreen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#44CCA3" />
                  <stop offset="100%" stopColor="#7C5CEC" />
                </linearGradient>
                <linearGradient id="dashboardGreen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#44CCA3" />
                  <stop offset="100%" stopColor="#135c4f" />
                </linearGradient>
                <linearGradient id="dashboardAmber" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#feb857" />
                  <stop offset="100%" stopColor="#fd6b4d" />
                </linearGradient>
                <linearGradient id="dashboardRed" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#92241e" />
                  <stop offset="100%" stopColor="#fd6b4d" />
                </linearGradient>
                <linearGradient id="dashboardSoftBlue" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8eb2f8" />
                  <stop offset="100%" stopColor="#7C5CEC" />
                </linearGradient>
                <linearGradient id="dashboardYellow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#eae081" />
                  <stop offset="100%" stopColor="#feb857" />
                </linearGradient>
                <linearGradient id="dashboardPurple" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#b97ae5" />
                  <stop offset="100%" stopColor="#7C5CEC" />
                </linearGradient>
                <linearGradient id="dashboardWater" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#72dad9" />
                  <stop offset="100%" stopColor="#44cca3" />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={105}
                dataKey="valor_total"
                paddingAngle={2}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.Tipo || index}
                    fill={COLORS[index % COLORS.length]}
                    stroke={activeIndex === index ? "#fff" : "none"}
                    strokeWidth={activeIndex === index ? 2 : 0}
                    style={{
                      filter: activeIndex === index ? 'brightness(1.08)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legenda minimalista proporcional */}
        <div className="w-full max-w-[290px] space-y-2">
          {data.map((item, index) => (
            <div
              key={item.Tipo || index}
              className={`flex items-center justify-between px-1 py-1 rounded transition cursor-pointer ${activeIndex === index ? 'bg-primary/10 scale-105' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{
                  background: `var(--pie-color-${index})`
                }}>
                  <span style={{
                    display: 'none'
                  }}>{COLORS[index % COLORS.length]}</span>
                </span>
                <span className="text-sm text-white/90">{item.Tipo ?? 'Outro'}</span>
              </div>
              <div className="text-xs text-[#aaaed2] font-medium">
                {(item.percentual || 0).toFixed(1)}%
                <span className="ml-2 text-xs font-normal text-[#858797]">
                  R$ {(item.valor_total || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          ))}
          {/* Total */}
          <div className="flex justify-between font-bold border-t border-[#232634] pt-3 mt-2 text-base text-[#e3e8f7]">
            <span>Total Carteira</span>
            <span>
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
