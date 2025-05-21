
import { MainNav } from "@/components/MainNav";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="font-semibold text-lg">Meus Investimentos</div>
        <MainNav />
      </div>
    </div>
  );
}
