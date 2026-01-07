import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  created_at: string;
  updated_at: string;
}

export interface TeacherFormData {
  name: string;
  email: string;
  phone: string;
  subjects: string[];
}

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Teacher[];
    },
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: TeacherFormData) => {
      const { data, error } = await supabase
        .from("teachers")
        .insert([formData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Professor cadastrado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar professor: " + error.message);
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("teachers")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Professor excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir professor: " + error.message);
    },
  });
}
