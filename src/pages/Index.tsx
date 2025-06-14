
import { DashboardView } from "@/components/DashboardView";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen gradient-dark">
      <Header />
      <div className="pb-10 pt-2 md:pt-4">
        <div className="mx-auto max-w-7xl px-2">
          <div className="mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center">Dashboard</h1>
            <p className="text-xl text-primary text-center">
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
