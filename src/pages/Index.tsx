
import { DashboardView } from "@/components/DashboardView";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <DashboardView />
        </div>
      </div>
    </div>
  );
};

export default Index;
