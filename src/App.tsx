import { Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProviders } from "@/store/contexts";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { lazy } from "react";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BioLinkEditor = lazy(() => import("./pages/BioLinkEditor"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const RedirectPage = lazy(() => import("./pages/RedirectPage"));
import { 
  Pricing, 
  BioLink, 
  NotFound 
} from "@/components/LazyPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProviders>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
              <div className="glass-card border-white/20 p-8 rounded-2xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue mx-auto"></div>
                <p className="text-white mt-4 text-center">Carregando...</p>
              </div>
            </div>
          }>
            <AppLayout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/bio/:username" element={<BioLink />} />
                <Route path="/joaosilva" element={<BioLink />} />
                
                <Route path="/r/:shortCode" element={<RedirectPage />} />

                {/* Protected Routes with Dashboard Layout */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/editor" element={<BioLinkEditor />} />
                    <Route path="/dashboard/analytics" element={<Analytics />} />
                    <Route path="/dashboard/settings" element={<Settings />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AppProviders>
  </QueryClientProvider>
);

export default App;