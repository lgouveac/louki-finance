import { ImportacaoView } from "@/components/ImportacaoView";

const Importacao = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Importação</h1>
        <p className="text-muted-foreground">Importe dados de corretoras</p>
      </div>
      <ImportacaoView />
    </div>
  );
};

export default Importacao;