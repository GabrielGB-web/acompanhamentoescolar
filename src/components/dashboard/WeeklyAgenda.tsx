import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, User, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AgendaLesson {
  id: string;
  time: string;
  student: string;
  teacher: string;
  subject: string;
}

interface DaySchedule {
  day: string;
  dayName: string;
  lessons: AgendaLesson[];
}

const weekSchedule: DaySchedule[] = [
  {
    day: "06",
    dayName: "Seg",
    lessons: [
      { id: "1", time: "14:00", student: "Maria Silva", teacher: "Prof. João", subject: "Matemática" },
      { id: "2", time: "15:30", student: "Pedro Santos", teacher: "Prof. Ana", subject: "Português" },
      { id: "3", time: "17:00", student: "Lucas Oliveira", teacher: "Prof. João", subject: "Física" },
    ],
  },
  {
    day: "07",
    dayName: "Ter",
    lessons: [
      { id: "4", time: "09:00", student: "Ana Costa", teacher: "Prof. Carlos", subject: "Química" },
      { id: "5", time: "14:00", student: "Bruno Ferreira", teacher: "Prof. Ana", subject: "Português" },
    ],
  },
  {
    day: "08",
    dayName: "Qua",
    lessons: [
      { id: "6", time: "10:00", student: "Carla Mendes", teacher: "Prof. João", subject: "Matemática" },
      { id: "7", time: "15:00", student: "Maria Silva", teacher: "Prof. Carlos", subject: "Química" },
      { id: "8", time: "16:30", student: "Pedro Santos", teacher: "Prof. João", subject: "Física" },
    ],
  },
  {
    day: "09",
    dayName: "Qui",
    lessons: [
      { id: "9", time: "14:00", student: "Lucas Oliveira", teacher: "Prof. Ana", subject: "Português" },
    ],
  },
  {
    day: "10",
    dayName: "Sex",
    lessons: [
      { id: "10", time: "09:00", student: "Ana Costa", teacher: "Prof. João", subject: "Matemática" },
      { id: "11", time: "14:00", student: "Bruno Ferreira", teacher: "Prof. Carlos", subject: "Química" },
      { id: "12", time: "15:30", student: "Maria Silva", teacher: "Prof. Ana", subject: "Redação" },
      { id: "13", time: "17:00", student: "Pedro Santos", teacher: "Prof. João", subject: "Matemática" },
    ],
  },
  {
    day: "11",
    dayName: "Sáb",
    lessons: [
      { id: "14", time: "08:00", student: "Carla Mendes", teacher: "Prof. Ana", subject: "Português" },
      { id: "15", time: "09:30", student: "Lucas Oliveira", teacher: "Prof. João", subject: "Matemática" },
    ],
  },
];

export function WeeklyAgenda() {
  const today = "06"; // Simulating today is Monday the 6th

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
          <div className="divide-y divide-border">
            {weekSchedule.map((daySchedule) => (
              <div key={daySchedule.day} className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold ${
                      daySchedule.day === today
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {daySchedule.day}
                  </div>
                  <div>
                    <p className={`font-medium ${daySchedule.day === today ? "text-primary" : ""}`}>
                      {daySchedule.dayName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {daySchedule.lessons.length} aula{daySchedule.lessons.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {daySchedule.day === today && (
                    <Badge className="ml-auto bg-primary/10 text-primary">Hoje</Badge>
                  )}
                </div>
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
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
