import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { useCreateLesson } from "@/hooks/useLessons";
import { useSubjects } from "@/hooks/useSubjects";

interface LessonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LessonModal({ open, onOpenChange }: LessonModalProps) {
  const [formData, setFormData] = useState({
    student_id: "",
    teacher_id: "",
    subject: "",
    date: "",
    time: "",
    duration: "",
  });

  const { data: students = [] } = useStudents();
  const { data: teachers = [] } = useTeachers();
  const { data: subjects = [] } = useSubjects();
  const createLesson = useCreateLesson();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createLesson.mutate({
      student_id: formData.student_id,
      teacher_id: formData.teacher_id,
      subject: formData.subject,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({ student_id: "", teacher_id: "", subject: "", date: "", time: "", duration: "" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Agendar Aula</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Aluno</Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => setFormData({ ...formData, student_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o aluno" />
                </SelectTrigger>
                <SelectContent>
                  {students.length === 0 ? (
                    <div className="py-2 px-2 text-sm text-muted-foreground">
                      Nenhum aluno cadastrado
                    </div>
                  ) : (
                    students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Professor</Label>
              <Select
                value={formData.teacher_id}
                onValueChange={(value) => setFormData({ ...formData, teacher_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o professor" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.length === 0 ? (
                    <div className="py-2 px-2 text-sm text-muted-foreground">
                      Nenhum professor cadastrado
                    </div>
                  ) : (
                    teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Disciplina</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData({ ...formData, subject: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a disciplina" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Duração</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Duração" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30min">30 min</SelectItem>
                  <SelectItem value="1h">1 hora</SelectItem>
                  <SelectItem value="1h30">1h30</SelectItem>
                  <SelectItem value="2h">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createLesson.isPending}>
              {createLesson.isPending ? "Agendando..." : "Agendar Aula"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
