import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  Wallet,
  Receipt,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import escolaLogo from "@/assets/escola-logo.png";

const allMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", adminOnly: false },
  { icon: Users, label: "Alunos", path: "/alunos", adminOnly: false },
  { icon: GraduationCap, label: "Professores", path: "/professores", adminOnly: false },
  { icon: Calendar, label: "Aulas", path: "/aulas", adminOnly: false },
  { icon: Wallet, label: "Financeiro", path: "/financeiro", adminOnly: true },
  { icon: Receipt, label: "Recibos", path: "/recibos", adminOnly: false },
  { icon: Settings, label: "Configurações", path: "/configuracoes", adminOnly: false },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();

  const menuItems = allMenuItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar shadow-sidebar transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-center border-b border-sidebar-border px-4">
            <div className="flex items-center gap-3">
              <img 
                src={escolaLogo} 
                alt="Logo Escolar" 
                className={cn("object-contain transition-all", isCollapsed ? "h-10 w-10" : "h-14")} 
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "animate-pulse-soft")} />
                  {!isCollapsed && <span className="animate-slide-in">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-destructive/20 hover:text-destructive"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Sair</span>}
            </button>
          </div>

          {/* Collapse button - Desktop only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-24 hidden h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md transition-transform hover:scale-110 md:flex"
          >
            <Menu className="h-3 w-3" />
          </button>
        </div>
      </aside>
    </>
  );
}
