
import { MainNav } from "@/components/MainNav";
import { AppLogo } from "@/components/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function Header() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="border-b border-muted">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center">
          <AppLogo size="medium" className="mb-0 mr-3" />
          <span className="font-semibold text-lg text-white">Meus Investimentos</span>
        </div>
        
        <div className="flex-1 flex justify-end items-center gap-4">
          <MainNav />
          
          {user && (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {user.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
