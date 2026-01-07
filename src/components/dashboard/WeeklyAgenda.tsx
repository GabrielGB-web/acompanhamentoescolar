import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLessons } from "@/hooks/useLessons";
import { useStudents } from "@/hooks/useStudents";
import { format, startOfWeek, endOfWeek, parseISO, isToday, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DaySchedule {
  date: Date;
  dayName: string;
  dayNumber: string;
  lessons: {
    id: string;
    time: string;
    student: string;
    subject: string;
  }[];
}

export function WeeklyAgenda() {
  const { data: lessons = [] } = useLessons();
  const { data: students = [] } = useStudents();

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 });

  // Filter lessons for this week that are scheduled
  const weekLessons = lessons.filter((lesson) => {
    const lessonDate = parseISO(lesson.date);
    return lessonDate >= weekStart && lessonDate <= weekEnd && lesson.status === "agendada";
  });

  // Create schedule for each day of the week
  const weekSchedule: DaySchedule[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dateStr = format(date, "yyyy-MM-dd");
    
    const dayLessons = weekLessons
      .filter((lesson) => lesson.date === dateStr)
      .map((lesson) => {
        const student = students.find((s) => s.id === lesson.student_id);
        return {
          id: lesson.id,
          time: lesson.time.slice(0, 5), // Format HH:MM
          student: student?.name || "Aluno não encontrado",
          subject: lesson.subject,
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));

    return {
      date,
      dayName: format(date, "EEE", { locale: ptBR }),
      dayNumber: format(date, "dd"),
      lessons: dayLessons,
    };
  });

  const hasAnyLesson = weekSchedule.some((day) => day.lessons.length > 0);

  return (
    <Card className="shadow-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 font-display">
          <CalendarDays className="h-5 w-5 text-primary" />
          Agenda da Semana
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {!hasAnyLesson ? (
            <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
              <div>
                <CalendarDays className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>Nenhuma aula agendada esta semana</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {weekSchedule.map((daySchedule) => (
                <div key={daySchedule.dayNumber} className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold ${
                        isToday(daySchedule.date)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {daySchedule.dayNumber}
                    </div>
                    <div>
                      <p className={`font-medium capitalize ${isToday(daySchedule.date) ? "text-primary" : ""}`}>
                        {daySchedule.dayName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {daySchedule.lessons.length} aula{daySchedule.lessons.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {isToday(daySchedule.date) && (
                      <Badge className="ml-auto bg-primary/10 text-primary">Hoje</Badge>
                    )}
                  </div>
                  {daySchedule.lessons.length > 0 && (
                    <div className="space-y-2 pl-12">
                      {daySchedule.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 rounded-lg bg-muted/50 p-2 text-sm"
                        >
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">{lesson.time}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {lesson.subject}
                          </Badge>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span className="truncate">{lesson.student}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
