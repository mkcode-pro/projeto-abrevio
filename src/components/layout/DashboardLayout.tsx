import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useIsMobile } from "@/store/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
              <div className="p-8">
                <Outlet />
              </div>
            </main>
          </div>
        ) : (
          // Mobile: Layout otimizado
          <div className="min-h-screen">
            {/* O header é adicionado em cada página mobile para ser contextual */}
            <Outlet />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}