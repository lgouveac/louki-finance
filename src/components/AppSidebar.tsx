import { 
  HomeIcon, 
  WalletIcon, 
  TrendingUpIcon, 
  FileTextIcon, 
  UploadIcon, 
  CogIcon,
  BarChart3,
  Target,
  DollarSign,
  User,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppLogo } from "@/components/AppLogo";

const portfolioItems = [
  { title: "Dashboard", url: "/", icon: HomeIcon },
  { title: "Carteira Consolidada", url: "/carteira", icon: WalletIcon },
  { title: "Carteira Ideal", url: "/carteira-ideal", icon: Target },
  { title: "Dividendos", url: "/dividendos", icon: DollarSign },
];

const managementItems = [
  { title: "Importação", url: "/importacao", icon: UploadIcon },
  { title: "Ativos Manuais", url: "/ativos-manuais", icon: CogIcon },
  { title: "Alteração PM", url: "/alteracao-pm", icon: FileTextIcon },
];

const analysisItems = [
  { title: "Análise Econômica", url: "/analise-economica", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive: active }: { isActive: boolean }) =>
    active ? "bg-primary text-primary-foreground" : "hover:bg-accent";

  const handleLogout = async () => {
    await signOut();
  };

  const SidebarMenuItem_ = ({ item }: { item: { title: string; url: string; icon: any } }) => (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink to={item.url} end className={getNavCls}>
          <item.icon className="h-4 w-4" />
          {!collapsed && <span>{item.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      {/* Logo */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <AppLogo size="small" className="mb-0" />
          {!collapsed && (
            <h2 className="text-lg font-semibold">Investimentos</h2>
          )}
        </div>
      </div>

      <SidebarContent>
        {/* Portfolio */}
        <SidebarGroup>
          <SidebarGroupLabel>Portfólio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {portfolioItems.map((item) => (
                <SidebarMenuItem_ key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem_ key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Analysis */}
        <SidebarGroup>
          <SidebarGroupLabel>Análise</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analysisItems.map((item) => (
                <SidebarMenuItem_ key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer com usuário */}
      <SidebarFooter className="border-t p-4">
        {user && (
          <div className="space-y-2">
            {!collapsed && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
                <User className="h-4 w-4" />
                <span className="truncate">{user.email}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout} 
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}