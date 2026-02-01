import { useState } from "react";
import { Plus, Search, MoreVertical, Mail, Phone, Link, Copy, Check } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { StudentModal } from "@/components/modals/StudentModal";
import { useStudents, useDeleteStudent } from "@/hooks/useStudents";
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
import { toast } from "sonner";

export default function Alunos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: students = [], isLoading } = useStudents();
  const deleteStudent = useDeleteStudent();

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = () => {
    if (deletingId) {
      deleteStudent.mutate(deletingId);
      setDeletingId(null);
    }
  };

  const copyAgendaLink = (student: typeof students[0]) => {
    if (!student.access_code) {
      toast.error("Aluno sem código de acesso gerado");
      return;
    }
    const link = `${window.location.origin}/agenda/${student.access_code}`;

    // Copy to clipboard
    navigator.clipboard.writeText(link);
    setCopiedId(student.id);
    toast.success("Link da agenda copiado!");

    // Open in new tab
    window.open(link, '_blank');

    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Alunos</h1>
            <p className="mt-1 text-muted-foreground">Gerencie os alunos matriculados</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Aluno
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar alunos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Carregando...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {searchTerm ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado."}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.grade || "Sem série"}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyAgendaLink(student)}>
                          <Link className="h-4 w-4 mr-2" />Copiar link da agenda
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeletingId(student.id)}>Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4 space-y-2">
                    {student.email && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" /><span className="truncate">{student.email}</span></div>}
                    {student.phone && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" /><span>{student.phone}</span></div>}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge className="bg-success/10 text-success">ativo</Badge>
                    {student.access_code && (
                      <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={() => copyAgendaLink(student)}>
                        {copiedId === student.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}Agenda
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <StudentModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir aluno?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
