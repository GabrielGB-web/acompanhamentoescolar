import { Users, GraduationCap, Calendar, Wallet } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentLessons } from "@/components/dashboard/RecentLessons";
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { WeeklySchedule } from "@/components/dashboard/WeeklySchedule";

export default function Dashboard() {
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de Alunos"
            value={42}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatCard
            title="Professores"
            value={8}
            icon={GraduationCap}
            trend={{ value: 2, isPositive: true }}
            variant="secondary"
          />
          <StatCard
            title="Aulas esta Semana"
            value={54}
            icon={Calendar}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Lucro do Mês"
            value="R$ 8.300"
            icon={Wallet}
            trend={{ value: 15, isPositive: true }}
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentLessons />
          </div>
          <div className="space-y-6">
            <FinancialSummary />
            <WeeklySchedule />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
