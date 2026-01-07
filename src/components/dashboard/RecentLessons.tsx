import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLessons } from "@/hooks/useLessons";
import { format } from "date-fns";

const statusStyles = {
  agendada: "bg-primary/10 text-primary hover:bg-primary/20",
  concluída: "bg-success/10 text-success hover:bg-success/20",
  cancelada: "bg-destructive/10 text-destructive hover:bg-destructive/20",
};

export function RecentLessons() {
  const { data: lessons, isLoading } = useLessons();

  // Get the 5 most recent lessons
  const recentLessons = lessons?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 font-display">
            <Calendar className="h-5 w-5 text-primary" />
            Aulas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 font-display">
          <Calendar className="h-5 w-5 text-primary" />
          Aulas Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {recentLessons.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            Nenhuma aula registrada ainda
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{lesson.students?.name || "Aluno"}</p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.subject} • {lesson.teachers?.name || "Professor"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {format(new Date(lesson.date), "dd/MM/yyyy")}
                    </p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {lesson.time.substring(0, 5)}
                    </p>
                  </div>
                  <Badge className={statusStyles[lesson.status]}>
                    {lesson.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
