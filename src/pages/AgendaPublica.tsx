import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, BookOpen, GraduationCap } from "lucide-react";
import { format, parseISO, startOfWeek, endOfWeek, addWeeks, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Lesson {
  id: string;
  date: string;
  time: string;
  subject: string;
  duration: string;
  status: string;
  teachers: { name: string } | null;
}

interface Student {
  id: string;
  name: string;
  grade: string | null;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  agendada: { label: "Agendada", variant: "default" },
  concluida: { label: "Concluída", variant: "secondary" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};

export default function AgendaPublica() {
  const { codigo } = useParams<{ codigo: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!codigo) {
        setError("Código de acesso não fornecido.");
        setLoading(false);
        return;
      }

      // Fetch student by access code
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("id, name, grade, access_code")
        .eq("access_code", codigo.toUpperCase())
        .single();

      if (studentError || !studentData) {
        setError("Código de acesso inválido. Verifique o código e tente novamente.");
        setLoading(false);
        return;
      }

      setStudent(studentData);

      // Fetch lessons for this student
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select(`
          id,
          date,
          time,
          subject,
          duration,
          status,
          teachers:teacher_id (name)
        `)
        .eq("student_id", studentData.id)
        .order("date", { ascending: true });

      if (lessonsError) {
        setError("Erro ao carregar as aulas.");
        setLoading(false);
        return;
      }

      setLessons(lessonsData || []);
      setLoading(false);
    }

    fetchData();
  }, [codigo]);

  const currentWeekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 });

  const weekLessons = lessons.filter((lesson) => {
    const lessonDate = parseISO(lesson.date);
    return isWithinInterval(lessonDate, { start: currentWeekStart, end: currentWeekEnd });
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <Calendar className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{student?.name}</h1>
              {student?.grade && (
                <p className="text-muted-foreground">{student.grade}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Agenda de Aulas
              </CardTitle>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWeekOffset(weekOffset - 1)}
                  className="px-3 py-1 text-sm rounded border hover:bg-muted"
                >
                  ← Anterior
                </button>
                <span className="text-sm text-muted-foreground px-2">
                  {format(currentWeekStart, "dd/MM", { locale: ptBR })} - {format(currentWeekEnd, "dd/MM/yyyy", { locale: ptBR })}
                </span>
                <button
                  onClick={() => setWeekOffset(weekOffset + 1)}
                  className="px-3 py-1 text-sm rounded border hover:bg-muted"
                >
                  Próxima →
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {weekLessons.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma aula agendada para esta semana.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {weekLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{lesson.subject}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(parseISO(lesson.date), "EEEE, dd/MM", { locale: ptBR })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.time.slice(0, 5)} ({lesson.duration})
                          </span>
                        </div>
                        {lesson.teachers && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <User className="h-3 w-3" />
                            Prof. {lesson.teachers.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={statusConfig[lesson.status]?.variant || "default"}>
                      {statusConfig[lesson.status]?.label || lesson.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All upcoming lessons */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Próximas Aulas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lessons.filter(l => parseISO(l.date) >= new Date() && l.status === "agendada").length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhuma aula futura agendada.
              </p>
            ) : (
              <div className="space-y-3">
                {lessons
                  .filter(l => parseISO(l.date) >= new Date() && l.status === "agendada")
                  .slice(0, 10)
                  .map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 rounded border"
                    >
                      <div>
                        <p className="font-medium">{lesson.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(lesson.date), "dd/MM/yyyy", { locale: ptBR })} às {lesson.time.slice(0, 5)}
                        </p>
                      </div>
                      <Badge variant="outline">{lesson.duration}</Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>Agenda de aulas • Acesso exclusivo para pais/responsáveis</p>
      </footer>
    </div>
  );
}
