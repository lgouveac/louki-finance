
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CoinsIcon } from "lucide-react";
import { useState } from "react";

// Novo: Cores mais suaves/nobres e integração com fundo
const COLORS = [
  '#7C5CEC', '#44cca3', '#feb857', '#fd6b4d',
  '#8eb2f8', '#eae081', '#b97ae5', '#72dad9'
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

  return (
    <section className="w-full px-2 mb-20 flex flex-col gap-5 items-center">
      <h2 className="text-xl font-semibold flex items-center justify-center gap-2 mb-2 text-[#e3e8f7]">
        <CoinsIcon className="h-7 w-7 text-primary" />
        Distribuição dos Investimentos
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full">
        {/* Gráfico pizza */}
        <div className="h-[255px] w-full max-w-[310px] flex-shrink-0 bg-transparent">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={115}
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
        {/* Legenda minimalista */}
        <div className="w-full max-w-[335px] space-y-3">
          {data.map((item, index) => (
            <div
              key={item.Tipo || index}
              className={`flex items-center justify-between px-1 py-1 rounded transition cursor-pointer ${activeIndex === index ? 'bg-primary/10 scale-105' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                <span className="text-md text-white/90">{item.Tipo ?? 'Outro'}</span>
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
          <div className="flex justify-between font-bold border-t border-[#232634] pt-4 mt-3 text-base text-[#e3e8f7]">
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
