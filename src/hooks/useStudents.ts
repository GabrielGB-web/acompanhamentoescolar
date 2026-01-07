import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Student {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  grade: string | null;
  responsible_name: string | null;
  responsible_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentFormData {
  name: string;
  email?: string;
  phone?: string;
  grade?: string;
  responsible_name?: string;
  responsible_phone?: string;
}

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Student[];
    },
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: StudentFormData) => {
      const { data, error } = await supabase
        .from("students")
        .insert([formData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Aluno cadastrado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar aluno: " + error.message);
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Aluno excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir aluno: " + error.message);
    },
  });
}
