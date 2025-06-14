
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CoinsIcon } from "lucide-react";
import { useState } from "react";

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', 
  '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'
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
        <div className="bg-white/95 text-black rounded-md px-4 py-2 shadow-xl">
          <div className="font-semibold">{d.Tipo}</div>
          <div>R$ {d.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div className="font-bold">{d.percentual.toFixed(2)}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="w-full my-8 px-2">
      <h2 className="text-xl font-semibold flex items-center justify-center gap-2 mb-8">
        <CoinsIcon className="h-7 w-7 text-primary" />
        Distribuição dos Investimentos
      </h2>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
        {/* Gráfico pizza */}
        <div className="h-[320px] w-full max-w-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={125}
                dataKey="valor_total"
                paddingAngle={2}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.Tipo || index}
                    fill={COLORS[index % COLORS.length]}
                    stroke={activeIndex === index ? '#fff' : 'none'}
                    strokeWidth={activeIndex === index ? 2 : 0}
                    style={{
                      filter: activeIndex === index ? 'brightness(1.06)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legenda */}
        <div className="w-full max-w-[320px] space-y-4">
          {data.map((item, index) => (
            <div
              key={item.Tipo || index}
              className={`flex items-center justify-between px-2 py-2 rounded-md transition cursor-pointer ${
                activeIndex === index ? 'bg-primary/10 scale-105' : ''
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                <span>{item.Tipo ?? 'Outro'}</span>
              </div>
              <div className="text-xs text-foreground/80 font-medium">
                {(item.percentual || 0).toFixed(1)}%
                <span className="ml-2 text-xs font-normal text-foreground/50">
                  R$ {(item.valor_total || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          ))}
          {/* Total */}
          <div className="flex justify-between font-bold border-t pt-4 mt-5 text-base">
            <span>Total Carteira</span>
            <span className="text-primary">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
