import { useState } from "react";
import { Plus, Search, Calendar as CalendarIcon, Clock, User, GraduationCap, MoreVertical, CheckCircle, XCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LessonModal } from "@/components/modals/LessonModal";
import { useLessons, useUpdateLessonStatus, useDeleteLesson } from "@/hooks/useLessons";
import { formatDateBR } from "@/lib/date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

const statusStyles = {
  agendada: "bg-primary/10 text-primary",
  concluída: "bg-success/10 text-success",
  cancelada: "bg-destructive/10 text-destructive",
};

export default function Aulas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: lessons = [], isLoading } = useLessons();
  const updateStatus = useUpdateLessonStatus();
  const deleteLesson = useDeleteLesson();

  const filteredLessons = lessons.filter((lesson) => {
    const studentName = lesson.students?.name || "";
    const teacherName = lesson.teachers?.name || "";
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.subject.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "todas") return matchesSearch;
    return matchesSearch && lesson.status === activeTab;
  });

  const handleStatusChange = (id: string, status: "agendada" | "concluída" | "cancelada") => {
    updateStatus.mutate({ id, status });
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteLesson.mutate(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Aulas</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie o agendamento de aulas
            </p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Agendar Aula
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar aulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="agendada">Agendadas</TabsTrigger>
              <TabsTrigger value="concluída">Concluídas</TabsTrigger>
              <TabsTrigger value="cancelada">Canceladas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Lessons List */}
        <Card className="shadow-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 font-display">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Lista de Aulas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Carregando...
                </div>
              ) : filteredLessons.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  {searchTerm || activeTab !== "todas" 
                    ? "Nenhuma aula encontrada" 
                    : "Nenhuma aula agendada. Clique em 'Agendar Aula' para começar."}
                </div>
              ) : (
                filteredLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <CalendarIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{lesson.subject}</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {lesson.students?.name || "Aluno não encontrado"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {lesson.teachers?.name || "Professor não encontrado"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {formatDateBR(lesson.date)}
                        </p>
                        <p className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {(lesson.time ?? "").slice(0, 5) || "--:--"} ({lesson.duration})
                        </p>
                      </div>
                      <Badge className={statusStyles[lesson.status]}>
                        {lesson.status === "concluída" ? "Concluída" : lesson.status === "cancelada" ? "Cancelada" : "Agendada"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {lesson.status === "agendada" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(lesson.id, "concluída")}
                                className="text-success"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Marcar como Concluída
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(lesson.id, "cancelada")}
                                className="text-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancelar Aula
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {lesson.status !== "agendada" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(lesson.id, "agendada")}
                              >
                                Reabrir como Agendada
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletingId(lesson.id)}
                          >
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

      <LessonModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir aula?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A aula será permanentemente excluída.
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
