import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Lesson {
  id: string;
  student_id: string;
  teacher_id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: "agendada" | "concluída" | "cancelada";
  created_at: string;
  updated_at: string;
  students?: { id: string; name: string };
  teachers?: { id: string; name: string };
}

export interface LessonFormData {
  student_id: string;
  teacher_id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
}

export function useLessons() {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select(`
          *,
          students (id, name),
          teachers (id, name)
        `)
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as Lesson[];
    },
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: LessonFormData) => {
      const { data, error } = await supabase
        .from("lessons")
        .insert([formData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Aula agendada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao agendar aula: " + error.message);
    },
  });
}

export function useUpdateLessonStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "agendada" | "concluída" | "cancelada" }) => {
      const { data, error } = await supabase
        .from("lessons")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Status da aula atualizado!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar status: " + error.message);
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Aula excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir aula: " + error.message);
    },
  });
}
