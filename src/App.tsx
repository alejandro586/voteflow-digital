import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DNIValidation from "./pages/DNIValidation";
import Seleccion from "./pages/Seleccion";
import Presidentes from "./pages/Presidentes";
import MesaRedonda from "./pages/MesaRedonda";
import Alcaldes from "./pages/Alcaldes";
import AdminLogin from "./pages/admin/AdminLogin";
import PanelAdmin from "./pages/admin/PanelAdmin";
import PanelSuperAdmin from "./pages/admin/PanelSuperAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/dni" element={<DNIValidation />} />
          <Route path="/seleccion" element={<Seleccion />} />
          <Route path="/presidentes" element={<Presidentes />} />
          <Route path="/mesa-redonda" element={<MesaRedonda />} />
          <Route path="/alcaldes" element={<Alcaldes />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/panel_de_admin" element={<PanelAdmin />} />
          <Route path="/admin/panel_de_superadmin" element={<PanelSuperAdmin />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
