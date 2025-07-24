
import { AtivoManualList } from "@/components/AtivoManualList";

const AtivosManuais = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestão de Ativos Manuais</h1>
        <p className="text-muted-foreground">Adicione e gerencie ativos não importados</p>
      </div>
      <AtivoManualList />
    </div>
  );
};

export default AtivosManuais;
