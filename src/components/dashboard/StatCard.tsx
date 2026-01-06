import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "success" | "warning";
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
};

const iconStyles = {
  default: "bg-primary/10 text-primary",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  secondary: "bg-secondary-foreground/20 text-secondary-foreground",
  success: "bg-success-foreground/20 text-success-foreground",
  warning: "bg-warning-foreground/20 text-warning-foreground",
};

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-sm font-medium", variant === "default" ? "text-muted-foreground" : "opacity-80")}>
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold font-display">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                trend.isPositive ? "text-success" : "text-destructive",
                variant !== "default" && "opacity-90"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% este mês
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-3", iconStyles[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-current opacity-5 transition-transform duration-500 group-hover:scale-150" />
    </div>
  );
}
