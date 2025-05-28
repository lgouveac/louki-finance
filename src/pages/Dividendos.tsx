
import { DividendosView } from "@/components/DividendosView";
import { Header } from "@/components/Header";

const Dividendos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold mb-6">Dividendos</h1>
          <DividendosView />
        </div>
      </div>
    </div>
  );
};

export default Dividendos;
