import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateBR(
  dateStr?: string | null,
  pattern: string = "dd/MM/yyyy",
): string {
  if (!dateStr) return "—";

  try {
    const parsed = parseISO(dateStr);
    if (!isValid(parsed)) return "—";
    return format(parsed, pattern, { locale: ptBR });
  } catch {
    return "—";
  }
}
