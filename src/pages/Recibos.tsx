import { useState } from "react";
import { Plus, Search, Printer, Eye, Download, Receipt } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReceiptModal } from "@/components/modals/ReceiptModal";
import { toast } from "sonner";

interface ReceiptData {
  id: string;
  number: string;
  student: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: "pago" | "pendente";
}

const mockReceipts: ReceiptData[] = [
  {
    id: "1",
    number: "REC-2026-001",
    student: "Maria Silva",
    description: "Mensalidade Janeiro/2026",
    amount: 450,
    date: "06/01/2026",
    paymentMethod: "PIX",
    status: "pago",
  },
  {
    id: "2",
    number: "REC-2026-002",
    student: "Pedro Santos",
    description: "Mensalidade Janeiro/2026",
    amount: 350,
    date: "05/01/2026",
    paymentMethod: "Cartão",
    status: "pago",
  },
  {
    id: "3",
    number: "REC-2026-003",
    student: "Ana Costa",
    description: "Mensalidade Janeiro/2026",
    amount: 400,
    date: "04/01/2026",
    paymentMethod: "Boleto",
    status: "pendente",
  },
  {
    id: "4",
    number: "REC-2026-004",
    student: "Lucas Oliveira",
    description: "Mensalidade Janeiro/2026",
    amount: 500,
    date: "03/01/2026",
    paymentMethod: "Dinheiro",
    status: "pago",
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default function Recibos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredReceipts = mockReceipts.filter(
    (receipt) =>
      receipt.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (receipt: ReceiptData) => {
    toast.info(`Visualizando recibo ${receipt.number}`);
  };

  const handlePrint = (receipt: ReceiptData) => {
    toast.success(`Imprimindo recibo ${receipt.number}`);
  };

  const handleDownload = (receipt: ReceiptData) => {
    toast.success(`Download do recibo ${receipt.number} iniciado`);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Recibos</h1>
            <p className="mt-1 text-muted-foreground">
              Gere e imprima recibos de pagamento
            </p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Recibo
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar recibos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Receipts List */}
        <Card className="shadow-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 font-display">
              <Receipt className="h-5 w-5 text-primary" />
              Lista de Recibos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredReceipts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhum recibo encontrado
                </div>
              ) : (
                filteredReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                        <Receipt className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{receipt.number}</p>
                          <Badge
                            className={
                              receipt.status === "pago"
                                ? "bg-success/10 text-success"
                                : "bg-warning/10 text-warning"
                            }
                          >
                            {receipt.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {receipt.student} • {receipt.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-success">
                          {formatCurrency(receipt.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {receipt.date} • {receipt.paymentMethod}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" title="Visualizar" onClick={() => handleView(receipt)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Imprimir" onClick={() => handlePrint(receipt)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Download" onClick={() => handleDownload(receipt)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ReceiptModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </MainLayout>
  );
}
