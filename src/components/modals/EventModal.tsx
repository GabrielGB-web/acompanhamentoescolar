import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateEvent, useUpdateEvent, Event } from "@/hooks/useEvents";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
}

const colorOptions = [
  { value: "primary", label: "Azul", className: "bg-primary" },
  { value: "secondary", label: "Amarelo", className: "bg-secondary" },
  { value: "success", label: "Verde", className: "bg-success" },
  { value: "warning", label: "Laranja", className: "bg-warning" },
  { value: "destructive", label: "Vermelho", className: "bg-destructive" },
];

export function EventModal({ open, onOpenChange, event }: EventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    color: "primary",
  });

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        date: event.date,
        time: event.time || "",
        color: event.color || "primary",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: "",
        color: "primary",
      });
    }
  }, [event, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      title: formData.title,
      description: formData.description || undefined,
      date: formData.date,
      time: formData.time || undefined,
      color: formData.color,
    };

    if (event) {
      updateEvent.mutate({ ...data, id: event.id }, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createEvent.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isLoading = createEvent.isPending || updateEvent.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {event ? "Editar Evento" : "Novo Evento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Reunião de pais"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalhes do evento..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
              <Label htmlFor="time">Horário (opcional)</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <Select
              value={formData.color}
              onValueChange={(value) => setFormData({ ...formData, color: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${color.className}`} />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : event ? "Salvar" : "Criar Evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
