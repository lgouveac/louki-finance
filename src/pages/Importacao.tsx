import { ImportacaoView } from "@/components/ImportacaoView";
import { Header } from "@/components/Header";
const Importacao = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          
          <ImportacaoView />
        </div>
      </div>
    </div>;
};
export default Importacao;