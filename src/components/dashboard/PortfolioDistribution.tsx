
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
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

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.Tipo}</p>
          <p className="text-sm text-muted-foreground">
            R$ {data.valor_total.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
          <p className="text-sm font-medium text-primary">
            {data.percentual.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card hover-glass">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CoinsIcon className="h-6 w-6 text-primary" />
          Distribuição de Investimentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Chart */}
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="valor_total"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke={activeIndex === index ? '#fff' : 'none'}
                      strokeWidth={activeIndex === index ? 2 : 0}
                      style={{
                        filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                        transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Enhanced Legend */}
          <div className="space-y-3">
            {data.map((item, index) => (
              <div 
                key={item.Tipo || index}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-accent/50 ${
                  activeIndex === index ? 'bg-accent scale-105' : ''
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                  <span className="font-medium">{item.Tipo || 'Não categorizado'}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{(item.percentual || 0).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {(item.valor_total || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Total Summary */}
            <div className="flex items-center justify-between pt-4 border-t mt-4 font-bold text-lg">
              <div>Total da Carteira</div>
              <div className="text-primary">
                R$ {totalValue.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
