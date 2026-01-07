import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudents } from "@/hooks/useStudents";
import { useCreateReceipt } from "@/hooks/useReceipts";

interface ReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentMethods = ["PIX", "Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Boleto", "Transferência"];

export function ReceiptModal({ open, onOpenChange }: ReceiptModalProps) {
  const [formData, setFormData] = useState({
    student_id: "",
    student_name: "",
    description: "",
    amount: "",
    paymentMethod: "",
    date: new Date().toISOString().split("T")[0],
  });

  const { data: students = [] } = useStudents();
  const createReceipt = useCreateReceipt();

  const handleStudentChange = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setFormData({ 
      ...formData, 
      student_id: studentId,
      student_name: student?.name || "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createReceipt.mutate({
      student_id: formData.student_id || undefined,
      student_name: formData.student_name,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({ student_id: "", student_name: "", description: "", amount: "", paymentMethod: "", date: new Date().toISOString().split("T")[0] });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Novo Recibo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Aluno</Label>
            <Select
              value={formData.student_id}
              onValueChange={handleStudentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o aluno" />
              </SelectTrigger>
              <SelectContent>
                {students.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Nenhum aluno cadastrado
                  </SelectItem>
                ) : (
                  students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Mensalidade Janeiro/2026"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0,00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createReceipt.isPending}>
              {createReceipt.isPending ? "Gerando..." : "Gerar Recibo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
