
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, WalletIcon, BarChartIcon, CoinsIcon, UploadIcon, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MainNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
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
    }
  ];
  
  return (
    <>
      {/* Versão Desktop */}
      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary gap-1.5",
              location.pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
      
      {/* Versão Mobile */}
      <div className="md:hidden ml-auto">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-md hover:bg-accent">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80vw] max-w-[300px] bg-card">
            <nav className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center text-base py-2 px-3 rounded-md font-medium transition-colors hover:bg-accent",
                    location.pathname === item.href
                      ? "bg-accent/50 text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
