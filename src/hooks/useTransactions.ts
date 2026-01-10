import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  type: "entrada" | "saida";
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
}

export interface TransactionFormData {
  type: "entrada" | "saida";
  description: string;
  amount: number;
  category: string;
  date: string;
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: TransactionFormData) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert([formData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(variables.type === "entrada" ? "Entrada registrada com sucesso!" : "Saída registrada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao registrar transação: " + error.message);
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...formData }: TransactionFormData & { id: string }) => {
      const { data, error } = await supabase
        .from("transactions")
        .update(formData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transação atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar transação: " + error.message);
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transação excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir transação: " + error.message);
    },
  });
}
