
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
  WalletIcon, 
  TrendingUpIcon, 
  FileTextIcon, 
  UploadIcon, 
  CogIcon,
  BarChart3,
  Target,
  DollarSign
} from "lucide-react";

export function MainNav() {
  const location = useLocation();
  
  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: HomeIcon,
      active: location.pathname === "/",
    },
    {
      href: "/carteira",
      label: "Carteira",
      icon: WalletIcon,
      active: location.pathname === "/carteira",
    },
    {
      href: "/carteira-ideal",
      label: "Carteira Ideal",
      icon: Target,
      active: location.pathname === "/carteira-ideal",
    },
    {
      href: "/dividendos",
      label: "Dividendos",
      icon: DollarSign,
      active: location.pathname === "/dividendos",
    },
    {
      href: "/importacao",
      label: "Importação",
      icon: UploadIcon,
      active: location.pathname === "/importacao",
    },
    {
      href: "/ativos-manuais",
      label: "Ativos Manuais",
      icon: CogIcon,
      active: location.pathname === "/ativos-manuais",
    },
    {
      href: "/alteracao-pm",
      label: "Alteração PM",
      icon: FileTextIcon,
      active: location.pathname === "/alteracao-pm",
    },
    {
      href: "/analise-economica",
      label: "Análise Econômica",
      icon: BarChart3,
      active: location.pathname === "/analise-economica",
    }
  ];

  return (
    <nav className="flex items-center space-x-1 lg:space-x-2">
      {routes.map((route) => {
        const Icon = route.icon;
        return (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary px-2 py-1.5 rounded-md",
              route.active 
                ? "text-black bg-accent" 
                : "text-muted-foreground hover:bg-accent/50"
            )}
          >
            <Icon className="h-4 w-4 mr-1.5" />
            <span className="hidden md:inline">{route.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
