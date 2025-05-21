
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, WalletIcon } from "lucide-react";

export function MainNav() {
  const location = useLocation();
  
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
  ];
  
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary gap-1.5",
            location.pathname === item.href
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
