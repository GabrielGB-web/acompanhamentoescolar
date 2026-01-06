import { useState } from "react";
import { Plus, Search, Calendar as CalendarIcon, Clock, User, GraduationCap } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Lesson {
  id: string;
  student: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: "agendada" | "concluída" | "cancelada";
}

const mockLessons: Lesson[] = [
  {
    id: "1",
    student: "Maria Silva",
    teacher: "Prof. João",
    subject: "Matemática",
    date: "06/01/2026",
    time: "14:00",
    duration: "1h",
    status: "agendada",
  },
  {
    id: "2",
    student: "Pedro Santos",
    teacher: "Prof. Ana",
    subject: "Português",
    date: "06/01/2026",
    time: "15:30",
    duration: "1h30",
    status: "agendada",
  },
  {
    id: "3",
    student: "Lucas Oliveira",
    teacher: "Prof. João",
    subject: "Física",
    date: "06/01/2026",
    time: "17:00",
    duration: "1h",
    status: "agendada",
  },
  {
    id: "4",
    student: "Ana Costa",
    teacher: "Prof. Carlos",
    subject: "Química",
    date: "05/01/2026",
    time: "10:00",
    duration: "1h",
    status: "concluída",
  },
  {
    id: "5",
    student: "Bruno Ferreira",
    teacher: "Prof. Ana",
    subject: "Português",
    date: "05/01/2026",
    time: "14:00",
    duration: "1h",
    status: "concluída",
  },
  {
    id: "6",
    student: "Carla Mendes",
    teacher: "Prof. João",
    subject: "Matemática",
    date: "04/01/2026",
    time: "16:00",
    duration: "1h30",
    status: "cancelada",
  },
];

const statusStyles = {
  agendada: "bg-primary/10 text-primary",
  concluída: "bg-success/10 text-success",
  cancelada: "bg-destructive/10 text-destructive",
};

export default function Aulas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todas");

  const filteredLessons = mockLessons.filter((lesson) => {
    const matchesSearch =
      lesson.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.subject.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "todas") return matchesSearch;
    return matchesSearch && lesson.status === activeTab;
  });

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
          <Button className="gap-2 bg-primary hover:bg-primary/90">
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
              {filteredLessons.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma aula encontrada
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
                            {lesson.student}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {lesson.teacher}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{lesson.date}</p>
                        <p className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {lesson.time} ({lesson.duration})
                        </p>
                      </div>
                      <Badge className={statusStyles[lesson.status]}>{lesson.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
