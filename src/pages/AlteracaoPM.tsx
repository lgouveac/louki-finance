
import { AnomaliasCorrigidasView } from "@/components/AnomaliasCorrigidasView";

const AlteracaoPM = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alteração PM</h1>
        <p className="text-muted-foreground">Gerenciar alterações de preço médio</p>
      </div>
      <AnomaliasCorrigidasView />
    </div>
  );
};

export default AlteracaoPM;
