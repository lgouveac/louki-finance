
import { DashboardView } from "@/components/DashboardView";

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">Dashboard</h1>
        <p className="text-xl text-muted-foreground font-light">
          Acompanhe o desempenho dos seus investimentos
        </p>
      </div>
      <DashboardView />
    </div>
  );
};

export default Index;
