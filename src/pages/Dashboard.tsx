import { Users, GraduationCap, Calendar } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentLessons } from "@/components/dashboard/RecentLessons";
import { WeeklySchedule } from "@/components/dashboard/WeeklySchedule";
import { WeeklyAgenda } from "@/components/dashboard/WeeklyAgenda";
import { EventsReminders } from "@/components/dashboard/EventsReminders";
import { useStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { useLessons } from "@/hooks/useLessons";

export default function Dashboard() {
  const { data: students = [] } = useStudents();
  const { data: teachers = [] } = useTeachers();
  const { data: lessons = [] } = useLessons();

  // Count lessons scheduled for this week
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weeklyLessons = lessons.filter((lesson) => {
    const lessonDate = new Date(lesson.date);
    return lessonDate >= startOfWeek && lessonDate <= endOfWeek;
  });

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Bem-vindo ao Acompanhamento Escolar • Palmas, Tocantins
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total de Alunos"
            value={students.length}
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Professores"
            value={teachers.length}
            icon={GraduationCap}
            variant="secondary"
          />
          <StatCard
            title="Aulas esta Semana"
            value={weeklyLessons.length}
            icon={Calendar}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentLessons />
          </div>
          <div className="space-y-6">
            <EventsReminders />
            <WeeklyAgenda />
          </div>
        </div>

        {/* Weekly Chart */}
        <WeeklySchedule />
      </div>
    </MainLayout>
  );
}
