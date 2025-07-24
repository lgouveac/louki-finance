
import { DividendosView } from "@/components/DividendosView";

const Dividendos = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dividendos</h1>
        <p className="text-muted-foreground">Acompanhe seus proventos recebidos</p>
      </div>
      <DividendosView />
    </div>
  );
};

export default Dividendos;
