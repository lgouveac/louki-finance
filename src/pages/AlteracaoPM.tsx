
import { Header } from "@/components/Header";
import { AnomaliasCorrigidasView } from "@/components/AnomaliasCorrigidasView";

const AlteracaoPM = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold mb-6">Alteração PM</h1>
          <AnomaliasCorrigidasView />
        </div>
      </div>
    </div>
  );
};

export default AlteracaoPM;
