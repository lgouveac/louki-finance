
import { MainNav } from "@/components/MainNav";

export function Header() {
  return (
    <div className="border-b border-muted">
      <div className="flex h-16 items-center px-4">
        <div className="font-semibold text-lg truncate flex items-center">
          <span className="text-primary mr-2">•</span>
          Meus Investimentos
        </div>
        <div className="flex-1 flex justify-end md:justify-start">
          <MainNav />
        </div>
      </div>
    </div>
  );
}
