import { ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FinancialSummary() {
  const income = 12500;
  const expenses = 4200;
  const profit = income - expenses;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 font-display">
          <TrendingUp className="h-5 w-5 text-primary" />
          Resumo Financeiro
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Income */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <ArrowUpRight className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entradas</p>
                <p className="text-xl font-bold text-success">{formatCurrency(income)}</p>
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <ArrowDownLeft className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saídas</p>
                <p className="text-xl font-bold text-destructive">{formatCurrency(expenses)}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Profit */}
          <div className="rounded-xl bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
            <p className="text-sm opacity-90">Lucro do Mês</p>
            <p className="text-2xl font-bold">{formatCurrency(profit)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
