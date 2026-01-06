import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

const weekDays = [
  { name: "Seg", lessons: 8 },
  { name: "Ter", lessons: 12 },
  { name: "Qua", lessons: 10 },
  { name: "Qui", lessons: 6 },
  { name: "Sex", lessons: 14 },
  { name: "Sáb", lessons: 4 },
];

const maxLessons = Math.max(...weekDays.map((d) => d.lessons));

export function WeeklySchedule() {
  return (
    <Card className="shadow-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 font-display">
          <CalendarDays className="h-5 w-5 text-primary" />
          Aulas por Dia da Semana
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-end justify-between gap-2">
          {weekDays.map((day) => {
            const heightPercent = (day.lessons / maxLessons) * 100;
            return (
              <div key={day.name} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-sm font-medium text-primary">{day.lessons}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/70 transition-all duration-500 hover:from-secondary hover:to-secondary/70"
                  style={{ height: `${Math.max(heightPercent, 10)}px`, minHeight: "20px", maxHeight: "120px" }}
                />
                <span className="text-xs font-medium text-muted-foreground">{day.name}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-bold text-foreground">{weekDays.reduce((a, b) => a + b.lessons, 0)} aulas</span> esta semana
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
