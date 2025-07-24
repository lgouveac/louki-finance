import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="h-12 flex items-center border-b bg-background px-4">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
    </header>
  );
}