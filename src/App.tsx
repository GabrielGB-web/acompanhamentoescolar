import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import Professores from "./pages/Professores";
import Aulas from "./pages/Aulas";
import Financeiro from "./pages/Financeiro";
import Recibos from "./pages/Recibos";
import Configuracoes from "./pages/Configuracoes";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alunos"
              element={
                <ProtectedRoute>
                  <Alunos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professores"
              element={
                <ProtectedRoute>
                  <Professores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aulas"
              element={
                <ProtectedRoute>
                  <Aulas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/financeiro"
              element={
                <ProtectedRoute requireAdmin>
                  <Financeiro />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recibos"
              element={
                <ProtectedRoute>
                  <Recibos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <ProtectedRoute>
                  <Configuracoes />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
