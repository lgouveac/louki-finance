
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, WalletIcon, BarChartIcon, CoinsIcon, UploadIcon, Menu, Settings, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export function MainNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  // Garantir que o body scroll seja restaurado quando o drawer fecha
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup quando component desmonta
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);
  
  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Carteira Consolidada",
      href: "/carteira",
      icon: WalletIcon,
    },
    {
      title: "Alteração PM",
      href: "/alteracao-pm",
      icon: BarChartIcon,
    },
    {
      title: "Dividendos",
      href: "/dividendos",
      icon: CoinsIcon,
    },
    {
      title: "Importação",
      href: "/importacao",
      icon: UploadIcon,
    },
    {
      title: "Ativos Manuais",
      href: "/ativos-manuais",
      icon: Settings,
    },
    {
      title: "Análise Econômica",
      href: "/analise-economica",
      icon: TrendingUp,
    }
  ];
  
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="p-2 rounded-md hover:bg-accent">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] max-h-[85vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle>Menu de Navegação</DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col space-y-2 p-4 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center text-base py-4 px-4 rounded-md font-medium transition-colors hover:bg-accent min-h-[48px]",
                location.pathname === item.href
                  ? "bg-accent/50 text-primary"
                  : "text-muted-foreground"
              )}
              onClick={() => setOpen(false)}
            >
              <item.icon className="h-6 w-6 mr-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
