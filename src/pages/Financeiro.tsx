import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionModal } from "@/components/modals/TransactionModal";
import { EditTransactionModal } from "@/components/modals/EditTransactionModal";
import { useTransactions, useDeleteTransaction, Transaction } from "@/hooks/useTransactions";
import { formatDateBR } from "@/lib/date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const totalEntradas = transactions
    .filter((t) => t.type === "entrada")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalSaidas = transactions
    .filter((t) => t.type === "saida")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const lucro = totalEntradas - totalSaidas;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (activeTab === "todas") return matchesSearch;
    if (activeTab === "entradas") return matchesSearch && transaction.type === "entrada";
    if (activeTab === "saidas") return matchesSearch && transaction.type === "saida";
    return matchesSearch;
  });

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteTransaction.mutate(deletingId);
      setDeletingId(null);
    }
  };

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
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Carregando...
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  {searchTerm || activeTab !== "todas" 
                    ? "Nenhuma transação encontrada" 
                    : "Nenhuma transação registrada. Adicione uma entrada ou saída."}
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
                          {transaction.category} • {formatDateBR(transaction.date)}
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
                          {formatCurrency(Number(transaction.amount))}
                        </p>
                      </div>
                      <Badge className="bg-success/10 text-success">
                        confirmado
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletingId(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
      <EditTransactionModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen} 
        transaction={editingTransaction} 
      />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
