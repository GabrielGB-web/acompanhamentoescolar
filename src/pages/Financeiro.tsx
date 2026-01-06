import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Search,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionModal } from "@/components/modals/TransactionModal";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "entrada" | "saida";
  category: string;
  date: string;
  status: "confirmado" | "pendente";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Mensalidade - Maria Silva",
    amount: 450,
    type: "entrada",
    category: "Mensalidade",
    date: "06/01/2026",
    status: "confirmado",
  },
  {
    id: "2",
    description: "Mensalidade - Pedro Santos",
    amount: 350,
    type: "entrada",
    category: "Mensalidade",
    date: "05/01/2026",
    status: "confirmado",
  },
  {
    id: "3",
    description: "Pagamento Prof. João",
    amount: 1200,
    type: "saida",
    category: "Salário",
    date: "05/01/2026",
    status: "confirmado",
  },
  {
    id: "4",
    description: "Material Didático",
    amount: 280,
    type: "saida",
    category: "Material",
    date: "04/01/2026",
    status: "confirmado",
  },
  {
    id: "5",
    description: "Mensalidade - Ana Costa",
    amount: 400,
    type: "entrada",
    category: "Mensalidade",
    date: "04/01/2026",
    status: "pendente",
  },
  {
    id: "6",
    description: "Conta de Luz",
    amount: 320,
    type: "saida",
    category: "Despesas Fixas",
    date: "03/01/2026",
    status: "confirmado",
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default function Financeiro() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todas");
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const totalEntradas = mockTransactions
    .filter((t) => t.type === "entrada" && t.status === "confirmado")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSaidas = mockTransactions
    .filter((t) => t.type === "saida" && t.status === "confirmado")
    .reduce((sum, t) => sum + t.amount, 0);

  const lucro = totalEntradas - totalSaidas;

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (activeTab === "todas") return matchesSearch;
    if (activeTab === "entradas") return matchesSearch && transaction.type === "entrada";
    if (activeTab === "saidas") return matchesSearch && transaction.type === "saida";
    return matchesSearch;
  });

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Financeiro</h1>
            <p className="mt-1 text-muted-foreground">
              Controle suas entradas e saídas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setExpenseModalOpen(true)}>
              <ArrowDownLeft className="h-4 w-4 text-destructive" />
              Nova Saída
            </Button>
            <Button className="gap-2 bg-success hover:bg-success/90" onClick={() => setIncomeModalOpen(true)}>
              <ArrowUpRight className="h-4 w-4" />
              Nova Entrada
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Entradas"
            value={formatCurrency(totalEntradas)}
            icon={ArrowUpRight}
            variant="success"
          />
          <StatCard
            title="Total Saídas"
            value={formatCurrency(totalSaidas)}
            icon={ArrowDownLeft}
            variant="default"
          />
          <StatCard
            title="Lucro"
            value={formatCurrency(lucro)}
            icon={TrendingUp}
            variant="primary"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="entradas">Entradas</TabsTrigger>
              <TabsTrigger value="saidas">Saídas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Transactions List */}
        <Card className="shadow-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 font-display">
              <TrendingUp className="h-5 w-5 text-primary" />
              Transações
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma transação encontrada
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          transaction.type === "entrada"
                            ? "bg-success/10"
                            : "bg-destructive/10"
                        }`}
                      >
                        {transaction.type === "entrada" ? (
                          <ArrowUpRight className="h-5 w-5 text-success" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.category} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            transaction.type === "entrada"
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        >
                          {transaction.type === "entrada" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                      <Badge
                        className={
                          transaction.status === "confirmado"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionModal open={incomeModalOpen} onOpenChange={setIncomeModalOpen} type="entrada" />
      <TransactionModal open={expenseModalOpen} onOpenChange={setExpenseModalOpen} type="saida" />
    </MainLayout>
  );
}
