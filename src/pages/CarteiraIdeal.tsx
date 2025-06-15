
import { Header } from "@/components/Header";
import { CarteiraIdealManager } from "@/components/CarteiraIdealManager";

const CarteiraIdeal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-3 md:p-6">
        <div className="mx-auto max-w-7xl">
          <CarteiraIdealManager />
        </div>
      </div>
    </div>
  );
};

export default CarteiraIdeal;
