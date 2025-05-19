
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { SectorAllocation } from "@/types/stock";

interface SectorChartProps {
  data: SectorAllocation[];
}

// Cores para os diferentes setores
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed'];

export function SectorChart({ data }: SectorChartProps) {
  return (
    <div className="bg-card rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Distribuição por Setores</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor']}
                labelFormatter={(name) => `Setor: ${name}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item.sector} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                  <span>{item.sector}</span>
                </div>
                <div className="text-right">
                  <p>{item.percentage.toFixed(2)}%</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {item.value.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
