
import { DashboardView } from "@/components/DashboardView";
import { Header } from "@/components/Header";

// Fundo preto absoluto, apenas detalhes em degrade nos cards
const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pb-10 pt-2 md:pt-4">
        <div className="mx-auto max-w-7xl px-2">
          <div className="mb-14 md:mb-20">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center text-white tracking-tight">Dashboard</h1>
            <p className="text-xl text-[#C7CCE5] text-center font-light">
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
