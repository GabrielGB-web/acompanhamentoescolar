import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface StudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentModal({ open, onOpenChange }: StudentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
    responsibleName: "",
    responsiblePhone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar salvamento no banco de dados
    toast.success("Aluno cadastrado com sucesso!");
    onOpenChange(false);
    setFormData({ name: "", email: "", phone: "", grade: "", responsibleName: "", responsiblePhone: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Novo Aluno</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do aluno"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Série/Ano</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => setFormData({ ...formData, grade: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6ano">6º Ano</SelectItem>
                  <SelectItem value="7ano">7º Ano</SelectItem>
                  <SelectItem value="8ano">8º Ano</SelectItem>
                  <SelectItem value="9ano">9º Ano</SelectItem>
                  <SelectItem value="1em">1º Ano EM</SelectItem>
                  <SelectItem value="2em">2º Ano EM</SelectItem>
                  <SelectItem value="3em">3º Ano EM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(63) 99999-9999"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="responsibleName">Nome do Responsável</Label>
              <Input
                id="responsibleName"
                value={formData.responsibleName}
                onChange={(e) => setFormData({ ...formData, responsibleName: e.target.value })}
                placeholder="Nome do responsável"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsiblePhone">Telefone do Responsável</Label>
              <Input
                id="responsiblePhone"
                value={formData.responsiblePhone}
                onChange={(e) => setFormData({ ...formData, responsiblePhone: e.target.value })}
                placeholder="(63) 99999-9999"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Cadastrar Aluno</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
