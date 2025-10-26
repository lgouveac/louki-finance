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
    active ? "nav-item-active" : "nav-item-hover";

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
    <Sidebar className={`sidebar-glass ${collapsed ? "w-14" : "w-64"}`} collapsible="icon">
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
      <SidebarFooter className="border-t border-border/20 p-4">
        {user && (
          <div className="space-y-2">
            {!collapsed && (
              <div className="glass-card p-3 flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="truncate">{user.email}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout} 
              className="w-full justify-start glass-button-secondary"
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