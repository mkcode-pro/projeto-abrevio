import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useIsMobile } from "@/store/hooks/use-mobile";

export function DashboardLayout() {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen">
        {!isMobile ? (
          // Desktop: Layout com sidebar
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1">
              <DashboardHeader />
              <Outlet /> {/* O conteúdo da página será renderizado aqui */}
            </main>
          </div>
        ) : (
          // Mobile: Layout otimizado (o header é adicionado em cada página)
          <div className="min-h-screen">
            <Outlet /> {/* O conteúdo da página será renderizado aqui */}
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}