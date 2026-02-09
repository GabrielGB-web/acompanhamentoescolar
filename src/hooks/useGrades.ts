import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Grade {
    id: string;
    name: string;
}

export function useGrades() {
    return useQuery({
        queryKey: ["grades"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("grades")
                .select("*")
                .order("name", { ascending: true });

            if (error) throw error;
            return data as Grade[];
        },
    });
}

export function useCreateGrade() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (name: string) => {
            const { data, error } = await supabase
                .from("grades")
                .insert([{ name }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["grades"] });
            toast.success("Série/Ano cadastrada com sucesso!");
        },
        onError: (error: any) => {
            toast.error("Erro ao cadastrar série: " + error.message);
        },
    });
}

export function useDeleteGrade() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("grades")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["grades"] });
            toast.success("Série/Ano excluída com sucesso!");
        },
        onError: (error: any) => {
            toast.error("Erro ao excluir série: " + error.message);
        },
    });
}
