
import { AtivoManualList } from "@/components/AtivoManualList";
import { Header } from "@/components/Header";

const AtivosManuais = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold mb-6">Gestão de Ativos Manuais</h1>
          <AtivoManualList />
        </div>
      </div>
    </div>
  );
};

export default AtivosManuais;
