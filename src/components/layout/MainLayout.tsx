import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn("min-h-screen transition-all duration-300 md:ml-64")}>
        <div className="container mx-auto p-6 pt-20 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
