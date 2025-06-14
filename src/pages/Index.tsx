
import { DashboardView } from "@/components/DashboardView";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen gradient-dark">
      <Header />
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-center md:text-left">Dashboard</h1>
            <p className="text-muted-foreground text-center md:text-left">
              Acompanhe o desempenho dos seus investimentos
            </p>
          </div>
          <DashboardView />
        </div>
      </div>
    </div>
  );
};

export default Index;
