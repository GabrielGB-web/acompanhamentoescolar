import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Receipt {
  id: string;
  receipt_number: string;
  student_id: string | null;
  student_name: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface ReceiptFormData {
  student_id?: string;
  student_name: string;
  description: string;
  amount: number;
  date: string;
}

async function generateReceiptNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const { count, error } = await supabase
    .from("receipts")
    .select("*", { count: "exact", head: true });
  
  if (error) throw error;
  
  const nextNumber = (count || 0) + 1;
  return `REC-${year}-${String(nextNumber).padStart(3, "0")}`;
}

export function useReceipts() {
  return useQuery({
    queryKey: ["receipts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Receipt[];
    },
  });
}

export function useCreateReceipt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: ReceiptFormData) => {
      const receipt_number = await generateReceiptNumber();
      
      const { data, error } = await supabase
        .from("receipts")
        .insert([{ ...formData, receipt_number }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Recibo gerado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao gerar recibo: " + error.message);
    },
  });
}
