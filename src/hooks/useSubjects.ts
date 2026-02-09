import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Subject {
    id: string;
    name: string;
}

export function useSubjects() {
    return useQuery({
        queryKey: ["subjects"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("subjects")
                .select("*")
                .order("name", { ascending: true });

            if (error) throw error;
            return data as Subject[];
        },
    });
}

export function useCreateSubject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (name: string) => {
            const { data, error } = await supabase
                .from("subjects")
                .insert([{ name }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            toast.success("Matéria cadastrada com sucesso!");
        },
        onError: (error: any) => {
            toast.error("Erro ao cadastrar matéria: " + error.message);
        },
    });
}

export function useDeleteSubject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("subjects")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            toast.success("Matéria excluída com sucesso!");
        },
        onError: (error: any) => {
            toast.error("Erro ao excluir matéria: " + error.message);
        },
    });
}
