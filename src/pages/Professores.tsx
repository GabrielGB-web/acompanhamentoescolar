import { useState } from "react";
import { Plus, Search, MoreVertical, Mail, Phone, BookOpen } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TeacherModal } from "@/components/modals/TeacherModal";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  lessonsThisMonth: number;
  maxLessons: number;
  status: "ativo" | "inativo";
}

const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "Prof. João Mendes",
    email: "joao.mendes@email.com",
    phone: "(63) 99888-1234",
    subjects: ["Matemática", "Física"],
    lessonsThisMonth: 32,
    maxLessons: 40,
    status: "ativo",
  },
  {
    id: "2",
    name: "Prof. Ana Paula",
    email: "ana.paula@email.com",
    phone: "(63) 99888-5678",
    subjects: ["Português", "Literatura"],
    lessonsThisMonth: 28,
    maxLessons: 35,
    status: "ativo",
  },
  {
    id: "3",
    name: "Prof. Carlos Lima",
    email: "carlos.lima@email.com",
    phone: "(63) 99888-9012",
    subjects: ["Química"],
    lessonsThisMonth: 18,
    maxLessons: 30,
    status: "ativo",
  },
  {
    id: "4",
    name: "Prof. Fernanda Rocha",
    email: "fernanda.rocha@email.com",
    phone: "(63) 99888-3456",
    subjects: ["Biologia", "Ciências"],
    lessonsThisMonth: 0,
    maxLessons: 25,
    status: "inativo",
  },
];

export default function Professores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTeachers = mockTeachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Professores</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie os professores e suas aulas
            </p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Professor
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar professores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Teachers Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.map((teacher) => (
            <Card
              key={teacher.id}
              className="shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground">
                      {teacher.name.split(" ")[1]?.charAt(0) || teacher.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{teacher.name}</h3>
                      <Badge
                        className={
                          teacher.status === "ativo"
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {teacher.status}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{teacher.phone}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {teacher.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>

                {/* Lessons Progress */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      Aulas este mês
                    </span>
                    <span className="font-medium">
                      {teacher.lessonsThisMonth}/{teacher.maxLessons}
                    </span>
                  </div>
                  <Progress
                    value={(teacher.lessonsThisMonth / teacher.maxLessons) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <TeacherModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </MainLayout>
  );
}
