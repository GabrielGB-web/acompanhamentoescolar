import { useState } from "react";
import { Plus, Search, MoreVertical, Mail, Phone, BookOpen } from "lucide-react";
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
import { TeacherModal } from "@/components/modals/TeacherModal";
import { EditTeacherModal } from "@/components/modals/EditTeacherModal";
import { useTeachers, useDeleteTeacher, Teacher } from "@/hooks/useTeachers";
import { useLessons } from "@/hooks/useLessons";
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

export default function Professores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: teachers = [], isLoading } = useTeachers();
  const { data: lessons = [] } = useLessons();
  const deleteTeacher = useDeleteTeacher();

  // Count lessons per teacher this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const getLessonsCount = (teacherId: string) => {
    return lessons.filter((lesson) => {
      const lessonDate = new Date(lesson.date);
      return (
        lesson.teacher_id === teacherId &&
        lessonDate >= startOfMonth &&
        lessonDate <= endOfMonth
      );
    }).length;
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = () => {
    if (deletingId) {
      deleteTeacher.mutate(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Professores</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie os professores e suas aulas
            </p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Professor
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar professores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Teachers Grid */}
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Carregando...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {searchTerm ? "Nenhum professor encontrado" : "Nenhum professor cadastrado. Clique em 'Novo Professor' para começar."}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.map((teacher) => {
              const lessonsCount = getLessonsCount(teacher.id);
              return (
                <Card
                  key={teacher.id}
                  className="shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{teacher.name}</h3>
                          <Badge className="bg-success/10 text-success">
                            ativo
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingTeacher(teacher)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletingId(teacher.id)}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{teacher.phone}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>

                    {/* Lessons Count */}
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        Aulas este mês
                      </span>
                      <span className="font-medium">{lessonsCount}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <TeacherModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <EditTeacherModal 
        open={!!editingTeacher} 
        onOpenChange={(open) => !open && setEditingTeacher(null)} 
        teacher={editingTeacher} 
      />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir professor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O professor será permanentemente excluído.
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
