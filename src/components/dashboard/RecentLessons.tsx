import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Lesson {
  id: string;
  student: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
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
    status: "agendada",
  },
  {
    id: "2",
    student: "Pedro Santos",
    teacher: "Prof. Ana",
    subject: "Português",
    date: "06/01/2026",
    time: "15:30",
    status: "agendada",
  },
  {
    id: "3",
    student: "Lucas Oliveira",
    teacher: "Prof. João",
    subject: "Física",
    date: "05/01/2026",
    time: "10:00",
    status: "concluída",
  },
  {
    id: "4",
    student: "Ana Costa",
    teacher: "Prof. Carlos",
    subject: "Química",
    date: "05/01/2026",
    time: "16:00",
    status: "concluída",
  },
];

const statusStyles = {
  agendada: "bg-primary/10 text-primary hover:bg-primary/20",
  concluída: "bg-success/10 text-success hover:bg-success/20",
  cancelada: "bg-destructive/10 text-destructive hover:bg-destructive/20",
};

export function RecentLessons() {
  return (
    <Card className="shadow-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 font-display">
          <Calendar className="h-5 w-5 text-primary" />
          Aulas Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {mockLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{lesson.student}</p>
                  <p className="text-sm text-muted-foreground">
                    {lesson.subject} • {lesson.teacher}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{lesson.date}</p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {lesson.time}
                  </p>
                </div>
                <Badge className={statusStyles[lesson.status]}>
                  {lesson.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
